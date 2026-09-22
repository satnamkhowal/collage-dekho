@echo off
setlocal EnableExtensions EnableDelayedExpansion
title GitHub Chunk Commit + Push

REM ============================================================
REM GitHub Chunk Pusher
REM - Commits changed/untracked/deleted files in small batches
REM - Pushes every batch before continuing
REM - Stops if a normal Git file is >= 100 MiB
REM ============================================================

REM ---- SETTINGS YOU CAN CHANGE ----
set "MAX_FILES=100"
set /a MAX_BYTES=524288000
set "PUSH_DELAY_SECONDS=11"
set "COMMIT_PREFIX=chunk upload"
REM ---------------------------------

cd /d "%~dp0"

echo.
echo ============================================================
echo   GitHub Chunk Commit + Push
echo ============================================================
echo Project: %CD%
echo Max files per commit : %MAX_FILES%
echo Approx max raw size  : 500 MiB
echo.

where git >nul 2>&1
if errorlevel 1 (
    echo ERROR: Git is not installed or is not available in PATH.
    echo Install Git for Windows, reopen Command Prompt, and run this file again.
    pause
    exit /b 1
)

REM Initialize repository if required.
git rev-parse --is-inside-work-tree >nul 2>&1
if errorlevel 1 (
    echo No Git repository found. Initializing...
    git init
    if errorlevel 1 goto :fatal
)

REM Make sure identity exists before we start creating commits.
for /f "delims=" %%A in ('git config user.name 2^>nul') do set "GIT_NAME=%%A"
for /f "delims=" %%A in ('git config user.email 2^>nul') do set "GIT_EMAIL=%%A"

if not defined GIT_NAME (
    echo.
    echo ERROR: git user.name is not configured.
    echo Run:
    echo   git config --global user.name "Your Name"
    echo.
    pause
    exit /b 1
)

if not defined GIT_EMAIL (
    echo.
    echo ERROR: git user.email is not configured.
    echo Run:
    echo   git config --global user.email "you@example.com"
    echo.
    pause
    exit /b 1
)

REM Create/add origin when missing.
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    echo.
    echo No GitHub "origin" remote is configured.
    set /p "REPO_URL=Paste GitHub repository URL: "
    if not defined REPO_URL (
        echo ERROR: Repository URL is required.
        pause
        exit /b 1
    )
    git remote add origin "!REPO_URL!"
    if errorlevel 1 goto :fatal
)

for /f "delims=" %%A in ('git remote get-url origin 2^>nul') do set "ORIGIN_URL=%%A"
echo Remote: !ORIGIN_URL!

REM Determine current branch. For a new repository, use main.
for /f "delims=" %%A in ('git branch --show-current 2^>nul') do set "BRANCH=%%A"
if not defined BRANCH (
    set "BRANCH=main"
    git checkout -b main >nul 2>&1
)
if /i "!BRANCH!"=="master" (
    REM Keep an existing master branch; do not unexpectedly rename it.
)
echo Branch: !BRANCH!
echo.

REM GitHub rejects normal Git objects/files >= 100 MiB.
REM Check changed + untracked files before creating commits.
echo Checking for files that GitHub would reject...
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$limit=100MB; $bad=@(); git ls-files -m -o --exclude-standard | ForEach-Object { if (Test-Path -LiteralPath $_ -PathType Leaf) { $f=Get-Item -LiteralPath $_; if ($f.Length -ge $limit) { $bad += ('{0:N1} MiB  {1}' -f ($f.Length/1MB), $_) } } }; if($bad.Count -gt 0){ Write-Host ''; Write-Host 'ERROR: These files are 100 MiB or larger:' -ForegroundColor Red; $bad | ForEach-Object { Write-Host ('  ' + $_) }; Write-Host ''; Write-Host 'Use Git LFS or exclude these files before pushing.' -ForegroundColor Yellow; exit 2 }"
if errorlevel 2 (
    echo.
    echo Nothing was committed. Fix the large files and run this script again.
    pause
    exit /b 2
)

set /a BATCH=0

:next_batch
set /a COUNT=0
set /a TOTAL_BYTES=0
set /a BATCH+=1
set "LIST_FILE=%TEMP%\git_chunk_%RANDOM%_%RANDOM%.txt"

git ls-files -m -d -o --exclude-standard > "!LIST_FILE!"

for %%Z in ("!LIST_FILE!") do if %%~zZ EQU 0 (
    del /q "!LIST_FILE!" >nul 2>&1
    goto :finished
)

echo.
echo ------------------------------------------------------------
echo Preparing batch !BATCH!...
echo ------------------------------------------------------------

for /f "usebackq delims=" %%F in ("!LIST_FILE!") do (
    if !COUNT! LSS %MAX_FILES% (
        set /a FILE_BYTES=0

        if exist "%%F" (
            for %%S in ("%%F") do set /a FILE_BYTES=%%~zS 2>nul
        )

        set /a NEXT_BYTES=!TOTAL_BYTES!+!FILE_BYTES!

        REM Always allow the first file. After that, keep batch <= MAX_BYTES.
        if !COUNT! EQU 0 (
            git add -A -- "%%F"
            if not errorlevel 1 (
                set /a COUNT+=1
                set /a TOTAL_BYTES=!NEXT_BYTES!
                echo [!COUNT!] %%F
            )
        ) else (
            if !NEXT_BYTES! LEQ %MAX_BYTES% (
                git add -A -- "%%F"
                if not errorlevel 1 (
                    set /a COUNT+=1
                    set /a TOTAL_BYTES=!NEXT_BYTES!
                    echo [!COUNT!] %%F
                )
            )
        )
    )
)

del /q "!LIST_FILE!" >nul 2>&1

if !COUNT! EQU 0 (
    echo ERROR: No files could be staged.
    goto :fatal
)

REM Confirm something is really staged.
git diff --cached --quiet
if not errorlevel 1 (
    echo No staged changes found.
    goto :finished
)

for /f %%A in ('powershell -NoProfile -Command "[math]::Round(%TOTAL_BYTES%/1MB,1)"') do set "TOTAL_MB=%%A"

echo.
echo Batch !BATCH!: !COUNT! file(s), approx !TOTAL_MB! MiB raw size.
echo Creating commit...

git commit -m "%COMMIT_PREFIX% !BATCH!"
if errorlevel 1 goto :fatal

echo Pushing batch !BATCH! to origin/!BRANCH!...

REM If upstream already exists, normal push is enough.
git rev-parse --abbrev-ref --symbolic-full-name "@{u}" >nul 2>&1
if errorlevel 1 (
    git push -u origin "!BRANCH!"
) else (
    git push
)

if errorlevel 1 (
    echo.
    echo ERROR: Push failed on batch !BATCH!.
    echo The successful local commit has NOT been deleted.
    echo Fix the GitHub/auth/network issue, then run this BAT again.
    pause
    exit /b 1
)

echo Batch !BATCH! pushed successfully.

REM Avoid rapid-fire pushes. GitHub recommends keeping push rate modest.
if %PUSH_DELAY_SECONDS% GTR 0 (
    timeout /t %PUSH_DELAY_SECONDS% /nobreak >nul
)

goto :next_batch

:finished
echo.
echo ============================================================
echo SUCCESS: No remaining changed/untracked files.
echo All batches have been committed and pushed.
echo ============================================================
git status --short
echo.
pause
exit /b 0

:fatal
echo.
echo ============================================================
echo ERROR: The operation stopped.
echo Check the error shown above. Existing commits/files are safe.
echo ============================================================
echo.
pause
exit /b 1
