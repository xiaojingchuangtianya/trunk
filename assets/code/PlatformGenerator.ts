import { _decorator, Component, Node, Prefab, instantiate, Vec3, Sprite, Color } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlatformGenerator')
export class PlatformGenerator extends Component {
    @property({ type: Prefab })
    platformPrefab: Prefab = null!;
    
    @property
    platformWidth: number = 200;
    
    @property
    platformHeight: number = 40;
    
    @property
    groundY: number = -200;
    
    @property
    maxPlatforms: number = 5;
    
    private platforms: Node[] = [];

    start() {
        this.generateLevel();
    }

    generateLevel() {
        // 清除现有平台
        this.clearPlatforms();
        
        // 生成地面
        this.createPlatform(-400, this.groundY, 800, 40, new Color(139, 69, 19, 255));
        
        // 生成浮动平台
        const platformPositions = [
            { x: -200, y: -100 },
            { x: 200, y: -50 },
            { x: 0, y: 50 },
            { x: -300, y: 100 },
            { x: 300, y: 100 }
        ];
        
        platformPositions.forEach(pos => {
            this.createPlatform(pos.x, pos.y, 150, 20, new Color(100, 100, 100, 255));
        });
    }

    createPlatform(x: number, y: number, width: number, height: number, color: Color) {
        const platform = instantiate(this.platformPrefab);
        platform.setPosition(new Vec3(x, y, 0));
        platform.name = 'Ground';
        
        // 设置平台大小和颜色
        const sprite = platform.getComponent(Sprite);
        if (sprite) {
            sprite.color = color;
        }
        
        this.node.addChild(platform);
        this.platforms.push(platform);
    }

    clearPlatforms() {
        this.platforms.forEach(platform => {
            platform.destroy();
        });
        this.platforms = [];
    }

    getRandomPlatformPosition(): Vec3 {
        if (this.platforms.length === 0) return new Vec3(0, this.groundY + 50, 0);
        
        const randomPlatform = this.platforms[Math.floor(Math.random() * this.platforms.length)];
        const pos = randomPlatform.position;
        return new Vec3(pos.x, pos.y + 50, pos.z);
    }
}