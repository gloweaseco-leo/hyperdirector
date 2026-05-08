# HyperDirector v0.1 Release Notes

**发布日期：** 2026-05-07  
**版本代号：** First Director Cut  
**Skill Pack 路径：** `hyperdirector/`

---

## 本版本定位

HyperDirector v0.1 是一个可交付的 **Hermes Skill Pack**，为 AI 辅助视频内容生产提供结构化导演工作流。

**目标受众：**
- 视频号、TikTok、YouTube 内容创作者（主要，中文）
- 技术型产品经理和开发者（次要）
- 想要用 AI 批量生产短视频的内容团队

**核心定位：** HyperDirector 是 HyperFrames 上层的"导演大脑"，负责需求理解、分镜设计、品牌应用、QA 循环——不是视频渲染器，不是 SaaS 平台，不是万能视频工厂。

---

## 本版本包含内容

### 核心文件
| 文件 | 说明 |
|------|------|
| `SKILL.md` | Hermes Skill 入口，含完整 8 步工作流定义 |
| `AGENTS.md` | Agent 协作规则，含文件生成顺序、禁止行为、Schema 约束 |
| `CAPABILITY_BOUNDARY.md` / `.zh-CN.md` | 能力边界：适合/降级/拒绝三分类框架 |
| `README.md` / `README.zh-CN.md` | 用户文档主入口 |

### 工作流 Prompts（8 个）
| 文件 | 用途 |
|------|------|
| `01-capability-judge.md` | 判断请求是否适合、降级或拒绝 |
| `02-intake-brief.md` | 生成结构化 brief.json |
| `03-storyboard-generator.md` | 逐场景分镜生成 storyboard.json |
| `04-visual-design.md` | 模板选择 + 品牌应用 → DESIGN.md |
| `05-compose-hyperframes.md` | HyperFrames HTML 合成生成 index.html |
| `06-qa-fixer.md` | lint/validate 循环，最多 3 次重试 |
| `07-render-report.md` | 生成 render-report.md |
| `08-warm-iteration.md` | 局部外科手术式修改，禁止全量重写 |

### QA 规则（7 个）
- `hyperframes-core-rules.md` — HyperFrames 合成硬性规则
- `gsap-deterministic-rules.md` — GSAP 确定性规则（禁止 Math.random、无限循环等）
- `subtitle-safe-area.md` — 字幕安全区规范
- `performance-checklist.md` — 渲染性能检查
- `common-errors-fix.md` — 常见错误修复手册
- `content-safety-rules.md` — 内容安全规则
- `template-authoring-rules.md` — 模板编写规则

### JSON Schema（5 个）
- `schemas/brief.schema.json`
- `schemas/storyboard.schema.json`
- `schemas/brand-kit.schema.json`
- `schemas/render-report.schema.json`
- `schemas/edit-request.schema.json`
- `schemas/output-contract.md` — 交付契约人类可读版

### 视频模板（3 套）
| 模板 | 比例 | 适用场景 |
|------|------|---------|
| `tiktok-vertical-kit` | 9:16 | 视频号、TikTok、YouTube Shorts |
| `saas-demo-kit` | 16:9 / 9:16 | SaaS 产品演示、功能介绍、发布公告 |
| `ai-knowledge-explainer-kit` | 9:16 | AI 教程、开源项目介绍、技术科普 |

每套模板包含：`template.html`、`DESIGN.md`、`prompt.md`、`customization-guide.md`、3 个时长变体（15s / 30s / 60s）。

### 示例 Demo（3 个，均为中文）
| Demo | 说明 |
|------|------|
| `examples/zh-CN/demo-article-to-video` | 文章转 30s 视频号短视频 |
| `examples/zh-CN/demo-github-repo` | GitHub README 转 AI 项目介绍视频 |
| `examples/zh-CN/demo-saas-product` | SaaS 产品 Demo 视频（45s，16:9） |

每个 demo 包含完整输出文件：`brief.json`、`storyboard.json`、`DESIGN.md`、`index.html`、`preview.html`、`script.md`、`brand-used.json`、`render-report.md`、`edit-instructions.md`、`assets/`。

### Brand Kit
- `brand/brand-kit.example.json` — 通用示例品牌
- `brand/brand-kit.persona-zh.example.json` — 中文人设风格示例（虚构品牌，便于开源演示）
- `brand/brand-kit-guide.md` — 配置指南
- `brand/brand-intake-form.md` — 品牌需求采集表单
- `brand/motion-language.example.md` — 动效语言示例

### 工作流文档（8 个）
- `article-to-video.md`、`github-repo-to-video.md`、`saas-demo-kit` 等完整工作流指南

### 用户文档（docs/，中英双语）
- `quickstart.md` / `.zh-CN.md`
- `installation.md` / `.zh-CN.md`
- `first-video.md` / `.zh-CN.md`
- `brand-kit-setup.md` / `.zh-CN.md`
- `template-guide.md` / `.zh-CN.md`
- `faq.md` / `.zh-CN.md`
- `cursor-development-notes.md`

### QA 文档（qa/）
- `pre-render-checklist.md`、`lint-fix-loop.md`、`final-delivery-checklist.md`、`qa-report-template.md`、`troubleshooting.md`

