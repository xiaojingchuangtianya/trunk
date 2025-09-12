@echo off
echo 启动合金弹头游戏服务器...
cd /d %~dp0\server

if not exist "node_modules" (
    echo 正在安装依赖...
    npm install
)

echo 启动游戏服务器...
node game-server.js
pause