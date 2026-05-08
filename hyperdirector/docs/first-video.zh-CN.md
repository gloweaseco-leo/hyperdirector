# 生成第一个视频

> 完整教程：从一篇文章生成 30 秒竖屏短视频。

本教程以"文章转视频"为例，完整演示 HyperDirector 的工作流程。

---

## 示例场景

**输入：** 一篇关于 HyperDirector 的介绍文章
**目标：** 30 秒视频号竖屏视频，强 hook 开头，3 个核心观点，结尾引导关注
**模板：** `ai-knowledge-explainer-kit`

---

## 第一步：准备输入内容

将你要转换的文章复制到剪贴板，或保存到文本文件。

**示例文章（可用此测试）：**

```
HyperDirector 是什么？

HyperDirector 是一个运行在 Hermes AI Agent 中的视频导演增强包。
它不是传统的视频编辑软件，而是把自然语言需求变成可渲染视频工程的自动化工作流。

核心能力有三个：
第一，理解视频结构。它能把文章、产品页、README 自动拆解成脚本和分镜。
第二，记住你的品牌。通过 Brand Kit，它永远知道你的颜色、字体、语气和 CTA。
第三，自动质检修复。生成 HTML 视频后，它会自动执行 lint、检查、修复，保证渲染成功。

最终你拿到的不只是视频，而是一套完整的视频工程包：MP4 成品 + 可编辑 HTML 源码 + 设计说明。
```

---

## 第二步：向 Hermes 输入需求

在 Hermes 中输入：

```
使用 HyperDirector，把下面这篇文章生成一个 30 秒视频号竖屏短视频。
使用 ai-knowledge-explainer-kit 模板。
前 3 秒强 hook，中间 3 个核心观点逐幕展开，结尾引导关注示例创作者。
读取我的 brand-kit.json。

[粘贴文章内容]
```

---

## 第三步：观察 HyperDirector 工作流

HyperDirector 会依次输出以下内容：

### 3.1 能力判断

```
✅ 适合 HyperDirector。

任务类型：article_to_short_video
推荐模板：ai-knowledge-explainer-kit
风险等级：低
说明：文章有清晰的 3 段结构，适合生成知识解释型短视频。
```

### 3.2 Brief 生成（`brief.json`）

```json
{
  "title": "HyperDirector 是什么",
  "platform": "video_wechat",
  "aspect_ratio": "9:16",
  "duration_seconds": 30,
  "audience": "AI 内容创作者、产品经理、Hermes 用户",
  "goal": "讲清楚 HyperDirector 的价值并引导关注",
  "tone": "专业、直给、有工程感",
  "input_type": "article",
  "language": "zh-CN",
  "template": "ai-knowledge-explainer-kit"
}
```

### 3.3 分镜生成（`storyboard.json`，精简版）

```json
{
  "scenes": [
    {
      "id": "scene_01",
      "duration": 4,
      "purpose": "hook",
      "headline": "AI Agent 终于会当视频导演了",
      "visual": "大标题 + 背景渐变动效 + 快速入场",
      "caption": "以前它只会调用工具，现在它能导演视频。",
      "transition": "fast_scale_in"
    },
    {
      "id": "scene_02",
      "duration": 8,
      "purpose": "point_1",
      "headline": "理解视频结构",
      "visual": "文章 → 脚本 → 分镜，流程图动效",
      "caption": "把文章、产品页、README 自动拆解成脚本和分镜。",
      "transition": "slide_up"
    },
    {
      "id": "scene_03",
      "duration": 8,
      "purpose": "point_2",
      "headline": "记住你的品牌",
      "visual": "品牌色块动效 + 字体展示",
      "caption": "通过 Brand Kit，永远记住你的颜色、字体、语气和 CTA。",
      "transition": "slide_up"
    },
    {
      "id": "scene_04",
      "duration": 7,
      "purpose": "point_3",
      "headline": "自动质检修复",
      "visual": "lint 通过 ✓ → render 成功 ✓",
      "caption": "自动执行 lint、检查、修复，保证每次渲染成功。",
      "transition": "slide_up"
    },
    {
      "id": "scene_05",
      "duration": 3,
      "purpose": "cta",
      "headline": "关注示例创作者",
      "visual": "关注按钮 + 品牌色背景",
      "caption": "关注示例创作者，继续拆解能干活的 AI Agent。",
      "transition": "fade_out"
    }
  ]
}
```

