@echo off
echo ================================================
echo   Project Tesca - Installation Script (Windows)
echo ================================================
echo.

:: Check Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH.
    echo Please download and install it from: https://nodejs.org/
    pause
    exit /b 1
)
echo [OK] Node.js found: 
node -v

:: Check npm
where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm is not found. Please reinstall Node.js.
    pause
    exit /b 1
)
echo [OK] npm found:
npm -v

echo.
echo ------------------------------------------------
echo  Installing backend dependencies...
echo ------------------------------------------------
cd /d "%~dp0backend"
npm install
if %errorlevel% neq 0 (
    echo [ERROR] Backend npm install failed.
    pause
    exit /b 1
)
echo [OK] Backend dependencies installed.

echo.
echo ------------------------------------------------
echo  Installing frontend dependencies...
echo ------------------------------------------------
cd /d "%~dp0frontend"
npm install
if %errorlevel% neq 0 (
    echo [ERROR] Frontend npm install failed.
    pause
    exit /b 1
)
echo [OK] Frontend dependencies installed.

echo.
echo ------------------------------------------------
echo  Setting up environment files...
echo ------------------------------------------------
cd /d "%~dp0"

if not exist "backend\.env" (
    copy "backend\.env.example" "backend\.env" >nul
    echo [OK] Created backend\.env from .env.example
    echo [!] IMPORTANT: Open backend\.env and set a strong JWT_SECRET value!
) else (
    echo [--] backend\.env already exists, skipping.
)

if not exist "frontend\.env" (
    copy "frontend\.env.example" "frontend\.env" >nul
    echo [OK] Created frontend\.env from .env.example
) else (
    echo [--] frontend\.env already exists, skipping.
)

echo.
echo ================================================
echo  Installation complete!
echo ================================================
echo.
echo Next steps:
echo  1. Make sure MongoDB is running on port 27017
echo  2. Open backend\.env and set JWT_SECRET to a strong random string
echo  3. Start the backend:   cd backend ^&^& npm run dev
echo  4. Start the frontend:  cd frontend ^&^& npm run dev
echo  5. Open your browser:   http://localhost:5173
echo.
echo Default login credentials (password: Tesca2026!):
echo   Admin : tarek.ferchichi@tescagroup.com
echo   Achat : safa@tescagroup.com
echo   Other : bouyahi.mohamed@testgoup.com
echo.
pause
