# 快速开始

## 安装前先看

Monica Steam 当前仍是公开测试版。请先阅读 [风险与安全边界](/guide/risk-and-safety)，并确保 Steam Guard / `maFile` 不是只保存在这一台设备上。

建议准备：

- Android 8.0 或更高版本设备；
- 可正常登录的 Steam 账号；
- 现有 `maFile`、Steam Guard 数据或登录方式；
- 一份独立备份。

## 安装

从项目 Releases 获取最新 APK：

`https://github.com/JiangKaslana/Monica-Steam/releases`

安装后首次启动，按实际需求导入 `maFile` 或登录 Steam 账号。

## 建议的首次设置顺序

1. 先完成 Steam 账号与 Steam Guard 初始化。
2. 验证动态令牌与移动确认可正常工作。
3. 检查游戏库、商店、好友与聊天是否可正常加载。
4. 做一次 Steam 数据备份。
5. 只有在 Steam 页面存在 DNS / 网络问题时，再进入网络优化。

## 网络优化怎么选

普通使用优先：

```text
动态 DNS / DoH：开启
静态 Hosts：关闭
```

如果特定 Steam 域名长期不稳定，再使用静态 Hosts 扫描。

详细说明见 [动态 DNS / DoH 与静态 Hosts](/network/overview)。

## 更新前

测试版更新前建议备份：

- `maFile`
- Steam 账号 ZIP
- MDBX 数据（如果正在使用）
- 其他重要 Steam 令牌 / 账号资料

不要把测试版应用当作 Steam Guard 的唯一备份。