### 3.4 视觉设计说明（`DESIGN.md`，节选）

```markdown
# DESIGN.md — HyperDirector 是什么

## 基本参数
- 模板：ai-knowledge-explainer-kit
- 尺寸：1080×1920（9:16 竖屏）
- 总时长：30 秒
- 场景数：5

## 品牌应用
- 主色：#111827（深灰黑）
- 强调色：#38BDF8（天蓝）
- 背景：#F8FAFC（近白）
- 标题字体：Inter（700 Bold）
- 正文字体：Noto Sans SC（400 Regular）

## 动效风格
- 节奏：fast（能量感强）
- 转场：slide_up 为主，hook 场景使用 fast_scale_in
- 字幕：安全区内，底部 15% 留白
```

### 3.5 HTML Composition 生成

HyperDirector 生成 `index.html`，这是完整的 HyperFrames 视频源码，包含：
- 5 个场景的 HTML 结构
- GSAP 动画 timeline（paused，注册到 `window.__timelines`）
- 品牌色应用（CSS 变量）
- 字幕安全区设置

### 3.6 QA 质检

```
执行 npx hyperframes lint...

✅ Lint passed.
  - All timed elements have class="clip" ✓
  - Timeline registered: window.__timelines["hyperdirector-intro"] ✓
  - Timeline key matches data-composition-id ✓
  - No Math.random() usage ✓
  - No infinite repeat ✓
  - Timeline duration: 30.0s (matches storyboard) ✓
```

### 3.7 渲染报告（`render-report.md`）

```markdown
# Render Report

- Task: article_to_short_video
- Template: ai-knowledge-explainer-kit
- Aspect Ratio: 9:16
- Duration: 30s
- Lint Result: PASSED
- Validate Result: PASSED
- Fixes Applied: none
- Render Status: READY FOR RENDER

## How to Render

Run in the project directory:
  npx hyperframes render --quality draft --output output/draft.mp4
  npx hyperframes render --quality high --output output/final.mp4
```

---

## 第四步：本地预览

在输出的项目目录中运行：

```bash
cd output/hyperdirector-intro
npx hyperframes preview
```

浏览器会打开实时预览，可以看到视频动画效果。

---

## 第五步：渲染 MP4

预览满意后，渲染最终视频：

```bash
# 先渲染草稿（快，用于确认节奏）
npx hyperframes render --quality draft --output output/draft.mp4

# 确认无误后渲染最终版
npx hyperframes render --quality high --output output/final.mp4
```

渲染时间参考：30 秒视频，draft 约 30–60 秒，high 约 2–5 分钟（取决于电脑性能）。

---

## 第六步：二次迭代

如果你想修改某个场景，直接告诉 Hermes：

```
把 scene_02 的标题改成"自动理解视频结构"，字幕改为：
"输入文章，自动生成脚本、分镜和视觉设计。"
```

HyperDirector 会：
1. 找到 `scene_02` 对应的 HTML 元素
2. 只修改标题和字幕
3. 重新运行 lint
4. 输出 `edit-instructions.md` 记录修改内容

**不会重写整个项目。**

---

## 注意事项

- 如果 HyperFrames CLI 未安装，HyperDirector 会生成所有源文件，但在 render-report.md 中明确标注"未执行渲染"。不要误以为 MP4 已经生成。
- 第一次运行时建议用一篇短文（200–500 字）测试，确认工作流正常。
- 品牌色如果没有填写 brand-kit.json，会使用默认的深色主题。

---

下一步：[Brand Kit 配置指南 →](./brand-kit-setup.zh-CN.md)
