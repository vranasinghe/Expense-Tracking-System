@echo off
echo ==============================================
echo Staging and Committing with Custom Date...
echo Date Set: 2026-06-27 11:00:00
echo ==============================================
set GIT_AUTHOR_DATE=2026-06-27T11:00:00
set GIT_COMMITTER_DATE=2026-06-27T11:00:00

:: Commit message
set COMMIT_MSG=project created

echo [1/3] Staging all changes...
git add .

echo [2/3] Committing changes...
git commit -m "%COMMIT_MSG%"

echo [3/3] Pushing to GitHub (origin main)...
git push origin main

echo ==============================================
echo Success! Committed with date 27-06-2026 11:00 AM
echo ==============================================
pause
