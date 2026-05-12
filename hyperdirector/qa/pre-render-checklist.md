# Pre-Render Checklist

渲染前必须逐项确认。所有 ✅ 通过后，方可执行 `npx hyperframes render`。

---

## 1. Brief 完整性

| 检查项 | 说明 | 命令 |
|--------|------|------|
| ✅ brief.json 存在 | 输出目录下必须有 `brief.json` | `ls output/brief.json` |
| ✅ 必填字段齐全 | title / platform / aspect_ratio / duration_seconds / goal / template | `node hyperdirector/scripts/validate-brief.js output/brief.json` |
| ✅ platform 合法 | 必须是枚举值之一 | 脚本自动检查 |
| ✅ aspect_ratio 合法 | 9:16 / 16:9 / 1:1 | 脚本自动检查 |
| ✅ duration_seconds 在 10–300 范围 | — | 脚本自动检查 |

---

## 2. Storyboard 时长一致性

| 检查项 | 说明 | 命令 |
|--------|------|------|
| ✅ storyboard.json 存在 | — | `ls output/storyboard.json` |
| ✅ 必填字段齐全 | title / total_duration / aspect_ratio / template / scenes | `node hyperdirector/scripts/validate-storyboard.js output/storyboard.json` |
| ✅ scenes 数量在 2–12 之间 | — | 脚本自动检查 |
| ✅ 各场景时长之和 = total_duration（误差 ≤ 0.5s） | 脚本会计算并对比 brief.duration_seconds | 脚本自动检查 |
| ✅ storyboard.aspect_ratio = brief.aspect_ratio | 两文件必须一致 | 手动对比或脚本检查 |
| ✅ storyboard.template = brief.template | 两文件必须一致 | 手动对比或脚本检查 |
| ✅ scene id 格式为 scene_NN | 格式：scene_01, scene_02 … | 脚本自动检查 |

---

## 3. Brand Kit

| 检查项 | 说明 | 命令 |
|--------|------|------|
| ✅ brand-kit.json 存在 | brief.brand_kit 指向的文件必须存在 | `node hyperdirector/scripts/validate-brand-kit.js <path>` |
| ✅ 必填字段齐全 | brand_name / colors / fonts / cta | 脚本自动检查 |
| ✅ colors.primary 格式正确 | 必须为 `#RRGGBB` | 脚本自动检查 |
| ✅ colors.accent 格式正确 | 必须为 `#RRGGBB` | 脚本自动检查 |
| ✅ fonts.headline / fonts.body 非空 | — | 脚本自动检查 |
| ✅ cta.default 非空 | — | 脚本自动检查 |

---

## 4. Assets 存在性

| 检查项 | 说明 |
|--------|------|
| ✅ storyboard 中引用的所有 asset.path 均存在 | 相对于输出根目录 |
| ✅ brand_kit.assets.logo 文件存在（若声明） | — |
| ✅ brand_kit.assets.music_default 文件存在（若声明） | — |
| ✅ 图片格式为 PNG / JPG / WebP | 避免 BMP、TIFF |
| ✅ 视频素材为 MP4 / WebM | — |

---

## 5. 字幕安全区

| 检查项 | 说明 |
|--------|------|
| ✅ brand_kit.safe_zone 已配置 | 缺省值：top=10%, bottom=15%, left=5%, right=5% |
| ✅ 每场景 caption 字数 ≤ constraints.max_words_per_scene | 默认上限 80 字 |
| ✅ caption 不超过 150 字符 | storyboard schema 限制 |
| ✅ 全部场景均有 caption（若 accessibility.captions_required = true） | — |

---

## 6. Timeline 注册

| 检查项 | 说明 |
|--------|------|
| ✅ index.html 内各 scene 元素均有 `data-duration` 属性 | 值必须与 storyboard 对应场景一致 |
| ✅ `data-duration` 之和与 total_duration 吻合 | HyperFrames CLI 在 preview 阶段会自动验证 |
| ✅ scene 元素 id 与 storyboard.scenes[*].id 一一对应 | — |

---

## 7. 输出目录

| 检查项 | 说明 |
|--------|------|
| ✅ `output/` 目录存在且可写 | — |
| ✅ 磁盘空间充足 | 建议预留 ≥ 500 MB |
| ✅ `output/index.html` 存在 | 渲染入口，必须在 render 前就位 |
| ✅ `output/preview.html` 存在（可选） | 供 browser preview 测试 |

