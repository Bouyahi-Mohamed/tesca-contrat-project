@echo off
echo Starting Tesca Contract Manager...
cd /d "%~dp0backend"
set NODE_ENV=production
node server.js
pause
