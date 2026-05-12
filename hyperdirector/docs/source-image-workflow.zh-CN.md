# Source Image Pipeline 工作流

> 版本：v0.1.3-preview  
> 适用：HyperDirector + Hermes（Cursor Agent）  
> 规则参考：`rules/image-assets-basics.md`  
> Schema：`schemas/asset-manifest.schema.json`  
> QA 检查：`qa/image-asset-checklist.md`

---

## 概述

Source Image Pipeline 定义了 Hermes 从**源文件或源目录**中识别、整理、绑定和渲染图片资产的完整流程。

核心原则：

- **生产渲染优先使用本地图片资产**。远程 URL 仅允许出现在草稿/规划阶段。
- 不接入 AI 生图服务作为默认环节。
- 不提交真实图片素材到版本控制。`asset-manifest.json` 是资产的元数据声明，不是素材本身。
- 资产就绪（`render_safe: true`）后方可渲染。

---

## 阶段一：识别（Identify）

### 1.1 接受输入

Hermes 接受以下任意格式的图片资产输入：

| 输入类型 | 示例 |
|----------|------|
| 单张本地图片路径 | `assets/hero.png` |
| 本地图片目录 | `assets/images/` |
| 已导出的 PDF / PPTX 截图目录 | `assets/slides/` |
| UI 截图（PNG/WebP） | `assets/screenshots/` |
| 品牌手册导出 | `brand/logo.svg`, `brand/palette.png` |

### 1.2 自动识别规则

遇到以下模式时，Hermes 将主动识别并建议录入 Asset Manifest：

- 目录中存在 `.png` / `.jpg` / `.webp` / `.svg` 文件
- Brief 或 Storyboard 中出现 `visual` / `image` / `screenshot` 字段引用路径
- 用户指令中提到"图片"、"截图"、"Logo"、"背景图"等关键词

### 1.3 不识别的情况

Hermes **不会**主动搜索以下内容：

- 系统目录或用户桌面上的随机图片
- 远程 URL 不在 Brief 中明确声明的图片
- AI 生图服务的输出（需用户显式确认后方可收录）

---

## 阶段二：整理（Organize）

### 2.1 建立目录结构

```
output/
  assets/
    images/          ← 原始/源图片（不提交大文件至 git）
    images/variants/ ← 压缩版本、裁剪版本
  asset-manifest.json
  index.html
  brief.json
  storyboard.json
```

### 2.2 命名规范

- 使用 `snake_case`，全小写，无空格
- 格式：`<role>_<描述>_<序号>.<ext>`
- 示例：`hero_image_dashboard_01.png`、`brand_logo.svg`、`scene02_background.webp`

### 2.3 版本控制注意

将以下内容加入 `.gitignore`，**不要提交真实图片**：

```gitignore
output/assets/images/
output/assets/images/variants/
```

在 `asset-manifest.json` 中用元数据声明资产来源，而不是提交文件本身。

---

## 阶段三：建立 Asset Manifest

### 3.1 初始化 asset-manifest.json

在 `output/` 目录下创建 `asset-manifest.json`，严格遵守 `schemas/asset-manifest.schema.json`：

```json
{
  "$schema": "../hyperdirector/schemas/asset-manifest.schema.json",
  "project": "saas-product-launch-q2",
  "version": "0.1.0",
  "created_at": "2026-05-12",
  "updated_at": "2026-05-12",
  "assets": []
}
```

### 3.2 逐项录入资产

每个资产按以下顺序填写字段：

1. `asset_id` — 唯一标识符（snake_case）
2. `type` — 固定为 `"image"`
3. `role` — 从枚举中选择（若无合适项，用 `"custom"` + `custom_role`）
4. `source` — 来源描述（人可读，记录提供方与日期）
5. `local_path` — 相对于 `output/` 的本地路径（先填规划路径，文件就位后验证）
6. `format` / `width` / `height` / `size_bytes` — 文件属性（可从文件属性获取）
7. `has_alpha` — PNG/WebP 是否有透明通道
8. `license_status` — 版权状态，必须明确
9. `render_safe` — 初始填 `false`，就绪后改 `true`
10. `bindings` — 绑定到哪些场景/镜头/插槽

### 3.3 role 枚举选择指南

| 资产类型 | 推荐 role |
|----------|-----------|
| 全屏背景图 | `background` |
| 企业/产品 Logo | `logo` |
| 悬浮在场景上的半透明图层 | `overlay` |
| 产品主视觉大图 | `hero_image` |
| 应用界面截图 | `ui_screenshot` |
| PDF 或 PPTX 导出页面 | `document_page` |
| 数据图表 | `chart` |
| 架构图、流程图 | `diagram` |
| 人物照片 | `character_photo` |
| 产品实物照片 | `product_photo` |
| 场景缩略预览 | `scene_thumbnail` |
| 图标（单色或彩色） | `icon` |
| 材质贴图 | `texture` |
| 仅供参考、不直接渲染 | `reference_only` |
| 不确定类型 | `unknown`（后续更新） |
| 项目专属分类 | `custom` + `custom_role` |

