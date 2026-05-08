# 常见问题

> HyperDirector 使用过程中最常见的问题和解答。

---

## 关于 HyperDirector 本身

### Q：HyperDirector 和 HyperFrames 是什么关系？

HyperFrames 是底层的 HTML-to-video 渲染引擎，由 HeyGen 开源（Apache 2.0）。它把 HTML 文件渲染成 MP4 视频。

HyperDirector 是运行在 Hermes 环境中的视频导演工作流层，建立在 HyperFrames 之上。它负责：理解你的需求 → 生成脚本/分镜 → 套用品牌 → 生成 HTML 源码 → 质检修复 → 交付报告。

**简单来说：** HyperFrames 是引擎，HyperDirector 是驾驶员。你不需要懂 HyperFrames 的内部细节——HyperDirector 替你搞定了。

---

### Q：HyperDirector 和 Sora / Runway / Pika 有什么不同？

| 维度 | HyperDirector | Sora / Runway / Pika |
|---|---|---|
| 输出类型 | HTML 图形视频（动态文字、数据、品牌动效） | 写实视频（真实场景、人物、光影） |
| 可控性 | 代码级可控（每个元素都能修改） | 结果随机，难以精确控制 |
| 品牌一致性 | Brand Kit 记忆，每次保持一致 | 无品牌记忆 |
| 源码可编辑 | 输出 HTML 源码，任意修改 | 黑盒输出，不可编辑 |
| 适合内容 | 文章、产品、数据、知识讲解 | 写实场景、电影感、人物影像 |

**总结：** 这两类工具不是竞争关系，而是互补关系。当你需要信息图表型视频（可控、可编辑、品牌一致），用 HyperDirector。当你需要写实影像，用生成视频工具。

---

### Q：HyperDirector 是 SaaS 平台吗？需要注册账号吗？

不是。HyperDirector v0.1 是一个 Hermes Skill Pack，完全本地运行，不需要注册账号，不需要订阅，不上传任何数据。你的品牌配置、内容和视频都在你自己的电脑上。

---

### Q：它需要网络连接吗？

生成视频本身不需要网络（HyperFrames 渲染是本地的，TTS 使用 Kokoro 本地模型）。但以下情况需要网络：
- 首次安装 Node.js、FFmpeg、HyperFrames CLI
- 从 Google Fonts 加载字体（可以提前本地化字体来避免）
- 更新 HyperDirector 或 HyperFrames

---

## 关于视频能力

### Q：HyperDirector 能不能做真人视频？

不能做真人出镜视频。HyperDirector 生成的是 HTML 图形视频——动态文字、数据图表、品牌卡片、动效。没有真人面孔，没有真实场景。

可以做的最接近方案：TTS 配音（本地 Kokoro 模型）+ 动态字幕 + 信息卡片。

---

### Q：HyperDirector 能不能做数字人？

不能。数字人（AI 虚拟人口型同步）需要专门的 Avatar 渲染技术。
推荐使用：HeyGen Studio（与 HyperFrames 同一家公司 HeyGen 出品）、Synthesia、D-ID。

---

### Q：能不能做英文视频？

可以。在 brief.json 中设置 `"language": "en-US"`，或者直接用英文向 Hermes 提需求，HyperDirector 会推断你需要英文内容。

Brand Kit 中可以设置 `"default_output_language": "en-US"` 来默认生成英文视频。

---

### Q：中文视频怎么生成？

只要满足以下任一条件，HyperDirector 就会生成中文内容：
1. 你用中文向 Hermes 提需求（会自动推断）
2. `brand-kit.json` 中 `"default_output_language": "zh-CN"`
3. 手动在对话中说明"生成中文视频"

---

### Q：可以做多长的视频？

v0.1 的推荐时长是 **15–60 秒**。超过 60 秒的内容建议拆分成多个短视频分集。

**为什么有这个限制？**
- 短视频平台（视频号、TikTok）算法更偏好 15–60 秒
- 超长视频的 HTML composition 会变得复杂，QA 难度增加
- v0.2 规划了批量生成（一篇文章拆多条视频）

---

