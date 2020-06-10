/*
 * Author: 卓文理
 * Email: zhuowenligg@gmail.com
 * Date: 2020-06-05 14:15:46
 */
import Element from '../element'
import cache from '../../util/cache'
import Pool from '../../util/pool'
import tool from '../../util/tool'

const pool = new Pool()

export default class HTMLSelectElement extends Element {
    /**
     * 创建实例
     */
    static $$create(options, tree) {
        const config = cache.getConfig()

        if (config.optimization.elementMultiplexing) {
            // 复用 element 节点
            const instance = pool.get()

            if (instance) {
                instance.$$init(options, tree)
                return instance
            }
        }

        return new HTMLSelectElement(options, tree)
    }

    /**
     * 覆写父类的 $$init 方法
     */
    $$init(options, tree) {
        super.$$init(options, tree)
        this.$$resetOptions()
    }

    /**
     * 重置 options 显示
     */
    $$resetOptions() {
        const value = this.value

        if (value !== undefined) {
            this.options.forEach(child => child.$$updateSelected(child.value === value))
        } else {
            this.options.forEach((child, index) => child.$$updateSelected(index === 0))
        }
    }

    /**
     * 覆写父类的回收实例方法
     */
    $$recycle() {
        this.$$destroy()

        const config = cache.getConfig()

        if (config.optimization.elementMultiplexing) {
            // 复用 element 节点
            pool.add(this)
        }
    }

    /**
     * 调用 $_generateHtml 接口时用于处理额外的属性，
     */
    $$dealWithAttrsForGenerateHtml(html, node) {
        const value = node.value
        if (value) html += ` value="${tool.escapeForHtmlGeneration(value)}"`

        const disabled = node.disabled
        if (disabled) html += ' disabled'

        return html
    }

    /**
     * 调用 outerHTML 的 setter 时用于处理额外的属性
     */
    $$dealWithAttrsForOuterHTML(node) {
        this.name = node.name || ''
        this.value = node.value || ''
        this.disabled = !!node.disabled
        this.selectedIndex = node.selectedIndex || 0
    }

    /**
     * 调用 cloneNode 接口时用于处理额外的属性
     */
    $$dealWithAttrsForCloneNode() {
        return {
            value: this.value,
            disabled: this.disabled,
        }
    }

    /**
     * 对外属性和方法
     */
    get name() {
        return this.$_attrs.get('name')
    }

    set name(value) {
        value = '' + value
        return this.$_attrs.set('name', value)
    }

    get value() {
        return this.$_attrs.get('value')
    }

    set value(value) {
        value = '' + value

        this.$_attrs.set('value', value)

        // 同步更新 selectedIndex 属性
        this.$_attrs.set('selectedIndex', this.options.findIndex(option => option.value === value))

        // 同步更新 options 的 selected
        this.$$resetOptions()
    }

    get disabled() {
        return !!this.$_attrs.get('disabled')
    }

    set disabled(value) {
        value = !!value
        this.$_attrs.set('disabled', value)
    }

    get selectedIndex() {
        return +this.$_attrs.get('selectedIndex')
    }

    set selectedIndex(value) {
        value = +value

        this.$_attrs.set('selectedIndex', value)

        // 同步更新 value 属性
        this.$_attrs.set('value', this.options[value] && this.options[value].value || '')

        // 同步更新 options 的 selected
        this.$$resetOptions()
    }

    get options() {
        // 只考虑儿子节点中的 option
        return this.$_children.filter(child => child.tagName === 'OPTION' && !child.disabled)
    }
}