### 3.4 填写 bindings

将资产与 storyboard 场景关联：

```json
"bindings": [
  {
    "scene_id": "scene_02",
    "shot_id": "scene_02-shot-01",
    "slot": "main_visual",
    "usage": "ui_screenshot",
    "priority": 1
  },
  {
    "scene_id": "scene_04",
    "slot": "product_overlay",
    "usage": "product_hero",
    "priority": 1
  }
]
```

- `scene_id` 必须与 `storyboard.json` 中 scene 的 `id` 字段完全匹配
- `slot` 与 HTML 中的 element id 或 class 对应，方便 Hermes 在合成时自动定位插槽
- 一张图片可绑定多个 scene

---

## 阶段四：变体管理（Variants）

### 4.1 何时需要变体

- 原图超过 5 MB（R-IMG-06：需要压缩版用于渲染）
- 需要多个裁剪比例（9:16 / 16:9 / 1:1）
- 需要缩略图（用于 `scene_thumbnail` slot）
- 原图为 PNG，需要提供 WebP 版本以减小文件体积

### 4.2 变体命名示例

| 原图 | 变体用途 | 变体路径 |
|------|----------|----------|
| `hero_01.png` (1920×1080, 8 MB) | 渲染用 WebP | `assets/images/variants/hero_01_1920.webp` |
| `hero_01.png` | 缩略图 | `assets/images/variants/hero_01_thumb.webp` |
| `background.jpg` | 9:16 裁剪 | `assets/images/variants/background_9x16.jpg` |

### 4.3 在 Manifest 中声明变体

```json
"variants": [
  {
    "variant_id": "webp_1920",
    "local_path": "assets/images/variants/hero_01_1920.webp",
    "format": "webp",
    "width": 1920,
    "height": 1080,
    "size_bytes": 380000,
    "use_for_render": true
  }
]
```

将 `use_for_render: true` 的变体路径用于合成 HTML 中，原图仅作归档。

---

## 阶段五：合成 HTML 绑定

### 5.1 在 index.html 中引用图片

```html
<!-- 推荐：本地路径 + alt -->
<img src="assets/images/hero_01_1920.webp" alt="Product dashboard hero shot" />

<!-- 背景图 -->
<div class="scene" style="background-image: url('assets/images/background.webp');"></div>
```

**严禁（生产渲染）：**
```html
<!-- 远程 URL 在生产中禁止 -->
<img src="https://example.com/hero.png" />
<div style="background-image: url('https://cdn.example.com/bg.jpg');"></div>
```

### 5.2 slot 命名约定

HTML element 的 id 或 class 应与 `bindings.slot` 保持一致，方便 Hermes 自动替换内容：

```html
<div id="main_visual" class="scene-layer">
  <img src="assets/images/hero_01_1920.webp" alt="..." />
</div>
```

---

## 阶段六：就绪校验（render_safe 确认）

### 6.1 自动辅助扫描

```bash
node hyperdirector/scripts/check-composition-hazards.js output/index.html
```

扫描内容：
- `<img src>` 使用远程 URL → WARNING
- CSS `background-image` 使用远程 URL → WARNING
- `<img>` 缺少 `alt` → WARNING
- SVG 外链引用 → WARNING
- 本地图片路径不存在 → WARNING
- 本地图片文件超过 5 MB → WARNING（建议压缩）

### 6.2 人工确认清单

完整检查步骤见 `qa/image-asset-checklist.md`。

### 6.3 将 render_safe 置为 true

所有检查通过后，更新 `asset-manifest.json`：

```json
"render_safe": true
```

---

## 阶段七：渲染

```bash
npx hyperframes render --input output/index.html --output output/final.mp4
```

渲染完成后，用 `render-report.md` 记录本次渲染的资产版本信息。

---

## 边界说明

| 本流程包含 | 本流程不包含 |
|------------|--------------|
| 本地图片资产的识别、整理、绑定 | AI 生图服务调用 |
| Asset Manifest 的创建与维护 | 图片自动下载爬取 |
| 变体声明（压缩/裁剪） | 图片自动压缩（需手动或可选工具） |
| 合成 HTML 的图片引用规范 | 客户原始素材管理 |
| 渲染前 render_safe 校验 | 版权谈判或采购流程 |

---

## 相关文件

| 文件 | 说明 |
|------|------|
| `rules/image-assets-basics.md` | R-IMG-01 ～ R-IMG-09 规则定义 |
| `schemas/asset-manifest.schema.json` | Asset Manifest JSON Schema |
| `qa/image-asset-checklist.md` | 渲染前逐项检查清单 |
| `scripts/check-composition-hazards.js` | 启发式告警扫描（含图片检查） |
| `docs/source-image-workflow.md` | 英文版工作流文档 |
