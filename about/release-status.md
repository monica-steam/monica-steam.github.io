# 版本状态

## 当前阶段

Monica Steam 仍处于公开测试阶段，而不是稳定正式版。

测试版意味着：

- UI 和接口可能继续调整；
- Steam 上游变化可能导致功能临时失效；
- 数据结构可能继续迁移；
- 网络优化策略仍可能继续修正；
- 风控风险仍需要持续观察。

## 当前主要能力

现阶段项目已覆盖：

- Steam Guard 与账号管理；
- 游戏库和个人游戏内容；
- Steam 商店；
- 好友、聊天与通知；
- 备份和本地安全；
- **静态网络优化（Hosts）**，包括内置优选 Hosts 与自定义 Hosts；
- **动态网络优化**，统一管理传统 DNS 与 HTTPS DoH；
- 自定义传统 DNS / HTTPS DoH；
- 自定义 DoH Bootstrap IPv4 / IPv6；
- 动态候选的 HTTPS / SNI / 证书可用性验证与 System DNS fallback；
- 原生 Steam 页面与内置网页能力。

## 网络优化当前边界

网络优化仍然是 Monica Steam 应用范围内的解析与目标地址选择能力：

- 不修改 Android 系统 DNS / Hosts；
- 不建立系统 VPN；
- 不关闭 HTTPS 证书校验；
- 不承诺 Android WebView 的 Chromium 网络栈全部继承应用级自定义 DNS。

详见：[动态网络优化与静态网络优化（Hosts）](/network/overview)。

## 更新时

以项目 Releases、仓库 README 和 Release Notes 为准。升级前务必备份 Steam Guard / `maFile`。
