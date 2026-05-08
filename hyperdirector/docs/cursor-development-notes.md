# Cursor Development Notes

> 面向后续开发者的技术说明。说明 v0.1 的边界、核心文件的职责、以及如何安全地扩展功能。

---

## v0.1 边界说明

### 已完成（v0.1 In Scope）

| 功能模块 | 状态 | 位置 |
|---------|------|------|
| 能力判断（Capability Judge）| ✅ 完整 | `prompts/01-capability-judge.md` |
| Brief 生成 | ✅ 完整 | `prompts/02-intake-brief.md` |
| Storyboard 生成 | ✅ 完整 | `prompts/03-storyboard-generator.md` |
| 视觉设计（DESIGN.md 生成）| ✅ 完整 | `prompts/04-visual-design.md` |
| HTML 合成（HyperFrames）| ✅ 完整 | `prompts/05-compose-hyperframes.md` |
| QA Fix Loop | ✅ 完整 | `prompts/06-qa-fixer.md` |
| Render Report 生成 | ✅ 完整 | `prompts/07-render-report.md` |
| 迭代修改（Warm Iteration）| ✅ 完整 | `prompts/08-warm-iteration.md` |
| Brand Kit Schema | ✅ 完整 | `schemas/brand-kit.schema.json` |
| Brief Schema | ✅ 完整 | `schemas/brief.schema.json` |
| Storyboard Schema | ✅ 完整 | `schemas/storyboard.schema.json` |
| 3 个内置模板 | ✅ 完整结构 | `templates/` |
| 7 个 workflow 文档 | ✅ 完整 | `workflows/` |
| 5 个 QA 文档 | ✅ 完整 | `qa/` |
| 4 个校验脚本 | ✅ 完整 | `scripts/` |
| 3 个示例项目 | ✅ 完整 | `examples/zh-CN/` |
| 用户文档（zh-CN）| ✅ 完整 | `docs/` |

### 未完成 / 规划中（Not in v0.1）

| 功能 | 状态 | 规划版本 |
|------|------|---------|
| 批量视频生成 | 🔴 未实现 | v0.2 |
| 多模板 Composite | 🔴 未实现 | v0.2 |
| TTS 音频同步 | 🔴 未实现 | v0.2 |
| 云端渲染队列 | 🔴 未实现 | v0.3 |
| 模板市场 | 🔴 未实现 | v0.3+ |
| 英文文档 | 🟡 部分（en/ 目录有 README）| v0.2 |

---

## 核心文件职责（不要随便改这些）

### 绝对不要改

| 文件 | 原因 |
|------|------|
| `SKILL.md` | Hermes skill 入口，改动会导致 skill 无法加载或行为异常 |
| `AGENTS.md` | Agent 协作规则，改动可能破坏 Hermes 的任务分配逻辑 |
| `schemas/brief.schema.json` | Brief 字段约定，与所有 prompt 和脚本强耦合 |
| `schemas/storyboard.schema.json` | Storyboard 约定，与 compose-hyperframes prompt 强耦合 |
| `schemas/brand-kit.schema.json` | Brand Kit 约定，与 validate-brand-kit.js 强耦合 |
| `CAPABILITY_BOUNDARY.md` | 能力边界文件，改动影响能力判断和拒绝逻辑 |

### 可以谨慎修改

| 文件 | 注意事项 |
|------|---------|
| `prompts/*.md` | 修改 prompt 前先理解其在工作流中的位置；阶段 1–8 有顺序依赖 |
| `rules/*.md` | QA 规则修改后需重新测试示例项目的 lint 结果 |
| `upstream/*.md` | 这是 HyperFrames 知识库参考，轻易修改可能导致 HTML 生成出错 |
| `scripts/check-env.js` | 修改前确认测试通过，它是用户安装验证的第一道门 |

### 可以自由修改 / 新增

