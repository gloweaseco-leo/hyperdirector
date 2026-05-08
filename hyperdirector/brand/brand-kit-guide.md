# Brand Kit 配置指南

> 面向普通用户。不需要懂代码，按这份指南填写 `brand-kit.json`，你的所有视频就会自动使用同一套品牌风格。

---

## 什么是 Brand Kit？

Brand Kit 是一份 JSON 配置文件，保存了你的品牌记忆：颜色、字体、语气、常用 CTA。

每次 HyperDirector 生成视频，都会读取这份文件，自动套用你的品牌风格——你不用每次都重新说"用我的品牌蓝"。

**文件位置：** 把 `brand/brand-kit.example.json` 复制到项目根目录，重命名为 `brand-kit.json`，然后按下面的说明填写。

---

## 一、品牌名称

```json
"brand_name": "示例创作者"
```

填写你的品牌名或个人名称。会出现在视频 CTA 里和设计注释中。

---

## 二、品牌色怎么填

你需要 5 个颜色，用 6 位十六进制格式（`#RRGGBB`）：

```json
"colors": {
  "primary":        "#0F172A",
  "accent":         "#38BDF8",
  "background":     "#F8FAFC",
  "text_primary":   "#1E293B",
  "text_secondary": "#64748B"
}
```

| 字段 | 用途 | 建议 |
|------|------|------|
| `primary` | 标题文字、重要信息 | 用深色，确保在浅色背景上可读 |
| `accent` | 按钮、高亮、强调元素 | 你的品牌标志色，要和背景对比强 |
| `background` | 场景底色 | 浅色或白色最通用 |
| `text_primary` | 正文、字幕 | 接近黑色，可读性优先 |
| `text_secondary` | 次要信息、标签 | 比 `text_primary` 浅一到两个档次 |

