# 动态 DNS / DoH 与静态 Hosts

Monica Steam 当前的网络优化主要分成两套独立机制：

1. **动态 DNS / DoH**
2. **静态 Hosts 扫描**

两者共享统一的解析来源配置，但解析策略不同。

> **解析来源统一管理，动态解析与静态固定各司其职。**

## 为什么需要网络优化

Steam 商店、Community、Web API、登录、帮助、聊天和 CDN / UGC 静态资源在部分网络环境中可能遇到：

- DNS 超时；
- DNS 污染 / 劫持；
- 解析失败；
- 解析到质量不理想的 CDN；
- 某些地址存在但 HTTPS 不可用；
- 网络变化后旧地址失效。

这类问题不一定需要 VPN。若主要问题发生在 DNS 层，恢复正确解析后，Steam HTTPS 业务流量仍可以保持直连。

## 动态 DNS / DoH

动态模式更适合长期日常使用：

```text
配置一次
  ↓
按需解析
  ↓
短期缓存
  ↓
缓存失效后自动重新解析
```

应用访问受支持的 Steam 域名时，会按当前启用的解析来源进行解析。

<details>
<summary>展开：动态解析流程</summary>

```text
Steam 原生网络请求
        ↓
检查静态 Hosts 是否命中
        ↓
未命中
        ↓
检查动态 DNS 缓存
        ↓
缓存有效 ─────────→ 使用缓存
        ↓
无有效缓存
        ↓
调用启用的 DNS / DoH 来源
        ↓
得到公开 IP
        ↓
短期缓存
        ↓
Monica 直接连接 Steam / CDN
```

动态模式不会把某个 Steam IP 永久固定下来。网络或 CDN 变化后，缓存到期即可重新解析。

</details>

### 缓存

动态解析使用短期缓存，并允许在解析器临时失败时使用有限时间的过期缓存回退。

这样可以减少：

- 每个 HTTP 请求都重新查 DNS；
- 解析服务瞬时波动导致整个页面失败；
- 高频重复写诊断日志。

### 并发合并

同一个 hostname 同时触发多个网络请求时，动态解析会尽量合并同域名的并发解析任务，而不是让每个请求都独立轰炸 DNS / DoH。

## 解析来源

解析来源统一管理，可按需启用。

内置公共来源包括：

- Android System DNS；
- DNSPod；
- AliDNS；
- Cloudflare；
- Google Public DNS；
- Quad9 ECS。

此外支持用户添加：

- 最多 8 个自定义 UDP DNS；
- 最多 8 个自定义标准 HTTPS DoH。

自定义解析源进入同一套列表，可以：

- 独立启用 / 禁用；
- 单独测速；
- 参与全部测速；
- 参与动态 DNS；
- 参与静态 Hosts 扫描。

## 多源竞争

如果同时启用了多个解析源，动态解析可让它们在受控并发下参与解析。

```text
                 ┌─ System DNS
Steam hostname ──┼─ Cloudflare
                 ├─ Google
                 ├─ 自定义 UDP DNS
                 └─ 自定义 DoH
```

注意：**DNS 响应最快不等于它返回的 Steam CDN 一定最快。**

DNS 测速主要用于判断解析器自身：

- 是否可达；
- 延迟；
- 稳定性；
- 是否频繁失败。

## 静态 Hosts 扫描

静态 Hosts 更适合“扫描、验证、固定”。

```text
启用的 DNS / DoH
      ↓
收集候选 IP
      ↓
HTTPS / SNI / TLS / 证书验证
      ↓
重复采样和延迟比较
      ↓
选择可用节点
      ↓
写入 Monica Steam 应用内 Hosts
```

静态扫描不会因为 DNS 返回一个 IP 就直接固定它，而是继续验证实际 HTTPS 可用性。

### 为什么需要 HTTPS / SNI / 证书验证

单纯“能 ping”或“有 TCP 响应”不足以说明 IP 能正确服务目标 Steam hostname。

扫描会尽量排除：

- TLS 握手失败；
- SNI 不正确；
- 证书不匹配；
- 已失效节点；
- 私网 / 保留地址；
- 常见 Fake-IP；
- 不适用于目标服务的地址。

## 为什么静态 Hosts 要重扫

Hosts 的本质是固定。

当以下条件变化时，旧 IP 可能不再是最佳选择：

- Wi-Fi / 移动网络切换；
- 运营商变化；
- 跨网路由变化；
- Steam CDN 调度变化；
- IPv4 / IPv6 环境变化。

所以静态 Hosts 适合“当前验证过的节点”，而不是“永久答案”。

## 动态与静态同时开启

静态 Hosts 优先：

```text
hostname
  ↓
命中静态 Hosts？ ──是→ 使用固定 IP
  ↓ 否
动态 DNS / DoH
  ↓
实时解析
```

因此可以只固定少数问题域名，其余 Steam 域名继续动态解析。

## IPv4 与 IPv6

系统 DNS 与标准 DoH 可以处理 IPv4 / IPv6，并可提供 IPv6 优先策略。

当前自定义传统 UDP DNS 主要以 IPv4 A 记录能力为主，因此与 DoH / System DNS 的能力并不完全相同。

## Steam 域名覆盖

网络优化覆盖的目标不只商店首页，还包括 Monica Steam 实际使用的主要 Steam 服务族，例如：

- Store；
- Community；
- Web API；
- 登录 / Help；
- Chat；
- 静态资源；
- 媒体；
- UGC；
- 常见 CDN 域名。

## 是否改变 Steam 登录 IP

不会主动改变。

```text
DNS 查询：
Monica → DNS / DoH → 返回目标 IP

Steam HTTPS：
用户自己的公网网络 → Steam
```

DoH 服务器不是 Steam 流量代理。改变的是“目标 IP 怎么得到”，不是“用户从哪个第三方出口访问 Steam”。

## 应用边界

当前网络优化是 **app-scoped**：

- 不修改 Android 系统 DNS；
- 不修改 Android 系统 Hosts；
- 不建立系统 VPN；
- 不修改其他应用网络；
- 不承诺 WebView 全部走相同解析链路。

## 推荐

普通用户：

```text
动态 DNS / DoH：开启
静态 Hosts：关闭
```

如果某些 Steam 域名长期不稳定，再执行静态 Hosts 扫描。

如果希望自建一个只用于 DNS 的中转，可继续阅读：

[Cloudflare Worker 反代 Google DoH](/network/cloudflare-google-doh)
