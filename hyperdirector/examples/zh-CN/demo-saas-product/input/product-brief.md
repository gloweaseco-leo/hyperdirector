# Product Brief — HyperDirector

> 本文件是 demo-saas-product 的输入素材，模拟用户向 Hermes 提供的产品说明。

---

## 产品概述

**产品名称：** HyperDirector  
**定位：** 运行在 AI Agent（Hermes）中的视频导演引擎  
**目标用户：** AI 内容创作者、产品经理、技术型创作者  
**核心价值：** 用自然语言生成可渲染的专业短视频工程

---

## 用户痛点

1. **手动制作短视频耗时严重**：从文章到视频，需要手动排版、切片、配色，反复修改
2. **品牌一致性难维护**：多人多工具协作时，品牌色/字体/CTA 很容易出现偏差
3. **技术门槛高**：HyperFrames / CSS animation / GSAP 需要前端知识才能操控
4. **质检流程缺失**：没有系统性的 lint → validate → render 流程，出错难定位

---

## 三大核心功能

### 功能 1：结构化分镜生成
- 输入：文章 / 产品页 / README / PRD
- 输出：brief.json + storyboard.json + script.md
- 特点：场景数、时长、目的（purpose）自动规划，无需手动拆分

### 功能 2：Brand Kit 持久化
- 一次配置，永久生效
- 包含：品牌色、字体、语气、CTA 变体、安全区
- 所有生成视频自动套用，无需每次重设

### 功能 3：自动 QA 修复循环
- 三阶段：lint → validate → render
- 最多自动重试 3 次
- 失败后输出结构化 qa-report.md，清楚定位问题

---

## 产品 Demo 视频需求

- **平台：** YouTube / B 站（横屏优先）
- **时长：** 45 秒
- **比例：** 16:9
- **模板：** saas-demo-kit
- **风格：** 干净、高级、科技感，面向技术决策者
- **CTA：** 立即预约 Demo

---

*本文件由 HyperDirector 示例包提供，作为产品 Demo 视频的输入素材。*
