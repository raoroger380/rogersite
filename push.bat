@echo off
setlocal EnableExtensions
cd /d "%~dp0"

set "REMOTE=origin"
set "COMMIT_MESSAGE=Update website"
if not "%~1"=="" set "COMMIT_MESSAGE=%~1"

echo ========================================
echo   Commit and push website changes
echo ========================================
echo.

where git >nul 2>&1
if errorlevel 1 goto git_missing

git rev-parse --show-toplevel >nul 2>&1
if errorlevel 1 goto not_repo

for /f "delims=" %%B in ('git branch --show-current') do set "BRANCH=%%B"
if not defined BRANCH goto detached_head

git remote get-url "%REMOTE%" >nul 2>&1
if errorlevel 1 goto remote_missing

echo [1/3] Staging all changes...
git add -A
if errorlevel 1 goto stage_failed

git diff --cached --quiet
if not errorlevel 1 goto no_changes
if errorlevel 2 goto diff_failed

echo.
echo [2/3] Creating commit on branch "%BRANCH%"...
git commit -m "%COMMIT_MESSAGE%"
if errorlevel 1 goto commit_failed

echo.
echo [3/3] Pushing to %REMOTE%/%BRANCH%...
git push "%REMOTE%" "%BRANCH%"
if errorlevel 1 goto push_failed

echo.
echo ========================================
echo   Push succeeded.
echo ========================================
timeout /t 3 >nul
exit /b 0

:no_changes
echo.
echo No changes to commit. Nothing was pushed.
timeout /t 3 >nul
exit /b 0

:git_missing
echo Git was not found. Install Git and try again.
goto failure

:not_repo
echo This folder is not a Git repository.
goto failure

:detached_head
echo HEAD is detached. Check out a branch and try again.
goto failure

:remote_missing
echo Remote "%REMOTE%" was not found.
goto failure

:stage_failed
echo Failed to stage changes.
goto failure

:diff_failed
echo Failed to inspect staged changes.
goto failure

:commit_failed
echo Failed to create the commit. Nothing was pushed.
goto failure

:push_failed
echo Push failed. Check the Git message above.
goto failure

:failure
echo.
pause
exit /b 1
