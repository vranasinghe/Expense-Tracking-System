@echo off
echo ==============================================
echo Staging and Committing with Custom Date...
echo Date Set: 2026-06-27 12:00:00
echo ==============================================
set GIT_AUTHOR_DATE=2026-06-27T12:00:00
set GIT_COMMITTER_DATE=2026-06-27T12:00:00

echo [1/3] Staging changes...
git add .

echo [2/3] Committing changes...
git commit -m "feat: Integrate Firebase Auth and Cloud Firestore backend and setup Hosting deployment"

echo [3/3] Pushing to GitHub (origin main)...
git push origin main

echo ==============================================
echo Success! Commits pushed to GitHub with date 27.06.2026.
echo ==============================================
pause
