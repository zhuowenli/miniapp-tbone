module.exports = {
	origin: 'https://test.miniprogram.com',
	entry: '/',
	router: {
		index: [
			'/',
		],
	},
	redirect: {
		notFound: 'index',
		accessDenied: 'index',
	},
	generate: {
        appWxss: 'none',
	},
	runtime: {
		// wxComponent: 'noprefix',
		wxComponent: 'default',
	},
	app: {
		navigationBarTitleText: 'miniprogram-project',
	},
	global: {
		windowScroll: true,
	},
	projectConfig: {
		appid: '',
        projectname: 'tbone-demo3',
	},
	packageConfig: {
		author: 'wechat-miniprogram',
	},
}