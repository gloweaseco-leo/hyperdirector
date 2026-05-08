# 常见问题

> HyperDirector 使用过程中最常见的问题和解答。

---

## 关于 HyperDirector 本身

### Q：HyperDirector 和 HyperFrames 是什么关系？

HyperFrames 是底层的 HTML-to-video 渲染引擎，由 HeyGen 开源（Apache 2.0）。它把 HTML 文件渲染成 MP4 视频。

HyperDirector 是运行在 Hermes 中的视频导演工作流层，建立在 HyperFrames 之上。它负责：理解需求 → 生成脚本/分镜 → 套用品牌 → 生成 HTML → QA 修复 → 交付报告。

**简单说：** HyperFrames 是引擎，HyperDirector 是驾驶员。你不需要懂 HyperFrames 的内部细节——HyperDirector 替你搞定了。

---

### Q：HyperDirector 和 Sora / Runway / Pika 有什么不同？

| 维度 | HyperDirector | Sora / Runway / Pika |
|------|--------------|---------------------|
| 输出类型 | HTML 图形视频（动态文字、数据、品牌动效） | 写实视频（真实场景、人物、光影） |
| 可控性 | 代码级可控，每个元素都能精确修改 | 结果随机，难以精确控制细节 |
| 品牌一致性 | Brand Kit 记忆，每次保持一致 | 无品牌记忆 |
| 源码可编辑 | 输出 HTML 源码，任意修改 | 黑盒输出，不可编辑 |
| 适合内容 | 文章、产品页、数据、知识讲解 | 写实场景、电影感、人物影像 |
| 本地运行 | 是，完全本地 | 否，需要云端服务 |

这两类工具**不是竞争关系，而是互补关系**。信息图表型视频（可控、可编辑、品牌一致）→ HyperDirector。写实影像 → 生成视频工具。

---

### Q：HyperDirector 和 Remotion 有什么不同？

| 维度 | HyperDirector | Remotion |
|------|--------------|---------|
| 使用者 | 内容创作者（无需写代码）| 前端开发者（需写 React 代码）|
| 驱动方式 | 自然语言 + Brand Kit | React 组件 + TypeScript |
| 工作流 | Hermes AI 全自动生成 | 手写组件 + 手动合成 |
| 适合规模 | 单视频快速生成，迭代 | 程序化批量生成，需要代码能力 |
| 模板复用 | 3 个内置模板，自然语言定制 | 无限自定义，完全代码控制 |
| AI 集成 | 原生 AI 导演层 | 可集成，但非原生 |

**总结：** Remotion 是给开发者的视频编程框架，HyperDirector 是给内容创作者的 AI 视频工作流。会写 React 且需要高度定制 → Remotion。不想写代码、需要快速产出 → HyperDirector。

---

### Q：HyperDirector 是 SaaS 平台吗？需要注册账号吗？

不是。HyperDirector v0.1 是一个 Hermes Skill Pack，完全本地运行。不需要注册账号，不需要订阅，不上传任何数据。你的品牌配置、内容和视频都在你自己的电脑上。

---

### Q：它需要网络连接吗？

生成视频本身不需要网络（HyperFrames 渲染是本地的，TTS 使用 Kokoro 本地模型）。以下情况需要网络：

- 首次安装 Node.js、FFmpeg、HyperFrames CLI
- 从 Google Fonts 加载字体（可提前本地化）
- 更新 HyperDirector 或 HyperFrames

---

## 关于视频能力

### Q：HyperDirector 能不能做真人出镜视频？

不能。HyperDirector 生成的是 HTML 图形视频——动态文字、数据图表、品牌卡片、动效。没有真人面孔，没有真实场景。

最接近的方案：TTS 配音（本地 Kokoro 模型）+ 动态字幕 + 信息卡片。

---

### Q：HyperDirector 能不能做数字人？

不能。数字人（AI 虚拟人口型同步）需要专门的 Avatar 渲染技术。

替代选项：HeyGen Studio、Synthesia、D-ID。

---

### Q：能不能做英文视频？

可以。在 brief.json 中设置 `"language": "en-US"`，或直接用英文向 Hermes 提需求，HyperDirector 会推断语言偏好。

Brand Kit 中可以设置 `"default_output_language": "en-US"` 作为默认语言。

---

### Q：可以做多长的视频？

v0.1 推荐时长：**15–60 秒**。超过 60 秒建议拆分成多集。

原因：
- 短视频平台算法偏好 15–60 秒
- HTML composition 复杂度随时长增加，QA 难度上升
- v0.2 规划批量生成（一篇文章拆多条视频）

---

### Q：支持哪些视频比例？

| 比例 | 用途 |
|------|------|
| 9:16 | 视频号、TikTok、YouTube Shorts（默认） |
| 16:9 | YouTube、B 站、企业内部 |
| 1:1 | Instagram 方形视频 |

在需求中直接说明即可："生成 16:9 横屏版本"。

---

## 关于品牌和字幕

### Q：如何修改字幕？

字幕（caption）存储在 `storyboard.json` 的每个场景的 `caption` 字段，并同步在 `index.html` 对应 scene 的 `.caption-text` 元素中。

**通过 Hermes 修改（推荐）：**

