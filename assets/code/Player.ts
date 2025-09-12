import { _decorator, Component, Node, Sprite, Animation, Vec3, RigidBody2D, BoxCollider2D, ERigidBody2DType, PhysicsSystem2D, Contact2DType, Collider2D, IPhysics2DContact, Prefab, instantiate, tween } from 'cc';
import { Bullet } from './Bullet';
const { ccclass, property } = _decorator;

@ccclass('Player')
export class Player extends Component {
    @property({ type: Sprite })
    sprite: Sprite = null!;
    
    @property({ type: Prefab })
    bulletPrefab: Prefab = null!;
    
    @property({ type: Node })
    bulletSpawnPoint: Node = null!;
    
    @property
    speed: number = 300;
    
    @property
    jumpForce: number = 500;
    
    @property
    health: number = 100;
    
    @property
    maxHealth: number = 100;
    
    private playerId: number = 1;
    private isLocalPlayer: boolean = true;
    private isGrounded: boolean = false;
    private isJumping: boolean = false;
    private facingRight: boolean = true;
    private rigidBody: RigidBody2D = null!;
    private animation: Animation = null!;
    private canAttack: boolean = true;
    private attackCooldown: number = 0.5;
    private currentAttackCooldown: number = 0;

    start() {
        this.setupPhysics();
        this.setupAnimation();
    }

    setupPhysics() {
        this.rigidBody = this.getComponent(RigidBody2D);
        if (!this.rigidBody) {
            this.rigidBody = this.addComponent(RigidBody2D);
            this.rigidBody.type = ERigidBody2DType.Dynamic;
            this.rigidBody.fixedRotation = true;
            this.rigidBody.gravityScale = 3;
        }

        const collider = this.getComponent(BoxCollider2D);
        if (!collider) {
            const boxCollider = this.addComponent(BoxCollider2D);
            boxCollider.size = { width: 40, height: 60 };
            boxCollider.offset = { x: 0, y: 30 };
        }

        // 设置碰撞检测
        const colliders = this.getComponents(Collider2D);
        colliders.forEach(col => {
            col.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            col.on(Contact2DType.END_CONTACT, this.onEndContact, this);
        });
    }

    setupAnimation() {
        this.animation = this.getComponent(Animation);
        if (!this.animation) {
            this.animation = this.addComponent(Animation);
        }
    }

    initialize(id: number, isLocal: boolean) {
        this.playerId = id;
        this.isLocalPlayer = isLocal;
        
        // 根据玩家ID设置不同的颜色
        if (this.sprite) {
            if (id === 1) {
                this.sprite.color = { r: 255, g: 100, b: 100, a: 255 };
            } else {
                this.sprite.color = { r: 100, g: 100, b: 255, a: 255 };
            }
        }
    }

    moveLeft() {
        if (!this.isLocalPlayer) return;
        
        this.facingRight = false;
        this.node.scale = new Vec3(-1, 1, 1);
        this.rigidBody.linearVelocity = new Vec3(-this.speed, this.rigidBody.linearVelocity.y, 0);
    }

    moveRight() {
        if (!this.isLocalPlayer) return;
        
        this.facingRight = true;
        this.node.scale = new Vec3(1, 1, 1);
        this.rigidBody.linearVelocity = new Vec3(this.speed, this.rigidBody.linearVelocity.y, 0);
    }

    stopMove() {
        if (!this.isLocalPlayer) return;
        
        this.rigidBody.linearVelocity = new Vec3(0, this.rigidBody.linearVelocity.y, 0);
    }

    jump() {
        if (!this.isLocalPlayer || !this.isGrounded || this.isJumping) return;
        
        this.isJumping = true;
        this.rigidBody.linearVelocity = new Vec3(this.rigidBody.linearVelocity.x, this.jumpForce, 0);
        this.isGrounded = false;
    }

    attack() {
        if (!this.isLocalPlayer || !this.canAttack) return;
        
        this.canAttack = false;
        this.currentAttackCooldown = this.attackCooldown;
        
        // 创建子弹
        const bullet = instantiate(this.bulletPrefab);
        const bulletComp = bullet.getComponent(Bullet);
        
        if (bulletComp) {
            bulletComp.initialize(this.playerId, this.facingRight ? 1 : -1);
            bullet.setPosition(this.bulletSpawnPoint.worldPosition);
            this.node.parent?.addChild(bullet);
        }
    }

    takeDamage(damage: number) {
        this.health -= damage;
        this.health = Math.max(0, this.health);
        
        // 受伤闪烁效果
        tween(this.sprite)
            .to(0.1, { color: { r: 255, g: 255, b: 255, a: 128 } })
            .to(0.1, { color: { r: 255, g: 100, b: 100, a: 255 } })
            .union()
            .repeat(3)
            .start();
    }

    onBeginContact(self: Collider2D, other: Collider2D, contact: IPhysics2DContact) {
        const otherNode = other.node;
        
        if (otherNode.name === 'Ground') {
            this.isGrounded = true;
            this.isJumping = false;
        }
    }

    onEndContact(self: Collider2D, other: Collider2D, contact: IPhysics2DContact) {
        const otherNode = other.node;
        
        if (otherNode.name === 'Ground') {
            this.isGrounded = false;
        }
    }

    update(deltaTime: number) {
        // 更新攻击冷却
        if (this.currentAttackCooldown > 0) {
            this.currentAttackCooldown -= deltaTime;
            if (this.currentAttackCooldown <= 0) {
                this.canAttack = true;
            }
        }

        // 限制玩家不会掉出屏幕
        const pos = this.node.position;
        if (pos.y < -500) {
            this.node.setPosition(pos.x, 100, pos.z);
            this.rigidBody.linearVelocity = new Vec3(0, 0, 0);
        }
    }
}