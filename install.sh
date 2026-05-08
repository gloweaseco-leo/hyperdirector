#!/usr/bin/env bash
# HyperDirector — one-command install of the Hermes Skill Pack (public repo only).
# Does NOT install HyperFrames, Node.js, FFmpeg, or Hermes. Rendering still depends on your local stack.
set -euo pipefail

REPO_URL="${HYPERDIRECTOR_INSTALL_REPO:-https://github.com/gloweaseco-leo/hyperdirector.git}"
REPO_BRANCH="${HYPERDIRECTOR_INSTALL_BRANCH:-main}"
DEFAULT_TARGET="${HOME}/.hermes/skills/hyperdirector"
INSTALL_DIR="${HERMES_SKILLS_DIR:-$DEFAULT_TARGET}"
TS="$(date +%Y%m%d%H%M%S)"

echo "HyperDirector Skill Pack installer"
echo "=================================="
echo "Source: ${REPO_URL} (branch: ${REPO_BRANCH})"
echo "Target: ${INSTALL_DIR}"
echo ""

if ! command -v git >/dev/null 2>&1; then
  echo "Error: git is not installed or not on PATH. Install Git and retry." >&2
  exit 1
fi

TMPROOT="$(mktemp -d)"
cleanup() { rm -rf "${TMPROOT}"; }
trap cleanup EXIT

CLONE_DIR="${TMPROOT}/repo"
git clone --depth 1 --branch "${REPO_BRANCH}" "${REPO_URL}" "${CLONE_DIR}"

SKILL_MD="${CLONE_DIR}/hyperdirector/SKILL.md"
if [[ ! -f "${SKILL_MD}" ]]; then
  echo "Error: hyperdirector/SKILL.md not found after clone. Is this the HyperDirector public repository?" >&2
  exit 1
fi

PARENT_DIR="$(dirname "${INSTALL_DIR}")"
mkdir -p "${PARENT_DIR}"

if [[ -d "${INSTALL_DIR}" ]] || [[ -e "${INSTALL_DIR}" ]]; then
  BACKUP="${INSTALL_DIR}.backup.${TS}"
  echo "Existing path found; backing up to: ${BACKUP}"
  mv "${INSTALL_DIR}" "${BACKUP}"
fi

mkdir -p "${INSTALL_DIR}"
cp -R "${CLONE_DIR}/hyperdirector/." "${INSTALL_DIR}/"

echo ""
echo "Installation complete."
echo "Skill Pack installed at: ${INSTALL_DIR}"
echo ""
echo "Next steps:"
echo "  1) Restart Hermes so it reloads skills."
echo "  2) Verify tooling (Node.js, HyperFrames CLI, FFmpeg) — this pack does not install them:"
echo "       node \"${INSTALL_DIR}/scripts/check-hyperframes-env.js\""
echo ""
echo "Note: This script only installs the HyperDirector Skill Pack from the public repository."
echo "      It does not install the HyperFrames render pipeline; local render requires HyperFrames, FFmpeg, and a supported browser per HyperFrames docs."
