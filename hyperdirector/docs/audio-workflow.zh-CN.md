# Audio Director 工作流

> 版本：v0.1.3-preview  
> 适用：HyperDirector + Hermes（Cursor Agent）  
> 规则参考：`rules/audio-director-rules.md`  
> Schemas：`schemas/audio-manifest.schema.json` / `schemas/caption-timeline.schema.json`  
> QA 检查：`qa/audio-qa-checklist.md`

---

## 什么是 Audio Director

Audio Director 是 HyperDirector 的**音频导演层**，不是 TTS 工具。

它的职责是：

> 把脚本、旁白、字幕、声音角色、语速、停顿、TTS Provider、音频文件、字幕时间轴与视频 scene/shot 的关系，组织成可复核的音频管线。

Audio Director **不做**：

- 直接调用 TTS Provider 生成音频
- 声音克隆（除非用户明确授权）
- 音频波形分析或压缩
- 搜索互联网获取旁白素材（需要研究内容时，使用 Hermes 官方内置的 web_search / web_extract 能力）
- 替代 HyperFrames 的渲染引擎

---

## Audio Director 与其他管线的关系

```
Storyboard (scene_id / shot_id 主索引)
       │
       ├─→ Source Image Pipeline → asset-manifest.json
       │
       ├─→ Audio Director Pipeline
       │       │
       │       ├─→ audio-manifest.json   (音频段声明)
       │       └─→ caption-timeline.json (字幕时间轴)
       │
       └─→ Render Planning (同时读取 image + audio + caption)
```

三条索引：
- 图片资产进入 `asset-manifest.json`（按 scene_id / slot 绑定）
- 音频段进入 `audio-manifest.json`（按 scene_id / shot_id 绑定）
- 字幕进入 `caption-timeline.json`（按 scene_id / segment_id 关联）

分镜表（`storyboard.json`）始终是 `scene_id` / `shot_id` 的唯一主索引。

---

## 核心链路

```
script.md / storyboard.json
     │
     ▼ [Step 1] 提取 Audio Intent（每个 scene 需要什么声音？）
     │
     ▼ [Step 2] 拆分 Voice Segments（每段旁白文本、归属 scene）
     │
     ▼ [Step 3] 定义 Voice Profile（声音角色、语速、情绪标签）
     │
     ▼ [Step 4] Provider-Neutral TTS 规划（选 Provider、voice_name）
     │
     ▼ [Step 5] 生成 audio-manifest.json（render_safe = false 先占位）
     │
     ▼ [Step 6] 生成 caption-timeline.json（与 segment 对齐）
     │
     ▼ [Step 7] TTS 生成 / 人工录制 → 音频文件落地本地
     │
     ▼ [Step 8] 音画 sync QA（时长校验、字幕对齐、render_safe = true）
     │
     ▼ [Step 9] Render Planning（index.html 引用本地音频）
     │
     ▼ [Step 10] 渲染输出 + 交付包
```

---

## 阶段详解

### Step 1 · 提取 Audio Intent

从 `storyboard.json` 的每个 scene 读取：
- `purpose`（场景叙事目的）
- `caption`（现有字幕文本）
- `duration`（场景秒数）
- `notes`（导演意图）

结合 `script.md`（如已存在）确定每个场景是否需要旁白以及旁白的大致内容和语气。

**Hermes 示例指令：**
```
Hermes，请根据 output/storyboard.json 和 output/script.md，
为每个 scene 提取 audio intent：
1. 是否需要旁白（还是纯字幕或静音）
2. 大致旁白内容
3. 建议语速（slow / normal / fast）
4. 情绪风格（professional / warm / energetic / calm）

只输出规划建议，不生成音频，不调用 TTS。
```

### Step 2 · 拆分 Voice Segments

将完整旁白拆分成以 scene / shot 为单位的段落：
- 每个 `segment_id` 对应一个 `scene_id`（可选 `shot_id`）
- 拆分原则：一个 scene 内的旁白作为一个或多个 segment
- 每段文本长度建议：中文 30～80 字，英文 20～60 词（以配合 scene 时长）

### Step 3 · 定义 Voice Profile

为项目声明声音角色。Public 侧只记录 `voice_profile_id` 引用；详细的 Voice Profile（含 provider_preferences、cloning 配置）定义在 Pro 模板中。

最简单的做法：在 `audio-manifest.json` 的 segment 中直接写 `speaker_id` 和 `provider` / `voice_name`，不需要单独的 voice profile 文件（适合简单项目）。

### Step 4 · Provider-Neutral TTS 规划

