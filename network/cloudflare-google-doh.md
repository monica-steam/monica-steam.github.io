# Cloudflare Worker 反代 Google DoH

::: danger 风险提示
本方法使用 Cloudflare Workers 的免费或付费资源做 DoH Relay。**不要把免费额度理解成无限公共 DNS。** 如果完整 DoH 地址被公开、收录或扫描滥用，可能快速消耗额度，并增加限流、滥用处置或账号 / 项目风控风险。Cloudflare 的额度和政策也可能变化，请以部署时官方规则为准。
:::

这套方案只做一件事：

```text
DoH 客户端
   ↓
Cloudflare Worker
   ↓
https://dns.google/dns-query
```

不做：

- ECS 地区伪装；
- 香港 / 日本 / 新加坡强选；
- Cloudflare IP 优选；
- DNS 数据包重写；
- Steam HTTPS 代理；
- VPN；
- CDN 反代。

## 它不会代理 Steam 流量

DNS：

```text
Monica → Worker → dns.google
```

Steam 业务：

```text
Monica ─────────→ Steam / CDN
```

因此 Worker 只参与 DNS 查询，不会把 Steam 登录出口直接改成 Cloudflare Worker 的 IP。

## 创建 Worker

整个过程可以直接在 Cloudflare 网页后台完成：

```text
Workers & Pages
→ Create Worker
→ Edit code
```

不需要 VPS、Docker、GCP、AWS 或其他服务器。

## 最简单的纯反代代码

下面这版保持“透明转发”的思路，同时将上游固定为 Google DoH，避免把 Worker 变成任意网站反代。

<details>
<summary><strong>点击展开完整 Worker 代码</strong></summary>

```javascript
const UPSTREAM = "https://dns.google/dns-query";

export default {
  async fetch(request, env) {
    const incoming = new URL(request.url);

    // 可选 TOKEN。
    // 未设置 TOKEN：/dns-query
    // 设置 TOKEN：/<TOKEN>/dns-query
    const token = (env.TOKEN || "").trim();

    const expectedPath = token
      ? `/${token}/dns-query`
      : "/dns-query";

    if (incoming.pathname !== expectedPath) {
      return new Response("Not Found", { status: 404 });
    }

    if (request.method !== "GET" && request.method !== "POST") {
      return new Response("Method Not Allowed", {
        status: 405,
        headers: { Allow: "GET, POST" },
      });
    }

    const upstream = new URL(UPSTREAM);
    upstream.search = incoming.search;

    const proxyRequest = new Request(
      upstream.toString(),
      request
    );

    return fetch(proxyRequest);
  },
};
```

</details>

## 不设置 TOKEN

不配置 `TOKEN` 环境变量时：

```text
https://你的Worker域名/dns-query
```

Worker 会反代：

```text
https://dns.google/dns-query
```

RFC 8484 GET 的 `?dns=...` 查询参数和 POST Body 会随请求转发。

## 使用 TOKEN

更推荐自用时设置一个随机、足够长的 TOKEN。

Cloudflare Worker：

```text
Settings
→ Variables and Secrets
→ Add
→ TOKEN
```

例如生成 32 字节以上随机值，而不是使用昵称、生日或简单单词。

设置后地址变成：

```text
https://你的Worker域名/<TOKEN>/dns-query
```

而裸：

```text
/dns-query
```

会返回 404。

### TOKEN 的真实作用

TOKEN 主要是：

> 隐藏路径 + 降低被随手扫到和滥用的概率。

它不是完整身份认证系统。如果你把完整 URL 公开到论坛、GitHub、截图或日志里，拿到 URL 的人仍然可以使用。

## 为什么不做地区优选

对于这种 DNS Relay，手动设计“香港 / 日本 / 新加坡”会显著增加复杂度，而且：

```text
DNS 响应快
≠
DNS 返回的 Steam CDN 一定最快
```

同时不建议直接访问所谓 Cloudflare 优选 IP。Worker 应通过正常 hostname 访问，由 Cloudflare 自己处理网络入口；上游 `dns.google` 也由 Google 自己处理其 Anycast / 网络调度。

## 不要公开成公共 DoH

公开地址可能导致：

- 第三方持续调用；
- 免费额度被快速消耗；
- Worker 可用性下降；
- 上游 Google 返回限流；
- Cloudflare 侧出现异常流量；
- 增加被限制或处置的风险。

因此推荐：

```text
随机 TOKEN
+
仅自己使用
+
不要公开完整 URL
```

## 添加到 Monica Steam

在 Monica Steam：

```text
网络优化
→ 解析来源
→ 添加自定义 DoH
```

添加：

```text
名称：Google DoH · Cloudflare Relay
地址：https://你的Worker域名/<TOKEN>/dns-query
```

保存后，它进入统一解析来源列表，可以用于：

- 动态 DNS；
- 单独测速；
- 全部测速；
- 静态 Hosts 扫描。

## 隐私边界

采用这套链路后：

- Cloudflare Worker 能看到经过它的 DoH 请求；
- Google Public DNS 作为上游解析器处理 DNS 查询；
- Steam HTTPS 内容本身不会因为这套配置自动经过 Worker。

因此它属于 **DNS Relay**，不是 **Steam Proxy**。
