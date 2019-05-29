module.exports = {
	// plugins: ['@vuepress/last-updated', '@vuepress/nprogress', '@vuepress/blog', '@vuepress/back-to-top'],
	title: "SWTCLIB",
	description: "社区版swtc公链node.js开发库",
	themeConfig: {
		repo: 'swtcca/swtclib',
		lastUpdated: 'Last Updated', // string | boolean
		repoLabel: 'Contribute!',
		docsRepo: 'swtcca/swtclib',
		docsDir: 'docs',
		editLinks: true,
		editLinkText: '帮助维护文档!',
		nav: [
			{ text: '实例', link: '/docs/examples/' },
			{ text: '文档', link: '/docs/swtclib/' },
			{ text: '增强', link: '/docs/swtc/' },
			{ text: '联盟链', link: '/docs/swtcxlib/' },
			{ text: 'API', link: '/docs/swtcapi/' }
		]
	}
}
