# Workflow: GitHub Repo to Video

将开源项目的 README、功能说明、release notes 转化为项目发布视频或项目介绍视频。

---

## 适用场景

| 内容来源 | 典型示例 |
|---------|---------|
| GitHub README | 项目介绍、What/Why/How 结构 |
| Release Notes | 新版本发布公告视频 |
| 项目 docs | 快速上手、架构说明 |
| arXiv / 技术报告 | 研究项目的视觉化摘要 |
| Hackathon 项目 | 演示视频 / Pitch 视频 |

---

## 输入材料

| 材料 | 必需 | 说明 |
|------|------|------|
| README.md 内容 | 是 | 粘贴或提供 GitHub URL |
| Release Notes（可选） | 否 | 如果是新版本，提供 changelog |
| 架构图 / 截图 | 推荐 | 项目界面截图、架构图、流程图 |
| Star 数 / 使用场景数据 | 否 | 作为数据类内容增强说服力 |
| 推荐视频角度 | 推荐 | "项目是什么"或"新版本改了什么"或"怎么快速上手" |

**输入文件位置：** `input/readme.md`（README 内容），`input/assets/`（截图）

---

## 推荐模板

| 视频角度 | 推荐模板 | 说明 |
|---------|---------|------|
| 项目介绍 / What+Why+How | `ai-knowledge-explainer-kit` | 架构感、信息密度高 |
| 新版本发布 / release | `tiktok-vertical-kit` | 快节奏，三大变化，有冲击力 |
| 产品化开源工具 demo | `saas-demo-kit` | 有 UI 界面、有使用流程 |

---

## 执行步骤

```
准备阶段（用户操作）
  ① 把 README 内容保存到 input/readme.md（或粘贴）
  ② （可选）截图/架构图放入 input/assets/
  ③ 确定视频角度：介绍项目 / 发布新版本 / 快速上手

Stage 01 — Capability Judge
  ↓ task_type = github_repo_to_video → suitable
  ↓ 根据角度推断 template

Stage 02 — Intake Brief
  ↓ 从 README 提取：项目名、核心能力（What）、解决问题（Why）、使用方式（How）
  ↓ title = repo_name + 视频角度
  ↓ input_type = "document"
  ↓ source_materials = [{ type: "document", path_or_url: "input/readme.md", use_for: "script_source" }]
  ↓ 写入 output/brief.json

Stage 03 — Storyboard Generator
  ↓ 按 README 提取 What / Why / How / 上手步骤 / Star 数据
  ↓ hook: 最冲击的项目能力（一句话，配数据）
  ↓ 中间场景: Why this → What is it → How it works → 使用场景或代码效果
  ↓ cta: GitHub 链接 / Star / 试用
  ↓ 写入 output/storyboard.json + output/script.md

Stage 04 — Visual Design
  ↓ 技术感视觉系统；代码块、终端截图优先
  ↓ 写入 output/DESIGN.md

Stage 05 — Compose HyperFrames
  ↓ 流程图 / 架构图用 CSS 绘制（无法用图片时）
  ↓ 写入 output/index.html + output/preview.html

Stage 06 — QA Fixer → Stage 07 — Render Report
```

---

## 生成文件

```
output/
├── brief.json            ← input_type: "document"
├── storyboard.json       ← 5–6 场景：hook、why、what、how、上手、cta
├── script.md
├── DESIGN.md             ← 技术感视觉系统说明
├── index.html
├── preview.html
├── brand-used.json
├── render-report.md
└── assets/
    ├── architecture.png  ← 如有提供
    └── screenshot-*.png
```

---

## 用户可复制的调用示例

### 项目介绍视频

```
用 HyperDirector 把这个开源项目的 README 做成 30 秒介绍视频。

模板：ai-knowledge-explainer-kit，9:16
平台：微信视频号

--- README 内容开始 ---
[粘贴 README.md 内容]
--- README 内容结束 ---

重点：这个项目解决了什么问题，怎么工作，Star 数 / 用户数作为信任信号
CTA：GitHub 链接，附架构图 input/assets/arch.png
```

### 新版本发布视频

```
用 HyperDirector 把这个 v2.0 release notes 做成 30 秒发布视频。

模板：tiktok-vertical-kit，9:16
重点：3 个最重要的新功能，各用一句话说清楚
语气：兴奋但克制，技术感强
CTA：升级到 v2.0，链接在 GitHub Release 页面

--- Release Notes ---
[粘贴 release notes 内容]
```

### 快速上手视频

```
把这个项目的快速上手流程做成 45 秒视频。

角度：开发者第一次使用，从 clone 到跑起来需要几步
模板：ai-knowledge-explainer-kit，步骤卡风格
核心步骤：install → config → run → 看到效果

[粘贴 Getting Started 部分]
```

---

## 常见失败点

| 失败现象 | 原因 | 解决方式 |
|---------|------|---------|
| 视频内容太技术 / 看不懂 | README 面向开发者，未做受众转化 | 在 brief 中补充 audience 和 tone，避免直接复用 README 术语 |
| 架构图在视频里太小 | 复杂图在 1080px 画布里信息密度过高 | 拆解架构图为 2–3 个步骤卡，每步一个 scene |
| Hook 是项目名，无冲击力 | README 第一句话是"XX is a tool for..." | 让 Agent 从项目描述中提炼最强结论，放到 hook |
| 代码片段无法显示 | 代码字体小，移动端不可读 | 只展示关键代码（1–3 行），字号 ≥ 28px |

---

## QA 检查点

```
[ ] brief.json 的 input_type == "document"
[ ] 项目名称出现在 storyboard.json 的 scenes[0].headline 中
[ ] hook 场景包含项目的核心价值（不是"项目名 + is a tool"）
[ ] CTA 场景包含明确的 GitHub 链接或行动指引
[ ] 架构图资源路径有效（或有占位符注释）
[ ] index.html 代码块字号 ≥ 28px（移动端可读）
```

---

## 输出验收标准

- `brief.json` 的 `source_materials` 包含 README 路径或 URL
- `storyboard.json` 的 hook 场景用一句话说清楚"项目解决什么问题"
- `storyboard.json` 的 cta 场景包含 GitHub URL 或行动引导文案
- `render-report.md` 中 lint 状态为 PASSED 或 PARTIAL
- `preview.html` 打开后，技术流程卡或步骤序号清晰可见
