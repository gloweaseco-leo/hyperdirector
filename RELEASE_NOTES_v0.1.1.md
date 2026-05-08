# HyperDirector v0.1.1 Release Notes

**发布日期：** 2026-05-08  
**版本类型：** 维护 / 安装体验  
**代号：** One-Click Pack Install

---

## 本版变更摘要

### 一键安装

- **`install.sh`** — macOS、Linux、WSL：从公开仓库浅克隆，仅将 `hyperdirector/` 安装到 `~/.hermes/skills/hyperdirector`（可用 `HERMES_SKILLS_DIR` 覆盖目标路径；可选 `HYPERDIRECTOR_INSTALL_REPO`、`HYPERDIRECTOR_INSTALL_BRANCH`）。
- **`install.ps1`** — Windows PowerShell：行为与 `install.sh` 对齐；默认目标 `%USERPROFILE%\.hermes\skills\hyperdirector`。

### 文档

- **`README.md` / `README.zh-CN.md`** — 增加「一条命令安装」说明；明确：仅安装 Skill Pack，不安装完整渲染环境；建议运行前审阅安装脚本。
- **`public-clean-export.md`** — 白名单加入 `install.sh`、`install.ps1`、`.gitattributes`（若存在）。

### 行尾与脚本入口

- **`.gitattributes`** — 规范 `*.sh`（LF）、`*.ps1`（CRLF）、`*.md`（LF）。
- **`hyperdirector/scripts/check-hyperframes-env.js`** — 与 `check-env.js` 等价入口，供安装完成后检查 Node / HyperFrames CLI / FFmpeg。

---

## 不变更

- HyperDirector 仍依赖用户本地的 **Hermes**、**HyperFrames CLI**、**Node.js（≥22）**、**FFmpeg** 等才能完成预览与渲染；本版本**不**将 HyperDirector 定位为 HyperFrames 的替代品。

---

## 升级方式

已手动安装的用户可继续 `git pull` 后复制 `hyperdirector/`，或重新运行官方 README 中的一键安装命令（会先备份已有目录）。

---

## 版本历史

| 版本 | 日期 | 说明 |
|------|------|------|
| v0.1.1 | 2026-05-08 | 一键安装脚本、README 安装说明、check-hyperframes-env 入口、.gitattributes |
| v0.1.0 | 2026-05-07 | 初始 Skill Pack 与文档 |
