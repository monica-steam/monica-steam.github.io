# 架构与项目边界

## Monica Steam

Monica Steam 是从 Monica Android 的 Steam 能力中独立出来的 Android 项目。

主要业务包括：

- Steam 账号；
- Steam Guard；
- 移动确认；
- 游戏库；
- 商店；
- 好友与聊天；
- 通知；
- Steam 账号备份；
- Steam 网络优化。

## 不包含什么

Monica Steam 不包含 Monica Pass 的完整密码管理功能，例如：

- 普通密码库；
- Bitwarden；
- KeePass；
- Android 自动填充；
- 通用密码记录管理。

## 网络优化架构

网络优化的核心结构可以概括为：

```text
统一解析来源
│
├─ Dynamic DNS / DoH
│  └─ 实时解析 + 短缓存
│
└─ Static Hosts Scan
   └─ 解析候选 + HTTPS/SNI/证书验证 + 固定
```

静态 Hosts 优先于动态 DNS，但只覆盖明确命中的 hostname。

## 作用范围

当前网络优化是应用内部能力，而不是系统级网络工具：

```text
Monica Steam 原生 HTTP
        ↓
自定义 DNS / Hosts
        ↓
Steam
```

它不应被描述成：

- VPN；
- 系统 DNS 管理器；
- 全设备 Hosts；
- 通用代理；
- WebView 全流量网关。