| 位置 | 内容类型 |
|------|---------|
| `docs/` | 用户文档 |
| `examples/` | 示例项目 |
| `qa/` | QA 清单和模板 |
| `brand/` | 示例 Brand Kit |
| `templates/*/customization-guide.md` | 模板自定义说明 |
| `scripts/validate-*.js` | 校验脚本（新增或扩展） |

---

## 如何新增模板

新增一个模板需要完成以下步骤：

### Step 1：创建模板目录

```
hyperdirector/templates/你的模板名/
├── README.md
├── prompt.md
├── DESIGN.md
├── customization-guide.md
├── variants/
│   ├── 15s.md
│   ├── 30s.md
│   └── 60s.md
└── assets/
    └── README.md
```

命名规范：`{目标场景}-kit`，例如 `education-course-kit`、`podcast-clips-kit`。

### Step 2：定义场景结构（`README.md`）

```markdown
# {模板名}

## 适用场景
...

## 默认场景结构

| 场景 | 时长建议 | Purpose | 目标 |
|------|---------|---------|------|
| Hook | 3–5s | hook | ... |
| ... | ... | ... | ... |

## 推荐时长
...
```

### Step 3：编写生成 Prompt（`prompt.md`）

```markdown
# {模板名} 生成 Prompt

你正在使用 {模板名} 模板生成视频。

## 场景规则
...

## 视觉约束
...

## 禁止事项
...
```

Prompt 必须遵循 `prompts/05-compose-hyperframes.md` 中定义的 HTML 结构规范：
- 每个 scene 有 `data-duration`、`data-purpose`、`data-transition` 属性
- GSAP timeline 注册到 `window.__hf_timeline`
- CSS 使用品牌颜色变量

### Step 4：注册到 Schema

在 `schemas/brief.schema.json` 的 `template` 枚举中添加新模板名：

```json
"template": {
  "enum": [
    "tiktok-vertical-kit",
    "saas-demo-kit",
    "ai-knowledge-explainer-kit",
    "你的新模板名"  // 添加这里
  ]
}
```

在 `schemas/storyboard.schema.json` 同样添加。

**注意：** Schema 修改是破坏性变更，会影响所有现有校验脚本。确保新模板名格式符合 `kebab-case`，且不与现有模板冲突。

### Step 5：更新 SKILL.md 和文档

在 `SKILL.md` 的"支持的模板"部分添加新模板描述。在 `docs/template-guide.md` 中添加新模板的选择指南和示例。

### Step 6：创建示例项目

```
examples/zh-CN/demo-{你的模板}-/
├── README.md
├── input/
│   └── {输入文件}
└── output/
    ├── brief.json
    ├── storyboard.json
    ├── ...（完整输出文件）
    └── assets/README.md
```

运行校验确认示例通过：

```bash
node scripts/validate-storyboard.js examples/zh-CN/demo-{模板名}/output/storyboard.json
```

---

## 如何新增 Workflow

Workflow 是特定输入类型到视频的端到端流程文档，存储在 `workflows/` 目录。

### 现有 Workflow 列表

| 文件 | 场景 |
|------|------|
| `article-to-video.md` | 文章转视频 |
| `product-page-to-demo.md` | 产品页转 demo |
| `github-repo-to-video.md` | GitHub README 转视频 |
| `prd-to-product-video.md` | PRD 转产品视频 |
| `data-chart-to-video.md` | 数据图表转视频 |
| `batch-video-production.md` | 批量视频制作 |
| `warm-iteration.md` | 迭代修改工作流 |

### Workflow 文件结构

```markdown
# {输入类型} → 视频 工作流

## 适用场景
...

## 前置要求
...

## 工作流步骤

### Step 1：输入分析
...

### Step 2：Brief 配置建议
- 推荐模板：...
- 推荐时长：...
...

### Step 3：特殊处理说明
...

## 示例 Prompt
...

## 已知限制
...
```

新增 workflow 只需按此格式创建 `.md` 文件，不需要修改 Schema 或 SKILL.md（除非有新的触发词需要注册）。

---

## 如何新增 QA 规则

QA 规则存储在 `rules/` 目录，分两类：

