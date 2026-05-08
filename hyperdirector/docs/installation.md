# 安装指南

> 说明 HyperDirector 的所有依赖组件、安装顺序和验证方法。

---

## 组件关系

```
你的电脑
  ├── Hermes                    ← Agent 执行环境（对话界面）
  │     └── HyperDirector       ← Skill Pack（本项目，放这里）
  │
  ├── Node.js >= 22             ← HyperFrames CLI 运行要求
  ├── HyperFrames CLI           ← HTML-to-video 渲染引擎
  │     ├── FFmpeg              ← 视频编码（HyperFrames 依赖）
  │     └── Chromium（自动管理） ← 逐帧渲染（HyperFrames 依赖）
  └── GSAP                      ← 动画库（HyperFrames 内置，无需单独安装）
```

**重要区分：**

- **HyperDirector** 负责上游：理解需求、生成 brief/storyboard/HTML、QA 循环、交付报告
- **HyperFrames** 负责下游：lint 检查、preview 预览、render 输出 MP4

HyperFrames CLI 未安装时，HyperDirector 仍可生成所有源文件（brief/storyboard/HTML），但无法执行 lint 和渲染。

---

## 第一步：安装 Node.js（需要 v22+）

### 检查版本

```bash
node --version
```

输出 `v22.x.x` 或以上 → 跳过此步。

### 安装或升级

**推荐方式：使用 nvm（Node Version Manager）**

```bash
# macOS / Linux
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc   # 或 source ~/.zshrc
nvm install 22
nvm use 22
nvm alias default 22
```

```powershell
# Windows：安装 nvm-windows
# 下载 https://github.com/coreybutler/nvm-windows/releases
# 安装后：
nvm install 22
nvm use 22
```

**或直接从官网下载：** https://nodejs.org（选择 22.x LTS）

### 验证

```bash
node --version   # v22.x.x 或更高
npm --version    # 10.x.x 或更高
```

---

## 第二步：安装 FFmpeg

HyperFrames 渲染 MP4 必须依赖 FFmpeg。

### 检查是否已安装

```bash
ffmpeg -version
```

有版本输出 → 跳过此步。

### 安装

```bash
# macOS（推荐 Homebrew）
brew install ffmpeg

# Ubuntu / Debian
sudo apt update && sudo apt install ffmpeg

# CentOS / RHEL
sudo yum install ffmpeg
```

**Windows：**

1. 从 https://ffmpeg.org/download.html 下载（推荐 [gyan.dev](https://www.gyan.dev/ffmpeg/builds/) 的 release 版本）
2. 解压到 `C:\ffmpeg\`
3. 将 `C:\ffmpeg\bin` 添加到系统 PATH
4. **重启终端**（PATH 修改只对新终端生效）
5. 验证：`ffmpeg -version`

---

## 第三步：安装 HyperFrames CLI

```bash
npm install -g hyperframes
```

### 验证

```bash
npx hyperframes --version
```

### 运行环境诊断

```bash
npx hyperframes doctor
```

这个命令检查 Node.js、FFmpeg、Chromium 所有依赖。**Chromium 由 HyperFrames 自动管理，不需要手动安装**。若报 Chromium 问题：

```bash
npx hyperframes doctor --fix      # 尝试自动修复
npx hyperframes doctor --verbose  # 查看详细诊断
```

---

## 第四步：安装 HyperDirector Skill Pack

HyperDirector 是一个 Hermes Skill Pack，安装方式取决于你的 Hermes 配置。

### 方式 A：全局 skills 目录

```bash
# 克隆仓库
git clone https://github.com/your-org/hyperdirector.git
cd hyperdirector

# 复制 skill 到 Hermes 全局 skills 目录
cp -r hyperdirector/ ~/.hermes/skills/hyperdirector/
```

### 方式 B：项目级引用

如果你在特定项目目录中工作，可以将 `hyperdirector/` 放在项目根目录下，Hermes 会从当前工作目录扫描 skills。

### 方式 C：Cursor 环境

在 Cursor 中，将 `hyperdirector/` 目录的绝对路径添加到 Hermes 的 skills 加载配置中。具体配置路径请查看你的 Cursor 版本文档。

### 验证 Skill 加载

向 Hermes 发送：

```
HyperDirector 支持哪些视频模板？
```

Hermes 能列出三个模板并解释 → 安装成功。

---

## 完整验证清单

```bash
# 1. Node.js 版本
node --version           # v22.x.x 或更高

# 2. npm
npm --version            # 10.x.x 或更高

# 3. FFmpeg
ffmpeg -version          # 显示版本信息

# 4. HyperFrames CLI
npx hyperframes --version     # 显示版本号
npx hyperframes doctor        # 所有项通过

# 5. HyperDirector 脚本验证
node hyperdirector/scripts/check-env.js

# 6. 校验示例项目（验证 Node 脚本正常工作）
node hyperdirector/scripts/validate-brief.js \
  hyperdirector/examples/zh-CN/demo-article-to-video/output/brief.json
```

全部通过 → 可以开始使用。

---

## 常见安装问题

### `npx hyperframes` 报"找不到命令"

```bash
npm install -g hyperframes
# 若仍失败：
npx --yes hyperframes --version   # 强制临时安装
```

### Windows 上 FFmpeg 配置了 PATH 但仍不可用

重启终端或 VS Code / Cursor。PATH 修改只对新打开的窗口生效。

### `npx hyperframes doctor` 报 Chromium 缺失

```bash
npx hyperframes doctor --fix
```

若失败，查阅：https://hyperframes.heygen.com/guides/troubleshooting

### HyperDirector Skill 没有被 Hermes 识别

1. 确认 `hyperdirector/SKILL.md` 文件存在
2. 确认 `hyperdirector/` 目录在 Hermes 的 skills 扫描路径中
3. 重启 Hermes 会话（部分 Agent 框架需要重启才能加载新 skill）

### Node.js 版本低于 22 但无法升级

```bash
# 用 nvm 切换（不影响系统全局版本）
nvm install 22
nvm use 22
```

---

## 离线环境说明

HyperDirector 和 HyperFrames 的渲染是完全本地化的：

| 功能 | 是否需要网络 |
|------|------------|
| 生成 brief / storyboard / HTML | 否 |
| HyperFrames render | 否 |
| Kokoro TTS 配音 | 否 |
| Google Fonts 字体加载 | 是（首次，可本地化）|
| 安装 / 更新依赖 | 是（仅安装时）|

**离线字体处理：** 将 `.woff2` 字体文件放入 `assets/fonts/` 并在 `index.html` 中用 `@font-face` 声明，替换 Google Fonts CDN 链接。

---

## 下一步

- [快速开始 →](./quickstart.md)
- [第一个视频完整教程 →](./first-video.md)