---

## 8. 渲染稳定性（Headless / 离线 / 预览一致）

| 检查项 | 说明 |
|--------|------|
| ✅ GSAP 仅加载一次 | CDN **或** `assets/gsap.min.js`（3.12.x），见 R-CORE-12 |
| ✅ 生产路径不依赖远程字体 | 避免唯一依赖 `fonts.googleapis.com`；见 R-HRS-01 |
| ✅ `#composition` 尺寸固定 | 无 `@media` 改变画布 px 或画布内主字号；见 R-HRS-03 |
| ✅ 核心画面避免 emoji | 图标优先 SVG / 本地资产；见 R-HRS-02 |
| ✅ 字幕/标题动效 | 避免 CSS `translate` 居中与 GSAP `scale` 互抢；见 R-GSAP-09 |

**可选辅助（非 HyperFrames lint，不阻断）：**

```bash
node hyperdirector/scripts/check-composition-hazards.js output/index.html
```

详见 `rules/headless-rendering-stability.md`、`docs/rendering-stability.zh-CN.md`。

---

## 快速全检命令

```bash
# 1. 环境检查
node hyperdirector/scripts/check-env.js

# 2. Brief 校验
node hyperdirector/scripts/validate-brief.js output/brief.json

# 3. Storyboard 校验
node hyperdirector/scripts/validate-storyboard.js output/storyboard.json

# 4. Brand Kit 校验
node hyperdirector/scripts/validate-brand-kit.js hyperdirector/brand/brand-kit.example.json

# 5. 输出合约检查
node hyperdirector/scripts/check-output-contract.js output/

# 6. （可选）启发式稳定性扫描 — 非 lint，不阻断
node hyperdirector/scripts/check-composition-hazards.js output/index.html
```

全部通过后执行：

```bash
npx hyperframes render --input output/index.html --output output/final.mp4
```

---

## 9. 媒体资产管线（可选，Source Image Pipeline + Audio Director）

仅当项目启用了媒体资产管线时需要检查本节。如未使用，跳过。

### 9a. 图片资产

| 检查项 | 说明 | 命令/参考 |
|--------|------|-----------|
| ✅ asset-manifest.json 存在且符合 schema | 三个以上图片时建议建立 | `schemas/asset-manifest.schema.json` |
| ✅ 所有图片 local_path 文件实际存在 | 相对于 output/ 目录 | — |
| ✅ 所有图片 render_safe = true | 见 R-IMG-09 | `rules/image-assets-basics.md` |
| ✅ `<img src>` 无远程 URL | 见 R-IMG-01 | hazards scan |
| ✅ CSS background-image 无远程 URL | 见 R-IMG-03 | hazards scan |
| ✅ 单张图片 ≤ 5 MB（或已注册压缩变体） | 见 R-IMG-06 | hazards scan |

详细清单：`qa/image-asset-checklist.md`

### 9b. 音频资产

| 检查项 | 说明 | 命令/参考 |
|--------|------|-----------|
| ✅ audio-manifest.json 存在且符合 schema | 有旁白时必须建立 | `schemas/audio-manifest.schema.json` |
| ✅ 所有 segment local_path 文件实际存在 | — | — |
| ✅ 所有 segment render_safe = true | 见 R-AUD-02 | `rules/audio-director-rules.md` |
| ✅ consent_status 无 unknown / consent_pending | 见 R-AUD-03 | — |
| ✅ manifest 中不含 API key / Token | 见 R-AUD-04 | hazards scan |
| ✅ `<audio src>` 无远程 URL | 见 R-AUD-01 | hazards scan |

详细清单：`qa/audio-qa-checklist.md`

### 9c. 字幕时间轴

| 检查项 | 说明 |
|--------|------|
| ✅ caption-timeline.json 存在（若项目含旁白或字幕） | — |
| ✅ 字幕文本与 transcript 含义一致 | 见 R-AUD-08 |
| ✅ start_ms / end_ms 与对应 scene duration 匹配 | 误差 ≤ 500ms |
| ✅ scene_id 与 storyboard 一致 | — |

### 9d. 媒体资产快速辅助扫描

```bash
# 图片 + 音频启发式告警（非 lint，不阻断，exit 0）
node hyperdirector/scripts/check-composition-hazards.js output/index.html
```
