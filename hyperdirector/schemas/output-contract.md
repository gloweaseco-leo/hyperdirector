# HyperDirector Output Contract

> Version: v0.1  
> Scope: 每次 `hyperdirector run` 执行后，在 `output/` 目录内生成的标准文件集合。  
> 用途: 本文档是 Agent 与人类审阅者之间关于"输出物"的契约——哪些文件必须存在、格式是什么、谁来消费它。

---

## 标准输出目录结构

```
output/
├── final.mp4               # 最终渲染视频（可选，需渲染环境支持）
├── preview.html            # 单文件可播放预览（含内联资源）
├── index.html              # 可播放 HTML 合成主文件（分离资源引用）
├── DESIGN.md               # 视觉设计决策说明文档
├── storyboard.json         # 结构化分镜（符合 storyboard.schema.json）
├── script.md               # 旁白/字幕脚本（Markdown，每场景一节）
├── brief.json              # 本次任务结构化 Brief（符合 brief.schema.json）
├── brand-used.json         # 本次渲染实际使用的品牌配置快照
├── render-report.md        # 渲染与 Lint 报告（人类可读版）
├── edit-instructions.md    # 用户已提交或建议的二次编辑指令存档
└── assets/                 # 本视频使用的所有媒体资源
    ├── logo.*              # 品牌 Logo（PNG / SVG）
    ├── screenshot-*.png    # 产品截图等来源素材
    ├── bg-*.{png,jpg,mp4}  # 背景图或视频
    └── ...                 # 其他资源文件
```

---

## 每个文件的用途说明

### `final.mp4`

| 项目 | 说明 |
|------|------|
| **必需** | 否（依赖渲染环境，HTML-only 模式下可缺失） |
| **生成方** | Puppeteer + ffmpeg 渲染流程 |
| **消费方** | 内容发布、人类审阅 |
| **验收标准** | 时长 = `brief.duration_seconds ± 0.5s`；分辨率符合 `aspect_ratio` |

MP4 是最终交付物。若渲染环境不支持（如纯 Agent 模式），则以 `index.html` 作为等价交付。

---

### `preview.html`

| 项目 | 说明 |
|------|------|
| **必需** | 是 |
| **生成方** | Composer 在 `index.html` 完成后自动打包 |
| **消费方** | 人类用浏览器直接打开预览，无需本地服务器 |
| **验收标准** | 所有资源内联或使用相对路径；可离线播放 |

`preview.html` 是自包含单文件，适合发给非技术人员审阅。所有 CSS、JS、图片均应内联或打包。

---

### `index.html`

| 项目 | 说明 |
|------|------|
| **必需** | 是 |
| **生成方** | Composer（主生成产物） |
| **消费方** | 渲染引擎（Puppeteer）、Lint 检查、Agent 二次编辑 |
| **验收标准** | 每个 scene 元素有 `data-duration` 属性；场景总时长 = `brief.duration_seconds ± 0.5s`；通过 WCAG AA 对比度检查 |

`index.html` 是核心合成文件，结构由模板定义，是 Lint 和渲染的直接输入。

---

### `DESIGN.md`

| 项目 | 说明 |
|------|------|
| **必需** | 是 |
| **生成方** | Composer（生成 `index.html` 时同步输出） |
| **消费方** | 人类设计审阅、Agent 二次编辑上下文 |

记录本次视频的视觉决策，包括：
- 使用的调色板和字体选择
- 动画风格与节奏决策
- 与品牌 Kit 的偏差说明（如有）
- 各场景的布局逻辑

---

### `storyboard.json`

| 项目 | 说明 |
|------|------|
| **必需** | 是 |
| **Schema** | [`storyboard.schema.json`](./storyboard.schema.json) |
| **生成方** | Director Agent（Storyboard 阶段） |
| **消费方** | Composer、Lint 检查、Agent 编辑 |
| **验收标准** | 通过 `storyboard.schema.json` 校验；`total_duration` 等于所有 `scenes[].duration` 之和 |

分镜是 Agent 工作流的核心中间产物，介于 Brief 和 HTML 之间。

---

### `script.md`

| 项目 | 说明 |
|------|------|
| **必需** | 是 |
| **生成方** | Director Agent（与 Storyboard 同步生成） |
| **消费方** | TTS 引擎、字幕生成、人类审阅 |

每个场景对应一个 Markdown 节（`## scene_01`），包含：
- `**Headline:**` 屏幕标题
- `**Caption:**` 字幕文本
- `**Narration:**` 旁白脚本（若有 TTS 需求）

