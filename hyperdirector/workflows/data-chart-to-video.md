# Workflow: Data Chart to Video

将数据、表格、指标、增长曲线转化为带动态图表动效的短视频。数字会动，结论会出现，增长会被看见。

---

## 适用场景

| 数据类型 | 典型示例 |
|---------|---------|
| 月度 / 季度增长数据 | "GMV 增长了 3.2 倍" |
| 产品指标 | DAU、留存、转化率、NPS |
| 市场规模数据 | 行业 TAM、增速、渗透率 |
| 对比类数据 | A vs B，我们 vs 竞品 |
| 调研结果 | 问卷、用户画像、占比分布 |
| 时序数据 | 月度趋势、季度走势 |

**不适合：** 需要实时更新的数据仪表盘 → 使用专用 BI 工具。  
**不适合：** 超过 10 个数据系列同时展示 → 拆分为多个视频或降级到静态截图。

---

## 输入材料

| 材料 | 必需 | 说明 |
|------|------|------|
| 数据表格或数值列表 | 是 | CSV / Markdown 表格 / JSON / 手动填写 |
| 数据背后的结论 | 是 | "这组数据说明什么"，不能只给数字 |
| 图表类型偏好 | 推荐 | 计数器 / 柱状图 / 折线图 / 进度环 / 对比卡 |
| 数据时间范围 | 推荐 | 如"2024Q1 vs 2024Q2" |
| 品牌色 | 否 | 影响图表配色 |

---

## 推荐模板

| 数据类型 | 推荐模板 | 图表动效 |
|---------|---------|---------|
| 单一核心数字（增长） | `ai-knowledge-explainer-kit` | 计数器动画（counter） |
| 3–4 个指标对比 | `tiktok-vertical-kit` | 数字卡片依次出现 |
| 功能价值 + 数据佐证 | `saas-demo-kit` | 进度环 + 数值 |

所有图表动效必须用 **纯 CSS/JS** 实现（GSAP CounterPlugin 或手写计数逻辑），不依赖外部图表库。

---

## 支持的图表动效类型

| 类型 | 实现方式 | 适合数据 |
|-----|---------|---------|
| counter | GSAP 数字从 0 计数到目标值 | 单个大数字（DAU、GMV、增长率） |
| bar | CSS `scaleX` 从 0 展开到目标宽度 | 横向对比（A vs B vs C） |
| progress_ring | SVG `stroke-dashoffset` 动画 | 占比、完成率（0%–100%） |
| line | SVG `stroke-dasharray` 逐步绘制 | 时序趋势 |
| card_reveal | 数字卡片顺序 fade-in | 多指标展示（3–5 个） |

每个视频最多混用 **2 种** 图表动效类型，避免视觉混乱。

---

## 执行步骤

```
准备阶段（用户操作）
  ① 整理数据（CSV 表格 / Markdown 表格 / 手动列举）
  ② 写清楚每组数字背后的结论（"这说明什么"）
  ③ 明确图表类型（counter / bar / progress_ring / line / card_reveal）

Stage 01 — Capability Judge
  ↓ task_type = data_chart_to_video → suitable
  ↓ 若数据系列 > 10 → degraded（建议拆分）

Stage 02 — Intake Brief
  ↓ goal = "用动态图表展示 [数据结论]，说服 [受众]"
  ↓ input_type = "data"
  ↓ source_materials = [{ type: "data", path_or_url: "input/data.csv", use_for: "chart_source" }]
  ↓ constraints.max_words_per_scene = 25（数据视频字幕要短）
  ↓ 写入 output/brief.json

Stage 03 — Storyboard Generator
  ↓ hook: 核心结论（不是原始数据），用最强数字
  ↓ 每个图表场景：data_type + chart_type + 数值 + 结论
  ↓ storyboard.json 的 scene.visual 字段描述图表类型和动效
  ↓ 写入 output/storyboard.json + output/script.md

Stage 04 — Visual Design
  ↓ 图表色系与 brand_kit.colors 对齐
  ↓ 规定每种图表的字号、颜色、动效时长
  ↓ 写入 output/DESIGN.md

Stage 05 — Compose HyperFrames
  ↓ 图表动效用 GSAP 实现（counter / bar / ring 均有标准实现）
  ↓ 参考 brand/motion-language.example.md 的 Chart and Data Animation 章节
  ↓ 所有动效 paused，注册到 window.__timelines
  ↓ 数值硬编码（不从外部 fetch），确保 determinism
  ↓ 写入 output/index.html + output/preview.html

Stage 06 — QA Fixer
  ↓ 检查计数器最终值与输入数据一致
  ↓ 检查进度环 stroke-dashoffset 计算是否正确
  ↓ lint → fix（最多 3 次）

Stage 07 — Render Report
  ↓ 写入 output/render-report.md
```

