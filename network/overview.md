# 动态网络优化与静态网络优化（Hosts）

Monica Steam 的网络优化分成两套职责清晰、可以同时开启的机制：

1. **静态网络优化（Hosts）**：把指定 Steam 域名固定到已验证的 IP；
2. **动态网络优化**：使用传统 DNS / HTTPS DoH 动态解析 Steam 域名，并验证候选 IP 的 HTTPS 可用性。

> **静态优先，动态补充，系统 DNS 兜底。**

底层实现中，传统 DNS 与 DoH 是不同的解析传输方式；在产品界面里，它们统一归入“动态网络优化”，因为最终目标都是在运行时为 Steam 域名得到可用地址。

## 为什么需要网络优化

Steam 商店、Community、Web API、登录、帮助、聊天和 CDN / UGC 静态资源在部分网络环境中可能遇到：

- DNS 超时；
- DNS 污染 / 劫持；
- 解析失败；
- 解析到质量不理想的 CDN；
- DNS 返回公网 IP，但该 IP 对当前 Steam hostname 的 HTTPS 实际不可用；
- 网络变化后旧地址失效。

这类问题不一定需要 VPN。如果主要问题位于解析与 CDN 调度层，恢复一个实际可用的目标 IP 后，Steam HTTPS 业务流量仍然可以保持用户自己的网络直连。

## 最终解析顺序

当前网络链路按以下优先级执行：

```text
Steam hostname
      ↓
静态 Hosts 是否命中？
      ├─ 是 → 直接使用静态 IP
      │        └─ 可选附加 Android System DNS fallback
      │
      └─ 否 → 动态网络优化
                 ↓
            DNS / DoH 解析
                 ↓
            收集候选 IP
                 ↓
       HTTPS / SNI / 证书可用性验证
                 ↓
          可用候选进入短期缓存
                 ↓
          全部失败时 System DNS fallback
```

静态 Hosts 命中后**不会再进入动态 DNS / DoH**。这样可以避免已经明确指定的优选 IP 被动态解析延迟、错误结果或其他解析来源干扰。

## 静态网络优化（Hosts）

静态 Hosts 适合“已经验证过、希望明确固定”的 Steam 域名。

### 内置优选 Hosts

Monica Steam 提供一组内置优选 Hosts 预设，当前包含 18 个常用 Steam / CDN hostname。它主要覆盖：

- Steam Web API；
- Store；
- 登录与结账；
- Community 静态资源；
- Steam Chat；
- Steam CDN / SteamStatic；
- 用户图片；
- Support / Help；
- Steam 网络连通性测试。

首次没有保存过静态 Hosts 配置的安装可以使用内置预设；已有用户自己保存过 Hosts 的情况下，升级不会强行覆盖用户配置。设置菜单中也可以随时选择“使用内置优选 Hosts”。

内置预设默认保留 **System DNS fallback**，所以某个 CDN IP 将来失效时，不会因为一条固定映射永久阻断对应 hostname。

### 自定义 Hosts

手工填写的 Hosts 与内置预设使用**同一套静态解析引擎**，格式和原来的 Hosts 编辑功能保持一致。

示例：

```text
184.84.58.165 store.steampowered.com
184.87.199.210 api.steampowered.com
```

应用不会把请求 URL 改写成 IP 地址。连接仍使用原始 hostname：

```text
URL / Host: store.steampowered.com
TLS SNI:    store.steampowered.com
目标 IP:    184.84.58.165
```

因此 HTTPS 仍按 Steam 原域名完成 SNI 与证书验证。

### 静态扫描

如果希望自己重新优选，可以使用静态扫描：

```text
启用的 DNS / DoH
      ↓
收集候选 IP
      ↓
HTTPS / SNI / TLS / 证书验证
      ↓
重复采样和延迟比较
      ↓
选择稳定节点
      ↓
写入 Monica Steam 应用内 Hosts
```

静态扫描不会因为 DNS 返回一个 IP 就直接固定它，而是继续验证实际 HTTPS 可用性。

## 动态网络优化

动态模式适合不希望长期固定 IP、希望 CDN 地址随网络变化自动重新解析的场景。

```text
缓存 miss
   ↓
启用的传统 DNS / DoH 并行解析
   ↓
收集多个候选 IP
   ↓
短时并行 HTTPS 可用性验证
   ↓
只返回实际可服务目标 Steam hostname 的候选
   ↓
缓存约 5 分钟
```

### 为什么不能“DNS 有答案就直接用”

DNS 返回非空结果只说明“解析器给出了地址”，并不能证明：

- 当前网络能连到该地址；
- CDN 节点仍在服务该 Steam hostname；
- TLS 握手可用；
- SNI 与证书匹配；
- 该结果没有被污染或错误调度。

因此动态解析会对候选进行一次轻量 HTTPS 验证。验证使用原始 Steam hostname，并强制连接到候选 IP，所以 SNI 与证书校验不会被绕过。

验证只在缓存 miss 时发生，验证通过后的结果继续使用短期缓存，不会每个 HTTP 请求都额外探测一次。

### 动态解析失败如何回退

如果自定义 DNS / DoH 返回了 IP，但这些候选全部无法通过 HTTPS 验证，它们不会被当作成功结果缓存。

在启用 System DNS fallback 时：

```text
自定义 / 内置动态来源
      ↓
候选全部不可用
      ↓
Android System DNS
```

这避免了“自定义解析器能回答，但返回的路线不可用，于是开启动态网络优化后反而整个 Steam 打不开”的情况。

