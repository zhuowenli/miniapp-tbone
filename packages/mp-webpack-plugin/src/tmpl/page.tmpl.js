const mp = require('miniapp-render')
const config = require('/* CONFIG_PATH */')

/* INIT_FUNCTION */

/**
 * 处理一些特殊的页面
 */
function dealWithPage(evt, window, value) {
    const type = evt.type
    let url = evt.url

    if (value === 'webview') {
        // 补全 url
        url = mp.$$adapter.tool.completeURL(url, window.location.origin)

        const options = {url: `/pages/webview/index?url=${encodeURIComponent(url)}`}
        if (type === 'jump') my.redirectTo(options)
        else if (type === 'open') my.navigateTo(options)
    } else if (value === 'error') {
        console.error(`page not found: ${evt.url}`)
    } else if (value !== 'none') {
        const targeturl = `${window.location.origin}/redirect?url=${encodeURIComponent(url)}`
        const subpackagesMap = window.$$miniapp.subpackagesMap
        const packageName = subpackagesMap[value]
        const pageRoute = `/${packageName ? packageName + '/' : ''}pages/${value}/index`
        const options = {url: `${pageRoute}?type=${type}&targeturl=${encodeURIComponent(targeturl)}`}
        if (window.$$miniapp.isTabBarPage(pageRoute)) my.switchTab(options)
        else if (type === 'jump') my.redirectTo(options)
        else if (type === 'open') my.navigateTo(options)
    }
}

