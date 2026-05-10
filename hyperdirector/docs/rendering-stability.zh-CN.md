# 渲染稳定性（Headless / 离线 / 预览与成片一致）

本文是面向中文读者的摘要；可执行条款以英文规则文件为准。

## 应阅读的规则

- `rules/headless-rendering-stability.md` — 字体、emoji、GSAP 来源、`@media`、动效与可读性  
- `rules/hyperframes-core-rules.md` — R-CORE-07、R-CORE-12（GSAP：CDN 与 `assets/gsap.min.js` 二选一）  
- `rules/gsap-deterministic-rules.md` — R-GSAP-09（CSS `transform` 与 GSAP `scale` / 位移动画）

## 辅助检查（非权威）

以下脚本**只输出警告**，**不能**替代 `npx hyperframes lint`：

```bash
node hyperdirector/scripts/check-composition-hazards.js output/<项目>/index.html
```

详见 `qa/pre-render-checklist.md` 中的说明。

## 关于 `examples/**/output/`

该目录下的示例 HTML 可能是历史生成物（例如仍含远程字体链接），**仅作结构参考**，**不代表**生产渲染推荐路径。后续会有单独的 examples 刷新任务。

## 排障

预览正常但成片异常时，除资源路径与时间轴外，还应排查：无头环境字体、外网依赖超时、浏览器缓存等。见 `qa/troubleshooting.md`。
