import { _decorator, Component, Node, Sprite, RigidBody2D, BoxCollider2D, ERigidBody2DType, Contact2DType, Collider2D, IPhysics2DContact, Vec3, tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Bullet')
export class Bullet extends Component {
    @property
    speed: number = 800;
    
    @property
    damage: number = 20;
    
    @property
    lifetime: number = 3;
    
    private ownerId: number = 0;
    private direction: number = 1;
    private rigidBody: RigidBody2D = null!;
    private currentLifetime: number = 0;

    start() {
        this.setupPhysics();
    }

    setupPhysics() {
        this.rigidBody = this.getComponent(RigidBody2D);
        if (!this.rigidBody) {
            this.rigidBody = this.addComponent(RigidBody2D);
            this.rigidBody.type = ERigidBody2DType.Kinematic;
            this.rigidBody.gravityScale = 0;
        }

        const collider = this.getComponent(BoxCollider2D);
        if (!collider) {
            const boxCollider = this.addComponent(BoxCollider2D);
            boxCollider.size = { width: 20, height: 10 };
            boxCollider.tag = 1; // 子弹标签
        }

        // 设置碰撞检测
        const colliders = this.getComponents(Collider2D);
        colliders.forEach(col => {
            col.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        });
    }

    initialize(ownerId: number, direction: number) {
        this.ownerId = ownerId;
        this.direction = direction;
        
        // 设置子弹速度
        this.rigidBody.linearVelocity = new Vec3(this.speed * direction, 0, 0);
        
        // 根据方向翻转子弹
        this.node.scale = new Vec3(direction, 1, 1);
    }

    onBeginContact(self: Collider2D, other: Collider2D, contact: IPhysics2DContact) {
        const otherNode = other.node;
        const otherPlayer = otherNode.getComponent('Player');
        
        if (otherPlayer && otherPlayer.playerId !== this.ownerId) {
            // 击中敌人
            otherPlayer.takeDamage(this.damage);
            this.destroyBullet();
        } else if (other.tag === 1 && other.node !== this.node) {
            // 子弹相撞
            this.destroyBullet();
            other.node.destroy();
        } else if (otherNode.name === 'Ground') {
            // 击中地面
            this.destroyBullet();
        }
    }

    destroyBullet() {
        // 销毁动画效果
        tween(this.node)
            .to(0.1, { scale: new Vec3(1.5, 1.5, 1) })
            .call(() => {
                this.node.destroy();
            })
            .start();
    }

    update(deltaTime: number) {
        this.currentLifetime += deltaTime;
        
        if (this.currentLifetime >= this.lifetime) {
            this.node.destroy();
        }
    }
}