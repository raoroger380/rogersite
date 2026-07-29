@echo off
chcp 65001 >nul 2>&1
setlocal
cd /d "%~dp0"

echo ========================================
echo   Git 自动推送工具
echo ========================================
echo.

echo [1/3] 添加更改...
git add -A

echo.
echo [2/3] 提交更改...
git diff --cached --quiet
if %errorlevel%==0 (
    echo 没有需要提交的更改，工作区是干净的。
    echo.
    pause
    exit /b 0
)
git commit -m "更新"

echo.
echo [3/3] 推送到 GitHub...
git push origin main

if %errorlevel%==0 (
    echo.
    echo ========================================
    echo   推送成功！窗口将在 3 秒后关闭...
    echo ========================================
    timeout /t 3 >nul
) else (
    echo.
    echo ========================================
    echo   推送失败！请检查上方的错误信息
    echo ========================================
    pause
)