---

## 生成文件

```
output/
├── brief.json            ← input_type: "data"
├── storyboard.json       ← scene.visual 含 chart_type 描述
├── script.md             ← 每场景字幕（结论句，非数字列表）
├── DESIGN.md             ← 图表色系、动效规格
├── index.html            ← 图表动效实现
├── preview.html
├── brand-used.json
├── render-report.md
└── assets/
    └── README.md
```

---

## 用户可复制的调用示例

### 单一大数字（计数器）

```
用 HyperDirector 把这个增长数据做成 20 秒短视频。

主要数字：MAU 从 12,000 增长到 480,000（增长 40 倍）
结论：过去 6 个月，产品进入了爆发期
图表类型：计数器动画，数字从 0 跳到 480,000

其他数据（次要，作为辅助卡片）：
- 留存率：D7 = 62%
- NPS = 71

平台：微信视频号，9:16，20 秒
语气：自信、克制、数据优先
```

### 对比类数据（柱状图）

```
做一个 30 秒对比视频：

数据：
| 方案 | 处理时间 | 成本 | 准确率 |
|-----|---------|------|-------|
| 传统方式 | 4 小时 | 2000 元 | 78% |
| 我们的方案 | 8 分钟 | 200 元 | 94% |

图表类型：横向柱状图，两行对比
结论：速度提升 30 倍，成本降低 90%，准确率提升 16%

平台：B 站，16:9
语气：专业，数据说话
CTA：立即申请内测
```

### 增长趋势（折线图）

```
把过去 12 个月的 GMV 数据做成折线图动效视频，30 秒。

数据（月度 GMV，单位：万元）：
1月: 230, 2月: 210, 3月: 280, 4月: 320, 5月: 380,
6月: 450, 7月: 520, 8月: 610, 9月: 740, 10月: 850,
11月: 1020, 12月: 1380

结论：全年 GMV 增长 6 倍，Q4 加速显著
图表：折线图从左往右逐步绘制，最终值高亮
```

---

## 常见失败点

| 失败现象 | 原因 | 解决方式 |
|---------|------|---------|
| 计数器最终值与原始数据不符 | JS 计算逻辑用了浮点近似 | 在 index.html 中硬编码目标值，不做运算 |
| 进度环显示为满圆 / 空圆 | `stroke-dashoffset` 公式错误 | 参考 `brand/motion-language.example.md` 的 progress_ring 公式 |
| 图表在 9:16 画布溢出 | 图表宽度按 16:9 设计 | canvas 宽度改为 `--canvas-w: 1080px`，图表宽度用百分比 |
| 数字被认为是随机生成 | 使用了 `Math.random()` 生成初始值 | 所有数字必须硬编码，禁止 `Math.random()` |
| 字幕是数字列表，非结论句 | Agent 直接复用了输入数据 | 在 brief.goal 补充："字幕必须是结论句，不能是原始数字罗列" |

---

## QA 检查点

```
[ ] index.html 中无 Math.random() 调用
[ ] 计数器目标值 == 输入数据中的原始数值（手动验证）
[ ] 进度环的 stroke-dashoffset 起始值 == circumference，终止值 == circumference * (1 - percent)
[ ] 图表动效在 paused timeline 中，可被 seek() 到任意帧
[ ] 字幕句子是结论（"增长了 X 倍"），不是原始数字列表（"值为 X、Y、Z"）
[ ] 9:16 布局下图表无溢出（overflow: hidden 有效）
```

---

## 输出验收标准

- `brief.json` 的 `input_type == "data"`，`source_materials` 包含数据来源
- `storyboard.json` 的每个图表场景中，`scene.visual` 描述了图表类型和动效
- `index.html` 中每种图表动效有对应的 GSAP tween，且全部注册在 `window.__timelines`
- 计数器/进度环最终值与输入数据 100% 一致
- `render-report.md` lint 状态 PASSED，无 determinism violation
