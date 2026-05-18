@echo off
title Life Tech · Servidor Admin
cd /d "%~dp0"

:: Verifica que Node.js esté instalado
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js no encontrado. Instálalo desde https://nodejs.org
    pause
    exit /b 1
)

:: Instala dependencias si node_modules no existe
if not exist "node_modules" (
    echo Instalando dependencias...
    npm install
)

echo.
echo  ╔══════════════════════════════════════╗
echo  ║   Life Tech · Admin Panel Server     ║
echo  ║   http://localhost:3001              ║
echo  ╚══════════════════════════════════════╝
echo.

:: Inicia el servidor. Si se cae, lo reinicia automáticamente
:restart
node server.js
echo.
echo  Servidor caído. Reiniciando en 3 segundos...
timeout /t 3 /nobreak >nul
goto restart
