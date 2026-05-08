# Troubleshooting

常见问题诊断与解决方案。按错误类型索引，快速定位修复路径。

---

## 目录

1. [HyperFrames CLI 未安装](#1-hyperframes-cli-未安装)
2. [FFmpeg 缺失](#2-ffmpeg-缺失)
3. [字体缺失](#3-字体缺失)
4. [Render 失败（通用）](#4-render-失败通用)
5. [Preview 正常但输出失败](#5-preview-正常但输出失败)
6. [Asset 路径错误](#6-asset-路径错误)
7. [字幕超出安全区](#7-字幕超出安全区)
8. [Timeline 未注册](#8-timeline-未注册)

---

## 1. HyperFrames CLI 未安装

**症状：**

```
✗ HyperFrames CLI    NOT FOUND
  → Run: npm install -g hyperframes
```

或执行任何 `npx hyperframes` 命令时报 `command not found`。

**原因：** HyperFrames CLI 未全局安装，或 npm 全局路径未加入 PATH。

**修复步骤：**

```bash
# 全局安装
npm install -g hyperframes

# 验证安装
npx hyperframes --version

# 若 npx 仍报错，检查 npm 全局路径
npm config get prefix
# Windows 将输出类似 C:\Users\你的用户名\AppData\Roaming\npm
# 确认该路径已加入系统 PATH
```

**验证：**

```bash
node hyperdirector/scripts/check-env.js
```

---

## 2. FFmpeg 缺失

**症状：**

```
✗ FFmpeg             NOT FOUND
  → Install from https://ffmpeg.org/download.html (required for render)
```

或 render 阶段报：`Error: ffmpeg is not installed or not in PATH`

**修复步骤：**

```bash
# macOS（推荐 Homebrew）
brew install ffmpeg

# Ubuntu / Debian
sudo apt-get update && sudo apt-get install ffmpeg

# Windows
# 1. 从 https://ffmpeg.org/download.html 下载 Windows 构建
# 2. 解压到 C:\ffmpeg\
# 3. 将 C:\ffmpeg\bin 加入系统 PATH 环境变量
# 4. 重新打开终端

# 验证
ffmpeg -version
```

**验证：**

```bash
node hyperdirector/scripts/check-env.js
```

---

## 3. 字体缺失

**症状：**

- preview.html 中文字显示为方框或系统默认字体
- render 后视频字体与设计稿不符
- FFmpeg / Puppeteer 报 `font not found` 或 `cannot load font`

**原因：** brand-kit 中声明的字体（如 `Noto Sans SC`、`PingFang SC`）未安装在系统中，或 Google Fonts 未能在渲染环境加载。

**修复步骤：**

```bash
# 方案一：系统安装字体（推荐用于 render）
# Windows：下载 .ttf 文件，双击安装
# macOS：双击 .ttf / .otf，点击"安装字体"
# Linux：cp font.ttf ~/.local/share/fonts/ && fc-cache -fv

# 方案二：在 index.html 中使用 Google Fonts CDN（仅 preview）
# <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC&display=swap" rel="stylesheet">

# 方案三：修改 brand-kit 使用系统自带字体
# headline: "Arial" 或 "Microsoft YaHei"（Windows）
# body: "Helvetica" 或 "Microsoft YaHei"（Windows）
```

**验证：**

打开 `output/preview.html`，确认所有场景字体正确渲染，然后重新执行 render。

---

## 4. Render 失败（通用）

**症状：**

```
Error: Render failed with exit code 1
```

或

```
HyperFrames render error: ...
```

**诊断步骤：**

```bash
# 1. 先检查环境
node hyperdirector/scripts/check-env.js

# 2. 检查 index.html 在浏览器中能否正常打开
# 手动用浏览器打开 output/index.html，观察控制台报错

# 3. 验证所有 schema
node hyperdirector/scripts/validate-brief.js output/brief.json
node hyperdirector/scripts/validate-storyboard.js output/storyboard.json
node hyperdirector/scripts/check-output-contract.js output/

# 4. 增加详细日志重试
npx hyperframes render --input output/index.html --output output/final.mp4 --verbose
```

**常见子原因：**

| 子原因 | 症状 | 修复 |
|--------|------|------|
| Node.js 版本过低 | `SyntaxError: unexpected token` | 升级到 Node.js ≥ 22 |
| 内存不足 | `ENOMEM` / `killed` | 关闭其他应用，或减少并发场景数 |
| 输出目录权限不足 | `EACCES` / `permission denied` | `chmod 755 output/` |
| index.html 语法错误 | `Parse error` | 在浏览器检查控制台，修复 JS/CSS 错误 |

---

## 5. Preview 正常但输出失败

**症状：** `output/preview.html` 在浏览器中完全正常，但 `npx hyperframes render` 输出的 `final.mp4` 为空、黑屏或崩溃。

**原因：** preview 使用浏览器原生渲染，render 使用 Puppeteer + FFmpeg 无头截帧，两者环境差异导致不一致。

**诊断步骤：**

1. **检查 asset 路径是否使用绝对路径**（无头环境下相对路径可能失效）：

   ```html
   <!-- 错误：相对路径在无头环境中可能失败 -->
   <img src="assets/hero.png">
   
   <!-- 正确：使用 file:// 绝对路径或通过 HyperFrames asset loader -->
   <img src="file:///absolute/path/to/assets/hero.png">
   ```

2. **检查是否有 CORS 阻塞**：无头浏览器更严格，Google Fonts 等外部资源可能被阻止。改为本地字体或内联 CSS。

3. **检查动画是否依赖 `window.requestAnimationFrame` 时序**：无头截帧时序与真实浏览器不同，需确保 `data-duration` 驱动动画，而非依赖 rAF 帧率。

4. **降低复杂度测试**：将场景数减为 1，验证单场景 render 是否成功，再逐步恢复。

---

## 6. Asset 路径错误

**症状：**

```
✗ asset not found: assets/screenshot-01.png
```

或 preview/render 中出现占位图、空白区域。

**原因：** storyboard 中 `assets[*].path` 声明的路径与实际文件位置不符。

**修复步骤：**

```bash
# 1. 列出实际文件
ls output/assets/

# 2. 对比 storyboard 中声明的路径
# storyboard.json → scenes[*].assets[*].path

# 3. 修复方式（选一）：
#    a. 将文件移动/重命名到 storyboard 声明的路径
#    b. 更新 storyboard 中的 path 字段匹配实际文件名

# 4. 重新校验
node hyperdirector/scripts/validate-storyboard.js output/storyboard.json
```

**预防：** 在 storyboard 生成阶段，统一使用 `assets/<type>-<index>.<ext>` 命名规范，例如：
- `assets/image-01.png`
- `assets/video-01.mp4`

---

## 7. 字幕超出安全区

**症状：**

- preview 中字幕被画面边缘裁切
- 字幕与 Logo 或 UI 元素重叠
- render 后字幕在移动端显示不完整

**原因：** caption 文字过长，或 CSS 布局未遵循 `brand_kit.safe_zone` 配置。

**修复步骤：**

1. **缩短 caption**：

   ```json
   // storyboard.json - 修改前
   "caption": "这是一段非常长的字幕文字，超过了安全区域的限制，会在视频边缘被裁切掉"
   
   // 修复后（分拆或精简）
   "caption": "这是精简后的字幕，控制在安全区内"
   ```

2. **检查 safe_zone 配置**：

   ```json
   // brand-kit.json
   "safe_zone": {
     "top_percent": 10,
     "bottom_percent": 15,
     "left_percent": 5,
     "right_percent": 5
   }
   ```

3. **CSS 字幕容器检查**：确保 `index.html` 中字幕容器使用了 safe_zone 对应的 padding/margin。

4. **字符数限制参考：**
   - 9:16 竖屏：每行 ≤ 14 个汉字（约 28 字符）
   - 16:9 横屏：每行 ≤ 24 个汉字（约 48 字符）

---

## 8. Timeline 未注册

**症状：**

```
Error: HyperFrames timeline: scene element not found or missing data-duration
```

或视频播放时所有场景同时出现，没有时序切换。

**原因：** `index.html` 中的 scene 元素缺少 `data-duration` 属性，或 id 与 storyboard 不匹配。

**修复步骤：**

1. **检查 scene 元素结构：**

   ```html
   <!-- 错误：缺少 data-duration -->
   <section id="scene_01" class="scene">...</section>
   
   <!-- 正确 -->
   <section id="scene_01" class="scene" data-duration="5">...</section>
   ```

2. **对比 storyboard 与 HTML：**

   | storyboard scenes[*].id | HTML element id | data-duration | storyboard duration |
   |------------------------|-----------------|---------------|---------------------|
   | scene_01 | scene_01 | 5 | 5 ✅ |
   | scene_02 | scene_02 | 8 | 8 ✅ |
   | scene_03 | missing ❌ | — | 7 |

3. **修复**：为缺失的 scene 元素添加正确的 id 和 data-duration，确保与 storyboard 完全对应。

4. **验证 timeline 注册（手动检查）：**

   ```js
   // 在浏览器控制台执行
   document.querySelectorAll('.scene[data-duration]').length
   // 应等于 storyboard.scenes.length
   ```

---

## 仍未解决？

1. 运行 `node hyperdirector/scripts/check-env.js` 获取完整环境报告
2. 将错误信息贴入新的 Agent 对话，注明：
   - 执行的命令
   - 完整错误输出
   - 操作系统与 Node.js 版本
3. 参考 `hyperdirector/docs/faq.zh-CN.md` 获取更多常见问题解答
