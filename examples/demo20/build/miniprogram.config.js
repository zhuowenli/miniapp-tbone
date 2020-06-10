module.exports = {
	origin: 'https://test.miniprogram.com',
	entry: '/',
	router: {
		index: ['/'],
		bar: ['/bar'],
		scatter: ['/scatter'],
		pie: ['/pie'],
		line: ['/line'],
		funnel: ['/funnel'],
		gauge: ['/gauge'],
		k: ['/k'],
		radar: ['/radar'],
		heatmap: ['/heatmap'],
		tree: ['/tree'],
		treemap: ['/treemap'],
		sunburst: ['/sunburst'],
		map: ['/map'],
		graph: ['/graph'],
		boxplot: ['/boxplot'],
		parallel: ['/parallel'],
		sankey: ['/sankey'],
		themeriver: ['/themeriver'],
	},
	redirect: {
		notFound: 'index',
		accessDenied: 'index',
	},
	app: {
		navigationBarTitleText: 'miniprogram-project',
	},
	projectConfig: {
		appid: '',
        projectname: 'tbone-demo20',
	},
	packageConfig: {
		author: 'wechat-miniprogram',
	},
}