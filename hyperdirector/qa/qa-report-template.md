# QA Report Template

> 复制本文件到 `output/qa-report.md`，在每次 QA 循环结束后填写。

---

## 项目信息

| 字段 | 值 |
|------|----|
| **项目名称** | <!-- brief.title --> |
| **平台** | <!-- brief.platform --> |
| **时长（秒）** | <!-- brief.duration_seconds --> |
| **模板** | <!-- brief.template --> |
| **QA 执行时间** | <!-- YYYY-MM-DD HH:mm --> |
| **QA 执行人** | <!-- Agent / 用户名 --> |
| **尝试次数** | <!-- 1 / 2 / 3 --> |

---

## 检查结果总览

| 检查项 | 状态 | 备注 |
|--------|------|------|
| Brief 校验 | ✅ 通过 / ❌ 失败 | |
| Storyboard 校验 | ✅ 通过 / ❌ 失败 | |
| Brand Kit 校验 | ✅ 通过 / ❌ 失败 | |
| Assets 存在性 | ✅ 通过 / ❌ 失败 | |
| 输出合约检查 | ✅ 通过 / ❌ 失败 | |
| HTML Preview | ✅ 通过 / ❌ 失败 | |
| Render | ✅ 通过 / ❌ 失败 | |
| 最终交付清单 | ✅ 通过 / ❌ 失败 | |

**整体结论：**

- [ ] ✅ 全部通过，可交付
- [ ] ⚠️ 有警告，已记录，可交付
- [ ] ❌ 有阻塞错误，需人工介入

---

## 错误详情

> 若无错误，删除本节或写"无"。

### 错误 1

- **来源文件：** `output/storyboard.json`
- **错误信息：**
  ```
  ✗ duration mismatch — scenes sum = 32s, total_duration = 30s (diff: 2.00s)
  ```
- **分类：** 时长不匹配
- **修复操作：** 将 scene_05.duration 从 5 改为 3
- **修复后状态：** ✅ 通过

### 错误 2

<!-- 按上方格式继续填写 -->

---

## 修复记录

| 尝试 | 修改文件 | 修改内容 | 结果 |
|------|---------|---------|------|
| 第 1 次 | | | |
| 第 2 次 | | | |
| 第 3 次 | | | |

---

## 警告（不阻塞交付）

> 可选填写：记录不影响交付但值得关注的问题。

- [ ] <!-- 警告内容 -->

---

## 交付文件确认

```
output/
├── final.mp4          [ 存在 / 缺失 ]  大小: _____ MB
├── index.html         [ 存在 / 缺失 ]
├── preview.html       [ 存在 / 缺失 ]
├── DESIGN.md          [ 存在 / 缺失 ]
├── storyboard.json    [ 存在 / 缺失 ]
├── brief.json         [ 存在 / 缺失 ]
├── script.md          [ 存在 / 缺失 ]
├── brand-used.json    [ 存在 / 缺失 ]
├── render-report.md   [ 存在 / 缺失 ]
└── edit-instructions.md [ 存在 / 缺失 ]
```

---

## 下一步建议

> QA 通过后，记录改进点供下一轮迭代参考。

- 
- 

---

*本报告由 HyperDirector QA 流程生成，模板位于 `hyperdirector/qa/qa-report-template.md`。*
