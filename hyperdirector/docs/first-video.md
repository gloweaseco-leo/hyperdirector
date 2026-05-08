# 生成第一个视频

> 完整教程：从一段文字到 30 秒竖屏短视频的全流程。

---

## 示例场景

- **输入：** 一篇关于 HyperDirector 的简介文章
- **目标：** 30 秒视频号竖屏视频，强 hook + 3 个核心观点 + CTA
- **模板：** `ai-knowledge-explainer-kit`

---

## 准备输入内容

以下是本教程使用的示例文章（可直接复制用于测试）：

```
HyperDirector 是什么？

HyperDirector 是运行在 Hermes AI Agent 中的视频导演增强包。
它不是传统视频编辑软件，而是把自然语言需求变成可渲染视频工程的自动化工作流。

核心能力有三个：

第一，理解视频结构。它能把文章、产品页、README 自动拆解成脚本和分镜。

第二，记住你的品牌。通过 Brand Kit，它永远知道你的颜色、字体、语气和 CTA。

第三，自动质检修复。生成 HTML 视频后，它会自动执行 lint、检查、修复，保证渲染成功。

最终你拿到的不只是视频，而是一套完整的视频工程包：MP4 成品 + 可编辑 HTML 源码 + 设计说明。
```

---

## Step 1 — 向 Hermes 输入需求

```
使用 HyperDirector，把下面这篇文章做成 30 秒视频号竖屏短视频。
使用 ai-knowledge-explainer-kit 模板。
前 3 秒强 hook，中间 3 个核心观点逐幕展开，结尾引导关注。
读取我的 brand-kit.json。

[粘贴文章内容]
```

---

## Step 2 — 能力判断

HyperDirector 首先判断请求是否适合：

```
✅ 适合 HyperDirector。

任务类型：article_to_short_video
推荐模板：ai-knowledge-explainer-kit
风险等级：低
说明：文章有清晰的三段结构，适合生成知识解释型短视频。
```

如果需求超出能力范围（如写实视频、数字人），会在这一步说明原因并建议替代方案。

---

## Step 3 — Brief 生成（`brief.json`）

```json
{
  "title": "HyperDirector 是什么",
  "platform": "video_wechat",
  "aspect_ratio": "9:16",
  "duration_seconds": 30,
  "audience": "AI 内容创作者、产品经理、Hermes 用户",
  "goal": "讲清楚 HyperDirector 的三个核心能力并引导关注",
  "tone": "专业、直给、有工程感",
  "input_type": "article",
  "language": "zh-CN",
  "template": "ai-knowledge-explainer-kit",
  "brand_kit": "default"
}
```

如果 brief 有偏差，直接说"修正 title 为 XX"，HyperDirector 会更新后继续。

**校验 brief：**

```bash
node hyperdirector/scripts/validate-brief.js output/brief.json
```

---

## Step 4 — 分镜生成（`storyboard.json`）

```json
{
  "title": "HyperDirector 是什么",
  "total_duration": 30,
  "aspect_ratio": "9:16",
  "template": "ai-knowledge-explainer-kit",
  "scenes": [
    {
      "id": "scene_01",
      "duration": 4,
      "purpose": "hook",
      "headline": "AI Agent 终于会当视频导演了",
      "visual": "大标题 + 背景渐变动效 + 快速入场",
      "caption": "以前它只会调用工具，现在它能导演视频。",
      "transition": "fast_scale_in",
      "brand_accent": true
    },
    {
      "id": "scene_02",
      "duration": 7,
      "purpose": "context",
      "headline": "HyperDirector 是什么？",
      "visual": "定义文字 + 工作流简图",
      "caption": "运行在 Hermes 中的视频导演增强包。把自然语言变成可渲染视频工程。",
      "transition": "slide_up"
    },
    {
      "id": "scene_03",
      "duration": 6,
      "purpose": "mechanism_1",
      "headline": "理解视频结构",
      "visual": "文章 → 脚本 → 分镜，三步流程卡片",
      "caption": "把文章、产品页、README 自动拆解成脚本和分镜。",
      "transition": "slide_up"
    },
    {
      "id": "scene_04",
      "duration": 6,
      "purpose": "mechanism_2",
      "headline": "记住你的品牌",
      "visual": "品牌色块 + 字体展示 + Brand Kit 图标",
      "caption": "一次配置，所有视频自动套用品牌色、字体、语气和 CTA。",
      "transition": "slide_up"
    },
    {
      "id": "scene_05",
      "duration": 4,
      "purpose": "use_case",
      "headline": "自动质检修复",
      "visual": "lint ✓ → validate ✓ → render ✓ 三步绿勾动效",
      "caption": "自动 lint、检查、修复，最多重试 3 次，保证渲染成功。",
      "transition": "scale_in"
    },
    {
      "id": "scene_06",
      "duration": 3,
      "purpose": "cta",
      "headline": "关注示例创作者",
      "visual": "品牌色背景 + 关注引导按钮动效",
      "caption": "关注示例创作者，继续拆解能干活的 AI Agent。",
      "transition": "fade_out",
      "brand_accent": true
    }
  ]
}
```

