@echo off
cd /d %~dp0
cd api

if not exist node_modules (
    echo Instalando dependências...
    call npm install
)

node app.js
pause

