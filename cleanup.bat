@echo off
echo ==============================================
echo Cleaning up duplicate files and directories...
echo ==============================================

:: Copy assets to mobile/assets if they exist and destination doesn't exist
if exist assets (
    if not exist mobile\assets (
        echo Copying assets to mobile\assets...
        xcopy /E /I /Y assets mobile\assets
    )
)

:: Copy .gitignore to mobile/.gitignore if it doesn't exist
if exist .gitignore (
    if not exist mobile\.gitignore (
        copy .gitignore mobile\.gitignore
    )
)

:: Delete duplicate root directories
echo Deleting original root directories...
for %%d in (app components constants store utils .expo node_modules assets) do (
    if exist %%d (
        echo Deleting %%d...
        rmdir /s /q %%d
    )
)

:: Delete duplicate root files
echo Deleting original root config files...
for %%f in (.env.example .firebaserc app.json babel.config.js create-dummy-assets.js expo-env.d.ts firebase.json firestore.indexes.json firestore.rules metro.config.js package-lock.json package.json tsconfig.json organize-project.bat) do (
    if exist %%f (
        echo Deleting %%f...
        del /f /q %%f
    )
)

echo ==============================================
echo Root cleanup completed!
echo ==============================================
pause
