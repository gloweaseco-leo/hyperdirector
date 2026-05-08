# Workflow: Batch Video Production（批量生产）

用统一的策略、模板、品牌配置，生产一组主题相关的视频。本轮只定义拆分策略和执行规范，不实现自动化脚本。

---

## 适用场景

| 场景 | 示例 |
|-----|------|
| 内容矩阵（系列视频） | 每周一发，主题相关的 8 集系列 |
| 多平台版本 | 同一内容，生产 9:16 + 16:9 + 1:1 三个版本 |
| 多语言版本 | 中文版 + 英文版同内容 |
| A/B 测试变体 | 同一视频，Hook 不同，看哪个效果好 |
| 产品功能系列 | 每个功能一个 30s 视频，共 10 个 |

---

## 核心原则

```
1. 先定策略，再开始生产
   拆分逻辑、模板选择、brand-kit 必须在第一个视频开始前确定。
   中途改策略等于重来。

2. 一个任务 = 一个 output 目录
   每个视频有独立的 output/ 目录，互不污染。
   命名规则：output/video-01-hook-a/、output/video-01-hook-b/

3. shared brief，差异化 storyboard
   同系列视频共用一份 base-brief.json，每个视频在其基础上覆盖差异字段。
   不要每次从零写 brief.json。

4. 同一品牌配置贯穿全系列
   brand-kit.json 不随单个视频调整，所有视频共用。
```

---

## 输入材料

| 材料 | 必需 | 说明 |
|------|------|------|
| 拆分策略文档 | 是 | 说明这批视频如何划分（按主题/平台/语言/变体） |
| base-brief.json | 是 | 共用的 brief 基础（platform、aspect_ratio、tone、template、brand_kit） |
| 每个视频的差异项 | 是 | title、goal、storyboard 的差异点 |
| brand-kit.json | 是 | 全批次统一使用 |
| 素材清单 | 推荐 | 哪些视频需要截图、数据、特殊素材 |

---

## 推荐模板

批量生产优先在单一模板中完成。

| 批次目标 | 推荐模板 |
|---------|---------|
| 知识系列（技术/AI/行业） | `ai-knowledge-explainer-kit` |
| 产品功能系列 | `saas-demo-kit` |
| 观点/经验系列 | `tiktok-vertical-kit` |
| 混合批次 | 按单个视频类型选模板，但 brand-kit 统一 |

---

## 执行步骤

### 第一阶段：策略定义（必须在生产前完成）

```
① 确定批次目标
   - 这批视频的总体目标是什么？
   - 共几个视频？完成时间要求？

② 定义拆分逻辑
   选择一种主要拆分维度：
   A. 主题拆分：每个子主题一个视频
   B. 平台拆分：同内容，9:16 / 16:9 / 1:1 各一个
   C. 语言拆分：中文版 + 英文版
   D. 变体拆分：A/B 测试，Hook 不同其余相同
   E. 功能拆分：每个功能点一个视频

③ 建立 batch-plan.md
   列出每个视频的：ID、标题、拆分差异、输出目录名、负责 prompt、截止时间
   见下方模板

④ 创建 base-brief.json
   填写所有视频共用的字段，差异字段留空或标注 OVERRIDE

⑤ 确认 brand-kit.json
   批次中途不修改 brand-kit
```

### 第二阶段：逐个生产

```
对每个视频 video-N：

  ① 复制 base-brief.json → output/video-N/brief.json
  ② 填写差异字段（title、goal、storyboard 相关字段）
  ③ 运行对应 workflow（article-to-video / one-prompt-video 等）
  ④ 完成 QA，更新 batch-status.md 中该视频的状态为 DONE

按顺序生产，不要同时开多个视频的 Stage 05 Compose（避免文件混淆）
```

### 第三阶段：批次验收

```
① 检查所有 output/video-N/ 目录是否完整（brief.json、index.html、render-report.md）
② 汇总各视频的 lint 状态（PASSED / PARTIAL / FAILED）
③ 统一检查 brand 一致性（CSS 变量、字体、CTA 文案）
④ 更新 batch-status.md 中的最终状态
```

---

## batch-plan.md 模板

```markdown
# Batch Plan: [批次名称]

## 批次信息
- 总视频数: N
- 使用模板: ai-knowledge-explainer-kit
- 品牌配置: `brand/brand-kit.persona-zh.example.json`
- 默认平台: 微信视频号（9:16，30s）

## 视频清单

| ID | 标题 | 拆分差异 | 输出目录 | 状态 |
|----|------|---------|---------|------|
| video-01 | [标题] | [差异字段] | output/video-01/ | TODO |
| video-02 | [标题] | [差异字段] | output/video-02/ | TODO |
| video-03 | [标题] | [差异字段] | output/video-03/ | TODO |

## 共用 brief 字段（来自 base-brief.json）
- platform: video_wechat
- aspect_ratio: 9:16
- duration_seconds: 30
- tone: 专业、直给、有工程感
- template: ai-knowledge-explainer-kit
- brand_kit: persona-zh-example
```

