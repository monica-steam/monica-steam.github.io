# Monica Steam Documentation

这是 `https://monica-steam.github.io/` 的 VitePress 文档站源代码，已经整理为可直接上传到：

```text
monica-steam/monica-steam.github.io
```

## 上传后要做什么

1. 将本压缩包内 **所有文件和目录上传到仓库根目录**，不要再套一层 `monica-steam.github.io/`。
2. 打开仓库 `Settings → Pages`。
3. `Build and deployment → Source` 选择 **GitHub Actions**。
4. 向 `main` push 后等待 `Deploy Monica Steam Docs` 工作流完成。
5. 站点地址：

```text
https://monica-steam.github.io/
```

## 本地预览

```bash
npm install
npm run docs:dev
```

## 设计

文档站使用 VitePress，并借鉴 Monica Pass 文档站的一些视觉元素：

- 渐变 Hero；
- 浮动图标与柔和光晕；
- 圆角 CTA；
- 功能卡片 Hover；
- 深色模式；
- 左侧分组导航；
- 本地全文搜索；
- 右侧目录；
- 长内容折叠块。

网络文档重点覆盖动态 DNS / DoH、静态 Hosts，以及 Cloudflare Worker 纯反代 Google DoH 的自建方法与风险提示。
