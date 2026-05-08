# HyperDirector — one-command install of the Hermes Skill Pack (public repo only).
# Does NOT install HyperFrames, Node.js, FFmpeg, or Hermes. Rendering still depends on your local stack.
#Requires -Version 5.1
$ErrorActionPreference = "Stop"

$RepoUrl = if ($env:HYPERDIRECTOR_INSTALL_REPO) { $env:HYPERDIRECTOR_INSTALL_REPO } else { "https://github.com/gloweaseco-leo/hyperdirector.git" }
$RepoBranch = if ($env:HYPERDIRECTOR_INSTALL_BRANCH) { $env:HYPERDIRECTOR_INSTALL_BRANCH } else { "main" }
$defaultTarget = Join-Path $HOME ".hermes\skills\hyperdirector"
$InstallDir = if ($env:HERMES_SKILLS_DIR) { $env:HERMES_SKILLS_DIR } else { $defaultTarget }
$ts = Get-Date -Format "yyyyMMddHHmmss"

Write-Host "HyperDirector Skill Pack installer"
Write-Host "=================================="
Write-Host "Source: $RepoUrl (branch: $RepoBranch)"
Write-Host "Target: $InstallDir"
Write-Host ""

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  Write-Error "git is not installed or not on PATH. Install Git for Windows and retry."
}

$tmpRoot = Join-Path ([System.IO.Path]::GetTempPath()) ("hyperdirector-install-" + [Guid]::NewGuid().ToString("N"))
New-Item -ItemType Directory -Path $tmpRoot | Out-Null
try {
  $cloneDir = Join-Path $tmpRoot "repo"
  git clone --depth 1 --branch $RepoBranch $RepoUrl $cloneDir
  if ($LASTEXITCODE -ne 0) { throw "git clone failed with exit code $LASTEXITCODE" }

  $skillMd = Join-Path $cloneDir "hyperdirector\SKILL.md"
  if (-not (Test-Path -LiteralPath $skillMd)) {
    throw "hyperdirector\SKILL.md not found after clone. Is this the HyperDirector public repository?"
  }

  $parent = Split-Path -Parent $InstallDir
  if (-not (Test-Path -LiteralPath $parent)) {
    New-Item -ItemType Directory -Path $parent -Force | Out-Null
  }

  if (Test-Path -LiteralPath $InstallDir) {
    $backup = "${InstallDir}.backup.${ts}"
    Write-Host "Existing path found; backing up to: $backup"
    Rename-Item -LiteralPath $InstallDir -NewPath $backup
  }

  New-Item -ItemType Directory -Path $InstallDir -Force | Out-Null
  $srcPack = Join-Path $cloneDir "hyperdirector"
  Copy-Item -Path (Join-Path $srcPack "*") -Destination $InstallDir -Recurse -Force
}
finally {
  Remove-Item -LiteralPath $tmpRoot -Recurse -Force -ErrorAction SilentlyContinue
}

Write-Host ""
Write-Host "Installation complete."
Write-Host "Skill Pack installed at: $InstallDir"
Write-Host ""
Write-Host "Next steps:"
Write-Host "  1) Restart Hermes so it reloads skills."
Write-Host "  2) Verify tooling (Node.js, HyperFrames CLI, FFmpeg) — this pack does not install them:"
Write-Host "       node `"$InstallDir\scripts\check-hyperframes-env.js`""
Write-Host ""
Write-Host "Note: This script only installs the HyperDirector Skill Pack from the public repository."
Write-Host "      It does not install the HyperFrames render pipeline; local render requires HyperFrames, FFmpeg, and a supported browser per HyperFrames docs."
