# 模板选择指南

> HyperDirector v0.1 提供 3 个视频模板，覆盖最高频的使用场景。

---

## 三个模板一览

| 模板名 | 中文名 | 默认比例 | 最适合 |
|---|---|---|---|
| `tiktok-vertical-kit` | 竖屏知识短视频套件 | 9:16 | 视频号、TikTok、YouTube Shorts |
| `saas-demo-kit` | SaaS 产品演示套件 | 16:9 / 9:16 | 产品 demo、功能介绍、发布视频 |
| `ai-knowledge-explainer-kit` | AI 知识讲解套件 | 9:16 | AI 教程、技术拆解、开源项目介绍 |

---

## tiktok-vertical-kit

**适用平台：** 视频号、TikTok、YouTube Shorts、抖音

**核心设计逻辑：** 专为竖屏短视频平台设计，强调前 3 秒 hook、高信息密度、结尾明确 CTA。

### 场景结构

| 场景 | 默认时长 | 内容目标 |
|---|---|---|
| Hook | 3–5 秒 | 强冲击标题 + 核心冲突，让观众停下来 |
| Point 1 | 6–8 秒 | 第一个核心观点，图文结合 |
| Point 2 | 6–8 秒 | 第二个核心观点，图文结合 |
| Point 3 | 6–8 秒 | 第三个核心观点，图文结合 |
| CTA | 3–5 秒 | 引导关注/领取资料/加入社群 |

**推荐时长：** 30 秒（标准）/ 45 秒（详细）

### 适合这类内容

- 行业洞察类文章："为什么 XX 正在改变 XX"
- 工具推荐类："5 个让你效率翻倍的 AI 工具"
- 观点类："大多数人不知道的 XX 事"
- 数据驱动类："这组数据说明了什么"

### 视觉风格

默认风格：大字幕、高对比度、简洁图形、强调色高亮关键词。
Brand Kit 的 `motion_language.pace: "fast"` 与此模板最配合。

### 如何调用

```
使用 HyperDirector，用 tiktok-vertical-kit 模板把这篇文章做成 30 秒竖屏视频。
```

---

## saas-demo-kit

**适用场景：** 产品 demo 视频、功能介绍、上线发布、产品路演

**核心设计逻辑：** 结构化的"问题 → 产品 → 功能 → 数据 → CTA"叙事，专为产品展示设计。

### 场景结构

| 场景 | 内容目标 |
|---|---|
| Problem | 展示用户痛点，建立共鸣 |
| Product Reveal | 产品名称 + 一句话价值主张 |
| Feature 1 | 核心功能卡片 + UI 截图/动效 |
| Feature 2 | 第二功能工作流演示 |
| Feature 3 | 关键数据结果（如：节省 80% 时间） |
| CTA | 预约试用 / 关注 / 加入社群 |

**推荐时长：** 45 秒（标准）/ 60 秒（详细）

### 适合这类内容

- SaaS 产品新功能发布视频
- 产品落地页转视频
- App onboarding 介绍视频
- 融资路演的产品介绍片段
- PRD 转视频（给团队内部展示）

### 视觉风格

默认风格：干净的深色或浅色背景、卡片式信息布局、动态数字高亮。
支持放置产品截图（`assets/screenshot-*.png`）作为功能演示素材。

### 如何调用

```
使用 HyperDirector，用 saas-demo-kit 模板把这个产品页做成 45 秒产品 demo 视频。
突出三个功能：自动导入、智能分析、团队协作。风格干净、高级、科技感。
```

---

## ai-knowledge-explainer-kit

**适用场景：** AI 知识讲解、技术拆解、开源项目介绍、GitHub README 转视频

**核心设计逻辑：** 专为解释"某个概念/工具/系统是怎么工作的"设计，叙事结构为：大判断 → 背景 → 机制 → 用例 → 行动。

### 场景结构

| 场景 | 内容目标 |
|---|---|
| Big Claim | 一个强判断/结论，吸引有兴趣的人 |
| Context | 为什么这件事值得了解，背景和重要性 |
| Mechanism | 它是怎么工作的，核心机制 |
| Use Case | 可以用在哪里，具体场景 |
| Action | 用户下一步怎么做，行动建议 |

**推荐时长：** 30 秒（简洁版）/ 45 秒（详细版）

### 适合这类内容

- AI Agent 工作原理讲解
- 开源项目功能介绍（GitHub README 转视频）
- 技术工具的概念解释（"什么是 RAG"、"什么是 HyperFrames"）
- 技术教程前言片段
- 行业报告关键结论解读

### 视觉风格

默认风格：代码感、信息密度中等、概念图表动效、技术词汇保留英文。
推荐搭配 `fonts.code: "JetBrains Mono"` 显示代码片段。

### 如何调用

```
使用 HyperDirector，用 ai-knowledge-explainer-kit 模板把这个 GitHub README 
做成 30 秒开源项目介绍视频，讲清楚它解决什么问题、怎么工作、适合谁用。
```

---

## 如何选择模板

**一个快速决策框架：**

```
你的内容是 "知识/观点/教程" 吗？
  ↓ 是 → 是 AI 相关技术内容吗？
          ↓ 是 → ai-knowledge-explainer-kit
          ↓ 否 → tiktok-vertical-kit

你的内容是 "产品/功能/业务" 吗？
  ↓ 是 → saas-demo-kit

不确定？
  → 先用 tiktok-vertical-kit（覆盖最广）
```

**快捷选择参考：**

| 我想做... | 选哪个模板 |
|---|---|
| 公众号文章转视频号 | `tiktok-vertical-kit` |
| SaaS 产品介绍 | `saas-demo-kit` |
| GitHub 项目介绍 | `ai-knowledge-explainer-kit` |
| PRD 展示给团队 | `saas-demo-kit` |
| AI 工具拆解教程 | `ai-knowledge-explainer-kit` |
| 课程/活动招募 | `tiktok-vertical-kit` |
| 数据分析报告 | `saas-demo-kit` |
| Hermes 工作流演示 | `ai-knowledge-explainer-kit` |

---

## 模板自定义

选定模板后，可以通过以下方式定制：

**1. 调整场景时长**
```
把 hook 场景缩短到 3 秒，point_1 延长到 10 秒
```

**2. 调整视觉风格**
```
这个视频风格要更"人文温暖"，少一点科技感，用暖色调
```

**3. 替换场景结构**
```
不需要 point_3 场景，改成展示一张产品截图
```

**4. 复用局部场景**
模板内的单个场景可以被引用和复用。例如，可以把 `saas-demo-kit` 的 Product Reveal 场景嵌入到 `tiktok-vertical-kit` 的结构里。

---

## v0.2 模板变体（规划中）

每个模板未来会有时长变体：

| 变体 | 用途 |
|---|---|
| 15 秒版 | 朋友圈视频、广告素材 |
| 30 秒版（当前默认） | 标准知识短视频 |
| 60 秒版 | 完整讲解版 |

---

下一步：[常见问题 →](./faq.zh-CN.md) · [渲染稳定性（headless / 离线）→](./rendering-stability.zh-CN.md)
