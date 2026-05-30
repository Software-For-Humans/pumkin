# rename-to-pumkin.ps1
# Rename the desktop app from "agentkit" to "Pumkin" across config files.
# Idempotent — safe to re-run.
#
# Usage (from the repo root):
#   powershell -ExecutionPolicy Bypass -File .\rename-to-pumkin.ps1
#
# Files touched:
#   desktop/src-tauri/tauri.conf.json    productName + identifier
#   desktop/src-tauri/Cargo.toml          package name
#   desktop/src-tauri/src/lib.rs          any "agentkit" path references
#   desktop/package.json                  name field
#   desktop/README.md                     prose references
#
# After running, do:
#   cd desktop
#   npm run build
# That produces  desktop/src-tauri/target/release/bundle/nsis/Pumkin_0.0.1_x64-setup.exe

$ErrorActionPreference = "Stop"

function Replace-InFile {
    param(
        [string]$Path,
        [string]$Pattern,
        [string]$Replacement
    )
    if (-not (Test-Path $Path)) {
        Write-Host "  skip (not found): $Path" -ForegroundColor DarkGray
        return
    }
    $content = Get-Content $Path -Raw
    $new = $content -replace $Pattern, $Replacement
    if ($new -ne $content) {
        Set-Content -Path $Path -Value $new -NoNewline
        Write-Host "  updated: $Path" -ForegroundColor Green
    } else {
        Write-Host "  no-op:   $Path" -ForegroundColor DarkGray
    }
}

Write-Host "Renaming desktop app: agentkit -> Pumkin" -ForegroundColor Cyan
Write-Host ""

# === tauri.conf.json ===
# productName: "agentkit"  -> "Pumkin"
# identifier:  "app.agentkit.desktop" -> "app.pumkin.desktop"
$tauriConf = "desktop\src-tauri\tauri.conf.json"
Write-Host "tauri.conf.json" -ForegroundColor Yellow
Replace-InFile $tauriConf '"productName"\s*:\s*"agentkit"' '"productName": "Pumkin"'
Replace-InFile $tauriConf '"identifier"\s*:\s*"app\.agentkit\.desktop"' '"identifier": "app.pumkin.desktop"'

# === Cargo.toml ===
# package name: agentkit-desktop -> pumkin-desktop
$cargoToml = "desktop\src-tauri\Cargo.toml"
Write-Host "Cargo.toml" -ForegroundColor Yellow
Replace-InFile $cargoToml 'name\s*=\s*"agentkit-desktop"' 'name = "pumkin-desktop"'
Replace-InFile $cargoToml 'name\s*=\s*"agentkit_desktop_lib"' 'name = "pumkin_desktop_lib"'

# === desktop/package.json ===
$pkg = "desktop\package.json"
Write-Host "desktop/package.json" -ForegroundColor Yellow
Replace-InFile $pkg '"name"\s*:\s*"agentkit-desktop"' '"name": "pumkin-desktop"'

# === lib.rs — any hardcoded "agentkit" directory references ===
$lib = "desktop\src-tauri\src\lib.rs"
Write-Host "lib.rs" -ForegroundColor Yellow
# Match the LOCALAPPDATA/agentkit and similar startup-log paths
Replace-InFile $lib '"agentkit"' '"pumkin"'
Replace-InFile $lib 'agentkit/startup' 'pumkin/startup'
Replace-InFile $lib 'agentkit\\\\startup' 'pumkin\\\\startup'
Replace-InFile $lib 'agentkit-node-extract' 'pumkin-node-extract'

# === README.md ===
$readme = "desktop\README.md"
Write-Host "README.md" -ForegroundColor Yellow
Replace-InFile $readme 'agentkit-desktop' 'pumkin-desktop'
Replace-InFile $readme '`agentkit`' '`pumkin`'
Replace-InFile $readme 'app\.agentkit\.desktop' 'app.pumkin.desktop'
Replace-InFile $readme 'agentkit\.db' 'pumkin.db'

# === Web app SQLite path (if hardcoded) ===
$dbInit = "web\lib\server.ts"
if (Test-Path $dbInit) {
    Write-Host "web/lib/server.ts (SQLite path)" -ForegroundColor Yellow
    Replace-InFile $dbInit '"agentkit\.db"' '"pumkin.db"'
    Replace-InFile $dbInit "'agentkit\.db'" "'pumkin.db'"
}

# === Setup-node script (cosmetic only — temp dir naming) ===
$setupNode = "desktop\scripts\setup-node.mjs"
if (Test-Path $setupNode) {
    Write-Host "setup-node.mjs (cosmetic)" -ForegroundColor Yellow
    Replace-InFile $setupNode 'agentkit-node-extract' 'pumkin-node-extract'
}

Write-Host ""
Write-Host "Done. Next steps:" -ForegroundColor Cyan
Write-Host "  1. Review the changes:  git diff" -ForegroundColor White
Write-Host "  2. Clean previous build: Remove-Item -Recurse -Force desktop\src-tauri\target\release\bundle" -ForegroundColor White
Write-Host "  3. Rebuild:              cd desktop ; npm run build" -ForegroundColor White
Write-Host "  4. New installer at:" -ForegroundColor White
Write-Host "       desktop\src-tauri\target\release\bundle\nsis\Pumkin_0.0.1_x64-setup.exe" -ForegroundColor White
