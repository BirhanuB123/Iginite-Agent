@echo off
echo ========================================
echo Restarting Backend Server
echo ========================================
echo.

echo Step 1: Killing any process on port 3000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING') do (
    echo Killing PID %%a
    taskkill /F /PID %%a 2>nul
)

timeout /t 2 /nobreak >nul

echo.
echo Step 2: Starting backend server...
cd /d "%~dp0.."
call npm run start:dev

pause
