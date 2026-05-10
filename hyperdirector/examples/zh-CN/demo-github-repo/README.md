# Demo：GitHub README 转视频

> 示例场景：把虚构开源项目 Agent Video OS 的 README 转成 30 秒开源发布视频。

---

## 示例说明

本 demo 演示"开源项目发布视频"场景：把 GitHub README 变成介绍项目的短视频。

| 字段 | 值 |
|------|----|
| **输入** | `input/readme-sample.md` |
| **模板** | ai-knowledge-explainer-kit |
| **比例** | 9:16 竖屏（1080×1920） |
| **时长** | 30 秒 |
| **平台** | 视频号 |
| **品牌色** | 科技青 `#58C7F3` |
| **设计风格** | GitHub 开发者暗色系 |

---

## 目录结构

```
demo-github-repo/
├── README.md                           ← 本文件
├── input/
│   └── readme-sample.md                ← 虚构项目 README（用户输入）
└── output/
    ├── brief.json                       ← 结构化需求
    ├── storyboard.json                  ← 5 场景分镜
    ├── script.md                        ← 逐场景旁白脚本
    ├── DESIGN.md                        ← 视觉设计决策
    ├── brand-used.json                  ← 品牌配置快照（GitHub 暗色系）
    ├── index.html                       ← HyperFrames 合成（可渲染）
    ├── preview.html                     ← 浏览器预览入口
    ├── edit-instructions.md             ← 二次编辑指南
    ├── render-report.sample.md          ← 模拟渲染报告
    └── assets/
        └── README.md                    ← 资产说明（当前为占位）
```

---

## 场景结构（5 场景 · 30 秒）

| 场景 | 时长 | Purpose | 内容 |
|------|------|---------|------|
| scene_01 | 4s | big_claim | "把 AI Agent 变成视频操作系统" |
| scene_02 | 6s | context | 现有工具的三个问题（红叉列表）|
| scene_03 | 7s | mechanism | 五模块 Pipeline 流程图 |
| scene_04 | 7s | use_case | 三类适合用户卡片 |
| scene_05 | 6s | action | GitHub Star + 安装命令 CTA |

---

## 如何预览

```bash
# 打开 preview.html（推荐）
open output/preview.html

# 或直接打开 index.html，点击画面播放
open output/index.html
```

---

## 如何渲染

```bash
# 1. 检查环境
node hyperdirector/scripts/check-env.js

# 2. 校验文件
node hyperdirector/scripts/validate-storyboard.js output/storyboard.json output/brief.json

# 3. 进入 output 目录
cd hyperdirector/examples/zh-CN/demo-github-repo/output

# 4. 预览
npx hyperframes preview index.html

# 5. 渲染
npx hyperframes render --input index.html --output final.mp4 --quality high
```

---

## 如何用于你的真实项目

把此 demo 改成你的开源项目发布视频，只需：

1. 替换 `input/readme-sample.md` 为你的真实 README
2. 向 Hermes 发送：

   ```
   使用 HyperDirector，把这个 README 改成 demo-github-repo 的格式，
   替换 Agent Video OS 的所有内容为我的项目信息。
   ```

3. 或直接手动修改 `output/` 中的文件，参考 `edit-instructions.md`

---

## 已知限制（v0.1）

- `final.mp4` 未包含，需本地渲染
- 使用 Emoji 作为用户类型图标，部分渲染环境可能不一致（替换为 SVG 更稳定）
- 示例 `output/` 可能含历史产物（如远程字体链接），**不代表**生产渲染推荐路径；生产请见 `docs/rendering-stability.zh-CN.md`

---

## 示例提示词

```
使用 HyperDirector，把这个 GitHub README 变成 30 秒开源项目发布视频。
讲清楚它解决什么问题、核心机制是什么、适合谁用、如何开始使用。
使用 ai-knowledge-explainer-kit 模板，9:16 竖屏，视频号平台。
风格：GitHub 开发者风格，工程感强，青色强调色。
结尾引导 GitHub Star 和 npm install。
```