---

## 目录结构

```
project/
├── base-brief.json         ← 所有视频共用
├── batch-plan.md           ← 拆分策略 + 进度表
├── batch-status.md         ← 每个视频的当前状态
├── brand/
│   └── brand-kit.json      ← 批次统一使用
└── output/
    ├── video-01/           ← 独立 output 目录
    │   ├── brief.json
    │   ├── storyboard.json
    │   ├── index.html
    │   ├── preview.html
    │   └── render-report.md
    ├── video-02/
    └── video-03/
```

---

## 生成文件

每个视频的 output 目录同对应的单视频 workflow。批次级别额外生成：

```
project/
├── batch-plan.md           ← 策略定义（第一阶段产物）
└── batch-status.md         ← 批次进度追踪（按视频更新）
```

---

## 用户可复制的调用示例

### A/B 测试变体

```
批量生产任务：A/B 测试

目标：同一内容，测试 2 种 Hook 风格哪个效果更好
内容：HyperDirector 是什么
平台：微信视频号，9:16，30s

视频 A（output/video-hook-a/）：
Hook 风格：强结论开场
Hook 文案："AI 视频生产，从 4 小时变成 4 分钟"

视频 B（output/video-hook-b/）：
Hook 风格：问题开场
Hook 文案："你还在用 PPT 配旁白做视频？"

其余场景（scene-02 到 scene-05）两个版本完全相同。
品牌配置：`brand/brand-kit.persona-zh.example.json`
```

### 多平台版本

```
批量生产任务：多平台适配

内容：已有 output/video-main/ 目录（9:16 版本）

生产以下版本：
- output/video-16x9/：16:9，45 秒，适合 YouTube / B 站
- output/video-1x1/：1:1，30 秒，适合朋友圈 / LinkedIn

文案和信息点相同，layout 按比例重新排布。
不使用 warm-iteration（比例变化属于重新构建）。
```

### 产品功能系列

```
批量生产 5 个功能介绍视频，每个 30 秒。

共用设置：
- 模板：saas-demo-kit，16:9
- 品牌：brand-kit.json（我们自己的）
- CTA：预约 demo，链接相同

功能列表：
1. video-feature-01：智能导入功能（截图：input/assets/feature-01.png）
2. video-feature-02：自动分析功能（截图：input/assets/feature-02.png）
3. video-feature-03：团队协作功能（截图：input/assets/feature-03.png）
4. video-feature-04：数据导出功能（截图：input/assets/feature-04.png）
5. video-feature-05：权限管理功能（截图：input/assets/feature-05.png）

请先生成 batch-plan.md，确认结构后再开始生产。
```

---

## 常见失败点

| 失败现象 | 原因 | 解决方式 |
|---------|------|---------|
| 各视频的 CSS 变量不一致 | 部分视频在 brief 阶段单独覆盖了品牌色 | 批次中 brand-kit 设为只读，所有颜色走 CSS 变量 |
| output 目录互相污染 | 两个视频共用了同一个 output 目录 | 严格执行命名规则：output/video-N/ 独立不重名 |
| 批次中途改了 base-brief | 某个视频需要调整，直接改了共用的 base-brief | 改的只能是 output/video-N/brief.json，不能改 base-brief.json |
| 语言版本中英文混用 | 多语言批次，某视频字幕中文英文混排 | 每个视频的 brief.language 和 brief.subtitle_language 单独设置 |
| 进度无法追踪 | 没有 batch-status.md | 每完成一个视频，立即更新 batch-status.md 中对应行的状态 |

---

## QA 检查点

```
[ ] batch-plan.md 存在，所有视频都有 ID 和输出目录
[ ] 每个 output/video-N/ 目录独立（无文件交叉）
[ ] 所有视频的 brand-used.json 中 brand_name 和 colors 一致
[ ] 所有视频的 lint 状态汇总到 batch-status.md
[ ] A/B 测试变体：非 Hook 场景的 storyboard.json diff 为空
[ ] 多平台版本：同一内容视频在不同比例下 headline 文案一致
```

---

## 输出验收标准

- `batch-plan.md` 存在且包含所有视频的 ID、标题、状态
- 每个 `output/video-N/` 目录包含 `brief.json`、`index.html`、`render-report.md`
- 所有视频的 `brand-used.json` 中品牌配置字段完全一致
- 无任何两个视频的 output 目录发生文件交叉引用
- `batch-status.md` 中所有视频状态为 `DONE` 或明确标注 `KNOWN_ISSUE`