---

### `brief.json`

| 项目 | 说明 |
|------|------|
| **必需** | 是 |
| **Schema** | [`brief.schema.json`](./brief.schema.json) |
| **生成方** | Director Agent（任务开始时） |
| **消费方** | 所有后续阶段的上下文输入；人类可修改后重新运行 |
| **验收标准** | 通过 `brief.schema.json` 校验；`template`、`aspect_ratio`、`platform` 字段必填 |

Brief 是整个生成流程的起点。保存到输出目录，确保结果可复现。

---

### `brand-used.json`

| 项目 | 说明 |
|------|------|
| **必需** | 是 |
| **Schema** | [`brand-kit.schema.json`](./brand-kit.schema.json) |
| **生成方** | Director Agent（从 brand-kit.json 加载后写入快照） |
| **消费方** | 审计追踪、二次编辑一致性保证 |

`brand-used.json` 是本次渲染实际使用的品牌配置**快照**（非符号链接）。记录实际值，防止品牌 Kit 更新后影响历史输出的可复现性。

---

### `render-report.md`

| 项目 | 说明 |
|------|------|
| **必需** | 是 |
| **Schema（JSON 版）** | [`render-report.schema.json`](./render-report.schema.json) |
| **生成方** | Validator / Render 阶段 |
| **消费方** | 人类审阅；CI 质量门禁 |

人类可读的 Markdown 渲染报告，内容包含：
- Lint 结果汇总（Pass / Fail + 问题列表）
- Preview 验证结果
- MP4 渲染状态
- 已自动修复的问题列表
- 剩余已知问题及建议解法

---

### `edit-instructions.md`

| 项目 | 说明 |
|------|------|
| **必需** | 否（首次生成时可能为空模板） |
| **Schema（JSON 版）** | [`edit-request.schema.json`](./edit-request.schema.json) |
| **生成方** | 用户或 Agent 在二次编辑时写入 |
| **消费方** | Director Agent 在编辑模式下读取 |

存档所有针对本项目的编辑指令历史。每条编辑指令记录格式：

```markdown
## Edit v2 — 2026-05-07

**类型**: copy_rewrite  
**目标场景**: scene_02, scene_05  
**指令**: 将 Headline 语气调整为更口语化，保留品牌色和字体  
**状态**: 已应用  
```

---

### `assets/`

| 项目 | 说明 |
|------|------|
| **必需** | 是（目录必须存在，内容可为空） |
| **生成方** | 用户提供 + Composer 拷贝/生成 |
| **消费方** | `index.html`、`preview.html`、`final.mp4` |

所有媒体资源均以**相对路径**从 `output/` 根目录引用（如 `assets/logo.png`）。资源文件命名规范：

| 文件 | 命名格式 |
|------|---------|
| Logo | `logo.{png,svg}` |
| 产品截图 | `screenshot-{nn}.png` |
| 背景图 | `bg-{name}.{jpg,png}` |
| 背景视频 | `bg-{name}.mp4` |
| Lottie 动画 | `anim-{name}.json` |
| 背景音乐 | `music-{name}.mp3` |

---

## 输出完整性检查清单

在 `render-report.md` 中，Agent 应确认以下所有项均满足：

- [ ] `index.html` 存在且可在浏览器打开
- [ ] `storyboard.json` 通过 schema 校验
- [ ] `brief.json` 通过 schema 校验
- [ ] `brand-used.json` 通过 schema 校验
- [ ] `storyboard.json` 的 `total_duration` = 所有 scenes 时长之和（±0.5s）
- [ ] `index.html` 中所有 `data-duration` 属性值之和 = `brief.duration_seconds`（±0.5s）
- [ ] 所有 `assets/` 引用文件实际存在
- [ ] `preview.html` 可离线打开
- [ ] `DESIGN.md` 已生成
- [ ] `script.md` 已生成，包含所有场景
- [ ] `render-report.md` 已生成

---

## 设计约束

1. **路径一律使用相对路径**：`output/` 内的所有文件互相引用时使用相对路径，确保目录可整体移动。
2. **不写入 `output/` 以外的位置**：Agent 的写操作必须限制在 `output/` 目录内（及 `output/assets/` 子目录）。
3. **幂等性**：重新运行 `hyperdirector run` 应覆盖输出，而非追加。`edit-instructions.md` 为唯一追加文件。
4. **编码**：所有文本文件使用 UTF-8 无 BOM 编码。
5. **JSON 格式**：所有 `.json` 文件使用 2 空格缩进，末尾无多余空行。
