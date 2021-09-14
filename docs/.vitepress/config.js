module.exports = {
  base: "/swtclib/",
  title: "swtclib",
  description: "swtclib documents",
  markdown: {
    config: md => {
      md.use(require("vpress-mdi-details").details).use(
        require("vpress-mdi-details").mermaid
      )
    }
  },
  themeConfig: {
    repo: "https://github.com/swtcca/swtclib",
    docsDir: "docs",
    editLinks: true,
    editLinkText: "Edit",
    lastUpdated: "Last Updated",

    nav: [
      { text: "国密综合", link: "/docs/swtcxlib/", activeMatch: "/swtcxlib/" },
      { text: "钱包", link: "/docs/wallet/", activeMatch: "/wallet/" },
      { text: "实例", link: "/docs/examples/", activeMatch: "/examples/" },
      { text: "RPC", link: "/docs/swtcrpc/", activeMatch: "/swtcprc/" },
      { text: "WS", link: "/docs/swtclib/", activeMatch: "/swtclib/" },
      { text: "API", link: "/docs/api/", activeMatch: "/api/" },
      { text: "PROXY", link: "/docs/swtcproxy/", activeMatch: "/swtcproxy/" },
      {
        text: "swtcdoc",
        link: "https://swtcdoc.netlify.app/"
      }
    ]
  }
}
