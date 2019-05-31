module.exports = {
  // plugins: ['@vuepress/last-updated', '@vuepress/nprogress', '@vuepress/blog', '@vuepress/back-to-top'],
  title: "SWTCLIB",
  description: "社区版swtc公链node.js开发库",
  themeConfig: {
    repo: "swtcca/swtc-app-examples",
    lastUpdated: "Last Updated", // string | boolean
    repoLabel: "Contribute!",
    docsRepo: "swtcca/swtc-app-examples",
    docsDir: "docs",
    editLinks: true,
    editLinkText: "帮助维护文档!",
    nav: [
      { text: "实例", link: "/docs/examples/" },
      { text: "lib文档", link: "/docs/swtclib/" },
      { text: "api文档", link: "/docs/api/" },
      { text: "增强", link: "/docs/swtc/" },
      { text: "联盟链扩展", link: "/docs/swtcxlib/" },
      { text: "API扩展", link: "/docs/swtcapi/" }
    ]
  }
};
