import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

// 简单的网络管理器，支持WebSocket连接
@ccclass('NetworkManager')
export class NetworkManager extends Component {
    @property
    serverUrl: string = 'ws://localhost:8080';
    
    private socket: WebSocket | null = null;
    private isConnected: boolean = false;
    private reconnectAttempts: number = 0;
    private maxReconnectAttempts: number = 5;

    initialize() {
        this.connect();
    }

    connect() {
        try {
            this.socket = new WebSocket(this.serverUrl);
            
            this.socket.onopen = () => {
                console.log('Connected to server');
                this.isConnected = true;
                this.reconnectAttempts = 0;
                this.onConnected();
            };
            
            this.socket.onmessage = (event) => {
                this.handleMessage(event.data);
            };
            
            this.socket.onclose = () => {
                console.log('Disconnected from server');
                this.isConnected = false;
                this.attemptReconnect();
            };
            
            this.socket.onerror = (error) => {
                console.error('WebSocket error:', error);
            };
            
        } catch (error) {
            console.error('Failed to create WebSocket:', error);
            this.attemptReconnect();
        }
    }

    attemptReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
            setTimeout(() => {
                this.connect();
            }, 2000 * this.reconnectAttempts);
        }
    }

    send(data: any) {
        if (this.isConnected && this.socket) {
            this.socket.send(JSON.stringify(data));
        }
    }

    handleMessage(data: string) {
        try {
            const message = JSON.parse(data);
            this.onMessage(message);
        } catch (error) {
            console.error('Failed to parse message:', error);
        }
    }

    onConnected() {
        // 连接成功后的处理
        this.send({
            type: 'join',
            playerId: Math.random().toString(36).substr(2, 9)
        });
    }

    onMessage(message: any) {
        switch (message.type) {
            case 'player_joined':
                console.log('Player joined:', message.playerId);
                break;
            case 'player_left':
                console.log('Player left:', message.playerId);
                break;
            case 'game_state':
                this.handleGameState(message);
                break;
            case 'player_action':
                this.handlePlayerAction(message);
                break;
        }
    }

    handleGameState(state: any) {
        // 处理游戏状态同步
        console.log('Game state received:', state);
    }

    handlePlayerAction(action: any) {
        // 处理玩家动作
        console.log('Player action received:', action);
    }

    sendPlayerAction(action: string, data: any) {
        this.send({
            type: 'action',
            action: action,
            data: data
        });
    }

    onDestroy() {
        if (this.socket) {
            this.socket.close();
        }
    }
}