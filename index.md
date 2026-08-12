---
layout: home

hero:
  name: "Monica Steam"
  text: "独立、原生、面向 Steam 的 Android 客户端"
  tagline: "Steam Guard · 多账号 · 游戏库 · 商店 · 好友聊天 · 移动确认 · 备份 · 网络优化"
  image:
    src: /logo.svg
    alt: Monica Steam
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/quick-start
    - theme: alt
      text: 网络优化
      link: /network/overview
    - theme: alt
      text: GitHub
      link: https://github.com/JiangKaslana/Monica-Steam

features:
  - title: Steam Guard 与多账号
    details: 管理 Steam Guard 动态令牌、移动确认、多账号切换与 maFile 导入。
    icon: 🔐
  - title: 游戏库与商店
    details: 浏览游戏库、游玩统计、成就、Steam 商店、愿望单、购物车与个人游戏内容。
    icon: 🎮
  - title: 好友、聊天与通知
    details: 原生好友、私聊、群聊、Steam 通知与社区交互能力。
    icon: 💬
  - title: 动态 DNS / DoH
    details: 按启用的解析来源实时解析 Steam 域名，不固定长期 IP，不改变公网出口。
    icon: 🌐
  - title: 静态 Hosts 扫描
    details: 收集候选地址并进行 HTTPS、SNI 与证书验证，适合固定已验证节点。
    icon: ⚡
  - title: 本地优先
    details: Steam 账号数据、令牌与备份能力由 Android 应用沙箱、本地加密与可选远程备份保护。
    icon: 🛡️
---

::: danger 当前仍为公开测试版
Monica Steam 不是 Steam 官方客户端。部分功能依赖 Steam 网页或非公开移动接口，并可能受到 Valve 接口变更、账号地区和风控策略影响。**存在因 Steam 风控导致账号收到红信或限制的风险；介意请先不要使用。**
:::

## 文档导航

第一次使用请从 [快速开始](/guide/quick-start) 阅读；准备使用 DNS / DoH、自动优选或静态 Hosts 时，建议先阅读 [网络优化](/network/overview)。

如果你只想找答案，可以直接使用右上角的**全文搜索**。

## Monica Steam 做什么

Monica Steam 将 Steam Guard、账号管理、移动确认、游戏库、商城、好友、聊天、通知、Steam 账号备份与网络优化集中到一个 Android 应用中。

它从 Monica Android 的 Steam 能力独立出来，但不包含 Monica Pass 的密码库、Bitwarden、KeePass、自动填充和普通密码管理流程。

## 网络优化的核心原则

Monica Steam 的网络优化不是 VPN，也不是 Steam 流量代理。动态 DNS / DoH 和静态 Hosts 的主要作用都是帮助应用确定“应该连接哪个 Steam / CDN 目标地址”。

```text
DNS / DoH：
Monica → DNS / DoH → 获得 Steam IP
Monica ─────────────→ Steam / CDN

静态 Hosts：
Monica → 固定经过验证的 Steam IP
Monica ─────────────→ Steam / CDN
```

Steam 业务流量仍由用户自己的网络直接发出，因此这些机制不会主动把 Steam 登录出口改成第三方代理 IP。
