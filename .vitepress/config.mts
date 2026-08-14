import { defineConfig } from "vitepress";

export default defineConfig({
  lang: "zh-CN",
  title: "Monica Steam",
  description: "Monica Steam 安装、Steam Guard、游戏库、商店、聊天、备份、安全与网络优化文档。",
  base: "/",
  cleanUrls: true,
  lastUpdated: true,
  head: [
    ["meta", { name: "theme-color", content: "#1a9fff" }],
    ["meta", { name: "color-scheme", content: "light dark" }],
    ["link", { rel: "icon", type: "image/png", sizes: "64x64", href: "/favicon.png" }],
    ["link", { rel: "shortcut icon", type: "image/png", href: "/favicon.png" }],
    ["link", { rel: "apple-touch-icon", href: "/monica-steam.webp" }],
  ],
  themeConfig: {
    logo: "/monica-steam.webp",
    siteTitle: "Monica Steam",
    nav: [
      { text: "指南", link: "/guide/quick-start" },
      { text: "网络优化", link: "/network/overview" },
      { text: "参考", link: "/reference/faq" },
      { text: "开发", link: "/development/build" },
      {
        text: "项目",
        items: [
          { text: "Monica Steam 主项目", link: "https://github.com/JoyinJoester/Monica-Steam" },
          { text: "Monica 生态关系", link: "/about/ecosystem" },
          { text: "版本状态", link: "/about/release-status" },
          { text: "赞助、QQ群与支持", link: "/about/support" },
          { text: "致谢", link: "/about/thanks" },
          { text: "友情链接", link: "/about/links" },
          { text: "文档站仓库", link: "https://github.com/monica-steam/monica-steam.github.io" },
        ],
      },
    ],
    sidebar: [
      {
        text: "开始使用",
        collapsed: false,
        items: [
          { text: "快速开始", link: "/guide/quick-start" },
          { text: "风险与安全边界", link: "/guide/risk-and-safety" },
        ],
      },
      {
        text: "核心功能",
        collapsed: false,
        items: [
          { text: "账号、Steam Guard 与确认", link: "/guide/account-guard" },
          { text: "游戏库、商店、好友与聊天", link: "/guide/library-store-chat" },
          { text: "备份与本地安全", link: "/guide/backup-security" },
        ],
      },
      {
        text: "网络优化",
        collapsed: false,
        items: [
          { text: "动态网络优化与静态 Hosts", link: "/network/overview" },
          { text: "2026-08-14 网络优化重构", link: "/network/changelog-2026-08-14" },
          { text: "Cloudflare Worker 反代 Google DoH", link: "/network/cloudflare-google-doh" },
        ],
      },
      {
        text: "参考",
        collapsed: true,
        items: [
          { text: "设置与使用建议", link: "/reference/settings" },
          { text: "常见问题", link: "/reference/faq" },
        ],
      },
      {
        text: "开发",
        collapsed: true,
        items: [
          { text: "构建与测试", link: "/development/build" },
          { text: "架构与项目边界", link: "/development/architecture" },
        ],
      },
      {
        text: "关于",
        collapsed: true,
        items: [
          { text: "Monica 生态关系", link: "/about/ecosystem" },
          { text: "版本状态", link: "/about/release-status" },
          { text: "赞助、QQ群与支持", link: "/about/support" },
          { text: "致谢", link: "/about/thanks" },
          { text: "友情链接", link: "/about/links" },
        ],
      },
    ],
    search: {
      provider: "local",
      options: {
        translations: {
          button: { buttonText: "搜索文档", buttonAriaLabel: "搜索文档" },
          modal: {
            noResultsText: "没有找到相关内容",
            resetButtonTitle: "清除查询",
            footer: {
              selectText: "选择",
              navigateText: "切换",
              closeText: "关闭",
            },
          },
        },
      },
    },
    outline: { level: [2, 3], label: "本页目录" },
    docFooter: { prev: "上一篇", next: "下一篇" },
    lastUpdated: { text: "最后更新于" },
    editLink: {
      pattern: "https://github.com/monica-steam/monica-steam.github.io/edit/main/:path",
      text: "在 GitHub 上编辑此页",
    },
    socialLinks: [
      { icon: "github", link: "https://github.com/JoyinJoester/Monica-Steam" },
    ],
    footer: {
      message: "Monica Steam 是非官方第三方 Steam 客户端，与 Valve Corporation 无隶属、授权或赞助关系。",
      copyright: '<strong>Monica Steam</strong>：<a href="https://github.com/JoyinJoester/Monica-Steam" target="_blank" rel="noreferrer">JoyinJoester</a> · GPL-3.0 <span class="docs-credit">· 文档贡献：<a href="https://github.com/JiangKaslana" target="_blank" rel="noreferrer">JiangKaslana</a> · <a href="https://kianakaslana.top" target="_blank" rel="noreferrer">Blog</a></span>',
    },
  },
});
