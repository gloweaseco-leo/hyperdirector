# Brand Kit 配置指南

> Brand Kit 是 HyperDirector 的品牌记忆系统。配置一次，所有视频自动套用。

---

## 为什么需要 Brand Kit？

没有 Brand Kit 时，每次生成视频都要重新描述你的颜色、字体和风格。配置后：

- 品牌色在每条视频中保持一致
- 字幕字体无需每次指定
- 动效节奏匹配你的品牌风格
- CTA 自动填入，不再手动写
- 多语言视频统一输出语言策略

---

## 文件位置

将 `brand-kit.json` 放在工作目录根目录（与 `output/` 同级）：

```
你的工作目录/
├── brand-kit.json     ← 品牌配置
├── output/            ← 视频输出
└── ...
```

快速创建：

```bash
cp hyperdirector/brand/brand-kit.example.json ./brand-kit.json
```

---

## 最小可用配置

只需填写这些字段即可开始使用：

```json
{
  "brand_name": "你的品牌名称",
  "locale": "zh-CN",
  "default_output_language": "zh-CN",
  "colors": {
    "primary": "#111827",
    "accent": "#6366F1"
  },
  "fonts": {
    "headline": "Inter",
    "body": "Noto Sans SC"
  },
  "cta": {
    "default": "关注 [你的品牌名]，持续更新"
  }
}
```

其余字段使用默认值，视频可以正常生成。

---

## 完整字段参考

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
    "accent": "#6366F1",
    "background": "#FFFFFF",
    "text_primary": "#1F2937",
    "text_secondary": "#6B7280"
  },

  "fonts": {
    "headline": "Inter",
    "body": "Noto Sans SC",
    "code": "JetBrains Mono"
  },

  "motion_language": {
    "pace": "medium",
    "style": "clean_tech",
    "transitions": ["slide_up", "scale_in", "fade"],
    "entrance_default": "fade_slide_up",
    "exit_default": "fade_out"
  },

  "voice": {
    "tone": "专业、直给、有工程感",
    "avoid": ["过度夸张", "空泛口号", "廉价图标"],
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
    "bottom_percent": 22,
    "left_percent": 5,
    "right_percent": 5
  }
}
```

---

## 字段详解

### 语言设置

| 字段 | 说明 | 可选值 |
|------|------|--------|
| `locale` | 品牌区域 | `zh-CN`、`en-US`、`ja-JP` |
| `default_output_language` | 视频默认输出语言 | `zh-CN`、`en-US` |
| `language_policy.script_language` | 旁白脚本语言 | `zh-CN`、`en-US` |
| `language_policy.subtitle_language` | 字幕语言 | `zh-CN`、`en-US` |
| `language_policy.ui_copy_language` | CTA 和按钮语言 | `zh-CN`、`en-US` |
| `language_policy.technical_terms` | 技术词汇处理 | 见下表 |

`technical_terms` 可选值：

| 值 | 效果 |
|----|------|
| `keep_english` | 技术词保持英文（API、GSAP、HTML） |
| `keep_english_with_chinese_explanation` | 英文 + 括号注释（默认推荐） |
| `translate_all` | 全部翻译为目标语言 |

---

### 颜色设置

颜色值格式必须为 `#RRGGBB`（6 位十六进制）。

| 字段 | 用途 |
|------|------|
| `colors.primary` | 标题、重点文字、深色背景 |
| `colors.accent` | 高亮、按钮、CTA 背景 |
| `colors.background` | 浅色场景背景 |
| `colors.text_primary` | 浅色背景上的主体文字 |
| `colors.text_secondary` | 说明文字、标注、次要信息 |

从品牌 Logo 或网站 CSS 提取颜色值，确保与已有视觉系统一致。

校验颜色格式是否正确：

```bash
node hyperdirector/scripts/validate-brand-kit.js brand-kit.json
```

---

### 字体设置

