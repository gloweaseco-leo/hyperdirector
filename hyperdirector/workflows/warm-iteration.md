# Workflow: Warm Iteration（暖迭代）

基于已有视频进行**局部修改**。不重新生成全部内容，只改用户指定的部分，保留品牌风格和未被触及的场景。

---

## 适用场景

| 需求 | 示例 |
|-----|------|
| 修改文案 | "把第三个场景的标题改掉" |
| 调整时长 | "前两个场景各缩短 2 秒" |
| 替换 CTA | "把结尾 CTA 改成关注公众号" |
| 更换视觉风格 | "第二个场景背景色太亮，改暗一点" |
| 品牌刷新 | "用新的品牌色更新整个视频" |
| 添加场景 | "在第三和第四场景之间插入一个过渡场景" |
| 删除场景 | "去掉第四个场景" |
| 修复已知问题 | "字幕出了安全区，帮我修一下" |

**原则：不改的不碰。** 只修改用户明确要求修改的内容，其余 scene、样式、timeline 保持原状。

---

## 输入材料

| 材料 | 必需 | 说明 |
|------|------|------|
| 已有 output 目录 | 是 | 包含 `index.html`、`storyboard.json` 的完整输出目录 |
| edit-request 描述 | 是 | 用户的修改指令（自然语言或结构化） |
| target_scene_ids | 推荐 | 明确指定要改哪些场景（如 `["scene-03", "scene-05"]`） |
| brand-used.json | 是 | 确认品牌配置不变 |

**如果用户愿意，提供一份结构化 edit-request.json（符合 `schemas/edit-request.schema.json`）会让修改更精准。**

---

## 推荐模板

暖迭代不切换模板。沿用原视频的模板和 brand-kit，只修改指定部分。

---

## 执行步骤

```
准备阶段（用户操作）
  ① 打开已有 output/ 目录，确认 storyboard.json 和 index.html 存在
  ② 用自然语言说清楚要改什么，最好附上 scene_id
  ③ （可选）填写 edit-request.json

Stage 08 — Warm Iteration
  ↓ 读取 output/storyboard.json，识别全部场景
  ↓ 读取 output/brand-used.json，确认品牌配置
  ↓ 解析用户指令，确定 edit_scope（受影响的 scene_id 列表）
  ↓ 分类 edit_type：
    copy_rewrite: 只改文案，不改 HTML 结构
    visual_redesign: 只改对应 scene 的 CSS/HTML
    timing_adjust: 只改 data-duration 和 timeline 时长
    cta_update: 只改最后一个 scene
    brand_refresh: 更新全部 CSS 变量（不改场景内容）
    scene_add / scene_remove / scene_reorder: 修改 storyboard.json 结构
  ↓ 外科手术式修改 index.html（只改受影响的 HTML 节点）
  ↓ 更新 storyboard.json（只修改受影响的 scene 字段）
  ↓ 不改动未被指定的场景（即使发现可以优化也不动）

修改后验证
  ↓ npx hyperframes lint output/index.html（缩减版，只检查改动区域）
  ↓ 如果 total_duration 变化 → 验证 window.__timelines[0].totalDuration() 正确
  ↓ 写入 output/edit-instructions.md（append，不覆盖）
```

---

## 生成文件

```
output/
├── index.html            ← 局部修改后的版本（非全量重写）
├── storyboard.json       ← 对应更新的场景
├── edit-instructions.md  ← append 新增一条记录
└── render-report.md      ← 若重新渲染，更新此文件
```

**不会重新生成的文件：** brief.json、script.md（除非明确要求）、DESIGN.md、brand-used.json。

---

## 用户可复制的调用示例

### 修改文案

```
基于已有的视频（output/ 目录），做以下修改：

修改 scene-03 的标题：
原文：AI 工具 vs 传统工具
改为：AI Agent 一个人顶一个团队

其余场景不变。

记录这次修改到 edit-instructions.md。
```

### 调整时长

```
把 output/ 目录里的视频做以下时长调整：
- scene-01: 从 5 秒改为 3 秒
- scene-05: 从 6 秒改为 8 秒
总时长保持 30 秒不变（其余场景时长等比调整）

不改文案和视觉。
```

### 替换 CTA

```
把结尾 CTA 场景（scene-06）的文案替换：
原文：关注我们了解更多
改为：关注示例创作者，继续拆解能干活的 AI Agent

CTA 按钮文字：立即关注
品牌色不变，视觉风格不变。
```

### 品牌刷新

```
用新的品牌色更新整个视频的视觉，但不改场景结构和文案。

原色系：--color-primary: #0F172A; --color-accent: #38BDF8
新色系：--color-primary: #1A1A2E; --color-accent: #E94560

只更新 CSS 变量，不改 HTML 结构。
```

### 结构化 edit-request.json

```json
{
  "source_output": "output/",
  "target_scene_ids": ["scene-03"],
  "edit_type": "copy_rewrite",
  "user_instruction": "把 scene-03 的标题改为'AI Agent 一个人顶一个团队'，副标题保持",
  "preserve_brand": true,
  "preserve_timing": true,
  "expected_output": {
    "format": "html_only",
    "re_render": false,
    "write_edit_report": true
  }
}
```

---

## 常见失败点

| 失败现象 | 原因 | 解决方式 |
|---------|------|---------|
| 全量重写了 index.html | Agent 没有读取 storyboard.json 做定向修改 | 在指令中明确："只修改 scene-0X，不重写整个文件" |
| 总时长变化导致 timeline 错位 | 修改了场景时长但未更新 GSAP 时间轴 | 修改 `data-duration` 后必须重算对应 scene 的 timeline offset |
| 品牌色被局部修改破坏 | 在某个 scene 中硬编码了颜色 | 确保所有颜色使用 CSS 变量，刷新时只改变量值 |
| edit-instructions.md 被覆盖 | Agent 使用了写入模式而非追加 | 明确要求 "append to edit-instructions.md"，不清空原有记录 |
| 指定场景被改，其他场景也有变化 | Agent 扩大了修改范围 | 在指令末尾加："除以上指定内容外，其余场景一律不动" |

---

## QA 检查点

```
[ ] storyboard.json 中未指定修改的 scene 字段未发生变化（diff 验证）
[ ] index.html 中 window.__timelines 注册的 timeline 总时长正确
[ ] 如果修改了场景数量，总 data-duration 之和 == brief.duration_seconds
[ ] edit-instructions.md 中有本次修改的记录（时间戳 + 修改内容摘要）
[ ] npx hyperframes lint 无新增 error（允许保留已知 known_issues）
[ ] 品牌色 / 字体 CSS 变量未被局部硬编码替换
```

---

## 输出验收标准

- `storyboard.json` 中未指定 scene 的所有字段与修改前完全一致
- `index.html` 修改范围精确，未指定的 scene HTML 块内容不变
- `edit-instructions.md` 包含本次迭代记录（edit_type、修改内容、执行时间）
- `render-report.md` 若更新，lint 状态不低于修改前的状态（不能引入新 blocking error）
- 修改后 `preview.html` 在浏览器可打开，动画可播放，无 JS 错误
