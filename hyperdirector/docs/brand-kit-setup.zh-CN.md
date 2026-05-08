# Brand Kit 配置指南

> Brand Kit 是 HyperDirector 的品牌记忆系统。配置一次，所有视频自动套用。

---

## 为什么需要 Brand Kit？

如果没有 Brand Kit，每次生成视频都需要重新说明你的颜色、字体和风格。配置好 Brand Kit 之后：
- 每条视频自动使用你的品牌色
- 字幕字体保持一致
- 动效节奏匹配你的品牌风格
- CTA 自动填入你的引导语

---

## 文件位置

将 `brand-kit.json` 放在你工作目录的根目录下（与 `output/` 同级）：

```
your-project/
├── brand-kit.json        ← 品牌配置文件
├── output/               ← 视频输出目录
└── ...
```

HyperDirector 会自动查找并加载该文件。

---

## 完整字段说明

以下是 `brand-kit.json` 的完整格式，每个字段都有说明：

```json
{
  "brand_name": "你的品牌名称",

  "locale": "zh-CN",
  "default_output_language": "zh-CN",

  "language_policy": {
    "script_language": "zh-CN",
    "subtitle_language": "zh-CN",
    "ui_copy_language": "zh-CN",
    "technical_terms": "keep_english_with_chinese_explanation"
  },

  "colors": {
    "primary": "#111827",
    "accent": "#38BDF8",
    "background": "#F8FAFC",
    "text_primary": "#1F2937",
    "text_secondary": "#6B7280"
  },

  "fonts": {
    "headline": "Inter",
    "body": "Noto Sans SC",
    "code": "JetBrains Mono"
  },

  "motion_language": {
    "pace": "fast",
    "style": "clean_tech",
    "transitions": ["slide_up", "scale_in", "wipe"],
    "entrance_default": "fade_slide_up",
    "exit_default": "fade_out"
  },

  "voice": {
    "tone": "专业、直给、有工程感",
    "avoid": ["过度鸡血", "空泛口号", "廉价图标"],
    "tts_voice": "af_heart",
    "tts_speed": 1.0
  },

  "cta": {
    "default": "关注 [品牌名]，持续更新",
    "subscription": "前往你的课程或会员落地页",
    "follow_wechat": "关注公众号 [公众号名称]"
  },

  "assets": {
    "logo": "assets/logo.png",
    "watermark": "assets/watermark.png",
    "background_default": "assets/bg-default.png",
    "music_default": "assets/bgm-default.mp3"
  },

  "safe_zone": {
    "top_percent": 10,
    "bottom_percent": 15,
    "left_percent": 5,
    "right_percent": 5
  }
}
```

---

## 字段详解

### 语言设置

| 字段 | 说明 | 可选值 |
|---|---|---|
| `locale` | 品牌区域设置 | `zh-CN`、`en-US` 等 |
| `default_output_language` | 默认视频输出语言 | `zh-CN`、`en-US` |
| `language_policy.script_language` | 脚本语言 | `zh-CN`、`en-US` |
| `language_policy.subtitle_language` | 字幕语言 | `zh-CN`、`en-US` |
| `language_policy.ui_copy_language` | CTA 和界面文字语言 | `zh-CN`、`en-US` |
| `language_policy.technical_terms` | 技术词汇处理方式 | `keep_english`、`keep_english_with_chinese_explanation`、`translate_all` |

**建议设置：** 技术内容博主使用 `keep_english_with_chinese_explanation`——技术术语保留英文但加中文注释，比如 "GSAP（动画库）"。

### 颜色设置

| 字段 | 说明 |
|---|---|
| `colors.primary` | 主色，用于标题、重点文字 |
| `colors.accent` | 强调色，用于高亮、按钮、图标 |
| `colors.background` | 背景色 |
| `colors.text_primary` | 正文主色 |
| `colors.text_secondary` | 次要文字色（说明、标注） |

推荐使用 16 进制颜色值（如 `#111827`）。品牌色可以从你的 Logo 或网站 CSS 中提取。

### 字体设置

| 字段 | 说明 |
|---|---|
| `fonts.headline` | 标题字体，用于大标题、场景标题 |
| `fonts.body` | 正文字体，用于字幕、说明文字 |
| `fonts.code` | 代码字体，技术类视频用 |