```
把 scene_02 的字幕改为："新的字幕内容，不超过 150 字"
```

**手动修改 storyboard.json：**

```json
{
  "id": "scene_02",
  "caption": "新的字幕内容"
}
```

修改后同步更新 `index.html` 对应 scene 的 `.caption-text`，并重新运行：

```bash
node hyperdirector/scripts/validate-storyboard.js output/storyboard.json output/brief.json
```

**字幕长度限制：**
- storyboard schema 限制 ≤ 150 字符
- 视频号竖屏推荐每行 ≤ 14 个汉字

---

### Q：如何保持品牌一致？

HyperDirector 通过 Brand Kit 机制保持品牌一致性：

**一次配置，永久生效：**

```bash
# 1. 建立 brand-kit.json（只需一次）
cp hyperdirector/brand/brand-kit.example.json ./brand-kit.json

# 2. 填写品牌颜色、字体、CTA
# 3. 验证
node hyperdirector/scripts/validate-brand-kit.js brand-kit.json
```

**每次生成视频时：**
- HyperDirector 自动读取 `brand-kit.json`
- 生成 `brand-used.json`（快照）放入输出目录
- 品牌色通过 CSS 变量注入 `index.html`
- 字幕字体、CTA 文案、动效风格均来自 Brand Kit

**跨多个项目保持一致：**
- 将 `brand-kit.json` 放在所有视频项目的共同父目录
- 或在每次生成时明确指定：`使用我的 brand-kit.json`

**验证品牌一致性：**
```bash
# 检查 brand-used.json 是否与 brand-kit.json 一致
node hyperdirector/scripts/validate-brand-kit.js output/brand-used.json
```

---

### Q：为什么有些需求会被拒绝？

HyperDirector 在每次请求时做能力边界判断，拒绝原因：

| 拒绝类型 | 示例 | 建议替代 |
|---------|------|---------|
| 超出技术能力 | 写实视频、数字人 | Sora / HeyGen Studio |
| 内容安全 | 色情、暴力、欺诈、虚假医疗 | — |
| 版权问题 | 无授权复刻特定品牌模板 | 改成通用原创风格 |

详细边界说明 → [CAPABILITY_BOUNDARY.zh-CN.md](../CAPABILITY_BOUNDARY.zh-CN.md)

---

### Q：为什么要输出 HTML 源码？

HTML 是视频的"工程文件"——就像 Premiere 的项目文件。有了源码：

- 随时修改某个场景的文字或颜色（不用重新生成）
- 用 git 追踪每次修改
- 让 AI 助手精准局部修改（`<!-- HERMES: ... -->` 注释标注可编辑区）
- 复用某个场景到其他视频项目
- 在浏览器中直接预览，无需安装任何软件

没有源码的黑盒视频，改一个字就要重新生成一遍。

---

## 关于技术和工程

### Q：如果 HyperFrames CLI 未安装，还能用吗？

可以部分使用。未安装时仍可生成：

- `brief.json`
- `storyboard.json`
- `DESIGN.md`
- `index.html`（视频源码）
- `render-report.md`（标注"未执行渲染"）

**但不能：** 执行 lint 检查、preview 预览、render 输出 MP4。

建议先安装所有依赖再使用完整工作流 → [installation.md](./installation.md)

---

### Q：生成的视频每次都一样吗？

**结构一致，文案可能略有差异。**

相同的 `brief.json` + `brand-kit.json` + 模板，应该产生结构相同、样式一致的视频。但 LLM 生成的脚本措辞有随机性，每次的字幕可能略有不同。

HTML 动画代码是确定性的（不使用 `Math.random()`），相同的 HTML 渲染出来的视频帧完全一致。

---

### Q：视频生成失败怎么办？

**Step 1：** 查看 `render-report.md` 了解具体错误

**Step 2：** 把错误信息发给 Hermes，HyperDirector 自动修复（最多 3 次）

**Step 3：** 手动运行 lint 查看问题：

```bash
npx hyperframes lint
```

**Step 4：** 查看排障文档 → [qa/troubleshooting.md](../qa/troubleshooting.md)

**常见错误：**
- `data-duration mismatch` → HTML 时长与 storyboard 不一致
- `font not found` → 字体未安装或 CDN 加载失败
- `render failed` → FFmpeg 未安装或输出目录无写权限

---

### Q：能不能批量生成多条视频？

v0.1 不支持批量生成，每次处理一个视频项目。批量生成规划在 v0.2 中。

---

## 关于价格和授权

### Q：HyperDirector 是免费的吗？

HyperDirector v0.1 是开源 Skill Pack，免费使用。HyperFrames 也是 Apache 2.0 开源免费。

你可能需要付费的是：
- 你的 Hermes 账号（如果 Hermes 是付费服务）
- TTS 模型（v0.1 使用 Kokoro 本地模型，免费）

---

### Q：可以用于商业项目吗？

可以。生成的视频和 HTML 源码归你所有，可以商业使用。

注意：
- 视频中引用的第三方素材（字体、图片、音乐）需确认其授权协议
- HyperDirector 代码遵循其开源协议，见仓库 LICENSE 文件

---

更多问题？在 GitHub Issues 提交。
