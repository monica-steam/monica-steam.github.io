# Monica Steam Documentation

这是 `https://monica-steam.github.io/` 的 VitePress 文档站源代码，对应文档仓库：

```text
monica-steam/monica-steam.github.io
```

Monica Steam 主项目仓库：

```text
JoyinJoester/Monica-Steam
```

## GitHub Pages

仓库使用 GitHub Actions 构建和部署：

1. 打开仓库 `Settings → Pages`。
2. `Build and deployment → Source` 选择 **GitHub Actions**。
3. 向 `main` push 后等待 `Deploy Monica Steam Docs` 工作流完成。
4. 站点地址：

```text
https://monica-steam.github.io/
```

## 本地预览

```bash
npm install
npm run docs:dev
```

构建：

```bash
npm run docs:build
```

## Monica Steam 图标

首页 Hero、顶部 Logo、favicon 与 Apple Touch Icon 使用 Monica Steam App 的正式图标。

为了避免在两个仓库里维护两份二进制资源，`scripts/prepare-assets.mjs` 会在开发或构建前从上游主项目的：

```text
JoyinJoester/Monica-Steam/image/monica_launcher.webp
```

获取图标，并生成：

```text
public/monica-steam.webp
```

生成文件已加入 `.gitignore`，最终 GitHub Pages 构建产物仍会包含正式图标。

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
