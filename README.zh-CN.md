# HyperDirector

> 面向 Hermes 的结构化视频导演 Skill Pack，底层渲染由 [HyperFrames](https://github.com/heygen-com/hyperframes) 完成。  
> English → [README.md](./README.md)

HyperDirector 是一个 Agent Skill Pack 实验：把视频创作从一句提示词，拆成可规划、可检查、可修改、可交付的结构化任务流。

它关注的不是一次性生成视频，而是让视频生产具备流程、模板、质量检查和可重复交付能力。

---

## 这是什么？

HyperDirector 把「需求 → brief → 分镜 → 设计说明 → HyperFrames HTML → 质检 → 渲染」串成一条可重复的工作流，适合文章/产品页/README/PRD 等素材转成 15–60 秒的动效短视频。

---

## 仓库结构（开源公开部分）

```
HyperDirector/               ← 建议作为 GitHub 公开仓库根目录
├── LICENSE                  ← Apache 2.0
├── NOTICE
├── CONTRIBUTING.md
├── SECURITY.md
├── RELEASE_NOTES_v0.1.md / v0.1.1.md
├── install.sh / install.ps1  ← 一键安装 Skill Pack
├── README.md
├── README.zh-CN.md          ← 本文件
├── hyperdirector/           ← Hermes Skill Pack（复制到 Hermes skills 目录）
│   ├── SKILL.md
│   ├── prompts/、rules/、schemas/、templates/、workflows/、docs/、qa/、examples/ …
│   └── scripts/             ← check-env、check-hyperframes-env、校验脚本、leak-scan
└── output/                  ← 本地生成物（默认不提交）
```

商业增强内容（高阶模板、客户交付、真实案例等）应放在**独立私有仓库**；请勿将商业增强目录或内部 PRD 推送到公开远程。

---

## 一条命令安装（仅 Skill Pack）

从官方公开仓库拉取并**仅安装** `hyperdirector/` 到默认 Hermes skills 目录；可用环境变量 **`HERMES_SKILLS_DIR`** 覆盖安装路径。

**安全提示：** 若担心远程脚本，可先浏览器打开或下载查看 [`install.sh`](./install.sh)、[`install.ps1`](./install.ps1) 内容，再本地执行。

**Windows PowerShell：**

```powershell
irm https://raw.githubusercontent.com/gloweaseco-leo/hyperdirector/main/install.ps1 | iex
```

**macOS / Linux / WSL：**

```bash
curl -fsSL https://raw.githubusercontent.com/gloweaseco-leo/hyperdirector/main/install.sh | bash
```

**说明：** 这只是一键安装 **HyperDirector Skill Pack**，**不是**一键安装完整视频渲染环境。真实渲染仍依赖 Hermes、**HyperFrames CLI**、Node.js（≥22）、FFmpeg 与 HyperFrames 所需的浏览器环境。HyperDirector 是在 HyperFrames 之上的导演工作流层，**不能替代** HyperFrames。

安装后检查本机工具链：

```bash
node ~/.hermes/skills/hyperdirector/scripts/check-hyperframes-env.js
```

（Windows 请将路径换为 `%USERPROFILE%\.hermes\skills\hyperdirector\scripts\check-hyperframes-env.js`。）

---

## 快速开始

```bash
node hyperdirector/scripts/check-env.js
node hyperdirector/scripts/leak-scan.js
cp hyperdirector/brand/brand-kit.example.json ./brand-kit.json
```

将 `hyperdirector/` 安装到 Hermes skills 路径后，可直接对 Hermes 说：

> 使用 HyperDirector，把下面这篇文章做成 30 秒竖屏短视频，使用我的 brand-kit。

---

## 文档入口

| 文档 | 说明 |
|------|------|
| [hyperdirector/README.zh-CN.md](./hyperdirector/README.zh-CN.md) | Skill Pack 完整说明与目录索引 |
| [hyperdirector/docs/quickstart.zh-CN.md](./hyperdirector/docs/quickstart.zh-CN.md) | 快速上手 |
| [hyperdirector/CAPABILITY_BOUNDARY.zh-CN.md](./hyperdirector/CAPABILITY_BOUNDARY.zh-CN.md) | 能力边界（适合 / 降级 / 拒绝） |

---

## 致谢

- [HyperFrames](https://github.com/heygen-com/hyperframes)（Apache 2.0）
- [GSAP](https://gsap.com/)（商业使用请自行查阅 GreenSock 许可）
