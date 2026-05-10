# HyperDirector 中文文档

**Hermes 视频导演增强包 — 由 HyperFrames 驱动**

English documentation: [README.md](./README.md)

---

## HyperDirector 是什么？

HyperDirector 是一个运行在 Hermes 环境中的 AI 视频导演增强包。它不是 SaaS 平台，不是网页工具，不是万能视频生成器——它是一个结构化的视频生产工作流，专门帮你把文章、产品页、PRD、README、数据图表和品牌素材，变成可编辑、可渲染、品牌一致的 HyperFrames 视频项目。

**一句话定位：**
> HyperFrames 是视频渲染引擎，HyperDirector 是运行在 Hermes 中的视频导演工作流层。

最终目标：让 Hermes 不只是会调用 HyperFrames 工具，而是会写脚本、会做分镜、会套品牌、会生成 HTML composition、会质检修复、会渲染 MP4。

---

## 适合谁用？

| 用户类型 | 使用场景 |
|---|---|
| AI 内容创作者 | 把文章、教程、拆解内容转成短视频 |
| 产品经理 / SaaS 创业者 | 把产品页、PRD、功能截图转成 demo 视频 |
| 开源作者 / 技术博主 | 把 README、GitHub 项目转成传播视频 |
| 社群运营者 | 把课程、活动、权益说明转成招生视频 |
| Hermes 玩家 | 把 Agent skill 产品化，形成完整视频交付能力 |

---

## 能做什么？

### 最适合的视频类型

| 视频类型 | 适配度 | 示例 |
|---|---|---|
| 文章转短视频 | 高 | 公众号文章、技术教程、行业分析 |
| 产品 demo 视频 | 高 | SaaS 功能介绍、App onboarding、产品发布 |
| README 转视频 | 高 | GitHub 项目介绍、开源项目发布 |
| PRD 转视频 | 高 | 产品方案、功能路线图 |
| 数据图表动效 | 高 | 增长数据、趋势图、对比表 |
| AI 知识讲解 | 高 | Agent、RAG、本地大模型教程 |

### 完整工作流

```
用户输入需求
  ↓
HyperDirector 判断适合性
  ↓
生成 brief.json（结构化需求）
  ↓
生成 storyboard.json（脚本 + 分镜 + 字幕）
  ↓
生成 DESIGN.md（视觉设计说明）
  ↓
读取 brand-kit.json（品牌色、字体、语气、CTA）
  ↓
选择视频模板并生成 HTML composition
  ↓
执行 HyperFrames lint / validate（质检）
  ↓
自动修复常见错误（最多 3 轮）
  ↓
渲染输出 MP4
  ↓
输出完整交付包
```

### 标准输出文件

每次运行都会在 `output/<项目名>/` 目录下生成：

```
output/my-project/
├── final.mp4              ← 渲染完成的视频（需要 HyperFrames CLI）
├── index.html             ← 可编辑的 HyperFrames composition 源码
├── preview.html           ← 本地预览文件
├── DESIGN.md              ← 视觉设计说明
├── storyboard.json        ← 分镜结构
├── script.md              ← 视频脚本
├── brief.json             ← 结构化需求
├── brand-used.json        ← 本次使用的品牌参数
├── assets/                ← 媒体素材目录
├── render-report.md       ← 质检和渲染报告
└── edit-instructions.md   ← 本轮修改说明
```

---

## 不能做什么？

这些需求不适合 HyperDirector，使用前请了解：

| 不适合的需求 | 原因 | 建议工具 |
|---|---|---|
| 写实真人连续镜头 | HyperDirector 生成 HTML 图形视频，不是写实影像 | Sora / Runway / Pika / Kling |
| 数字人口型同步 | 没有 avatar 渲染能力 | HeyGen Studio / Synthesia / D-ID |
| 电影级特效 | 不支持 3D 渲染引擎 | Blender / Unreal / After Effects |
| 专业长视频剪辑 | 不是 NLE 软件 | Premiere / DaVinci / 剪映 |
| 电话会议录制编辑 | 不处理录制素材 | 剪映 / Clipchamp |

**如果你的需求刚好在边界上，HyperDirector 会提供降级方案**，比如把真人口播需求改成 TTS 配音 + 动态字幕 + 信息卡片版本。

---

## 安装

详细安装步骤请看：[docs/installation.zh-CN.md](./docs/installation.zh-CN.md)

### 前置要求

| 组件 | 要求 | 说明 |
|---|---|---|
| Hermes | 已安装并正常运行 | HyperDirector 的 Agent 执行环境 |
| Node.js | >= 22 | HyperFrames CLI 要求 |
| FFmpeg | 最新稳定版 | 视频编码，`ffmpeg -version` 验证 |
| HyperFrames CLI | 最新版 | `npm install -g hyperframes` |

