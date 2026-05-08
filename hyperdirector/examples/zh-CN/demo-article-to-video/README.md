# Demo：文章转视频

> 示例场景：把一篇介绍 HyperDirector 的文章转成 30 秒视频号竖屏短视频。

---

## 示例说明

本 demo 演示 HyperDirector 的核心工作流：文章 → brief → storyboard → DESIGN.md → HTML。

**输入：** 一篇文章（见 `input/article.md`）
**输出：** brief.json + storyboard.json + DESIGN.md + index.html（sample，未真实渲染）
**模板：** ai-knowledge-explainer-kit
**比例：** 9:16 竖屏
**时长：** 30 秒

---

## 目录结构

```
demo-article-to-video/
├── README.md
├── input/
│   └── article.md              ← 输入文章
└── output/
    ├── brief.json              ← 结构化需求（6 字段）
    ├── storyboard.json         ← 6 场景分镜
    ├── script.md               ← 逐场景旁白脚本
    ├── DESIGN.md               ← 视觉设计决策说明
    ├── brand-used.json         ← 本次品牌配置快照
    ├── index.html              ← HyperFrames 合成（可渲染）
    ├── preview.html            ← 浏览器预览入口
    ├── edit-instructions.md    ← 二次编辑指南
    ├── render-report.md        ← 质检报告（render 未执行）
    └── assets/
        └── README.md           ← 资产说明（当前为占位）
```

---

## 如何运行此 Demo

### 方法一：直接向 Hermes 提问

```
使用 HyperDirector，按照 hyperdirector/examples/zh-CN/demo-article-to-video/input/article.md 
的内容，生成一个 30 秒视频号竖屏短视频。使用 ai-knowledge-explainer-kit 模板。
```

### 方法二：查看 sample 输出

`output/` 目录下的文件是此 demo 的 sample 输出，可以直接查看格式和内容参考。

**注意：** sample 中的 `index.html` 是结构完整的 HyperFrames composition，但 final.mp4 未包含，因为渲染需要本地 HyperFrames CLI 环境。

### 方法三：自行渲染

如果你已安装 HyperFrames CLI，进入 `output/` 目录运行：
```bash
npx hyperframes lint          # 先检查
npx hyperframes preview       # 预览效果
npx hyperframes render --quality high --output final.mp4
```

---

## Sample 输出说明

`output/render-report.md` 中的渲染状态为 `NOT_EXECUTED`，这是正常的——demo sample 不包含真实渲染过程。

所有源文件（brief.json、storyboard.json、DESIGN.md、index.html）都是真实可用的内容，不是占位符。