### 验证脚本（scripts/，Node.js，无依赖）
- `check-env.js` — 环境检查
- `leak-scan.js` — 开源发布前启发式泄漏扫描（API Key、路径、商业话术等）
- `validate-brief.js` — Brief JSON 校验
- `validate-storyboard.js` — Storyboard JSON 校验
- `validate-brand-kit.js` — Brand Kit JSON 校验
- `check-output-contract.js` — 输出文件完整性检查

---

## 如何安装

### 方式一：Hermes Skill（推荐）

```bash
# 1. 将 hyperdirector/ 目录复制到 Hermes skills 文件夹
# Hermes skills 路径见你的 Hermes 配置

# 2. 复制示例品牌 Kit 到工作目录
cp hyperdirector/brand/brand-kit.example.json ./brand-kit.json

# 3. 验证环境
node hyperdirector/scripts/check-env.js

# 4. 确认 Hermes 加载 Skill
# 向 Hermes 提问："What can HyperDirector do?" 或 "HyperDirector 能做什么？"
```

### 前置依赖

| 依赖 | 版本 | 安装 |
|------|------|------|
| Node.js | >= 22 | https://nodejs.org |
| HyperFrames CLI | latest | `npm install -g hyperframes` |
| FFmpeg | 任意近期版本 | https://ffmpeg.org/download.html |
| Chromium | 自动管理 | `npx hyperframes doctor` |

---

## 如何运行第一个 Demo

```bash
# 方式 1：直接向 Hermes 发出指令（推荐）
"使用 HyperDirector，把这篇文章做成 30 秒视频号竖屏短视频，使用我的 brand-kit。"
[粘贴文章内容]

# 方式 2：查看现有 Demo 输出
cd hyperdirector/examples/zh-CN/demo-article-to-video/output

# 验证 brief.json
node hyperdirector/scripts/validate-brief.js brief.json

# 验证 storyboard.json（如果 validate-storyboard.js 需要 brief.json 作为第二参数）
node hyperdirector/scripts/validate-storyboard.js storyboard.json brief.json

# 验证 brand-kit
node hyperdirector/scripts/validate-brand-kit.js ../../../brand/brand-kit.example.json

# 检查输出契约
node hyperdirector/scripts/check-output-contract.js .

# 预览合成（需要 HyperFrames CLI）
npx hyperframes preview index.html

# 渲染（需要 HyperFrames CLI + FFmpeg）
npx hyperframes render --input index.html --output final.mp4 --quality high
```

---

## 已知限制

| 限制 | 说明 | 计划版本 |
|------|------|---------|
| 不支持真人视频 | HyperDirector 生成 HTML 图形视频，不生成实拍素材 | 不在计划内 |
| 不支持数字人口型 | 无头像渲染引擎 | 不在计划内 |
| Demo 未实际渲染 | 三个示例 Demo 均为样本输出，`final.mp4` 未包含 | 用户本地执行 |
| 英文 Demo 未包含 | `examples/en/` 仅有说明文档，无可运行示例 | v0.2 |
| 视频时长限制 | v0.1 目标 15–60 秒，超过 60s 建议拆分章节 | v0.2 扩展 |
| 本地渲染只支持单机 | 无云端渲染队列，无分布式渲染 | v0.3 计划 |
| 模板数量有限 | 当前仅 3 套模板，无模板市场 | v0.2 后规划 |
| 字体依赖外部 CDN | Google Fonts 在某些网络环境不可用 | 可自托管替代 |
| 无 Web UI | 纯 CLI + Hermes 操作，无浏览器端界面 | 不在 v0.1 计划内 |

---

## 下一版本计划（v0.2）

| 功能 | 说明 |
|------|------|
| 英文 Demo | 补充 `examples/en/` 三个完整示例 |
| 模板扩展 | 新增 1–2 套模板（数据可视化 / 教育类） |
| 批量生产工作流 | `batch-video-production.md` 完整实现 |
| TTS 集成说明 | 接入本地 TTS 引擎的配置指南 |
| 字体离线包 | 常用中文字体本地化方案文档 |
| `npx hyperdirector` CLI | 初步命令行工具，封装常用验证命令 |
| 社区模板投稿规范 | 第三方模板贡献指南 |

---

## 脚本快速参考

```bash
# 环境检查
node hyperdirector/scripts/check-env.js

# 开源发布前泄漏扫描
node hyperdirector/scripts/leak-scan.js

# 验证 Brief
node hyperdirector/scripts/validate-brief.js <path/to/brief.json>

# 验证 Storyboard
node hyperdirector/scripts/validate-storyboard.js <path/to/storyboard.json> [path/to/brief.json]

# 验证 Brand Kit
node hyperdirector/scripts/validate-brand-kit.js <path/to/brand-kit.json>

# 检查输出目录完整性
node hyperdirector/scripts/check-output-contract.js <path/to/output-dir>
```

所有脚本使用 Node.js 内置模块，无需 `npm install`，开箱即用。

---

## 版本历史

| 版本 | 日期 | 说明 |
|------|------|------|
| v0.1 | 2026-05-07 | 初始发布：完整 Skill Pack，3 套模板，3 个中文 Demo，8 个 prompts，7 个 QA 规则，5 个 JSON Schema，验证脚本与泄漏扫描 |
