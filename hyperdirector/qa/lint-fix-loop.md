# Lint / Fix Loop

当 lint、preview 或 render 任一阶段失败时，按以下循环修复，最多重试 3 次。

---

## 循环流程图

```
┌─────────────────────────────┐
│   触发：lint / preview /     │
│         render 报告错误      │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│  Step 1: 读取错误输出        │
│  • 完整复制错误信息           │
│  • 记录错误来源文件/行号       │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│  Step 2: 分类错误            │
│  见下方「错误分类表」         │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│  Step 3: 局部修复            │
│  • 仅修改报错的文件/字段       │
│  • 不改动通过的场景           │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│  Step 4: 重新检查            │
│  运行对应的校验脚本           │
└──────────────┬──────────────┘
               │
        ┌──────┴──────┐
        │              │
       通过            失败
        │              │
        ▼              ▼
   进入下一        重试 ≤ 3 次
    阶段           超出 → 输出报告
                   并停止
```

---

## Step 1：读取错误输出

执行任意校验脚本或 CLI 命令后，完整保存终端输出。关键信息：

- **Exit code**（0=通过，1=失败）
- **错误行**：通常格式为 `✗ <字段> — <原因>`
- **源文件路径**：绝对路径或相对路径

---

## Step 2：错误分类表

| 错误类型 | 特征关键词 | 典型修复方向 |
|----------|-----------|-------------|
| **Schema 字段缺失** | `missing required field` | 在 JSON 文件中补充对应字段 |
| **Schema 字段非法值** | `invalid value` / `enum` | 检查枚举列表，更正为合法值 |
| **时长不匹配** | `duration mismatch` / `±0.5s` | 调整 storyboard 场景时长或 total_duration |
| **Asset 路径不存在** | `file not found` / `asset missing` | 检查路径拼写，确认文件存在 |
| **颜色格式错误** | `#RRGGBB` / `hex color` | 改为 6 位十六进制格式 |
| **ID 格式错误** | `scene_NN` / `pattern` | 确保 id 为 scene_01 … scene_12 |
| **字幕超长** | `caption too long` | 压缩 caption 至 ≤ 150 字符 |
| **HTML timeline 不一致** | `data-duration mismatch` | 使 HTML 与 storyboard 时长同步 |
| **渲染崩溃** | `FFmpeg error` / `render failed` | 见 troubleshooting.md |

---

## Step 3：局部修复原则

1. **最小改动**：只修改报错的字段，不要重写整份文件。
2. **保留通过的场景**：storyboard 中只修复失败的 scene，不动其他。
3. **改完立即保存**，不要积累多处修改后一次性检查。
4. **记录修改内容**（写进 qa-report）：改了什么、为什么。

---

## Step 4：重新检查命令

```bash
# Brief 修复后
node hyperdirector/scripts/validate-brief.js output/brief.json

# Storyboard 修复后
node hyperdirector/scripts/validate-storyboard.js output/storyboard.json

# Brand Kit 修复后
node hyperdirector/scripts/validate-brand-kit.js <brand-kit路径>

# 输出合约修复后
node hyperdirector/scripts/check-output-contract.js output/

# HTML preview 检查
npx hyperframes preview output/index.html
```

---

## 重试计数与停止条件

```
尝试 1 → 修复 → 重新检查
尝试 2 → 修复 → 重新检查
尝试 3 → 修复 → 重新检查
─────────────────────────────
超过 3 次仍失败 → 停止自动修复
→ 填写 qa-report-template.md
→ 标记为「需要人工介入」
```

**何时立即停止（不等 3 次）：**

- 每次修复后错误信息**完全相同**（陷入循环）
- 修复内容导致新增了**其他字段的错误**
- 错误来源是**外部工具崩溃**（FFmpeg、HyperFrames CLI 异常）

---

## 最终输出报告

循环结束后，将结果写入 `output/qa-report.md`，格式参考 `qa-report-template.md`。

```bash
# 简单检查脚本可自动生成摘要：
node hyperdirector/scripts/check-output-contract.js output/ > output/qa-report.md
```
