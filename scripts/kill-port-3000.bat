@echo off
echo ========================================
echo Killing Process on Port 3000
echo ========================================
echo.

REM Find the PID using port 3000
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do (
    set PID=%%a
    goto :found
)

:found
if defined PID (
    echo Found process %PID% using port 3000
    echo Killing process...
    taskkill /F /PID %PID%
    echo.
    echo ✓ Process killed successfully!
) else (
    echo No process found using port 3000
    echo Port is available.
)

echo.
echo ========================================
echo Done!
echo ========================================
pause