| 字段 | 用途 | 中文视频推荐 |
|------|------|------------|
| `fonts.headline` | 大标题、场景标题 | Inter、Space Grotesk |
| `fonts.body` | 字幕、说明文字 | Noto Sans SC、PingFang SC |
| `fonts.code` | 代码块（技术视频）| JetBrains Mono、Consolas |

推荐字体搭配：

| 风格 | 标题 | 正文 |
|------|------|------|
| 简洁科技 | Inter | Noto Sans SC |
| 温暖人文 | Lora | PingFang SC |
| 强烈个性 | Space Grotesk | Noto Sans SC |
| 企业商务 | Source Sans 3 | Noto Sans SC |

**注意：** 字体必须在渲染环境中可用。Google Fonts 在渲染时需要联网。离线环境建议将 `.woff2` 文件放入 `assets/fonts/` 并用 `@font-face` 本地加载。

---

### 动效设置

| 字段 | 可选值 | 说明 |
|------|--------|------|
| `motion_language.pace` | `fast` / `medium` / `slow` | 元素出现速度（0.2s / 0.4s / 0.6s） |
| `motion_language.style` | `clean_tech` / `warm_social` / `corporate` / `editorial` / `playful` | 整体视觉风格 |
| `motion_language.transitions` | `slide_up`、`scale_in`、`wipe`、`fade`、`push`、`blur_crossfade` | 偏好转场效果列表 |

风格选择建议：

| 场景 | 推荐配置 |
|------|---------|
| 技术博主 | `clean_tech` + `fast` |
| 知识型创作者 | `editorial` + `medium` |
| 企业/商务 | `corporate` + `medium` |
| 生活/情感类 | `warm_social` + `medium` |

---

### 语气设置

```json
"voice": {
  "tone": "专业但不刻板，信息密度高，干货感强",
  "avoid": ["过于销售腔", "廉价鸡汤", "故作神秘", "过多感叹号"]
}
```

`tone` 用正面描述，`avoid` 用负面列表。两者共同引导 HyperDirector 生成脚本的措辞风格。

---

### CTA 设置

```json
"cta": {
  "default": "关注示例创作者，继续拆解能干活的 AI Agent",
  "subscription": "前往你的课程或会员落地页（示例：https://example.com/join）",
  "follow_wechat": "关注公众号「示例创作者」，回复「视频」获取说明",
  "trial": "立即预约 Demo → your-product.com"
}
```

在视频中使用特定 CTA：

```
使用 HyperDirector 生成视频，结尾 CTA 使用 cta.subscription
```

或在 brief.json 中通过 `cta_override` 字段临时覆盖：

```json
"cta_override": "本期特别推荐：扫码加入学习群"
```

---

### 安全区设置

安全区决定字幕和主要内容的显示范围，避免被平台 UI 遮挡：

```json
"safe_zone": {
  "top_percent": 10,
  "bottom_percent": 22,
  "left_percent": 5,
  "right_percent": 5
}
```

| 平台 | 建议 bottom_percent |
|------|-------------------|
| 视频号 / TikTok（9:16） | 22%（有进度条+头像遮挡） |
| YouTube（16:9） | 12% |
| B 站 | 15% |

---

## 校验 Brand Kit

```bash
node hyperdirector/scripts/validate-brand-kit.js brand-kit.json
```

通过示例：

```
✓ brand_name
✓ colors.primary (#111827)
✓ colors.accent (#6366F1)
✓ fonts.headline
✓ fonts.body
✓ cta.default
✓ Brand Kit validation passed
```

---

## 多 Brand Kit 切换

当你管理多个品牌时，可以使用多个配置文件：

```
brand-kit-brand-a.json
brand-kit-brand-b.json
```

在生成时指定：

```
使用 HyperDirector 生成视频，使用 brand-kit-brand-b.json 的品牌配置
```

---

## 参考示例

- `hyperdirector/brand/brand-kit.example.json` — 通用示例
- `hyperdirector/brand/brand-kit.persona-zh.example.json` — 中文人设风格示例（开源占位，非真实品牌）

---

下一步：[模板选择指南 →](./template-guide.md)
