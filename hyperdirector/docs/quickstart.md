# 快速开始

> 最短路径：从零到生成你的第一个视频项目。  
> 预计耗时：10–20 分钟（含安装）。

---

## 前置条件

运行以下命令确认环境就绪：

```bash
node --version        # 需要 v22 或以上
ffmpeg -version       # 需要能执行
npx hyperframes --version   # 需要能执行
```

| 组件 | 要求 | 安装方式 |
|------|------|---------|
| Node.js | >= 22 | https://nodejs.org |
| FFmpeg | 任意近期版本 | https://ffmpeg.org/download.html |
| HyperFrames CLI | latest | `npm install -g hyperframes` |
| Hermes | 能正常对话 | 见你的 Hermes 配置文档 |

全部就绪后，运行一键检查：

```bash
node hyperdirector/scripts/check-env.js
```

详细安装步骤 → [installation.md](./installation.md)

---

## 第一步：安装 Skill Pack

1. 克隆或下载此仓库
2. 将 `hyperdirector/` 目录复制到你的 Hermes skills 加载目录

```bash
# 示例：全局 skills 目录
cp -r hyperdirector/ ~/.hermes/skills/hyperdirector/
```

3. 向 Hermes 发送以下消息验证安装：

```
HyperDirector 支持哪些视频模板？
```

如果 Hermes 能列出 `tiktok-vertical-kit`、`saas-demo-kit`、`ai-knowledge-explainer-kit` 并说明各自用途，表示安装成功。

---

## 第二步：配置 Brand Kit

复制示例配置并填写你的品牌信息：

```bash
cp hyperdirector/brand/brand-kit.example.json ./brand-kit.json
```

最小可用配置（其余字段使用默认值）：

```json
{
  "brand_name": "你的品牌名称",
  "locale": "zh-CN",
  "default_output_language": "zh-CN",
  "colors": {
    "primary": "#111827",
    "accent": "#6366F1"
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

Brand Kit 完整说明 → [brand-kit-setup.md](./brand-kit-setup.md)

---

## 第三步：运行第一个 Demo

最快的验证方式是直接运行示例项目：

```bash
# 校验 demo-article-to-video 的分镜
node hyperdirector/scripts/validate-storyboard.js \
  hyperdirector/examples/zh-CN/demo-article-to-video/output/storyboard.json \
  hyperdirector/examples/zh-CN/demo-article-to-video/output/brief.json

# 打开浏览器预览示例视频
open hyperdirector/examples/zh-CN/demo-article-to-video/output/preview.html
# Windows: start hyperdirector/examples/zh-CN/demo-article-to-video/output/preview.html
```

---

## 第四步：生成你的第一个视频

在 Hermes 中输入：

```
使用 HyperDirector，把下面这篇文章做成 30 秒视频号竖屏短视频。
使用我的 brand-kit，前 3 秒强 hook，中间 3 个核心观点，结尾引导关注。

[粘贴你的文章或任何文字内容]
```

HyperDirector 会依次完成：

```
1. 能力判断 → 确认请求适合 HyperDirector
2. Brief 生成 → brief.json（结构化需求）
3. 分镜生成 → storyboard.json（场景/时长/字幕）
4. 视觉设计 → DESIGN.md（颜色/字体/动效决策）
5. HTML 合成 → index.html（HyperFrames 源码）
6. QA 质检 → npx hyperframes lint + validate
7. 渲染报告 → render-report.md
```

整个过程约 1–3 分钟。

---

## 第五步：查看输出文件

生成完成后，检查 `output/` 目录：

```bash
node hyperdirector/scripts/check-output-contract.js output/你的项目名/
```

标准输出结构：

```
output/你的项目名/
├── brief.json             ← 结构化需求
├── storyboard.json        ← 分镜（可直接编辑）
├── script.md              ← 旁白文稿
├── DESIGN.md              ← 视觉设计说明
├── brand-used.json        ← 本次品牌配置快照
├── index.html             ← 视频源码（浏览器可打开）
├── preview.html           ← 预览入口
├── edit-instructions.md   ← 二次编辑指南
├── render-report.md       ← QA 报告
└── assets/                ← 素材目录
```

**浏览器预览：**

```bash
open output/你的项目名/preview.html
```

**渲染 MP4：**

```bash
cd output/你的项目名/
npx hyperframes preview        # 先看效果
npx hyperframes render --quality high --output final.mp4
```

---

## 常见第一次问题

**Q：Hermes 没有识别 HyperDirector？**

确认 `SKILL.md` 文件存在于 `hyperdirector/` 目录下，且目录在 Hermes skills 加载路径中。重启 Hermes 会话后重试。

**Q：生成结果和我想的不一样？**

这很正常。直接告诉 Hermes 需要修改的地方：

```
把 hook 改成"AI Agent 终于能当视频导演了"，字幕大一号，CTA 改成"前往你的落地页订阅"
```

HyperDirector 会局部修改，不会重写整个项目。

**Q：render 报错了？**

```bash
npx hyperframes lint     # 查看具体错误
```

也可以把错误信息发给 Hermes，HyperDirector 会进入自动修复流程（最多 3 次）。

---

## 下一步

- [第一个视频完整教程 →](./first-video.md)
- [Brand Kit 配置指南 →](./brand-kit-setup.md)
- [模板选择指南 →](./template-guide.md)
- [示例项目 →](../examples/zh-CN/)
