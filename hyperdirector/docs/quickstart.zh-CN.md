# 快速开始

> 最短路径：从零到生成你的第一条视频项目。

---

## 前置条件

在开始之前，你需要：

| 组件 | 状态检查命令 | 如果未安装 |
|---|---|---|
| Hermes | 能正常对话就行 | 安装 Hermes，见官方文档 |
| Node.js >= 22 | `node --version` | https://nodejs.org |
| FFmpeg | `ffmpeg -version` | https://ffmpeg.org/download.html |
| HyperFrames CLI | `npx hyperframes --version` | `npm install -g hyperframes` |

如果还没有安装 HyperFrames CLI，详细步骤见：[installation.zh-CN.md](./installation.zh-CN.md)

---

## 第一步：放置 Skill Pack

1. 下载或克隆 HyperDirector 仓库
2. 将 `hyperdirector/` 目录放到你的 Hermes skills 目录（通常是 `~/.hermes/skills/` 或项目的 `skills/` 子目录）
3. 向 Hermes 提问，验证安装：

```
HyperDirector 能帮我做哪些类型的视频？
```

如果 Hermes 列出了视频类型和模板说明，表示 Skill Pack 已正确加载。

---

## 第二步：填写 Brand Kit

复制示例文件到你的工作目录：

```bash
cp hyperdirector/brand/brand-kit.example.json ./brand-kit.json
```

用文本编辑器打开 `brand-kit.json`，修改以下关键字段：

```json
{
  "brand_name": "你的品牌名称",
  "locale": "zh-CN",
  "default_output_language": "zh-CN",
  "colors": {
    "primary": "#111827",
    "accent": "#38BDF8",
    "background": "#F8FAFC"
  },
  "fonts": {
    "headline": "Inter",
    "body": "Noto Sans SC"
  },
  "cta": {
    "default": "关注 [你的品牌名]，持续更新"
  }
}
```

不需要填写所有字段——留空的字段会使用默认值。完整说明见：[brand-kit-setup.zh-CN.md](./brand-kit-setup.zh-CN.md)

---

## 第三步：输入你的需求

在 Hermes 中使用以下格式提问（可以直接复制，替换 `[...]` 部分）：

```
使用 HyperDirector，把下面这篇文章做成 30 秒视频号竖屏短视频，
使用我的 brand-kit，前 3 秒强 hook，中间 3 个核心观点，结尾引导关注。

[粘贴你的文章、产品说明、或任何文字内容]
```

也可以更简单地说：

```
用 HyperDirector 把这段内容做成短视频：[内容]
```

HyperDirector 会先判断需求是否适合，然后启动完整工作流。

---

## 第四步：确认 Brief

HyperDirector 会先输出 `brief.json`，包含它对你需求的理解：

```json
{
  "title": "你的视频标题",
  "platform": "video_wechat",
  "aspect_ratio": "9:16",
  "duration_seconds": 30,
  "goal": "讲清楚核心价值并引导关注",
  "tone": "专业、直给",
  "template": "ai-knowledge-explainer-kit"
}
```

如果理解有偏差，告诉 Hermes 修正；如果没问题，直接说"继续"。

---

## 第五步：等待生成

HyperDirector 按顺序生成：

1. `storyboard.json` — 分镜结构（各幕时长、内容、字幕）
2. `DESIGN.md` — 视觉设计说明（颜色、字体、动效）
3. `index.html` — HyperFrames 视频 composition 源码
4. 执行 `npx hyperframes lint` 质检
5. 输出 `render-report.md`

整个过程大约需要 1–3 分钟，取决于视频复杂度。

---

## 第六步：查看输出文件

生成完成后，所有文件在 `output/<你的项目名>/` 目录下：

```
output/my-video-project/
├── brief.json          ← 视频需求
├── storyboard.json     ← 分镜结构（可直接修改）
├── DESIGN.md           ← 视觉设计说明
├── index.html          ← 视频源码（可在浏览器打开预览）
├── assets/             ← 素材目录
└── render-report.md    ← 质检报告
```

**预览视频：** 在项目目录运行 `npx hyperframes preview`，浏览器会打开实时预览。

**渲染 MP4：** 预览满意后，运行 `npx hyperframes render --quality high --output output/final.mp4`。

---

## 常见第一次问题

**Q：Hermes 没有识别 HyperDirector 怎么办？**
检查 `SKILL.md` 是否在正确的目录，重启 Hermes 会话后重试。

**Q：生成的视频和我想的不一样？**
这是正常的——告诉 Hermes 需要修改的地方，HyperDirector 会局部调整（不重写整个项目）。例如：
```
把开头改慢一点，字幕变大，结尾 CTA 改成"前往你的落地页订阅"
```

**Q：render 命令失败了？**
先运行 `npx hyperframes lint` 查看具体错误，或向 Hermes 描述错误信息，HyperDirector 会进入自动修复流程。

---

下一步：[第一个视频完整教程 →](./first-video.zh-CN.md)
