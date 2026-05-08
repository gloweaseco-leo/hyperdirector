# 模板选择指南

> HyperDirector v0.1 内置 3 个视频模板，覆盖最高频使用场景。

---

## 三个模板一览

| 模板 | 中文名 | 默认比例 | 推荐时长 | 最适合 |
|------|--------|---------|---------|--------|
| `tiktok-vertical-kit` | 竖屏知识短视频 | 9:16 | 30–45s | 视频号、TikTok、YouTube Shorts |
| `saas-demo-kit` | SaaS 产品演示 | 16:9 / 9:16 | 45–60s | 产品 demo、功能介绍、发布视频 |
| `ai-knowledge-explainer-kit` | AI 知识讲解 | 9:16 | 30–45s | AI 教程、技术拆解、开源项目介绍 |

---

## 如何选模板

**一个决策框架：**

```
你的内容是"知识 / 观点 / 教程"类？
  ↓ 是 → 是 AI 相关或技术内容？
            ↓ 是 → ai-knowledge-explainer-kit
            ↓ 否 → tiktok-vertical-kit

你的内容是"产品 / 功能 / 业务"类？
  ↓ 是 → saas-demo-kit

不确定？
  → 先用 tiktok-vertical-kit（适用范围最广）
```

**场景速查：**

| 我想做... | 选哪个模板 |
|-----------|----------|
| 公众号文章转视频号 | `tiktok-vertical-kit` |
| SaaS 产品发布视频 | `saas-demo-kit` |
| GitHub 开源项目介绍 | `ai-knowledge-explainer-kit` |
| PRD 转给团队看的视频 | `saas-demo-kit` |
| AI 工具拆解教程 | `ai-knowledge-explainer-kit` |
| 课程 / 活动招募 | `tiktok-vertical-kit` |
| 数据分析报告 | `saas-demo-kit` |
| 行业洞察 / 观点输出 | `tiktok-vertical-kit` |

---

## tiktok-vertical-kit

**适用平台：** 视频号、TikTok、YouTube Shorts、抖音  
**核心逻辑：** 强 hook → 多个观点 → 明确 CTA  
**节奏：** 高频切换，信息密度高，适合短注意力窗口

### 默认场景结构

| 场景 | 时长建议 | 目标 |
|------|---------|------|
| Hook | 3–5s | 强冲击标题，让观众停下来 |
| Point 1 | 6–8s | 第一个核心观点 |
| Point 2 | 6–8s | 第二个核心观点 |
| Point 3 | 6–8s | 第三个核心观点 |
| CTA | 3–5s | 引导关注 / 领取资料 |

### 适合的内容类型

- 行业洞察："为什么 XX 正在改变 XX"
- 工具推荐："5 个让你效率翻倍的 AI 工具"
- 观点分享："大多数人不知道的 XX"
- 数据驱动："这组数据说明了什么"
- 公众号文章竖屏化

### 视觉特征

- 大字幕（30px+），高对比度
- 强调色高亮关键词
- 简洁图形，无复杂图表
- 竖屏安全区（底部 22%）

### 调用示例

```
使用 HyperDirector，用 tiktok-vertical-kit 模板
把这篇文章做成 30 秒竖屏视频。
前 3 秒强 hook，中间 3 个观点，结尾引导关注。
```

### 参考示例

`hyperdirector/examples/zh-CN/demo-article-to-video/`

---

## saas-demo-kit

**适用场景：** 产品 demo、功能介绍、上线发布、路演  
**核心逻辑：** 痛点 → 产品揭示 → 功能卡片 → 数据结果 → CTA  
**风格：** 干净、专业、有说服力，面向决策者

### 默认场景结构

| 场景 | 目标 |
|------|------|
| Hook / Problem | 展示用户痛点，建立共鸣 |
| Product Reveal | 产品名 + 一句话价值主张 |
| Feature 1 | 核心功能 + UI 截图 / 动效 |
| Feature 2 | 第二功能工作流演示 |
| Feature 3 | 关键数据结果 |
| CTA | 预约试用 / 立即体验 |