1. **运行时规则**（`rules/*.md`）：Hermes 在 QA Fix Loop 阶段读取，指导修复逻辑
2. **校验脚本**（`scripts/validate-*.js`）：Node.js 脚本，本地运行检查文件合规性

### 新增运行时规则

在 `rules/` 目录创建新 `.md` 文件：

```markdown
# {规则名称}

## 适用阶段
QA / Compose / Design

## 规则描述
...

## 检查项

| 检查项 | 正确示例 | 错误示例 |
|--------|---------|---------|
| ... | ... | ... |

## 自动修复方法
...

## 无法自动修复的情况
...
```

将新规则文件路径添加到 `prompts/06-qa-fixer.md` 的规则引用列表中，确保 Hermes 在 QA 阶段会读取它。

### 新增校验脚本

在 `scripts/` 目录创建 `validate-{名称}.js`。遵循现有脚本的规范：

```javascript
#!/usr/bin/env node
/**
 * HyperDirector {名称} Validator
 *
 * Usage:
 *   node hyperdirector/scripts/validate-{名称}.js <path-to-file.json>
 *
 * Exit codes:
 *   0 — passed
 *   1 — failed
 */

'use strict';
const fs   = require('fs');
const path = require('path');

// 使用与现有脚本相同的颜色常量
const RESET = '\x1b[0m';
const GREEN = '\x1b[32m';
const RED   = '\x1b[31m';
const YELLOW= '\x1b[33m';
const BOLD  = '\x1b[1m';

// 实现 pass() / fail() / warn() 函数（参考 validate-brief.js）

const filePath = process.argv[2];
// ... 检查逻辑 ...

// 退出时使用 process.exit(0) 或 process.exit(1)
```

**规范要求：**
- 只使用 Node.js 内置模块（`fs`、`path`），不引入 npm 依赖
- 支持命令行参数（`process.argv[2]`）
- 通过时输出明确的成功信息并 `exit(0)`
- 失败时输出明确的错误原因并 `exit(1)`
- 遵循现有脚本的颜色输出风格

---

## 如何贡献 Demo

每个 demo 演示一个真实用户场景，结构必须完整。

### Demo 目录结构

```
examples/zh-CN/demo-{场景名}/
├── README.md                    ← 说明场景、预览方式、渲染方式
├── input/
│   └── {输入文件.md}             ← 用户提供的原始内容
└── output/
    ├── brief.json               ← 必须通过 validate-brief.js
    ├── storyboard.json          ← 必须通过 validate-storyboard.js
    ├── script.md                ← 逐场景旁白文稿
    ├── DESIGN.md                ← 视觉设计说明
    ├── brand-used.json          ← 必须通过 validate-brand-kit.js
    ├── index.html               ← HyperFrames 合成（必须可以在浏览器打开）
    ├── preview.html             ← 预览入口（iframe 包装 index.html）
    ├── edit-instructions.md     ← 二次编辑指南
    ├── render-report.sample.md  ← 模拟渲染报告（标注 NOT EXECUTED）
    └── assets/
        └── README.md
```

### 贡献 Checklist

贡献 demo 前，运行完整校验：

```bash
# 校验所有 JSON 文件
node hyperdirector/scripts/validate-brief.js \
  examples/zh-CN/demo-你的示例/output/brief.json

node hyperdirector/scripts/validate-storyboard.js \
  examples/zh-CN/demo-你的示例/output/storyboard.json \
  examples/zh-CN/demo-你的示例/output/brief.json

node hyperdirector/scripts/validate-brand-kit.js \
  examples/zh-CN/demo-你的示例/output/brand-used.json

# 检查输出完整性
node hyperdirector/scripts/check-output-contract.js \
  examples/zh-CN/demo-你的示例/output/

# 在浏览器中打开 index.html，确认动画正常播放
```

**必须通过：**
- ✅ `validate-brief.js` 零错误
- ✅ `validate-storyboard.js` 零错误，时长无偏差
- ✅ `validate-brand-kit.js` 零错误
- ✅ `index.html` 在浏览器中能播放动画（点击画面）
- ✅ `preview.html` 能正常加载
- ✅ `render-report.sample.md` 标注 "NOT EXECUTED"（不要声称已渲染）