**找颜色的方法：**
- 打开你的品牌官网，用浏览器开发者工具吸取颜色
- 或者用 [Coolors](https://coolors.co) 生成配色方案
- 不确定就先用通用模板的默认值，后续再调

**合法格式验证：** 颜色必须是 `#` + 6 位十六进制，例如 `#FF5733`。不能用 `rgb()`、颜色名称（`blue`）或 4 位格式（`#FFF`）。

---

## 三、字体怎么填

```json
"fonts": {
  "headline": "Inter",
  "body": "Noto Sans SC",
  "code": "JetBrains Mono"
}
```

| 字段 | 用途 | 中文内容推荐 | 英文内容推荐 |
|------|------|------------|------------|
| `headline` | 大标题、场景主标题 | Noto Sans SC / PingFang SC | Inter / Space Grotesk / Outfit |
| `body` | 字幕、正文、说明文字 | Noto Sans SC / PingFang SC | Inter / Source Sans 3 |
| `code` | 代码片段（技术视频用） | JetBrains Mono | JetBrains Mono / Fira Code |

**重要：** 字体必须能在渲染环境加载。推荐使用 Google Fonts 上有的字体（HyperFrames 会自动从 Google Fonts CDN 加载）。

**中文视频必须用支持 CJK 的字体：**
- `Noto Sans SC`（免费，Google Fonts，推荐）
- `PingFang SC`（仅 Apple 设备有，跨平台不可靠）
- `Microsoft YaHei`（仅 Windows 设备有，跨平台不可靠）

如果你的视频只有中文，`headline` 和 `body` 都填 `Noto Sans SC` 是最安全的选择。

---

## 四、语气怎么填

`voice` 字段控制 AI 写文案时的语气和风格：

```json
"voice": {
  "tone": "专业、直给、有工程感。面向有经验的从业者，不需要解释基础概念。结论先行，每句话都要传递信息。",
  "avoid": [
    "过度鸡血",
    "空泛口号",
    "廉价图标",
    "短字成行"
  ]
}
```

### `tone`（正向描述）

用 1–3 句话描述你想要的语气。越具体越好。

| 不好的写法 | 好的写法 |
|-----------|---------|
| "专业" | "专业、直给，面向有 5 年以上工作经验的管理者，不用解释基础" |
| "有趣" | "有趣但不幼稚，像一个懂技术的朋友在聊天，不像在读 PPT" |
| "简洁" | "简洁，每句话不超过 20 字，结论放在句首" |

### `avoid`（禁用写法）

列出你不想出现在视频里的词语、句式或风格。这是你的品牌红线：

```json
"avoid": [
  "过度鸡血（你也可以成功、逆袭、月入百万）",
  "空泛口号（引领未来、赋能生态）",
  "假问句（你是否曾经感到迷茫？）",
  "虚假紧迫感（限时特惠、仅剩最后3名）",
  "廉价图标（emoji 当主视觉）"
]
```

---

## 五、动效语言怎么填

```json
"motion_language": {
  "pace": "fast",
  "style": "clean_tech",
  "transitions": ["slide_up", "scale_in", "wipe"]
}
```

### `pace`（整体节奏）

| 值 | 元素入场时长 | 适合 |
|----|------------|------|
| `fast` | 0.2s | 短视频、信息流、TikTok 风格 |
| `medium` | 0.4s | 大多数场景，平衡专业与活力 |
| `slow` | 0.6s | 品牌形象片、高端感、沉稳风格 |

### `style`（动效性格）

| 值 | 感觉 | 适合 |
|----|------|------|
| `clean_tech` | 精准、干净、无弹跳 | 科技产品、SaaS、AI 内容 |
| `warm_social` | 友好、轻微弹跳感 | 社交内容、生活方式、教育 |
| `corporate` | 对称、稳重、商务 | 企业汇报、B2B 产品 |
| `editorial` | 戏剧性入场、高级感 | 品牌片、高端产品 |
| `playful` | 弹跳、活泼 | 消费类、年轻受众、游戏 |

### `transitions`（偏好过渡方式）

从以下选项中选 2–4 个，填入数组。HyperDirector 会优先使用这些过渡方式：

```
slide_up   slide_down   scale_in   scale_out
wipe       fade         push       blur_crossfade   zoom_through
```

---

## 六、CTA 怎么填

CTA（Call to Action）是视频最后的行动号召。可以配置多个变体，HyperDirector 会根据视频类型选择合适的一个：

```json
"cta": {
  "default": "关注示例创作者，继续拆解能干活的 AI Agent",
  "subscription": "前往你的课程或会员落地页（示例：https://example.com/join）",
  "follow_wechat": "关注公众号「示例创作者」，回复「视频」获取说明",
  "share": "转发给正在转型 AI 的管理者朋友"
}
```

**必须有 `default`**，其他变体随意命名和添加。

写好 CTA 的技巧：
- 说清楚用户要做什么（关注 / 加入 / 下载）
- 说清楚用户会得到什么（继续学 AI / 获取源码 / 完整案例）
- 不超过 35 个字（字幕安全区放得下）

---

## 七、Logo 和背景资源

```json
"assets": {
  "logo": "brand/assets/logo.png",
  "watermark": "brand/assets/watermark.png",
  "background_default": "brand/assets/bg-default.jpg",
  "music_default": "brand/assets/music-ambient.mp3"
}
```

| 字段 | 说明 | 文件要求 |
|------|------|---------|
| `logo` | 品牌 Logo，出现在视频角落或 CTA 场景 | PNG，透明背景，建议 400×400px |
| `watermark` | 水印，半透明叠加在视频上 | PNG，透明背景，30% 不透明度 |
| `background_default` | 默认背景图 | JPG，1080×1920（9:16）或 1920×1080（16:9） |
| `music_default` | 背景音乐 | MP3，30–60s 循环段落 |

路径相对于项目根目录。如果没有这些资源，可以不填这些字段，HyperDirector 会用纯色背景。

---

## 八、安全区设置

```json
"safe_zone": {
  "top_percent": 10,
  "bottom_percent": 22,
  "left_percent": 5,
  "right_percent": 5
}
```

安全区控制字幕和内容离边缘的最小距离，避免被平台 UI 遮住。

**9:16 竖屏视频：** `bottom_percent` 设为 22 以上，避免被 TikTok / 微信视频号底部按钮遮挡。

如果你不确定，直接用上面的默认值，已经过测试可以在主流平台安全显示。

---

## 九、让多个视频保持一致风格

**每个项目只需要配置一次 Brand Kit。** HyperDirector 的工作方式是：

1. 把 `brand-kit.json` 放在你的工作目录根目录
2. 每次运行 HyperDirector，它会自动读取这份文件
3. 生成视频时，它会把 `brand-kit.json` 的实际值快照为 `output/brand-used.json`
4. 这样就算你后来更新了 `brand-kit.json`，旧视频的配置也有存档

**多版本品牌配置：**
如果你需要为不同场合准备不同风格（比如：日常内容风格 vs 活动推广风格），可以维护多个配置文件：

```
brand/
├── brand-kit.json              ← 日常默认配置
├── brand-kit.campaign.json     ← 活动专用（高能量、快节奏）
└── brand-kit.formal.json       ← 正式场合（缓慢、沉稳）
```

在 `brief.json` 里通过 `brand_kit` 字段指定要用哪个：

```json
{
  "brand_kit": "brand/brand-kit.campaign.json"
}
```

---

## 快速上手检查表

填写完 `brand-kit.json` 后，检查以下项目：

```
[ ] brand_name 已填写
[ ] colors.primary 和 colors.accent 都是 6 位十六进制颜色
[ ] fonts.headline 和 fonts.body 都已填写（中文视频用 Noto Sans SC）
[ ] voice.tone 描述了你想要的语气（不少于 10 个字）
[ ] voice.avoid 列出了至少 3 项禁用风格
[ ] cta.default 已填写（不超过 35 字）
[ ] safe_zone.bottom_percent 设为 22 或更高（9:16 视频）
[ ] 用 PowerShell 校验 JSON 合法性：
    Get-Content brand-kit.json -Raw | ConvertFrom-Json
    （无报错即合法）
```