### 适合的内容类型

- SaaS 产品新功能发布视频
- 产品落地页 → 视频
- App onboarding 介绍
- 融资路演产品介绍片段
- PRD 转视频（团队内部展示）

### 视觉特征

- 支持产品截图（`assets/screenshot-*.png`）
- 左右分栏布局（输入 → 输出对比）
- 卡片式信息展示
- 动态数字高亮（数据型场景）
- 支持 16:9 和 9:16 双比例

### 调用示例

```
使用 HyperDirector，用 saas-demo-kit 模板
把这个产品页做成 45 秒 YouTube 横屏产品 demo 视频。
突出三个功能：结构化分镜、Brand Kit、自动 QA。
风格干净、高级、科技感。结尾引导预约 Demo。
```

### 参考示例

`hyperdirector/examples/zh-CN/demo-saas-product/`

---

## ai-knowledge-explainer-kit

**适用场景：** AI 知识讲解、技术拆解、开源项目介绍、GitHub README 转视频  
**核心逻辑：** 大判断 → 背景 → 机制 → 用例 → 行动  
**受众：** AI 从业者、技术人、工程师

### 默认场景结构

| 场景 | 目标 |
|------|------|
| Big Claim | 强判断 / 结论，吸引同类人 |
| Context | 为什么值得了解，背景重要性 |
| Mechanism | 它是怎么工作的，核心机制 |
| Use Case | 可以用在哪里，具体场景 |
| Action | 用户下一步怎么做 |

### 适合的内容类型

- AI Agent 工作原理拆解
- 开源项目功能介绍（GitHub README 转视频）
- 技术工具解释（"什么是 RAG"、"什么是 MCP"）
- 技术教程前言片段
- 行业报告关键结论解读

### 视觉特征

- 代码字体展示技术术语
- 流程图 / 架构图动效
- 中英文混排（技术词保留英文）
- 信息密度中等，节奏比 tiktok-vertical-kit 更稳健

### 调用示例

```
使用 HyperDirector，用 ai-knowledge-explainer-kit 模板
把这个 GitHub README 做成 30 秒开源项目发布视频。
讲清楚：解决什么问题、核心机制、适合谁用、如何开始。
```

### 参考示例

`hyperdirector/examples/zh-CN/demo-github-repo/`

---

## 模板自定义

### 调整场景时长

```
把 hook 场景缩短到 3 秒，context 场景延长到 9 秒
```

**注意：** 修改后需确保所有场景时长之和等于 `brief.duration_seconds`（误差 ≤ 0.5s）。

校验：

```bash
node hyperdirector/scripts/validate-storyboard.js output/storyboard.json output/brief.json
```

### 调整视觉风格

```
这个视频要更"人文温暖"，少一点科技感，用暖色调背景
```

### 替换或跳过场景

```
不需要 context 场景，改成直接展示三个功能卡片
把 mechanism 场景改成展示一张产品截图
```

### 复用跨模板场景

```
用 ai-knowledge-explainer-kit 的结构，但结尾用 saas-demo-kit 的 CTA 样式
```

---

## 模板文件结构（开发者参考）

每个模板都有自己的目录：

```
hyperdirector/templates/tiktok-vertical-kit/
├── README.md              ← 模板说明和调用指南
├── prompt.md              ← Hermes 生成此模板的专用 prompt
├── DESIGN.md              ← 视觉设计规范
├── customization-guide.md ← 如何定制此模板
├── variants/
│   ├── 15s.md             ← 15 秒变体
│   ├── 30s.md             ← 30 秒变体（默认）
│   └── 60s.md             ← 60 秒变体
└── assets/
    └── README.md          ← 资产说明
```

如何新增模板 → [cursor-development-notes.md](./cursor-development-notes.md)

---

## v0.2 规划

- 每个模板的 15s / 30s / 60s 变体（当前已有结构，待完善）
- 跨模板场景复用（Composite Template）
- 模板扩展接口（社区贡献）

---

下一步：[常见问题 →](./faq.md)
