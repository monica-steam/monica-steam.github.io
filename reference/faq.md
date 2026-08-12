# 常见问题

## Monica Steam 是 Steam 官方客户端吗？

不是。Monica Steam 是非官方第三方 Android 客户端。

## 会不会红信？

项目当前仍明确提示存在 Steam 风控导致红信或账号限制的风险，无法承诺不会发生。介意风险就不要在重要账号上使用测试版。

## 动态 DNS / DoH 是代理吗？

不是。它主要负责把 Steam hostname 解析成目标 IP，Steam HTTPS 流量仍由你的网络直接发出。

## 会改变 Steam 登录公网 IP 吗？

DNS / Hosts 本身不会主动把 Steam 流量经第三方代理转发，因此不会像 VPN / 代理节点那样主动替换公网出口。

## 动态 DNS 与静态 Hosts 哪个更推荐？

日常使用优先动态 DNS / DoH。静态 Hosts 更适合某些域名长期不稳定、需要扫描并固定已验证节点的情况。

## 为什么静态 Hosts 用一段时间后变慢？

因为 CDN、运营商路由和网络环境会变化。静态 Hosts 的优点是固定，缺点也是固定；必要时重新扫描。

## 自定义 DoH 可以同时用于动态解析和静态扫描吗？

可以。解析来源统一管理，启用的自定义 DoH 可以同时服务两种策略。

## DNS 测速第一就是 Steam 最快吗？

不是。DNS 延迟只说明解析器响应速度，不等于它返回的 Steam CDN 对你最快。

## Cloudflare Worker DoH 会代理 Steam 吗？

不会。Worker 只处理中间的 DNS 查询，Steam HTTPS 仍由客户端直连。

## 为什么建议 Worker 加 TOKEN？

主要减少公开 `/dns-query` 被随手扫描、收录和滥用的概率。TOKEN 不是强认证，完整 URL 泄露后仍然能被使用。

## WebView 为什么可能和原生页面表现不同？

当前网络优化主要是应用原生网络栈能力，不应假设所有 WebView 请求都经过相同的自定义 DNS / Hosts 流程。

## 可以和 Monica Pass 一起安装吗？

可以独立安装。Monica Steam 是独立应用，不会自动共享 Monica Pass 的密码库数据。
