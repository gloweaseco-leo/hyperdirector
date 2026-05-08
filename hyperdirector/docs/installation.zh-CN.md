# 安装指南

> 本文说明 HyperDirector 的所有依赖组件、安装顺序和验证方法。

---

## 组件关系

理解各组件的关系有助于排障：

```
你的电脑
  ├── Hermes                    ← Agent 执行环境（对话界面）
  │     └── HyperDirector       ← Skill Pack（本项目）
  │
  ├── Node.js >= 22             ← HyperFrames CLI 运行要求
  ├── HyperFrames CLI           ← HTML-to-video 渲染引擎
  ├── FFmpeg                    ← 视频编码（HyperFrames 依赖）
  └── Chromium（自动管理）       ← 页面渲染（HyperFrames 依赖）
```

**重要：** HyperDirector 本身不是视频渲染引擎。它生成的 HTML 文件需要 HyperFrames CLI 来渲染成 MP4。如果 HyperFrames CLI 未安装，HyperDirector 仍然可以生成脚本、分镜、HTML 源码，但不能输出 MP4。

---

## 第一步：安装 Node.js

HyperFrames CLI 要求 Node.js **版本 22 或以上**。

### 检查当前版本

```bash
node --version
```

如果输出是 `v22.x.x` 或更高，跳过此步骤。

### 安装或升级 Node.js

推荐使用 nvm（Node Version Manager）管理 Node.js 版本：

**macOS / Linux：**
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
nvm install 22
nvm use 22
```

**Windows：**
使用 [nvm-windows](https://github.com/coreybutler/nvm-windows)，或直接从 https://nodejs.org 下载 LTS 版本安装包（选择 22.x 或更高）。

**验证：**
```bash
node --version   # 应显示 v22.x.x 或更高
npm --version    # 应显示 10.x.x 或更高
```

---

## 第二步：安装 FFmpeg

FFmpeg 是 HyperFrames 渲染 MP4 的必要依赖。

### 检查是否已安装

```bash
ffmpeg -version
```

如果有输出版本信息，跳过此步骤。

### 安装 FFmpeg

**macOS（推荐使用 Homebrew）：**
```bash
brew install ffmpeg
```

**Ubuntu / Debian：**
```bash
sudo apt update && sudo apt install ffmpeg
```

**Windows：**
1. 从 https://ffmpeg.org/download.html 下载 Windows 构建包（推荐 BtbN 或 gyan.dev 的构建）
2. 解压到 `C:\ffmpeg`
3. 将 `C:\ffmpeg\bin` 添加到系统环境变量 `PATH`
4. 重启终端后验证：`ffmpeg -version`

---

## 第三步：安装 HyperFrames CLI

```bash
npm install -g hyperframes
```

### 验证安装

```bash
npx hyperframes --version
```

应该输出类似 `hyperframes/0.x.x` 的版本信息。

### 运行环境检查

```bash
npx hyperframes doctor
```

这个命令会检查 Node.js、FFmpeg、Chromium 等所有依赖是否就绪。如有缺失，它会给出具体的安装提示。

**关于 Chromium：** HyperFrames 使用 Chromium 进行页面逐帧渲染。Chromium 由 HyperFrames 自动管理，不需要手动安装。如果遇到 Chromium 相关问题，运行 `npx hyperframes doctor` 会给出诊断。

---

## 第四步：安装 HyperDirector Skill Pack

### 方法 A：放置到 Hermes skills 目录

1. 下载或克隆 HyperDirector 仓库
2. 将 `hyperdirector/` 目录复制到 Hermes 的 skills 加载目录

Hermes skills 目录位置（以常见配置为例）：
- `~/.hermes/skills/` （全局）
- `<你的项目目录>/skills/hyperdirector/` （项目级）

具体目录位置请查看你的 Hermes 文档。

### 方法 B：项目内直接引用

如果你的工作项目就是一个 Hermes 对话会话，可以直接在会话的工作目录下放置 `hyperdirector/`，然后在对话中告知 Hermes skill 位置。

### 验证 Skill 加载

向 Hermes 提问：

```
HyperDirector 支持哪些视频模板？
```

如果 Hermes 能列出 `tiktok-vertical-kit`、`saas-demo-kit`、`ai-knowledge-explainer-kit` 并解释各自用途，表示安装成功。

---

## 完整验证清单

安装完成后，运行以下命令，每一条都应该成功：

```bash
# Node.js 版本
node --version          # v22.x.x 或更高

# npm 包管理器
npm --version           # 10.x.x 或更高

# FFmpeg
ffmpeg -version         # 显示版本信息

# HyperFrames CLI
npx hyperframes --version    # 显示版本
npx hyperframes doctor       # 所有检查通过

# 创建测试项目（可选）
npx hyperframes init test-video
cd test-video
npx hyperframes preview      # 浏览器打开预览
```

---

## 常见安装问题

### `npx hyperframes` 报找不到命令

```bash
npm install -g hyperframes   # 全局安装
# 如果仍然失败，尝试：
npx --yes hyperframes --version   # 强制安装最新版
```

### FFmpeg 在 Windows 上配置了 PATH 但仍不可用

重启终端（或重启 VS Code）。PATH 修改只对新打开的终端生效。

### `npx hyperframes doctor` 报 Chromium 问题

```bash
npx hyperframes doctor --fix    # 尝试自动修复
# 或者
npx hyperframes doctor --verbose   # 查看详细诊断
```

如果仍有问题，查看 HyperFrames 官方 troubleshooting 文档：
https://hyperframes.heygen.com/guides/troubleshooting

### HyperDirector Skill 没有被 Hermes 识别

1. 确认 `SKILL.md` 文件存在于 `hyperdirector/` 目录下
2. 确认目录路径在 Hermes skills 加载范围内
3. 重启 Hermes 会话（有些 Agent 框架需要重启才能加载新 skill）

---

## 离线环境说明

如果你的渲染环境没有互联网访问：

1. HyperDirector 生成的 HTML 文件可以离线运行（GSAP 通过 HyperFrames 本地提供）
2. TTS 功能使用 Kokoro 本地模型，不需要联网
3. HyperFrames 渲染也是完全本地化的，不需要联网
4. 素材（图片、音频）需要提前下载放到 `assets/` 目录

---

## 下一步

安装完成后，继续：

- [快速开始 →](./quickstart.zh-CN.md)
- [生成第一个视频 →](./first-video.zh-CN.md)