选择 TTS Provider 时遵循 R-AUD-09 Provider-Neutral 原则：
- 在 `audio-manifest.json` 的 `provider` 字段记录选定的 provider
- 确保 `text` 和 `language` 字段足够完整，以支持 provider 切换后重新生成
- 配置 fallback：推荐 `edge-tts` 作为 fallback（无需 API key）

可选 Provider 方向（均非默认依赖，需用户选择并手动配置）：

| Provider | 类型 | 适用场景 |
|----------|------|----------|
| `edge-tts` | 系统级 TTS，免费，可离线 | Fallback，快速验证 |
| `cosyvoice` | 本地高质量中文 TTS | 中文旁白，需本地安装 |
| `chattts` | 本地对话式 TTS | 对话场景，实验性 |
| `fish_audio` | 商业 API | 高质量多语言，需 API key |
| `minimax` | 商业 API | 高质量中文，需 API key |

**重要**：这些 Provider 均为可选方向，不是 HyperDirector 的默认依赖。不要提交 API key。

### Step 5 · 生成 audio-manifest.json

初始状态：所有 segment 的 `render_safe = false`，`local_path` 填写规划路径（文件尚未生成）。

```json
{
  "project_id": "my-project",
  "audio_root": "assets/audio",
  "caption_timeline_path": "caption-timeline.json",
  "default_language": "zh-CN",
  "segments": [
    {
      "segment_id": "seg_scene01_hook",
      "scene_id": "scene_01",
      "text": "旁白文本...",
      "provider": "edge-tts",
      "voice_name": "zh-CN-XiaoxiaoNeural",
      "local_path": "assets/audio/seg_scene01_hook.mp3",
      "format": "mp3",
      "render_safe": false,
      "consent_status": "tts_only"
    }
  ]
}
```

### Step 6 · 生成 caption-timeline.json

字幕时间轴与音频段关联：

```json
{
  "project_id": "my-project",
  "default_language": "zh-CN",
  "captions": [
    {
      "caption_id": "cap_scene01_01",
      "segment_id": "seg_scene01_hook",
      "scene_id": "scene_01",
      "start_ms": 500,
      "end_ms": 4200,
      "text": "旁白文本...",
      "max_chars_per_line": 20,
      "line_count": 2
    }
  ]
}
```

**字幕可以独立于音频存在**：没有 `segment_id` 的 caption 条目是纯文字字幕，不依赖 TTS。

### Step 7 · 音频文件落地

用户使用选定的 TTS Provider 生成音频文件，或人工录制后保存为指定格式，放入 `output/assets/audio/`。

更新 `audio-manifest.json`：
- 填写实际的 `duration_ms`（从文件属性获取）
- 填写实际的 `start_ms` / `end_ms`（根据时间轴规划）
- 填写 `transcript`（TTS 实际输出文本或人工记录）

### Step 8 · 音画 Sync QA

```bash
# 辅助扫描（告警，不阻断）
node hyperdirector/scripts/check-composition-hazards.js output/index.html
```

然后逐项完成 `qa/audio-qa-checklist.md`，全部通过后将 `render_safe` 置为 `true`。

### Step 9 · Render Planning

在 `output/index.html` 中引用本地音频：

```html
<!-- 推荐：本地路径，受 render_safe = true 保护 -->
<audio id="narration_scene01" src="assets/audio/seg_scene01_hook.mp3" preload="auto"></audio>

<!-- 禁止（生产渲染中）：远程 URL -->
<!-- <audio src="https://..."></audio> -->
```

字幕元素应与 `caption-timeline.json` 的 `start_ms` / `end_ms` 对应，由 GSAP timeline 控制显隐。

---

## 安全与授权边界

| 允许 | 禁止 |
|------|------|
| 标准 TTS Provider 合成（tts_only） | 未授权声音克隆 |
| 声音克隆（有书面授权 + consent_obtained） | API key 写入 manifest |
| Provider 元数据（无凭证参数） | 真实音频样本提交到 git |
| edge-tts 作为 fallback | 模型权重提交到 git |
| 规划音频管线（不调用 API） | 默认调用商业 TTS API |

---

## 相关文件

| 文件 | 说明 |
|------|------|
| `rules/audio-director-rules.md` | R-AUD-01 ～ R-AUD-11 规则定义 |
| `schemas/audio-manifest.schema.json` | Audio Manifest JSON Schema |
| `schemas/caption-timeline.schema.json` | Caption Timeline JSON Schema |
| `qa/audio-qa-checklist.md` | 渲染前逐项检查清单 |
| `scripts/check-composition-hazards.js` | 启发式告警扫描（含音频检查） |
| `docs/audio-workflow.md` | 英文版工作流文档 |
| `docs/source-image-workflow.zh-CN.md` | Source Image Pipeline 工作流 |