### Q：视频比例支持哪些？

| 比例 | 用途 |
|---|---|
| 9:16 | 视频号、TikTok、YouTube Shorts（竖屏，默认） |
| 16:9 | YouTube、B 站、企业内部（横屏） |
| 1:1 | Instagram 方形视频 |

在生成时说明即可，例如"生成 16:9 横屏版本"。

---

## 关于技术和工程

### Q：为什么要输出 HTML 源码？

HTML 源码是视频的"工程文件"——就像 Premiere 项目文件之于剪辑师。有了源码：
- 可以随时修改某一帧的文字或颜色
- 可以复用其中的某个场景
- 可以用 git 追踪每次修改
- 可以让 AI 助手（Hermes）精准地做局部修改，不需要重做整个视频

没有源码的黑盒视频，改一个字就要重新生成一遍。

---

### Q：为什么有些需求会被拒绝？

HyperDirector 在每次请求时都会做能力边界判断，拒绝有以下几种原因：

1. **超出技术能力范围：** 比如写实视频、数字人口型——这些需要 HyperDirector 不具备的渲染引擎
2. **内容安全问题：** 色情、暴力、欺诈、虚假医疗/金融承诺——内容安全政策禁止
3. **版权问题：** 无授权复刻特定品牌、电影、网红模板——改成通用原创风格

详细的能力边界说明见：[CAPABILITY_BOUNDARY.zh-CN.md](../CAPABILITY_BOUNDARY.zh-CN.md)

---

### Q：如果 HyperFrames CLI 没有安装，还能用吗？

可以部分使用。未安装 HyperFrames CLI 时，HyperDirector 仍然可以：
- 生成 `brief.json`
- 生成 `storyboard.json`
- 生成 `DESIGN.md`
- 生成 `index.html` 视频源码
- 输出 `render-report.md`（标注"未执行渲染"）

**但不能：** 执行 lint 检查、preview 预览、render 输出 MP4。

建议先安装所有依赖再使用完整工作流。安装说明：[installation.zh-CN.md](./installation.zh-CN.md)

---

### Q：生成的视频每次都一样吗？

结构一致，文案可能略有差异。

HyperDirector 的设计原则是"确定性输出"——相同的 `brief.json` + `brand-kit.json` + 模板，应该产生结构相同、样式一致的视频。但由于 LLM 生成的文案有随机性，每次的脚本措辞可能略有不同。

HTML 动画代码是确定性的（不使用 `Math.random()`），相同的 HTML 渲染出来的视频帧完全一致。

---

### Q：能不能批量生成多条视频？

v0.1 暂不支持批量生成，每次处理一个视频项目。批量生成（一篇文章拆多条短视频）规划在 v0.2 中。

---

### Q：视频生成失败怎么办？

1. 先向 Hermes 描述错误信息，HyperDirector 会进入自动修复流程（最多 3 次）
2. 查看 `render-report.md` 中的错误描述
3. 手动运行 `npx hyperframes lint` 查看具体问题
4. 查看排障文档（计划在 v0.1 发布包中提供）

常见问题：
- **Timeline 不播放：** `window.__timelines` key 与 `data-composition-id` 不一致
- **视频被截断：** GSAP timeline 时长比 storyboard 短，需要 `tl.set({}, {}, DURATION)` 延长
- **元素一直显示：** 缺少 `class="clip"` 属性

---

## 关于价格和授权

### Q：HyperDirector 是免费的吗？

HyperDirector v0.1 是开源 Skill Pack，免费使用。HyperFrames 也是 Apache 2.0 开源免费。

你需要支付的可能只有：
- 你的 Hermes 账号（如果 Hermes 是付费服务）
- TTS 模型（v0.1 使用本地 Kokoro，免费）

---

### Q：可以用于商业项目吗？

可以。生成的视频和 HTML 源码归你所有，可以商业使用。

注意：
- 如果视频包含第三方素材（字体、图片、音乐），需确认素材授权
- HyperDirector 本身的代码遵循其开源协议，具体见仓库 LICENSE 文件

---

更多问题？欢迎在 GitHub Issues 提交。