### 安装 HyperDirector

1. 下载或克隆本仓库
2. 将 `hyperdirector/` 目录放到 Hermes skills 目录下
3. 验证安装：向 Hermes 提问 "HyperDirector 能做什么？"

---

## 快速开始

### 第一步：配置 Brand Kit

复制 `brand/brand-kit.example.json` 到你的项目目录，重命名为 `brand-kit.json`，填写你的品牌信息：

```json
{
  "brand_name": "你的品牌名",
  "locale": "zh-CN",
  "default_output_language": "zh-CN",
  "colors": {
    "primary": "#111827",
    "accent": "#38BDF8",
    "background": "#F8FAFC"
  },
  "fonts": {
    "headline": "Inter",
    "body": "Noto Sans SC"
  },
  "motion_language": {
    "pace": "fast",
    "style": "clean_tech",
    "transitions": ["slide_up", "scale_in"]
  },
  "voice": {
    "tone": "专业、直给、有工程感",
    "avoid": ["过度鸡血", "空泛口号"]
  },
  "cta": {
    "default": "关注 [你的品牌名]，持续更新"
  }
}
```

完整说明：[docs/brand-kit-setup.zh-CN.md](./docs/brand-kit-setup.zh-CN.md)

### 第二步：跑第一个 Demo

在 Hermes 中输入以下提示词（把文章替换成你的内容）：

```
使用 HyperDirector，把下面这篇文章生成一个 30 秒视频号竖屏短视频，使用我的 brand-kit，
前 3 秒强 hook，中间保留 3 个核心观点，结尾引导关注。

[粘贴你的文章或产品说明]
```

完整教程：[docs/first-video.zh-CN.md](./docs/first-video.zh-CN.md)

---

## 三个视频模板

| 模板名 | 适用场景 | 默认比例 |
|---|---|---|
| `tiktok-vertical-kit` | 视频号、TikTok、YouTube Shorts | 9:16 竖屏 |
| `saas-demo-kit` | 产品 demo、功能介绍、发布视频 | 16:9 / 9:16 |
| `ai-knowledge-explainer-kit` | AI 知识讲解、开源项目介绍 | 9:16 竖屏 |

模板选择指南：[docs/template-guide.zh-CN.md](./docs/template-guide.zh-CN.md)

---

## 辅助脚本（非 lint）

启发式检查 composition 风险（远程字体、emoji、`@media` 等），**仅输出 WARNING，始终成功退出**，不能替代 `npx hyperframes lint`：

```bash
node hyperdirector/scripts/check-composition-hazards.js output/<项目>/index.html
```

说明见 `qa/pre-render-checklist.md` 与 `docs/rendering-stability.zh-CN.md`。

---

## 版本计划

| 版本 | 内容 |
|---|---|
| **v0.1（当前）** | Skill Pack + 3 模板 + Brand Kit + QA Fix Loop + 3 Demo |
| v0.2 | 批量生成 + 多语言字幕 + Docker 渲染 + 模板变体 |
| v0.3 | 云渲染队列 + 模板包安装 + 多品牌管理 |

---

## 已知限制（v0.1）

- 渲染需要本地安装 HyperFrames CLI。未安装时，只生成源码文件，不渲染视频。
- 暂无云渲染（v0.3 规划）。
- 暂无模板市场（v0.1 内置 3 个模板）。
- 不支持数字人口型同步，请使用 HeyGen Studio。
- 不支持写实视频生成，请使用 Sora / Runway 等工具。
- TTS 语音使用 Kokoro 本地模型，中文语音质量取决于本地环境。

---

## 常见问题

完整 FAQ：[docs/faq.zh-CN.md](./docs/faq.zh-CN.md)

**Q：它和 HyperFrames 是什么关系？**
A：HyperFrames 是底层的 HTML-to-video 渲染引擎，HyperDirector 是运行在 Hermes 中的导演工作流层。你不需要了解 HyperFrames 的细节，HyperDirector 会处理所有工程细节。

**Q：它能不能做真人视频？**
A：不能。HyperDirector 生成的是 HTML 图形视频（动态文字、数据图表、品牌动效），不是写实真人影像。

**Q：它和 Sora / Runway 有什么不同？**
A：Sora/Runway 生成写实影像，不可控、不可编辑。HyperDirector 生成代码级可控的图形视频，输出 HTML 源码，每个元素都可以单独修改。

---

## 致谢

- **HyperFrames** by HeyGen — https://github.com/heygen-com/hyperframes（Apache 2.0）
- **GSAP** by GreenSock — https://gsap.com
- HyperDirector 是运行在 Hermes 环境中的增强包，基于 HyperFrames 渲染引擎构建
