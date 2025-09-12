import { _decorator, Component, Node, Prefab, instantiate, Vec3, input, Input, KeyCode, EventKeyboard, director, Canvas, UITransform, Size } from 'cc';
import { Player } from './Player';
import { NetworkManager } from './NetworkManager';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    @property({ type: Prefab })
    playerPrefab: Prefab = null!;
    
    @property({ type: Node })
    spawnPoint1: Node = null!;
    
    @property({ type: Node })
    spawnPoint2: Node = null!;
    
    @property({ type: Node })
    gameUI: Node = null!;
    
    private player1: Node = null!;
    private player2: Node = null!;
    private isOnlineMode: boolean = false;
    private networkManager: NetworkManager = null!;

    start() {
        this.setupGame();
        this.setupInput();
    }

    setupGame() {
        // 创建玩家1
        this.player1 = instantiate(this.playerPrefab);
        this.player1.setPosition(this.spawnPoint1.position);
        this.player1.getComponent(Player)?.initialize(1, true);
        this.node.addChild(this.player1);

        // 创建玩家2 - 本地双人模式
        this.player2 = instantiate(this.playerPrefab);
        this.player2.setPosition(this.spawnPoint2.position);
        this.player2.getComponent(Player)?.initialize(2, false);
        this.node.addChild(this.player2);

        // 初始化网络管理器
        this.networkManager = this.getComponent(NetworkManager);
        if (this.networkManager) {
            this.isOnlineMode = true;
            this.networkManager.initialize();
        }
    }

    setupInput() {
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    onKeyDown(event: EventKeyboard) {
        const player1Comp = this.player1.getComponent(Player);
        const player2Comp = this.player2.getComponent(Player);

        // 玩家1控制 (WASD + J攻击 + K跳跃)
        switch(event.keyCode) {
            case KeyCode.KEY_A:
                player1Comp?.moveLeft();
                break;
            case KeyCode.KEY_D:
                player1Comp?.moveRight();
                break;
            case KeyCode.KEY_J:
                player1Comp?.attack();
                break;
            case KeyCode.KEY_K:
                player1Comp?.jump();
                break;
        }

        // 玩家2控制 (方向键 + 1攻击 + 2跳跃)
        switch(event.keyCode) {
            case KeyCode.ARROW_LEFT:
                player2Comp?.moveLeft();
                break;
            case KeyCode.ARROW_RIGHT:
                player2Comp?.moveRight();
                break;
            case KeyCode.NUMPAD_1:
                player2Comp?.attack();
                break;
            case KeyCode.NUMPAD_2:
                player2Comp?.jump();
                break;
        }
    }

    onKeyUp(event: EventKeyboard) {
        const player1Comp = this.player1.getComponent(Player);
        const player2Comp = this.player2.getComponent(Player);

        switch(event.keyCode) {
            case KeyCode.KEY_A:
            case KeyCode.KEY_D:
                player1Comp?.stopMove();
                break;
            case KeyCode.ARROW_LEFT:
            case KeyCode.ARROW_RIGHT:
                player2Comp?.stopMove();
                break;
        }
    }

    update(deltaTime: number) {
        // 更新游戏逻辑
        this.checkGameOver();
    }

    checkGameOver() {
        const player1Comp = this.player1.getComponent(Player);
        const player2Comp = this.player2.getComponent(Player);

        if (player1Comp?.health <= 0) {
            this.endGame(2);
        } else if (player2Comp?.health <= 0) {
            this.endGame(1);
        }
    }

    endGame(winner: number) {
        console.log(`Player ${winner} wins!`);
        // 可以添加游戏结束UI和重新开始逻辑
    }

    onDestroy() {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
    }
}