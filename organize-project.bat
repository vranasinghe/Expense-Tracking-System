@echo off
echo ==============================================
echo Reorganizing Project Directories...
echo ==============================================

:: Create directories
if not exist mobile mkdir mobile
if not exist backend mkdir backend

echo Moving backend files...
if exist firestore.rules move firestore.rules backend\
if exist firestore.indexes.json move firestore.indexes.json backend\
if exist firebase.json move firebase.json backend\
if exist .firebaserc move .firebaserc backend\

echo Moving mobile folders...
if exist app move app mobile\
if exist components move components mobile\
if exist constants move constants mobile\
if exist store move store mobile\
if exist utils move utils mobile\
if exist assets move assets mobile\
if exist .expo move .expo mobile\

echo Moving mobile configuration files...
if exist app.json move app.json mobile\
if exist babel.config.js move babel.config.js mobile\
if exist metro.config.js move metro.config.js mobile\
if exist package.json move package.json mobile\
if exist package-lock.json move package-lock.json mobile\
if exist tsconfig.json move tsconfig.json mobile\
if exist expo-env.d.ts move expo-env.d.ts mobile\
if exist create-dummy-assets.js move create-dummy-assets.js mobile\
if exist .env move .env mobile\
if exist .env.example move .env.example mobile\

echo ==============================================
echo Restructuring completed successfully!
echo ==============================================
pause
