# Workflow: PRD to Product Video

将产品需求文档（PRD）、产品方案、业务蓝图转化为对内或对外的产品介绍视频。

---

## 适用场景

| 应用场景 | 受众 | 目的 |
|---------|------|------|
| 向管理层汇报产品方案 | 高管、决策者 | 讲清楚方案背景、解法、价值 |
| 向研发团队传递产品理解 | 工程师、设计师 | 对齐需求，减少沟通成本 |
| 向投资人展示产品愿景 | 投资人、合作伙伴 | 建立信任，传达差异化 |
| 新产品对外发布 | 目标用户 | 预热、种草、驱动转化 |
| 业务蓝图全员对齐 | 跨部门团队 | 统一认知，明确优先级 |

---

## 输入材料

| 材料 | 必需 | 说明 |
|------|------|------|
| PRD 或产品方案文档 | 是 | 粘贴核心章节或完整文档 |
| 视频受众 | 是 | 对内（汇报）还是对外（发布）？受众不同，角度和语气完全不同 |
| 核心价值主张 | 推荐 | "这个产品解决什么问题，价值在哪里"（一句话） |
| 竞品对比数据 | 否 | 有则增强说服力 |
| UI 截图 / 线框图 | 否 | 提供则作为演示配图 |

**输入文件位置：** `input/prd.md`（或 `input/product-brief.md`）

---

## 推荐模板

| 场景 | 推荐模板 | 说明 |
|-----|---------|------|
| 对外产品发布（有 UI） | `saas-demo-kit` | 有截图位、有功能卡 |
| 对内汇报（方案逻辑为主） | `ai-knowledge-explainer-kit` | 流程图、步骤卡，信息密度高 |
| 新产品预热（品牌感强） | `tiktok-vertical-kit` | 快节奏，3 个价值点 |

---

## 执行步骤

```
准备阶段（用户操作）
  ① 明确"这个视频给谁看、要他们做什么决定或行动"
  ② 从 PRD 中找出最重要的 3–5 个观点（不是功能列表）
  ③ 把 PRD 核心章节保存到 input/prd.md

Stage 01 — Capability Judge
  ↓ task_type = prd_to_product_video → suitable
  ↓ 若 PRD 含 20+ 个功能需求 → degraded（建议拆成多个视频）

Stage 02 — Intake Brief
  ↓ 从 PRD 中提取：背景（why now）、解法（what）、价值（impact）
  ↓ input_type = "document"
  ↓ audience = 用户指定的受众（对内 / 对外）
  ↓ tone = 对内：专业直给；对外：有感染力
  ↓ goal = "让[受众]理解[产品方案]，并[期望的行动]"
  ↓ 写入 output/brief.json

Stage 03 — Storyboard Generator
  ↓ 对内方案结构：
    scene_01 (hook): 现状问题 + 为什么现在要解决
    scene_02: 方案概览 + 核心设计原则
    scene_03–04: 2 个关键功能 / 设计决策 + 影响
    scene_05 (cta): 下一步行动 / 里程碑 / 期望反馈
  ↓ 对外产品结构（同 product-page-to-demo）
  ↓ 写入 output/storyboard.json + output/script.md

Stage 04 — Visual Design
  ↓ 对内：克制、信息密度高、数据优先
  ↓ 对外：品牌感、有记忆点、CTA 明确
  ↓ 写入 output/DESIGN.md

Stage 05 — Compose HyperFrames → Stage 06 — QA Fixer → Stage 07 — Render Report
```

---

## 生成文件

```
output/
├── brief.json            ← audience 字段明确对内/对外
├── storyboard.json       ← 5–6 场景，依据受众结构不同
├── script.md             ← 字幕文案（非 PRD 原文）
├── DESIGN.md
├── index.html
├── preview.html
├── brand-used.json
├── render-report.md
└── assets/
    ├── screenshot-*.png  ← UI 截图（如有）
    └── README.md
```

---

## 用户可复制的调用示例

### 对内汇报视频

```
用 HyperDirector 把这份产品方案做成 45 秒对内汇报视频。

受众：技术总监 + 产品负责人
目的：让他们理解我们为什么要做这个功能，以及预计价值
模板：ai-knowledge-explainer-kit，16:9
语气：专业直给，数据驱动，不需要情绪

关键观点（我已提炼好，请按这 3 点组织分镜）：
1. 当前方案的核心问题：[一句话]
2. 我们的解法：[一句话]
3. 预期收益：[数字/指标]

[粘贴 PRD 相关章节]
```

### 对外产品发布视频

```
用 HyperDirector 把这个产品方案做成 30 秒对外发布视频。

受众：目标用户（企业运营人员）
目的：预热，引导预约 demo
模板：saas-demo-kit，16:9
语气：专业、有期待感、CTA 明确
截图：input/assets/ui-preview.png

产品名：[产品名]
核心解决的问题：[一句话]
3 个功能点：[功能1] / [功能2] / [功能3]
CTA：点击申请内测资格
```

### 业务蓝图对齐视频

```
把这份业务蓝图做成 60 秒全员对齐视频。

受众：全公司（含运营、销售、研发）
目的：让所有人理解今年的产品方向和各自的关联
模板：ai-knowledge-explainer-kit，16:9
语气：清晰、权威、鼓励

结构要求：
- 为什么这件事重要（现状+趋势）
- 今年我们要做什么（3 个方向）
- 各团队怎么协作（流程图）
- 第一个里程碑是什么

[粘贴业务蓝图核心章节]
```

---

## 常见失败点

| 失败现象 | 原因 | 解决方式 |
|---------|------|---------|
| 视频像 PPT 页面截图 | PRD 内容直接搬运，未转化为叙事 | 要求 Agent 按"问题→解法→影响"重新组织叙事，非原文罗列 |
| 功能太多，信息爆炸 | PRD 包含大量功能点 | 只取 3 个最重要功能，其余放 brief.constraints.forbidden_content 或注释 |
| 对内视频口吻像广告 | 语气设置错误 | brief.tone 改为"专业、直给、数据驱动"，避免使用感叹号 |
| 场景字幕是 PRD 需求原文 | 未做语言转换 | 在 prompt 中明确"字幕用口语化短句，不超过 20 字" |

---

## QA 检查点

```
[ ] brief.json 的 audience 字段明确标注受众（不能是"用户"这类泛称）
[ ] brief.json 的 goal 包含期望的受众行动（对内：做决策；对外：点击/申请）
[ ] storyboard.json 的 scenes 结构符合对内/对外对应的模板场景顺序
[ ] script.md 中没有出现"产品需求文档中提到"这类语言（PRD 转化失败的信号）
[ ] 核心数据指标出现在 headline 或 caption 中（不能藏在 notes 里）
```

---

## 输出验收标准

- `brief.json` 的 `audience` 和 `tone` 准确对应汇报对象
- `storyboard.json` 的 hook 场景表达"现状问题"或"价值主张"，不是产品名称
- `script.md` 每场景字幕为完整短句，非 PRD 章节摘录
- `render-report.md` lint 状态 PASSED 或 PARTIAL
- `preview.html` 中字幕与视觉内容同步，无明显空白场景
