# 2026-08-14 网络优化重构

本次更新集中修正 Monica Steam 的静态 Hosts 与动态 DNS / DoH 行为，使两套机制的职责、优先级和失败回退更加明确。

## 主要变化

### 静态网络优化（Hosts）

- 新增一组内置优选 Hosts，覆盖 18 个常用 Steam / CDN hostname。
- 内置预设与用户手工 Hosts 使用同一套静态解析引擎，不再引入第二套独立机制。
- 静态 Hosts 命中后直接使用固定 IP，不再先触发动态 DNS / DoH。
- 可选的 System DNS fallback 仍可附加在静态结果之后，用于固定节点失效时兜底。
- 已有用户保存过的 Hosts 不会被升级强行覆盖；可在菜单中随时恢复内置预设。

### 动态网络优化

- 传统 DNS 与 HTTPS DoH 继续统一作为“动态网络优化”的解析来源管理。
- 当启用了非 System 的动态来源时，Android System DNS 不再参与抢跑，而只在动态来源失败时 fallback。
- 修复“DoH 已开启但本地系统 DNS 因响应更快而长期抢先，导致 DoH 实际很少被使用”的问题。
- 动态 DNS / DoH 不再把“返回了公网 IP”直接视为成功。
- 缓存 miss 时会收集多个候选，并用原始 Steam hostname 对候选做轻量 HTTPS / SNI / 证书可用性验证。
- 最快返回的解析来源如果给出不可用路线，会继续使用其他可用候选，而不是直接把 Steam 导向死路。
- 所有动态候选都不可用时，可回退到 Android System DNS。
- 通过验证的结果继续使用短期缓存，避免每个 HTTP 请求都重复进行 HTTPS 探测。

### 自定义 DNS / DoH

- 保留最多 8 个自定义传统 DNS 与 8 个自定义 HTTPS DoH。
- 自定义 DoH 继续支持多个 Bootstrap IPv4 / IPv6。
- 修改 DoH URL 或 Bootstrap IP 后会重置旧 DnsOverHttps 实例并清理其连接池，避免旧 TLS keep-alive 继续复用原地址。
- Bootstrap 只用于寻找 DoH 服务端；DoH HTTPS 仍按原 hostname 完成 SNI 与证书验证。

### 连接与缓存状态

- 修改静态 Hosts、动态解析来源、Bootstrap 或强制刷新后，会立即清理旧的空闲 HTTPS 连接。
- 不再把连接池清理异步排队，从而减少“刚保存新配置，立即刷新却仍复用旧 IP”的窗口。
- 不会因为网络优化设置变化而取消正在执行的 HTTPS 请求。

## 最终优先级

```text
静态 Hosts 命中
    ↓
直接使用静态 IP
    ↓
未命中时进入动态网络优化
    ↓
传统 DNS / DoH 收集候选
    ↓
HTTPS / SNI / 证书可用性验证
    ↓
可用候选短期缓存
    ↓
全部失败时 System DNS fallback
```

## 安全边界

本轮更新没有通过降低 HTTPS 安全性换取可用性：

- 不关闭证书校验；
- 不修改 Steam SNI；
- 不使用裸 IP URL 替换 Steam hostname；
- 不安装自定义 CA；
- 不做 MITM；
- 不建立系统 VPN；
- 不修改 Android 系统 Hosts。

网络优化仍然是 Monica Steam 应用范围内的域名解析与目标地址选择。

## 测试

本轮增加或强化了以下回归测试：

- 静态 Hosts 命中不会调用动态 DNS；
- 静态 Hosts 的 System DNS fallback 与动态解析分离；
- 自定义动态解析返回坏 IP 时不会直接采用；
- 其他解析来源给出可用候选时可以继续使用；
- 所有动态候选不可用时回退 System DNS；
- DoH resolver 设置变化会清缓存并重置传输状态；
- 内置 18 条 Hosts 可完整解析；
- 网络优化集成守卫保持静态 / 动态职责边界。

相关使用方式请阅读：

[动态网络优化与静态网络优化（Hosts）](/network/overview)
