module.exports = {
  // plugins: ['@vuepress/last-updated', '@vuepress/nprogress', '@vuepress/blog', '@vuepress/back-to-top'],
  title: "SWTCLIB",
  description: "社区版swtc公链node.js开发库",
  themeConfig: {
    repo: "swtcca/swtcdoc",
    lastUpdated: "Last Updated", // string | boolean
    repoLabel: "Contribute!",
    docsRepo: "swtcca/swtcdoc",
    docsDir: "docs",
    editLinks: true,
    editLinkText: "帮助维护文档!",
    nav: [
      { text: "练习", link: "https://swtclearn.netlify.com" },
      { text: "实例", link: "/examples/" },
      { text: "lib文档", link: "/swtclib/" },
      { text: "api文档", link: "/api/" },
      { text: "增强", link: "/swtc/" },
      { text: "联盟链扩展", link: "/swtcxlib/" },
      { text: "API扩展", link: "/swtcapi/" }
    ]
  }
};
