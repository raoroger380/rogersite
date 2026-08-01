@echo off
setlocal
cd /d "%~dp0"

echo ========================================
echo   Git auto push
echo ========================================
echo.

echo [1/3] Staging changes...
git add -A

echo.
echo [2/3] Committing changes...
git diff --cached --quiet
if %errorlevel%==0 (
    echo No changes to commit. Working tree is clean.
    pause
    exit /b 0
)
git commit -m "Update"

echo.
echo [3/3] Pushing to GitHub...
git push origin master

if %errorlevel%==0 (
    echo.
    echo ========================================
    echo   Push succeeded.
    echo ========================================
    timeout /t 3 >nul
) else (
    echo.
    echo ========================================
    echo   Push failed. Check the error above.
    echo ========================================
    pause
)
