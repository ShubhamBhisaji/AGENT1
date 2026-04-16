@echo off
setlocal EnableExtensions EnableDelayedExpansion

echo ================================================
echo DEV-AI Prompt Installer
echo ================================================

if /I "%~1"=="/?" (
    echo Usage: install.bat "C:\path\to\workspace"
    echo        install.bat
    echo.
    echo When no path is provided, the current directory is used.
    exit /b 0
)

if "%~1"=="" (
    set "TARGET_WORKSPACE=%CD%"
    echo [INFO] No workspace path provided. Using current directory:
    echo        "%TARGET_WORKSPACE%"
) else (
    set "TARGET_WORKSPACE=%~1"
)

if not exist "%TARGET_WORKSPACE%" (
    echo [ERROR] Target workspace does not exist: "%TARGET_WORKSPACE%"
    exit /b 1
)

set "SCRIPT_DIR=%~dp0"
set "ZIP_PATH=%SCRIPT_DIR%DEV-AI-Prompt-Pack.zip"

if not exist "%ZIP_PATH%" (
    echo [ERROR] Zip package not found: "%ZIP_PATH%"
    exit /b 1
)

set "TEMP_DIR=%TEMP%\devai_install_%RANDOM%%RANDOM%"
mkdir "%TEMP_DIR%" >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Could not create temp directory: "%TEMP_DIR%"
    exit /b 1
)

echo [INFO] Extracting package...
powershell -NoProfile -ExecutionPolicy Bypass -Command "Expand-Archive -Path '%ZIP_PATH%' -DestinationPath '%TEMP_DIR%' -Force"
if errorlevel 1 (
    echo [ERROR] Failed to extract zip package.
    rmdir /s /q "%TEMP_DIR%" >nul 2>&1
    exit /b 1
)

set "SOURCE_ROOT=%TEMP_DIR%\DEV-AI-Prompt-Pack"
if not exist "%SOURCE_ROOT%\.github" (
    set "SOURCE_ROOT=%TEMP_DIR%"
)

if not exist "%SOURCE_ROOT%\.github" (
    echo [ERROR] Extracted package missing .github content.
    rmdir /s /q "%TEMP_DIR%" >nul 2>&1
    exit /b 1
)

set "TARGET_GITHUB=%TARGET_WORKSPACE%\.github"

if exist "%TARGET_GITHUB%" (
    for /f %%i in ('powershell -NoProfile -Command "Get-Date -Format yyyyMMdd_HHmmss"') do set "STAMP=%%i"
    set "BACKUP_PATH=%TARGET_WORKSPACE%\.github.backup.devai.!STAMP!"
    echo [INFO] Existing .github found. Creating backup:
    echo        "!BACKUP_PATH!"
    robocopy "%TARGET_GITHUB%" "!BACKUP_PATH!" /E /NFL /NDL /NJH /NJS /NP >nul
    set "RC=!ERRORLEVEL!"
    if !RC! GEQ 8 (
        echo [ERROR] Backup failed with robocopy code !RC!.
        rmdir /s /q "%TEMP_DIR%" >nul 2>&1
        exit /b !RC!
    )
)

echo [INFO] Installing Dev-AI prompt files...
robocopy "%SOURCE_ROOT%\.github" "%TARGET_GITHUB%" /E /NFL /NDL /NJH /NJS /NP >nul
set "RC=%ERRORLEVEL%"
if %RC% GEQ 8 (
    echo [ERROR] Install failed with robocopy code %RC%.
    rmdir /s /q "%TEMP_DIR%" >nul 2>&1
    exit /b %RC%
)

set "PROMPT_SOURCE=%SOURCE_ROOT%\.github\prompts"
if exist "%PROMPT_SOURCE%" (
    echo [INFO] Syncing agents to VS Code user prompt folders...
    call :sync_vscode_prompts "%APPDATA%\Code - Insiders\User\prompts"
    call :sync_vscode_prompts "%APPDATA%\Code\User\prompts"
) else (
    echo [WARN] Prompt source not found for VS Code sync: "%PROMPT_SOURCE%"
)

rmdir /s /q "%TEMP_DIR%" >nul 2>&1

echo [OK] Installation complete.
echo [OK] Installed to: "%TARGET_WORKSPACE%"
exit /b 0

:sync_vscode_prompts
set "VSCODE_PROMPT_DIR=%~1"
if "%VSCODE_PROMPT_DIR%"=="" exit /b 0

if not exist "%VSCODE_PROMPT_DIR%" (
    mkdir "%VSCODE_PROMPT_DIR%" >nul 2>&1
    if errorlevel 1 (
        echo [WARN] Could not create VS Code prompt folder: "%VSCODE_PROMPT_DIR%"
        exit /b 0
    )
)

robocopy "%PROMPT_SOURCE%" "%VSCODE_PROMPT_DIR%" *.prompt.md /NFL /NDL /NJH /NJS /NP >nul
set "RC=!ERRORLEVEL!"
if !RC! GEQ 8 (
    echo [WARN] VS Code prompt sync failed for "%VSCODE_PROMPT_DIR%" with code !RC!.
    exit /b 0
)

echo [OK] Synced agents to VS Code: "%VSCODE_PROMPT_DIR%"
exit /b 0
