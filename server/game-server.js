const WebSocket = require('ws');
const http = require('http');
const path = require('path');
const fs = require('fs');

class GameServer {
    constructor(port = 8080) {
        this.port = port;
        this.server = http.createServer();
        this.wss = new WebSocket.Server({ server: this.server });
        this.clients = new Map();
        this.gameRooms = new Map();
        
        this.setupWebSocket();
        this.start();
    }

    setupWebSocket() {
        this.wss.on('connection', (ws, req) => {
            const clientId = this.generateClientId();
            console.log(`Client ${clientId} connected`);
            
            this.clients.set(ws, {
                id: clientId,
                room: null,
                playerData: {
                    position: { x: 0, y: 0 },
                    health: 100,
                    isAlive: true
                }
            });

            ws.on('message', (data) => {
                try {
                    const message = JSON.parse(data);
                    this.handleMessage(ws, message);
                } catch (error) {
                    console.error('Error parsing message:', error);
                }
            });

            ws.on('close', () => {
                console.log(`Client ${clientId} disconnected`);
                this.handleDisconnection(ws);
            });

            ws.on('error', (error) => {
                console.error('WebSocket error:', error);
            });

            // 发送欢迎消息
            ws.send(JSON.stringify({
                type: 'welcome',
                clientId: clientId
            }));
        });
    }

    handleMessage(ws, message) {
        const client = this.clients.get(ws);
        if (!client) return;

        switch (message.type) {
            case 'join':
                this.handleJoin(ws, message);
                break;
            case 'action':
                this.handleAction(ws, message);
                break;
            case 'game_state':
                this.handleGameState(ws, message);
                break;
        }
    }

    handleJoin(ws, message) {
        const client = this.clients.get(ws);
        let room = this.findAvailableRoom();
        
        if (!room) {
            room = this.createRoom();
        }

        client.room = room.id;
        room.clients.add(ws);
        
        // 通知房间内的其他玩家
        this.broadcastToRoom(room.id, {
            type: 'player_joined',
            playerId: client.id,
            playerCount: room.clients.size
        });

        // 如果房间有2个玩家，开始游戏
        if (room.clients.size === 2) {
            this.startGame(room.id);
        }
    }

    handleAction(ws, message) {
        const client = this.clients.get(ws);
        if (!client || !client.room) return;

        // 广播玩家动作给房间内的其他玩家
        this.broadcastToRoom(client.room, {
            type: 'player_action',
            playerId: client.id,
            action: message.action,
            data: message.data
        });
    }

    handleGameState(ws, message) {
        const client = this.clients.get(ws);
        if (!client || !client.room) return;

        // 更新玩家状态
        Object.assign(client.playerData, message.data);

        // 广播游戏状态给房间内的其他玩家
        this.broadcastToRoom(client.room, {
            type: 'game_state_update',
            playerId: client.id,
            data: client.playerData
        });
    }

    handleDisconnection(ws) {
        const client = this.clients.get(ws);
        if (client && client.room) {
            const room = this.gameRooms.get(client.room);
            if (room) {
                room.clients.delete(ws);
                
                // 通知房间内的其他玩家
                this.broadcastToRoom(client.room, {
                    type: 'player_left',
                    playerId: client.id
                });

                // 如果房间为空，删除房间
                if (room.clients.size === 0) {
                    this.gameRooms.delete(client.room);
                }
            }
        }
        
        this.clients.delete(ws);
    }

    findAvailableRoom() {
        for (const room of this.gameRooms.values()) {
            if (room.clients.size < 2) {
                return room;
            }
        }
        return null;
    }

    createRoom() {
        const roomId = this.generateRoomId();
        const room = {
            id: roomId,
            clients: new Set(),
            gameStarted: false,
            gameState: {
                players: new Map(),
                gameTime: 0
            }
        };
        
        this.gameRooms.set(roomId, room);
        return room;
    }

    startGame(roomId) {
        const room = this.gameRooms.get(roomId);
        if (!room) return;

        room.gameStarted = true;
        
        // 通知房间内的所有玩家游戏开始
        this.broadcastToRoom(roomId, {
            type: 'game_start',
            players: Array.from(room.clients).map(ws => {
                const client = this.clients.get(ws);
                return {
                    id: client.id,
                    playerData: client.playerData
                };
            })
        });
    }

    broadcastToRoom(roomId, message) {
        const room = this.gameRooms.get(roomId);
        if (!room) return;

        const messageStr = JSON.stringify(message);
        room.clients.forEach(ws => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(messageStr);
            }
        });
    }

    generateClientId() {
        return 'client_' + Math.random().toString(36).substr(2, 9);
    }

    generateRoomId() {
        return 'room_' + Math.random().toString(36).substr(2, 9);
    }

    start() {
        this.server.listen(this.port, () => {
            console.log(`Game server running on port ${this.port}`);
        });
    }
}

// 启动服务器
const gameServer = new GameServer(8080);

// 优雅关闭
process.on('SIGINT', () => {
    console.log('Shutting down server...');
    gameServer.wss.close(() => {
        gameServer.server.close(() => {
            process.exit(0);
        });
    });
});