推荐字体搭配：
- **简洁科技风：** Inter（标题）+ Noto Sans SC（正文）
- **温暖人文风：** Lora（标题）+ PingFang SC（正文）
- **强烈个性风：** Space Grotesk（标题）+ Noto Sans SC（正文）

注意：字体需要在渲染环境中可用（Google Fonts 在渲染时可能需要网络）。离线环境建议使用系统字体。

### 动效设置

| 字段 | 说明 | 可选值 |
|---|---|---|
| `motion_language.pace` | 整体节奏 | `fast`（0.2s）、`medium`（0.4s）、`slow`（0.6s） |
| `motion_language.style` | 视觉风格 | `clean_tech`、`warm_social`、`corporate`、`editorial` |
| `motion_language.transitions` | 常用转场效果 | `slide_up`、`scale_in`、`wipe`、`fade`、`push` |

**风格选择建议：**
- 技术博主：`clean_tech` + `fast`
- 生活/情感类：`warm_social` + `medium`
- 企业/商务：`corporate` + `medium`
- 教育/知识类：`editorial` + `medium`

### 语气设置

| 字段 | 说明 |
|---|---|
| `voice.tone` | 正面描述：你希望视频给观众的感觉 |
| `voice.avoid` | 负面列表：不想要的语气特征 |

**示例：**
```json
"voice": {
  "tone": "专业但不刻板，信息密度高，干货感强",
  "avoid": ["过于销售腔", "廉价鸡汤", "故作神秘"]
}
```

### CTA 设置

CTA（Call to Action）是视频结尾的引导语。

```json
"cta": {
  "default": "关注示例创作者，继续拆解能干活的 AI Agent",
  "subscription": "前往你的课程或会员落地页（示例：https://example.com/join）",
  "follow_wechat": "关注公众号「示例创作者」，回复「视频」获取说明"
}
```

在生成视频时可以指定用哪个 CTA：
```
使用 HyperDirector 生成视频，结尾用 cta.subscription
```

---

## 中文人设示例（persona-zh）

以下是开源仓库中的**虚构**中文创作者人设，用于演示字段结构：

```json
{
  "brand_name": "示例创作者",
  "locale": "zh-CN",
  "default_output_language": "zh-CN",
  "language_policy": {
    "script_language": "zh-CN",
    "subtitle_language": "zh-CN",
    "ui_copy_language": "zh-CN",
    "technical_terms": "keep_english_with_chinese_explanation"
  },
  "colors": {
    "primary": "#111827",
    "accent": "#38BDF8",
    "background": "#F8FAFC",
    "text_primary": "#1F2937",
    "text_secondary": "#6B7280"
  },
  "fonts": {
    "headline": "Inter",
    "body": "Noto Sans SC"
  },
  "motion_language": {
    "pace": "fast",
    "style": "clean_tech",
    "transitions": ["slide_up", "scale_in", "wipe"]
  },
  "voice": {
    "tone": "专业、直给、有工程感",
    "avoid": ["过度鸡血", "空泛口号", "廉价图标"]
  },
  "cta": {
    "default": "关注示例创作者，继续拆解能干活的 AI Agent"
  }
}
```

完整示例文件：`brand/brand-kit.persona-zh.example.json`

---

## 最小可用配置

如果你只想快速试用，至少填写这些字段：

```json
{
  "brand_name": "我的品牌",
  "locale": "zh-CN",
  "default_output_language": "zh-CN",
  "colors": {
    "primary": "#111827",
    "accent": "#6366F1"
  },
  "cta": {
    "default": "关注 [你的名字]，持续更新"
  }
}
```

其余字段会使用默认值，视频仍然可以正常生成。

---

## 常见问题

**Q：颜色是什么格式？**
使用 16 进制颜色值，如 `#111827`。可以用设计工具（Figma、Adobe Color）取色。

**Q：字体不支持中文怎么办？**
使用 `Noto Sans SC`（思源黑体简体中文）或 `PingFang SC`（macOS 系统中文字体）。

**Q：Brand Kit 能切换吗？**
可以。在生成视频时指定 `--brand-kit ./brand-kit-v2.json`，或在对话中说明"使用另一套品牌配置"。

**Q：CTA 每次都一样，怎么让它更灵活？**
在 brief.json 的 `cta_override` 字段，或在对话中直接说明本次 CTA 内容。

---

下一步：[模板选择指南 →](./template-guide.zh-CN.md)
