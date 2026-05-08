# Workflow: Product Page to Demo

将产品落地页、SaaS 功能介绍、产品官网内容转化为专业的产品 demo 视频。

---

## 适用场景

| 内容来源 | 典型示例 |
|---------|---------|
| SaaS 产品落地页 | 功能介绍页、pricing 页、how-it-works 区块 |
| App Store / 应用市场页面 | 应用功能描述 + 截图 |
| 产品官网 | About 页、Features 页 |
| 内部产品文档 | 功能说明、onboarding 流程说明 |
| 新功能上线公告 | Release 说明、更新日志 |

**这个工作流的核心目的：** 把"文字+截图"转化为"动态演示"，传达产品的核心价值感。

---

## 输入材料

| 材料 | 必需 | 说明 |
|------|------|------|
| 产品页文本 | 是 | 粘贴页面核心文案，或提供 URL |
| 产品截图 | 推荐 | 最多 3 张；放入 `input/assets/screenshot-*.png` |
| 核心功能列表 | 推荐 | 明确要展示哪 2–3 个功能 |
| CTA 文案 | 推荐 | 最终视频要引导用户做什么 |
| 数据指标（可选） | 否 | 如"节省 80% 时间"等数据点，增强说服力 |

**截图规格：** PNG 或 JPG，最小 780×400px，内容清晰可读。

---

## 推荐模板

**首选：`saas-demo-kit`**

- 16:9（YouTube/B 站/网站嵌入）
- 9:16（微信视频号/TikTok，需在 brief 中指定）

场景结构：problem → product_reveal → feature_1 → feature_2 → feature_3 → cta

---

## 执行步骤

```
准备阶段（用户操作）
  ① 把截图保存到 input/assets/screenshot-01.png（最多 3 张）
  ② 把产品文案保存到 input/product-page.md 或直接粘贴
  ③ 确定：3 个要展示的核心功能 + 1 个 CTA

Stage 01 — Capability Judge
  ↓ task_type = product_demo → suitable
  ↓ template = saas-demo-kit

Stage 02 — Intake Brief
  ↓ goal = "展示 [产品名] 的 3 个核心功能，驱动 [用户行动]"
  ↓ input_type = "product_page"
  ↓ source_materials = [截图列表 + 文案文件]
  ↓ aspect_ratio = 16:9（默认）或按用户指定
  ↓ duration_seconds = 45（saas-demo-kit 默认）
  ↓ 写入 output/brief.json

Stage 03 — Storyboard Generator
  ↓ scene_01 (problem): 从产品页提取痛点/问题
  ↓ scene_02 (product_reveal): 产品 + 核心价值主张
  ↓ scene_03–05 (feature_1–3): 3 个核心功能，各 8s
  ↓ scene_06 (cta): 行动引导
  ↓ assets 字段引用提供的截图路径
  ↓ 写入 output/storyboard.json + output/script.md

Stage 04 — Visual Design
  ↓ 产品截图分配到对应场景（scene_02 = 主截图）
  ↓ 写入 output/DESIGN.md

Stage 05 — Compose HyperFrames
  ↓ 截图加载到 .screenshot-body 区域
  ↓ 写入 output/index.html + output/preview.html

Stage 06 — QA Fixer
  ↓ 验证截图路径正确，无 MISSING_ASSET
  ↓ lint → fix（最多 3 次）

Stage 07 — Render Report
  ↓ 写入 output/render-report.md
```

---

## 生成文件

```
output/
├── brief.json            ← input_type: "product_page"，source_materials 含截图
├── storyboard.json       ← 6 场景，含截图资源引用
├── script.md
├── DESIGN.md             ← 截图分配说明
├── index.html            ← 截图嵌入 .screenshot-body
├── preview.html
├── brand-used.json
├── render-report.md
└── assets/
    ├── screenshot-01.png
    ├── screenshot-02.png
    └── screenshot-03.png
```

---

## 用户可复制的调用示例

### 有截图 + 有功能说明

```
用 HyperDirector 把这个产品做成 45 秒 demo 视频。
模板：saas-demo-kit，16:9
截图已放在 input/assets/ 目录下（screenshot-01.png 到 screenshot-03.png）

产品：[产品名]
核心功能（按优先级）：
1. [功能一：一句话说明]
2. [功能二：一句话说明]
3. [功能三：一句话说明]

痛点：[目标用户的核心问题]
CTA：预约 demo / 立即免费试用 / 查看完整功能
```

### 只有产品页 URL

```
把这个产品页转成 45 秒 demo 视频：
https://www.example.com/product

自动提取核心功能和截图区域文案。
平台：YouTube（16:9）
语气：专业、高级、科技感
CTA：点击链接了解更多
```

### 新功能上线公告

```
把这个新功能上线公告转成 30 秒短视频：

[粘贴 release notes 或公告文案]

重点：这个功能解决了什么问题，怎么用，效果如何
截图：input/assets/feature-screenshot.png
平台：微信视频号（9:16）
```

---

## 常见失败点

| 失败现象 | 原因 | 解决方式 |
|---------|------|---------|
| 截图显示为空白/占位符 | 截图路径不匹配 | 确认截图文件在 `output/assets/` 目录，路径使用 `assets/screenshot-01.png` |
| 功能卡片内容空洞 | 产品文案没有具体描述功能细节 | 补充"每个功能一句话说明它解决什么问题" |
| 痛点场景（scene_01）不痛 | 产品页没有明确写痛点 | 手动补充痛点描述："用户现在的做法是 X，导致 Y 问题" |
| 视频像产品说明书 | 功能依次罗列，无叙事弧 | 要求 Agent："problem → solution，有因果关系，不要平铺直叙" |
| 截图文字在 9:16 上太小 | 横屏截图在竖屏画布里缩放后不可读 | 截图提供竖向裁切版本，或改用 16:9 |

---

## QA 检查点

```
[ ] brief.json 的 source_materials 包含所有截图路径
[ ] storyboard.json 的 scenes[*].assets 引用了对应截图
[ ] output/assets/ 目录下截图文件实际存在
[ ] index.html 中 .screenshot-body 有内容（非空）
[ ] 无 MISSING_ASSET lint 错误
[ ] 功能场景（feature_1–3）各有独立标题，不重复
[ ] CTA 场景有明确行动指向
```

---

## 输出验收标准

- `brief.json` 的 `goal` 包含产品名称和目标行动
- `storyboard.json` 中 `scenes[1].purpose == "product_reveal"`
- `storyboard.json` 中至少 2 个场景的 `assets` 数组非空（有截图引用）
- `index.html` 打开后截图区域有内容（截图或占位符均可，无 broken image）
- `render-report.md` 中若有 `[PLACEHOLDER]` 资源，须在 known_issues 中说明
