# Workflow: One-Prompt Video

一句话触发完整视频生产流程。用户只需说清楚主题和目的，HyperDirector 自动推断所有参数并生成视频。

---

## 适用场景

| 场景 | 示例 |
|------|------|
| 临时灵感快速成片 | "把 AI 搜索和传统搜索的区别做成 30 秒短视频" |
| 内容日历填坑 | "今天要发一条关于 RAG 的视频" |
| 验证选题 | "做一个草稿，看看这个角度行不行" |
| 纯文字概念可视化 | "把这个概念做成视频" |

**不适合的场景：** 需要特定品牌素材、精确数据图表、多语言版本的任务 → 使用专用工作流。

---

## 输入材料

| 材料 | 必需 | 说明 |
|------|------|------|
| 一句描述 | 是 | 视频主题 + 目的 + 目标受众（可选） |
| brand-kit.json | 否 | 有则自动套用，无则用 default |
| 时长偏好 | 否 | 不填默认 30s |
| 平台偏好 | 否 | 不填默认 `video_wechat` + `9:16` |

---

## 推荐模板

| 主题类型 | 推荐模板 |
|---------|---------|
| AI/技术知识 | `ai-knowledge-explainer-kit` |
| 产品/工具介绍 | `saas-demo-kit` |
| 其他内容（经验/观点/资讯） | `tiktok-vertical-kit` |

如果用户没有指定，HyperDirector 在 Stage 01 自动推断。

---

## 执行步骤

```
Stage 01 — Capability Judge
  ↓ 分类为 suitable（几乎所有一句话输入都 suitable）
  ↓ 推断 task_type、template、duration、aspect_ratio

Stage 02 — Intake Brief
  ↓ 从一句话中提取 title、goal、tone
  ↓ platform = video_wechat（default）
  ↓ audience = 从主题推断
  ↓ 写入 output/brief.json

Stage 03 — Storyboard Generator
  ↓ 读取 brief.json + template 默认场景结构
  ↓ 生成 5–6 个场景，total_duration = 30s
  ↓ 写入 output/storyboard.json + output/script.md

Stage 04 — Visual Design
  ↓ 读取 brand-kit（default 或用户配置）
  ↓ 生成 output/DESIGN.md

Stage 05 — Compose HyperFrames
  ↓ 生成 output/index.html + output/preview.html

Stage 06 — QA Fixer
  ↓ npx hyperframes lint output/index.html
  ↓ 修复 → 最多 3 次

Stage 07 — Render Report
  ↓ 写入 output/render-report.md + output/brand-used.json
```

---

## 生成文件

```
output/
├── brief.json
├── storyboard.json
├── script.md
├── DESIGN.md
├── index.html
├── preview.html
├── brand-used.json
├── render-report.md
└── assets/
    └── README.md
```

`final.mp4` 仅在渲染环境可用时生成。

---

## 用户可复制的调用示例

### 最简调用

```
把 AI Agent 和 RPA 的区别做成一个 30 秒短视频，发微信视频号。
```

### 带参数调用

```
用 HyperDirector 生成一个视频：
主题：为什么现在学 AI 比两年前容易 10 倍
平台：微信视频号
时长：30 秒
受众：35-50 岁想转型 AI 的管理者
语气：直给，有工程感，不鸡血
模板：ai-knowledge-explainer-kit
```

### 带 brand-kit 调用

```
用 `brand/brand-kit.persona-zh.example.json` 的品牌风格，
把下面这个主题做成 30 秒视频：

"HyperFrames 是什么，为什么用 HTML 做视频"
```

---

## 常见失败点

| 失败现象 | 原因 | 解决方式 |
|---------|------|---------|
| Stage 01 返回 degraded | 用户描述模糊，HyperDirector 不确定 task_type | 补充"做成什么类型的视频"或"目的是什么" |
| brief.json 缺少 goal 字段 | 一句话未说清目的 | Agent 会自动推断，但质量依赖原始描述质量 |
| 分镜与主题脱节 | 主题太宽泛（如"做一个 AI 视频"） | 具体化主题：说清楚"AI 的哪个方面"+"受众是谁" |
| 字幕超长 | 30s 内想塞太多信息 | 限制每场景字幕不超过 20 字，或延长时长 |

---

## QA 检查点

```
[ ] brief.json 中 title、goal、template 字段已填写
[ ] storyboard.json 的 total_duration == brief.duration_seconds
[ ] scenes[0].purpose == "hook"
[ ] scenes[-1].purpose == "cta"
[ ] npx hyperframes lint output/index.html 返回 0 errors
[ ] preview.html 可在浏览器打开
```

---

## 输出验收标准

- `output/brief.json` 通过 `schemas/brief.schema.json` 校验
- `output/storyboard.json` 通过 `schemas/storyboard.schema.json` 校验
- `output/index.html` 在浏览器打开无 JS 错误
- `window.__timelines[0].totalDuration()` 返回值与 `brief.duration_seconds` 一致
- `render-report.md` 中 Lint 状态为 PASSED 或 PARTIAL（无 blocking error）
