# Final Delivery Checklist

项目交付前，逐项核对以下文件是否存在且内容完整。全部通过后方可提交/归档。

---

## 必须交付的文件

### 渲染产物

| 文件 | 路径 | 说明 | 状态 |
|------|------|------|------|
| **final.mp4** | `output/final.mp4` | 最终渲染视频，格式 MP4 | ☐ |
| **index.html** | `output/index.html` | 主合成文件，包含完整 timeline | ☐ |
| **preview.html** | `output/preview.html` | 浏览器预览版（可用于 review） | ☐ |

### 结构文档

| 文件 | 路径 | 说明 | 状态 |
|------|------|------|------|
| **storyboard.json** | `output/storyboard.json` | 场景结构，已通过 validate-storyboard.js | ☐ |
| **brief.json** | `output/brief.json` | 项目需求文件，已通过 validate-brief.js | ☐ |
| **script.md** | `output/script.md` | 逐场景旁白 / 字幕文稿 | ☐ |
| **DESIGN.md** | `output/DESIGN.md` | 视觉决策说明：配色、字体、动效理由 | ☐ |

### Brand & 元数据

| 文件 | 路径 | 说明 | 状态 |
|------|------|------|------|
| **brand-used.json** | `output/brand-used.json` | 本次渲染实际使用的 brand-kit 快照 | ☐ |
| **render-report.md** | `output/render-report.md` | 渲染执行报告（由 HyperFrames 生成） | ☐ |
| **edit-instructions.md** | `output/edit-instructions.md` | 后期修改指南：如何改文案/配色/时长 | ☐ |

---

## 交付质量检查

### 视频质量

- ☐ final.mp4 文件大小 > 0（非空文件）
- ☐ 时长与 brief.duration_seconds 一致（允许误差 ≤ 1s）
- ☐ 分辨率与 aspect_ratio 匹配（9:16 → 1080×1920，16:9 → 1920×1080，1:1 → 1080×1080）
- ☐ 无黑屏帧（除非 brief 明确要求黑场转场）
- ☐ 字幕在安全区内，未超出画面边缘
- ☐ CTA 文案与 brand_kit.cta 或 brief.cta_override 一致

### HTML 合成质量

- ☐ index.html 在主流浏览器中可正常打开
- ☐ 所有 scene 元素有正确的 `data-duration` 属性
- ☐ timeline 总时长与 storyboard.total_duration 一致
- ☐ 无 JavaScript 控制台报错（排除跨域警告）
- ☐ 所有 asset 路径可访问（无 404）

### 文档质量

- ☐ storyboard.json 已通过 `validate-storyboard.js` 校验
- ☐ brief.json 已通过 `validate-brief.js` 校验
- ☐ script.md 场景数量与 storyboard.scenes 数量一致
- ☐ DESIGN.md 说明了主要视觉决策（至少涵盖：配色选择、字体选择、动效风格）
- ☐ render-report.md 记录了渲染时间、使用的模板、版本信息
- ☐ edit-instructions.md 提供了至少 3 条常见修改路径

### Brand 合规

- ☐ brand-used.json 与实际使用的 brand-kit 内容一致
- ☐ 视频中使用的主色 / 强调色均来自 brand-kit.colors
- ☐ 字体与 brand-kit.fonts 一致
- ☐ CTA 文案来自 brand-kit.cta（或有 brief.cta_override 记录）
- ☐ 无违反 brand_kit.constraints 的内容（如 no_text_over_logo）

---

## 交付前运行命令

```bash
# 完整输出合约检查
node hyperdirector/scripts/check-output-contract.js output/

# 验证 storyboard 最终版
node hyperdirector/scripts/validate-storyboard.js output/storyboard.json

# 验证 brief 最终版
node hyperdirector/scripts/validate-brief.js output/brief.json

# 验证使用的 brand kit
node hyperdirector/scripts/validate-brand-kit.js output/brand-used.json
```

---

## 归档清单

交付完成后，将整个 `output/` 目录压缩归档，命名规范：

```
{title}-{YYYYMMDD}-v{version}.zip
```

示例：`demo-article-to-video-20260507-v1.zip`