**校验 storyboard（含与 brief 交叉检查）：**

```bash
node hyperdirector/scripts/validate-storyboard.js output/storyboard.json output/brief.json
```

输出应为：`✓ Storyboard validation passed — 6 scenes, 30.00s total`

---

## Step 5 — 视觉设计（`DESIGN.md`）

HyperDirector 输出设计决策文档，说明配色、字体、动效选择理由：

```markdown
# DESIGN.md — HyperDirector 是什么

## 配色
- 主色 #111827（近黑）：工程感，高对比度
- 强调色 #6366F1（Indigo）：品牌识别，CTA 区分
- 白底场景与深色场景交替

## 字体
- headline: Inter Bold 700（工程感无衬线）
- body: Noto Sans SC（CJK 全覆盖，字幕清晰）

## 动效
- Hook：fast_scale_in 0.2s（冲击感）
- 信息场景：slide_up 0.4s（稳健展开）
- CTA：fade_out（柔和收尾）
```

---

## Step 6 — HTML 合成（`index.html`）

HyperDirector 生成完整的 HyperFrames 视频源码：

- 6 个场景的 HTML 结构，每个有 `data-duration` 属性
- GSAP timeline（`paused: true`，注册到 `window.__hf_timeline`）
- 品牌色 CSS 变量（可以直接编辑修改）
- 所有可编辑区域有 `<!-- HERMES: ... -->` 注释标注

```html
<!-- 示例：scene_01 结构 -->
<section
  id="scene_01"
  class="scene"
  data-duration="4"
  data-purpose="hook"
  data-transition="fast_scale_in"
>
  <!-- HERMES: scene_01 标题在此处修改 -->
  <h1 class="headline">AI Agent 终于会当视频导演了</h1>
  <div class="caption-bar">
    <!-- HERMES: scene_01 字幕在此处修改 -->
    <p class="caption-text">以前它只会调用工具，现在它能导演视频。</p>
  </div>
</section>
```

---

## Step 7 — QA 质检

HyperDirector 自动运行三阶段检查：

```bash
# 自动执行（也可手动运行）
node hyperdirector/scripts/validate-brief.js output/brief.json
node hyperdirector/scripts/validate-storyboard.js output/storyboard.json output/brief.json
node hyperdirector/scripts/check-output-contract.js output/

npx hyperframes lint    # HTML 合规检查
```

**质检通过示例输出：**

```
✓ Brief validation passed
✓ Storyboard validation passed — 6 scenes, 30.00s total
✓ Output contract check passed
✓ Lint passed — Timeline registered, all clips valid
```

**如果质检失败：** HyperDirector 进入自动修复循环，最多重试 3 次。修复记录写入 `qa-report.md`。详见 [qa/lint-fix-loop.md](../qa/lint-fix-loop.md)。

---

## Step 8 — 预览与渲染

```bash
# 进入输出目录
cd output/你的项目名/

# 浏览器预览（推荐先做这一步）
npx hyperframes preview

# 或直接打开 preview.html
open preview.html

# 草稿渲染（快速确认节奏，约 30–60 秒）
npx hyperframes render --quality draft --output draft.mp4

# 最终渲染（高质量，约 2–5 分钟）
npx hyperframes render --quality high --output final.mp4
```

---

## Step 9 — 迭代修改

看完 preview 后，如需修改，直接告诉 Hermes：

```
把 scene_02 的标题改成"你的新标题"，字幕改为"新字幕内容"
把 hook 改快一点
CTA 改成"前往你的落地页订阅"
```

HyperDirector 只修改受影响的场景，不重写整个项目，并输出 `edit-instructions.md` 记录改动内容。

---

## 完整输出文件

```
output/hyperdirector-intro/
├── brief.json             ✅ 已生成
├── storyboard.json        ✅ 已生成
├── script.md              ✅ 已生成（逐场景旁白）
├── DESIGN.md              ✅ 已生成（视觉决策）
├── brand-used.json        ✅ 已生成（品牌快照）
├── index.html             ✅ 已生成（视频源码）
├── preview.html           ✅ 已生成（预览入口）
├── edit-instructions.md   ✅ 已生成（编辑指南）
├── render-report.md       ✅ 已生成（QA 报告）
├── assets/                （素材目录，当前为占位）
└── final.mp4              ✅ 渲染后生成
```

---

## 可以直接参考的完整示例

此教程对应的完整示例文件在：

```
hyperdirector/examples/zh-CN/demo-article-to-video/
```

包含 brief.json、storyboard.json、index.html 等所有输出文件，可以直接打开对照学习。

---

下一步：[Brand Kit 配置指南 →](./brand-kit-setup.md)