## 解析来源

动态网络优化统一管理解析来源。

内置来源包括：

- Android System DNS；
- DNSPod DoH；
- AliDNS DoH；
- Cloudflare DoH；
- Google Public DNS DoH；
- Quad9 ECS DoH。

此外支持：

- 最多 8 个自定义传统 DNS；
- 最多 8 个自定义标准 HTTPS DoH。

自定义来源可以独立启用 / 禁用、单独测速并参与动态解析与静态扫描。

### System DNS 的角色

当存在已启用的传统 DNS / DoH 时，**System DNS 不再和它们抢“第一个响应”**。

原因很简单：本地运营商 DNS 通常延迟很低，如果它和 DoH 同时竞速，往往会因为响应更快而长期抢在前面，使已经开启的 DoH 实际上很少被使用。

因此现在的策略是：

```text
有非 System 动态来源：
DNS / DoH 主解析 → System DNS fallback

只有 System DNS：
直接使用 System DNS
```

## DoH Bootstrap IP

自定义 DoH 可以填写多个 Bootstrap IPv4 / IPv6。

例如：

```text
DoH URL:
https://dns.example/dns-query

Bootstrap:
1.1.1.1, 1.0.0.1
```

Bootstrap 的作用是帮助客户端在不先解析 `dns.example` 的情况下找到 DoH 服务端地址。

它**不会**关闭 HTTPS 安全检查：

- HTTPS URL 仍是原始 DoH hostname；
- TLS SNI 仍使用该 hostname；
- 证书仍必须匹配 hostname。

修改 DoH endpoint 或 Bootstrap IP 后，Monica Steam 会清理旧的 DoH resolver 与其连接池，避免旧 TLS keep-alive 连接继续复用原地址，让新的 Bootstrap 看起来“没有生效”。

## 配置变更为何立即清旧连接

修改静态 Hosts、动态解析来源、DoH Bootstrap 或强制刷新缓存后，应用会立即清理空闲的旧 HTTPS 连接。

否则存在这种窗口：

```text
保存新 IP / 新 DNS
      ↓
立即刷新页面
      ↓
OkHttp 继续复用旧 keep-alive 连接
      ↓
看起来像“设置没有生效”
```

当前实现只清理可复用的连接池，不会因为切换网络优化设置而粗暴取消正在执行的 HTTPS 请求。

## 缓存与并发合并

动态解析使用短期缓存，并允许在解析器短暂异常时保留有限的 stale cache 回退能力。

同一个 hostname 同时触发多个请求时，会合并同域名的解析任务，避免页面加载时让多个请求同时轰炸 DNS / DoH。

缓存和 resolver 设置变化会被明确区分：当解析器、Bootstrap 或启用状态变化时，会清理需要失效的运行时状态。

## IPv4 与 IPv6

系统 DNS 与标准 DoH 可以处理 IPv4 / IPv6，并可提供 IPv6 优先策略。

当前传统自定义 DNS 的运行时查询主要使用 IPv4 A 记录，因此与 DoH / System DNS 的能力并不完全相同。

## Steam 域名覆盖

网络优化覆盖的不只是商店首页，还包括 Monica Steam 使用的主要 Steam 服务族，例如：

- Store；
- Community；
- Web API；
- 登录 / Help / Support；
- Chat；
- 静态资源；
- 媒体；
- UGC；
- 常见 CDN 域名。

## 安全边界

当前网络优化不会为了“加速”牺牲 HTTPS 安全性：

- 不关闭 TLS 证书校验；
- 不把 Steam hostname 改写成裸 IP URL；
- 不修改 SNI；
- 不安装自定义 CA；
- 不做 HTTPS MITM；
- 不建立系统 VPN；
- 不修改 Android 系统 Hosts；
- 不修改其他应用网络。

DoH 也只是 DNS 解析通道，不是 Steam HTTPS 代理：

```text
DNS：
Monica → DNS / DoH → 得到目标 IP

Steam HTTPS：
用户自己的公网网络 → Steam / CDN
```

因此网络优化改变的是“目标地址怎么得到”，不是“登录流量从哪个第三方出口出去”。

## WebView 边界

当前静态 / 动态解析主要覆盖 Monica Steam 使用统一 OkHttp 网络栈的原生请求。

Android WebView 内部仍有自己的 Chromium 网络栈，不能简单认为所有 WebView 请求都会自动继承应用级自定义 DNS。文档和功能不会把这一能力描述为“全局 Steam 代理”或“系统级直连”。

## 推荐配置

### 希望最稳定、省心

```text
静态网络优化：使用内置优选 Hosts
System DNS fallback：开启
动态网络优化：可按需开启
```

对于已经验证有效的常用 Steam 域名，静态 Hosts 可以提供最确定的路线；未覆盖域名仍可以继续动态解析。

### 希望地址随网络自动变化

```text
静态 Hosts：只固定确实有问题的域名，或关闭
动态网络优化：开启
DNS / DoH：选择当前网络实际可用的来源
System DNS fallback：建议开启
```

### 使用自建 DoH

建议先在解析来源页单独测速，再开启动态网络优化。即使自定义 DoH 能返回 DNS 结果，运行时也会继续验证返回的 Steam 候选是否真的可以建立 HTTPS 连接。

如需自建一个只用于 DNS 的中转，可继续阅读：

[Cloudflare Worker 反代 Google DoH](/network/cloudflare-google-doh)

本轮网络优化改动记录见：

[2026-08-14 网络优化重构](/network/changelog-2026-08-14)