Page({
    data: {
        pageId: '',
        bodyClass: 'h5-body miniapp-root',
        bodyStyle: '',
        rootFontSize: '12px',
        pageStyle: '',
    },
    onLoad(query) {
        const pageName = mp.$$adapter.tool.getPageName(this.route)
        const pageConfig = this.pageConfig = config.pages[pageName] || {}

        if (pageConfig.loadingText) {
            my.showLoading({
                title: pageConfig.loadingText,
                mask: true,
            })
        }

        const mpRes = mp.createPage(this.route, config)
        this.pageId = mpRes.pageId
        this.window = mpRes.window
        this.document = mpRes.document
        this.query = query

        // 写入 page 的方法
        if (typeof this.getTabBar === 'function') this.window.getTabBar = this.getTabBar.bind(this)

        // 处理跳转页面不存在的情况
        if (config.redirect && config.redirect.notFound) {
            this.window.addEventListener('pagenotfound', evt => {
                dealWithPage(evt, mpRes.window, config.redirect.notFound)
            })
        }

        // 处理跳转受限制页面的情况
        if (config.redirect && config.redirect.accessDenied) {
            this.window.addEventListener('pageaccessdenied', evt => {
                dealWithPage(evt, mpRes.window, config.redirect.accessDenied)
            })
        }

        if (query.type === 'open' || query.type === 'jump' || query.type === 'share') {
            // 处理页面参数，只有当页面是其他页面打开或跳转时才处理
            let targetUrl = decodeURIComponent(query.targeturl)
            targetUrl = targetUrl.indexOf('://') >= 0 ? targetUrl : (config.origin + targetUrl)
            this.window.$$miniapp.init(targetUrl || null)

            if (query.search) this.window.location.search = decodeURIComponent(query.search)
            if (query.hash) this.window.location.hash = decodeURIComponent(query.hash)
        } else {
            console.log(this.window)
            this.window.$$miniapp.init()
        }

        // 处理分享显示
        if (!pageConfig.share) {
            my.hideShareMenu()
        }

        // 处理 document 更新
        this.document.documentElement.addEventListener('$$domNodeUpdate', () => {
            if (pageConfig.rem) {
                const rootFontSize = this.document.documentElement.style.fontSize
                if (rootFontSize && rootFontSize !== this.data.rootFontSize) this.setData({rootFontSize})
            }
            if (pageConfig.pageStyle) {
                const pageStyle = this.document.documentElement.style.cssText
                if (pageStyle && pageStyle !== this.data.pageStyle) this.setData({pageStyle})
            }
        })

        // 处理 body 更新
        this.document.documentElement.addEventListener('$$childNodesUpdate', () => {
            const domNode = this.document.body
            const data = {
                bodyClass: `${domNode.className || ''} h5-body miniapp-root`, // 增加默认 class
                bodyStyle: domNode.style.cssText || ''
            }

            if (data.bodyClass !== this.data.bodyClass || data.bodyStyle !== this.data.bodyStyle) {
                this.setData(data)
            }
        })

        // 处理 selectorQuery 获取
        this.window.$$createSelectorQuery = () => my.createSelectorQuery().in(this)

        // 处理 intersectionObserver 获取
        this.window.$$createIntersectionObserver = options => my.createIntersectionObserver(this, options)

        // 处理 openerEventChannel 获取
        this.window.$$getOpenerEventChannel = () => this.getOpenerEventChannel()

        // 初始化页面显示状态
        this.document.$$visibilityState = 'prerender'

        init(this.window, this.document)
        this.setData({
            pageId: this.pageId
        })
        this.app = this.window.createApp()
        this.window.$$trigger('load')
        this.window.$$trigger('myload', {event: query})
    },
    onShow() {
        // 方便调试
        global.$$runtime = {
            window: this.window,
            document: this.document,
        }
        this.document.$$visibilityState = 'visible'
        this.window.$$trigger('myshow')
        this.document.$$trigger('visibilitychange')
    },
    onReady() {
        if (this.pageConfig.loadingText) my.hideLoading()
        this.window.$$trigger('myready')
    },
    onHide() {
        global.$$runtime = null
        this.document.$$visibilityState = 'hidden'
        this.window.$$trigger('myhide')
        this.document.$$trigger('visibilitychange')
    },
    onUnload() {
        this.document.$$visibilityState = 'unloaded'
        this.window.$$trigger('beforeunload')
        this.window.$$trigger('myunload')
        if (this.app && this.app.$destroy) this.app.$destroy()
        this.document.body.$$recycle() // 回收 dom 节点
        this.window.$$destroy()

        mp.destroyPage(this.pageId)
        global.$$runtime = null

        this.pageConfig = null
        this.pageId = null
        this.window.getTabBar = null
        this.window = null
        this.document = null
        this.app = null
        this.query = null
    },
    onShareAppMessage(data) {
        const window = this.window
        if (window && window.onShareAppMessage) {
            const shareOptions = Object.assign({}, window.onShareAppMessage(data))

            if (shareOptions.miniappPath) {
                shareOptions.path = shareOptions.miniappPath
            } else {
                const query = Object.assign({}, this.query || {})
                let route = this.route

                if (shareOptions.path) {
                    shareOptions.path = shareOptions.path[0] === '/' ? window.location.origin + shareOptions.path : shareOptions.path
                    const {pathname} = window.location.constructor.$$parse(shareOptions.path)
                    const matchRoute = window.$$miniapp.getMatchRoute(pathname || '/')
                    if (matchRoute) route = matchRoute
                    query.targeturl = encodeURIComponent(shareOptions.path)
                } else {
                    // 组装当前页面路径
                    const location = window.location

                    query.targeturl = encodeURIComponent(location.href)
                    query.search = encodeURIComponent(location.search)
                    query.hash = encodeURIComponent(location.hash)
                }

                query.type = 'share'
                const queryString = Object.keys(query).map(key => `${key}=${query[key] || ''}`).join('&')
                const currentPagePath = `${route}?${queryString}`
                shareOptions.path = currentPagePath
            }

            return shareOptions
        }
    },
    /* PAGE_SCROLL_FUNCTION */
    /* REACH_BOTTOM_FUNCTION */
    /* PULL_DOWN_REFRESH_FUNCTION */
})
