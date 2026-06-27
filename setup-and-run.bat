@echo off
echo ====================================================
echo   ExpenseTracker - React Native (Expo) App Setup
echo ====================================================
echo.
echo Changing directory to mobile app...
cd /d "%~dp0mobile"
echo.
echo Installing dependencies...
call npm install
echo.
echo ====================================================
echo   Installation complete! Starting Expo dev server...
echo ====================================================
echo.
echo Scan the QR code with Expo Go on your phone,
echo or press 'a' for Android emulator / 'i' for iOS simulator
echo.
call npx expo start
pause
