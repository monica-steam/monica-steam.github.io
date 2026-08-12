# 构建与测试

## Android 工程

Monica Steam Android 工程位于主项目仓库：

`https://github.com/JiangKaslana/Monica-Steam`

常见构建要求以仓库当前 Gradle 配置为准。现有项目基线包括：

- JDK 17+；
- Android Gradle Plugin 8.7.x；
- Kotlin 2.0.x；
- Jetpack Compose / Material 3；
- Android 8.0+（minSdk 26）。

## 常用命令

Windows：

```powershell
.\gradlew.bat :app:testDebugUnitTest
.\gradlew.bat :app:assembleDebug
.\gradlew.bat :app:assembleRelease
```

Linux / macOS：

```bash
./gradlew :app:testDebugUnitTest
./gradlew :app:assembleDebug
./gradlew :app:assembleRelease
```

Release 签名应通过外部配置提供，不要把 keystore、密码或签名密钥提交到公开仓库。

## 文档站本地运行

本仓库就是文档站源代码：

```bash
npm install
npm run docs:dev
```

构建：

```bash
npm run docs:build
```

预览：

```bash
npm run docs:preview
```

构建输出：

```text
.vitepress/dist/
```
