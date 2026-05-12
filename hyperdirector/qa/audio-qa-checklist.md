# Audio QA Checklist

音频资产进入生产渲染前必须逐项确认。所有 ✅ 通过后，方可将 `audio-manifest.json` 中相关条目标记为 `render_safe: true`，并执行 `npx hyperframes render`。

> 规则参考：`rules/audio-director-rules.md`  
> 流程参考：`docs/audio-workflow.zh-CN.md`  
> 字幕：`schemas/caption-timeline.schema.json`

---

## 1. 音频文件存在性

| 检查项 | 规则 | 说明 |
|--------|------|------|
| ✅ 所有 `local_path` 文件实际存在于磁盘 | R-AUD-01 | 相对于 `output/` 目录 |
| ✅ `format` 为 mp3 / m4a / wav / ogg / opus 之一 | R-AUD-05 | 避免不兼容格式 |
| ✅ 合成 HTML 中 `<audio src>` 引用的是本地路径 | R-AUD-01 | 不含 `http://` / `https://` |
| ✅ 合成 HTML 中所有 `<audio>` 元素均有 `src` 属性 | — | 无 src 的 audio 标签无意义 |

**辅助扫描（非阻断）：**
```bash
node hyperdirector/scripts/check-composition-hazards.js output/index.html
```

---

## 2. segment_id 唯一性

| 检查项 | 说明 |
|--------|------|
| ✅ `audio-manifest.json` 中所有 `segment_id` 唯一 | 重复 segment_id 会导致引用歧义 |
| ✅ `caption-timeline.json` 中所有 `caption_id` 唯一 | — |
| ✅ `caption_ref` 引用的 `caption_id` 在 caption-timeline 中存在 | 悬空引用 |
| ✅ `segment_id` 引用的场景 `scene_id` 在 storyboard 中存在 | 避免绑定到不存在的场景 |

---

## 3. 场景绑定（scene_id / shot_id）

| 检查项 | 说明 |
|--------|------|
| ✅ 每个 segment 的 `scene_id` 与 storyboard.json 中的场景 id 完全匹配 | 区分大小写，格式如 `scene_01` |
| ✅ 需要语音的每个场景至少有一个 segment 与之绑定 | 无绑定 = 该场景无旁白（是否有意？记录在 notes） |
| ✅ `start_ms` 和 `end_ms` 与对应场景在时间轴上的位置吻合 | — |

---

## 4. Transcript 和字幕文本

| 检查项 | 规则 | 说明 |
|--------|------|------|
| ✅ 每个 segment 的 `transcript` 字段非空 | R-AUD-02 | render_safe 的必要条件 |
| ✅ 对应的 `caption-timeline.json` 中字幕文本与 transcript 含义一致 | R-AUD-08 | 允许断行差异，不允许语义差异 |
| ✅ 字幕文本换行合理（中文建议每行 ≤ 20 字，英文 ≤ 50 字） | — | — |
| ✅ 多语言字幕已区分 `language` 字段 | — | — |

---

## 5. 时长合理性

| 检查项 | 规则 | 说明 |
|--------|------|------|
| ✅ 每个 segment 的 `duration_ms` 已填写 | R-AUD-07 | 无法做时长校验 |
| ✅ segment `duration_ms` 不超过对应 scene `data-duration` 的 110% | R-AUD-07 | 超出则音频会被切断或视频需延长 |
| ✅ 所有 segment 时长之和不超过 brief.duration_seconds × 1000 | R-AUD-07 | 避免音频超出视频总时长 |
| ✅ 不存在 duration_ms < 200ms 的极短段（可能是空段或错误） | — | 标记为 ADVISORY |

---

## 6. Provider 和 Manifest 安全

| 检查项 | 规则 | 说明 |
|--------|------|------|
| ✅ `audio-manifest.json` 中不含 API Key、Token、密码或凭证 | R-AUD-04 | 扫描 `sk-`、`Bearer `、`token=`、长随机字符串 |
| ✅ `provider_metadata` 字段中不含凭证 | R-AUD-04 | 只存放无敏感的参数 |
| ✅ `provider` 字段填写了已确定的 Provider，或明确标注为 pending | R-AUD-09 | 有利于后续 fallback 规划 |
| ✅ 存在 fallback provider 规划（若首选 Provider 不可用） | R-AUD-09 | edge-tts 作为默认 fallback 方向 |

---

## 7. 授权与声音克隆

| 检查项 | 规则 | 说明 |
|--------|------|------|
| ✅ 每个 segment 的 `consent_status` 已明确填写 | R-AUD-03 | 不允许留 `unknown` |
| ✅ 无 `consent_status = "unknown"` 或 `"consent_pending"` 的 segment 进入渲染 | R-AUD-03 | 这两个状态强制 render_safe = false |
| ✅ `consent_status = "consent_obtained"` 的 segment 有 `consent_notes` 记录授权说明 | R-AUD-06 | 说明授权人、日期、方式 |
| ✅ 无声音克隆用于模仿未授权的真实人物 | R-AUD-06 | 任何个人声音相似性都需走 consent_obtained |
| ✅ `tts_only` 不用于模仿名人、公众人物、客户或员工的声音 | R-AUD-03 | 误用 tts_only 会绕过授权检查 |

---

## 8. 版本控制安全

| 检查项 | 规则 | 说明 |
|--------|------|------|
| ✅ 生成的 `.mp3` / `.wav` 等音频文件未提交到 git | R-AUD-10 | `output/assets/audio/` 应在 `.gitignore` 中 |
| ✅ 无真实音频样本（含声音克隆训练数据）在仓库中 | R-AUD-10 | — |
| ✅ `audio-manifest.json` 已提交（元数据可提交，文件本身不提交） | — | manifest 不含音频二进制 |

---

## 9. Caption Timeline 完整性

| 检查项 | 说明 |
|--------|------|
| ✅ `caption-timeline.json` 文件存在（若项目含旁白） | — |
| ✅ 每个需要字幕的 scene 在 caption timeline 中至少有一条 caption | — |
| ✅ 所有 caption 的 `end_ms` 不超过 `total_duration_ms` | 避免字幕超出视频结尾 |
| ✅ 相邻 caption 无重叠（同一语言轨道） | 重叠字幕在视频中难以阅读 |
| ✅ 字幕时间轴与 audio-manifest 中对应 segment 的 `start_ms` / `end_ms` 对齐（误差 ≤ 500ms） | — |

---

## 10. 最终 render_safe 确认

完成上述全部检查后，在 `audio-manifest.json` 中将每个通过的 segment 更新为：

```json
"render_safe": true
```

然后执行渲染：

```bash
npx hyperframes render --input output/index.html --output output/final.mp4
```

---

## 快速辅助扫描命令

```bash
# 启发式图片 + 音频相关告警（非 HyperFrames lint，不阻断，exit 0）
node hyperdirector/scripts/check-composition-hazards.js output/index.html
```

音频检查项：`<audio>` 远程 URL、缺少 src、本地路径不存在、文件超过 10 MB、manifest 疑似含 API key。
