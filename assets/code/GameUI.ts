import { _decorator, Component, Node, Label, Sprite, Button, director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameUI')
export class GameUI extends Component {
    @property({ type: Label })
    player1HealthLabel: Label = null!;
    
    @property({ type: Label })
    player2HealthLabel: Label = null!;
    
    @property({ type: Label })
    gameStatusLabel: Label = null!;
    
    @property({ type: Button })
    restartButton: Button = null!;
    
    @property({ type: Button })
    menuButton: Button = null!;
    
    private player1Health: number = 100;
    private player2Health: number = 100;

    start() {
        this.setupUI();
    }

    setupUI() {
        this.updateHealthDisplay();
        this.gameStatusLabel.string = "游戏进行中...";
        
        // 设置按钮事件
        this.restartButton.node.on(Button.EventType.CLICK, this.onRestart, this);
        this.menuButton.node.on(Button.EventType.CLICK, this.onMenu, this);
    }

    updateHealth(player1: number, player2: number) {
        this.player1Health = player1;
        this.player2Health = player2;
        this.updateHealthDisplay();
    }

    updateHealthDisplay() {
        this.player1HealthLabel.string = `玩家1: ${this.player1Health}/100`;
        this.player2HealthLabel.string = `玩家2: ${this.player2Health}/100`;
    }

    showGameOver(winner: number) {
        this.gameStatusLabel.string = `游戏结束! 玩家${winner}获胜!`;
        this.restartButton.node.active = true;
    }

    onRestart() {
        // 重新开始游戏
        director.loadScene('GameScene');
    }

    onMenu() {
        // 返回主菜单
        director.loadScene('MenuScene');
    }

    showMessage(message: string, duration: number = 2) {
        this.gameStatusLabel.string = message;
        
        setTimeout(() => {
            this.gameStatusLabel.string = "游戏进行中...";
        }, duration * 1000);
    }
}