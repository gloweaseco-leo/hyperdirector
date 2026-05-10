# Demo：SaaS 产品 Demo 视频

> 示例场景：把 HyperDirector 的产品能力转成 45 秒横屏产品 Demo 视频。

---

## 示例说明

本 demo 演示 `saas-demo-kit` 模板的完整工作流：产品说明 → 结构化分镜 → HTML 合成。

| 字段 | 值 |
|------|----|
| **输入** | `input/product-brief.md` |
| **模板** | saas-demo-kit |
| **比例** | 16:9 横屏（1920×1080） |
| **时长** | 45 秒 |
| **平台** | YouTube / B 站 |
| **品牌色** | Purple `#8B5CF6` |

---

## 目录结构

```
demo-saas-product/
├── README.md                          ← 本文件
├── input/
│   └── product-brief.md               ← 产品说明（用户输入）
└── output/
    ├── brief.json                      ← 结构化需求
    ├── storyboard.json                 ← 7 场景分镜
    ├── script.md                       ← 逐场景旁白脚本
    ├── DESIGN.md                       ← 视觉设计决策
    ├── brand-used.json                 ← 本次品牌配置快照
    ├── index.html                      ← HyperFrames 合成（可渲染）
    ├── preview.html                    ← 浏览器预览入口
    ├── edit-instructions.md            ← 二次编辑指南
    ├── render-report.sample.md         ← 模拟渲染报告
    └── assets/
        └── README.md                   ← 资产说明（当前为占位）
```

---

## 场景结构（7 场景 · 45 秒）

| 场景 | 时长 | Purpose | 内容 |
|------|------|---------|------|
| scene_01 | 4s | hook | 痛点引入："内容制作，还在手动排版？" |
| scene_02 | 7s | problem | 三个具体痛点（红叉列表） |
| scene_03 | 7s | product_reveal | HyperDirector 产品亮相 |
| scene_04 | 6s | feature_1 | 一句话生成完整分镜 |
| scene_05 | 6s | feature_2 | Brand Kit 一次配置永久生效 |
| scene_06 | 6s | feature_3 | 自动 QA，失败自动修复 |
| scene_07 | 9s | cta | 立即预约 Demo |

---

## 如何预览

```bash
# 方法一：直接打开 preview.html
open output/preview.html

# 方法二：打开 index.html，点击画面播放动画
open output/index.html
```

---

## 如何渲染

```bash
# 1. 安装依赖
npm install -g hyperframes

# 2. 检查环境
node hyperdirector/scripts/check-env.js

# 3. 校验文件
node hyperdirector/scripts/validate-storyboard.js output/storyboard.json output/brief.json

# 4. 进入 output 目录
cd hyperdirector/examples/zh-CN/demo-saas-product/output

# 5. 预览
npx hyperframes preview index.html

# 6. 渲染
npx hyperframes render --input index.html --output final.mp4 --quality high
```

---

## 如何二次编辑

详见 `output/edit-instructions.md`。常见编辑：

- 改产品名称 → `index.html` + `storyboard.json` → scene_03
- 改痛点列表 → `index.html` → `#scene_02 .pain-list`
- 改 CTA URL → `brief.json` → `cta_override` + `index.html` → `#scene_07 .cta-url`
- 改品牌色 → `brand-used.json` → `colors.accent` + `index.html` → `:root --color-accent`

---

## 已知限制（v0.1）

- `final.mp4` 未包含，需本地渲染
- Assets 目录为空，`index.html` 使用 CSS 占位效果
- 示例 `output/` 可能含历史产物（如远程字体链接），**不代表**生产渲染推荐路径；生产请见 `docs/rendering-stability.zh-CN.md`

---

## 示例提示词

向 Hermes 发送以下消息，可重新生成本示例：

```
使用 HyperDirector，把 input/product-brief.md 的产品说明
转成 45 秒 YouTube 横屏产品 Demo 视频。
使用 saas-demo-kit 模板，16:9。
突出三个功能：结构化分镜、Brand Kit、自动 QA。
风格干净、高级、科技感。
结尾引导预约 Demo。
```