**render-report.sample.md 注意：**

```markdown
> ⚠️ 声明：本报告为模拟样本，未实际执行渲染。
```

这一行必须出现在报告顶部，避免误导用户。

### Demo 命名规范

- 目录名：`demo-{内容类型}-{场景特征}`（全小写 kebab-case）
- 示例：`demo-article-to-video`、`demo-saas-product`、`demo-github-repo`
- 不要用真实客户品牌名作为目录名（`demo-acme-corp-real-client` ❌）

---

## 工作流阶段依赖关系

以下是 8 个 prompt 阶段的执行顺序和依赖：

```
01-capability-judge.md
  ↓（通过 → 继续，拒绝 → 停止）
02-intake-brief.md
  ↓（输出 brief.json）
03-storyboard-generator.md
  ↓（输出 storyboard.json）
04-visual-design.md
  ↓（输出 DESIGN.md）
05-compose-hyperframes.md
  ↓（输出 index.html）
06-qa-fixer.md
  ↓（循环最多 3 次，输出 qa-report.md）
07-render-report.md
  ↓（输出 render-report.md）
08-warm-iteration.md ← 二次迭代时从这里开始
```

**修改 prompt 的注意事项：**
- 每个 prompt 依赖前一阶段的输出（brief.json → storyboard.json → ...）
- 不要在某个阶段 prompt 中假设后续阶段的文件已存在
- `06-qa-fixer.md` 会循环执行，确保修复指令幂等（重复执行不产生副作用）

---

## 本地开发和测试

### 运行所有示例的完整校验

```bash
# 校验 demo-article-to-video
node hyperdirector/scripts/validate-brief.js \
  hyperdirector/examples/zh-CN/demo-article-to-video/output/brief.json
node hyperdirector/scripts/validate-storyboard.js \
  hyperdirector/examples/zh-CN/demo-article-to-video/output/storyboard.json \
  hyperdirector/examples/zh-CN/demo-article-to-video/output/brief.json

# 校验 demo-saas-product
node hyperdirector/scripts/validate-storyboard.js \
  hyperdirector/examples/zh-CN/demo-saas-product/output/storyboard.json \
  hyperdirector/examples/zh-CN/demo-saas-product/output/brief.json

# 校验 demo-github-repo
node hyperdirector/scripts/validate-storyboard.js \
  hyperdirector/examples/zh-CN/demo-github-repo/output/storyboard.json \
  hyperdirector/examples/zh-CN/demo-github-repo/output/brief.json
```

### 验证 Schema 一致性

当修改 Schema 文件时，手动确认现有示例仍能通过校验脚本。Schema 是向后兼容的——新增字段时设置为 optional，不要删除已有字段。

---

## 版本管理建议

- `hyperdirector/` 内的所有文件都应该进入版本控制
- `output/` 目录（生成的视频项目）不应进入版本控制（`.gitignore`）
- `brand-kit.json`（用户配置）不应进入版本控制

`.gitignore` 建议：

```
output/
brand-kit.json
*.mp4
```

---

## 已知技术债务（v0.1）

| 问题 | 影响 | 计划修复时间 |
|------|------|------------|
| `storyboard.schema.json` 中 `purpose` 枚举不含所有模板的 purpose 值（如 `big_claim`、`action`）| validate-storyboard.js 对 demo-github-repo 的 `big_claim` 和 `action` 会报警告 | v0.2 |
| `index.html` 中 GSAP CDN 使用 integrity hash，但 hash 可能随 CDN 版本更新失效 | 离线或 CDN 切换时 GSAP 加载失败 | v0.2（改为本地 bundle）|
| Emoji 图标在无头渲染环境中渲染不一致 | demo-github-repo 的用户类型图标 | v0.2（改为 SVG）|

---

*本文档最后更新：2026-05-07 · HyperDirector v0.1*
