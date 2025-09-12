// 简单的测试客户端，用于测试服务器功能
const WebSocket = require('ws');

class TestClient {
    constructor(name) {
        this.name = name;
        this.ws = new WebSocket('ws://localhost:8080');
        this.setupEvents();
    }

    setupEvents() {
        this.ws.on('open', () => {
            console.log(`${this.name} connected to server`);
            
            // 发送加入游戏请求
            this.ws.send(JSON.stringify({
                type: 'join',
                playerId: this.name
            }));
        });

        this.ws.on('message', (data) => {
            const message = JSON.parse(data);
            console.log(`${this.name} received:`, message);
            
            if (message.type === 'game_start') {
                console.log(`${this.name}: Game started!`);
                // 模拟游戏动作
                this.sendAction('move', { direction: 'right' });
                setTimeout(() => {
                    this.sendAction('shoot', { x: 100, y: 0 });
                }, 1000);
            }
        });

        this.ws.on('close', () => {
            console.log(`${this.name} disconnected`);
        });

        this.ws.on('error', (error) => {
            console.error(`${this.name} error:`, error.message);
        });
    }

    sendAction(action, data) {
        this.ws.send(JSON.stringify({
            type: 'action',
            action: action,
            data: data
        }));
    }
}

// 测试代码
if (require.main === module) {
    console.log('启动测试客户端...');
    
    // 创建两个测试客户端
    const client1 = new TestClient('Player1');
    setTimeout(() => {
        const client2 = new TestClient('Player2');
    }, 1000);
}

module.exports = TestClient;