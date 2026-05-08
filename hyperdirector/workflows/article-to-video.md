# Workflow: Article to Video

将公众号文章、博客、教程、行业分析转化为短视频。这是 HyperDirector 最常用的工作流。

---

## 适用场景

| 内容类型 | 典型示例 |
|---------|---------|
| 公众号文章 | 技术文章、行业分析、经验分享 |
| 博客 / 技术教程 | 使用指南、概念解释、操作流程 |
| 营销内容 | 产品故事、用户案例、品牌理念 |
| 知识类内容 | AI 概念、管理方法、行业趋势 |

**单篇文章建议生成 1–3 个短视频**（每个角度一个）。不要把 5000 字文章压缩进一个 60s 视频——选择 1–2 个核心观点生成。

---

## 输入材料

| 材料 | 必需 | 说明 |
|------|------|------|
| 文章全文 | 是 | 粘贴纯文本，或提供 URL |
| 视频主角度 | 推荐 | 文章有多个观点时，指定本次视频聚焦哪一个 |
| 目标平台 | 推荐 | 决定画幅和时长 |
| 时长 | 否 | 默认 30s；文章较长可用 45–60s |
| brand-kit.json | 否 | 有则套用，无则用 default |

**输入文件位置（推荐）：** `examples/zh-CN/my-project/input/article.md`

---

## 推荐模板

| 文章类型 | 推荐模板 | 说明 |
|---------|---------|------|
| AI/技术知识、流程解释 | `ai-knowledge-explainer-kit` | 流程图、步骤卡，适合技术受众 |
| 观点、经验、listicle | `tiktok-vertical-kit` | 三点结构，适合大众受众 |
| 产品类文章（含 demo） | `saas-demo-kit` | 配合截图使用 |

---

## 执行步骤

```
准备阶段（用户操作）
  ① 把文章内容保存为 input/article.md（或粘贴到提示词）
  ② 确定"本次视频要讲文章的哪个角度"
  ③ （可选）准备相关截图或配图到 input/assets/

Stage 01 — Capability Judge
  ↓ task_type = article_to_video → suitable
  ↓ 推断 template = ai-knowledge-explainer-kit 或 tiktok-vertical-kit

Stage 02 — Intake Brief
  ↓ 从文章中提取：核心观点作为 goal、目标受众
  ↓ title = 文章标题的精简版（kebab-case）
  ↓ input_type = "article"
  ↓ source_materials = [{ type: "article", path_or_url: "input/article.md" }]
  ↓ 写入 output/brief.json

Stage 03 — Storyboard Generator
  ↓ 阅读 input/article.md，提取 3–5 个核心观点
  ↓ hook: 从文章最具冲击力的结论或数据开始
  ↓ 中间场景: 每个观点一个 scene
  ↓ cta: 引导关注或阅读原文
  ↓ 写入 output/storyboard.json + output/script.md

Stage 04 — Visual Design
  ↓ 写入 output/DESIGN.md

Stage 05 — Compose HyperFrames
  ↓ 写入 output/index.html + output/preview.html

Stage 06 — QA Fixer
  ↓ lint → fix（最多 3 次）

Stage 07 — Render Report
  ↓ 写入 output/render-report.md
```

---

## 生成文件

```
output/
├── brief.json            ← input_type: "article"
├── storyboard.json       ← 5–6 个场景
├── script.md             ← 每场景旁白/字幕
├── DESIGN.md
├── index.html
├── preview.html
├── brand-used.json
├── render-report.md
└── assets/
    ├── README.md
    └── screenshot-*.png  ← 如有提供
```

---

## 用户可复制的调用示例

### 粘贴文章全文

```
请用 HyperDirector 把下面这篇文章转成 30 秒短视频。
平台：微信视频号（9:16）
重点：提炼文章的 3 个核心结论
受众：AI 从业者和有兴趣学 AI 的管理者
模板：ai-knowledge-explainer-kit

--- 文章内容开始 ---
[粘贴文章全文]
--- 文章内容结束 ---
```

### 提供 URL

```
把这篇文章转成 45 秒短视频：
https://mp.weixin.qq.com/s/xxxxxxxx

平台：B 站（16:9）
角度：只讲文章中关于"自主决策"的那一节
语气：专业、直给
```

### 指定角度

```
这篇文章有 5 个观点，本次只做"观点三：RAG 不是 AI 记忆"这个角度。
时长 20 秒，节奏快。
[粘贴文章全文]
```

---

## 常见失败点

| 失败现象 | 原因 | 解决方式 |
|---------|------|---------|
| 分镜内容与文章脱节 | 文章太长，Agent 提取了边缘内容 | 在调用时明确"聚焦文章第 N 节"或"只讲 X 观点" |
| 字幕是文章原文照搬 | Agent 没有做改写 | 在 Stage 02 的 brief.goal 补充："字幕需重写为短句，不能原文照搬" |
| Hook 无冲击力 | 文章结论平淡 | 在 brief 的 hook_requirement 字段补充："开头要有冲突感或强结论" |
| 30s 塞了 10 个观点 | 文章本身信息量大 | 限制 scene_count = 5，或把时长改为 60s |

---

## QA 检查点

```
[ ] brief.json 的 input_type == "article"
[ ] brief.json 的 source_materials 包含文章路径或 URL
[ ] storyboard.json 的 scenes[0].purpose == "hook"，且 headline 有冲击力
[ ] 每个 scene 的 caption 字数 ≤ scene.duration × 3
[ ] script.md 包含文章核心观点（非原文照搬）
[ ] index.html lint PASSED
```

---

## 输出验收标准

- `brief.json` 的 `goal` 字段体现了文章的核心价值主张（非文章标题的复读）
- `storyboard.json` 的每个 scene 标题不超过 60 个字符
- `script.md` 每场景字幕是短句，非原文摘录
- `render-report.md` lint 状态：PASSED 或 PARTIAL
- `preview.html` 打开后，hook 场景在 0.5s 内完成主视觉加载
