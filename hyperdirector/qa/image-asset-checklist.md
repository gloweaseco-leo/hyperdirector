# Image Asset Checklist

图片资产进入生产渲染前必须逐项确认。所有 ✅ 通过后，方可将 `asset-manifest.json` 中相关条目标记为 `render_safe: true`，并执行 `npx hyperframes render`。

> 规则参考：`rules/image-assets-basics.md`  
> 流程参考：`docs/source-image-workflow.zh-CN.md`

---

## 1. 文件存在性与格式

| 检查项 | 规则 | 说明 |
|--------|------|------|
| ✅ 所有 `local_path` 文件实际存在 | R-IMG-09 | 相对于 `output/` 目录或项目根目录 |
| ✅ 格式为 PNG / JPG / WebP / SVG 之一 | R-IMG-05 | 避免 BMP、TIFF、HEIC、AVIF |
| ✅ SVG 文件无外链引用（`<image href>`, `<use href>` 指向远端） | R-IMG-04 | 用浏览器开发者工具检查 Network 面板 |
| ✅ PNG/WebP 的 `has_alpha` 字段已如实填写 | — | 影响合成层叠顺序设计决策 |

---

## 2. 本地化（无远程依赖）

| 检查项 | 规则 | 说明 |
|--------|------|------|
| ✅ `<img src>` 无远程 URL | R-IMG-01 | `http://` / `https://` 开头的 src 必须替换为本地路径 |
| ✅ CSS `background-image: url(...)` 无远程 URL | R-IMG-03 | 包括 inline style 与 `<style>` 标签内 |
| ✅ 无 CDN 图片托管依赖 | R-IMG-01 | 包括 Cloudinary、imgix、Unsplash embed 等 |

**辅助扫描（非阻断）：**
```bash
node hyperdirector/scripts/check-composition-hazards.js output/index.html
```

---

## 3. Alt 属性与可访问性

| 检查项 | 规则 | 说明 |
|--------|------|------|
| ✅ 所有 `<img>` 均有 `alt` 属性 | R-IMG-02 | 装饰图可用 `alt=""`，内容图须有描述 |
| ✅ 内容图 `alt` 文字 ≤ 80 字符 | R-IMG-02 | 过长会被辅助技术截断 |

---

## 4. 文件大小与性能

| 检查项 | 规则 | 说明 |
|--------|------|------|
| ✅ 单张图片 ≤ 5 MB | R-IMG-06 | 超过 5 MB 建议压缩或使用 WebP 变体 |
| ✅ 超过 5 MB 的图片已在 `variants` 中注册压缩版本 | R-IMG-06 | 压缩版 `use_for_render: true` |
| ✅ 总图片资产体积合理（建议 ≤ 50 MB） | R-IMG-06 | 超出时检查是否误包含原图高清版 |

---

## 5. Asset Manifest 字段完整性

| 检查项 | 规则 | 说明 |
|--------|------|------|
| ✅ 三个以上图片资产时已建立 `asset-manifest.json` | R-IMG-07 | 验证命令见下方 |
| ✅ 每个 asset 有 `asset_id`、`type`、`role`、`render_safe` | R-IMG-07 | 必填字段 |
| ✅ `role = custom` 时 `custom_role` 字段已填写 | — | schema 约束 |
| ✅ `bindings` 中的 `scene_id` 与 storyboard 中的 scene id 一一对应 | R-IMG-07 | 手动比对 |
| ✅ 需要特定变体渲染的资产，`variants` 中已有 `use_for_render: true` | — | 确保合成 HTML 引用的是变体路径 |

**Manifest 格式校验：**
```bash
# 如已安装 ajv-cli
npx ajv validate -s hyperdirector/schemas/asset-manifest.schema.json -d output/asset-manifest.json
```

---

## 6. 版权与授权

| 检查项 | 规则 | 说明 |
|--------|------|------|
| ✅ 每个资产的 `license_status` 已填写 | R-IMG-09 | 不得为 `"unknown"` 或 `"pending"` |
| ✅ 客户提供的素材有书面授权记录 | — | 在 `license_notes` 字段注明日期与授权方式 |
| ✅ AI 生成图片已有用户明确确认，且 `license_status = "ai_generated"` | R-IMG-08 | AI 素材不得悄默使用 |
| ✅ 需要版权声明的图片已在视频描述/片尾字幕中安排 Attribution | — | 记录在 `license_notes` |

---

## 7. 场景绑定与渲染路径

| 检查项 | 说明 |
|--------|------|
| ✅ 合成 HTML 中每处 `<img src>` 路径与 `asset-manifest.json` 中对应 `local_path`（或变体 `local_path`）一致 | 手动比对或脚本辅助 |
| ✅ `bindings` 中的 `slot` 名称与 HTML element id / class 对应 | 避免绑定失效 |
| ✅ 所有被引用资产的 `render_safe = true` | R-IMG-09 |

---

## 8. 最终 render_safe 确认

完成上述全部检查后，在 `asset-manifest.json` 中将每个通过的资产条目更新为：

```json
"render_safe": true
```

然后执行渲染：

```bash
npx hyperframes render --input output/index.html --output output/final.mp4
```

---

## 快速辅助扫描命令

```bash
# 启发式图片相关告警（非 HyperFrames lint，不阻断，exit 0）
node hyperdirector/scripts/check-composition-hazards.js output/index.html
```

检查内容包括：远程图片 URL、缺失 alt、background-image 远程 URL、SVG 外链、本地路径不存在、文件超过 5 MB。
