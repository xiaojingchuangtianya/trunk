# 合金弹头双人在线对战游戏

一个基于Cocos Creator 3.6的2D横版射击对战游戏，支持本地双人对战和在线对战模式。

## 游戏特色

- **双人对战模式**: 支持本地双人同屏对战和在线匹配对战
- **经典玩法**: 类似合金弹头的横版射击玩法
- **实时对战**: 使用WebSocket实现低延迟在线对战
- **物理引擎**: 使用Cocos Creator内置的2D物理引擎
- **响应式控制**: 流畅的角色移动和射击体验

## 游戏控制

### 玩家1 (左侧)
- **A**: 向左移动
- **D**: 向右移动  
- **J**: 攻击/射击
- **K**: 跳跃

### 玩家2 (右侧)
- **←**: 向左移动
- **→**: 向右移动
- **数字键1**: 攻击/射击
- **数字键2**: 跳跃

## 游戏目标

- 击败对方玩家，将对手的生命值降至0
- 利用地形优势进行战术战斗
- 避免掉落平台边缘

## 技术架构

### 前端 (Cocos Creator)
- **GameManager.ts**: 游戏主控制器
- **Player.ts**: 玩家角色控制
- **Bullet.ts**: 子弹系统
- **NetworkManager.ts**: 网络通信管理
- **GameUI.ts**: 游戏界面
- **PlatformGenerator.ts**: 地形生成器

### 后端 (Node.js)
- **game-server.js**: WebSocket游戏服务器
- 支持房间匹配和游戏状态同步
- 自动重连机制

## 快速开始

### 本地运行
1. 安装Node.js服务器依赖：
   ```bash
   cd server
   npm install
   npm start
   ```

2. 在Cocos Creator中打开项目，运行游戏场景

### 在线对战
1. 启动服务器后，游戏会自动连接到本地服务器
2. 两个玩家加入后自动开始对战

## 开发计划

- [x] 基础角色控制和射击系统
- [x] 物理引擎集成
- [x] 双人本地对战
- [x] WebSocket网络对战
- [ ] 更多武器类型
- [ ] 道具系统
- [ ] 更多地图场景
- [ ] 音效和背景音乐
- [ ] 移动端支持

## 项目结构

```
onlineDemo/
├── assets/                    # Cocos Creator资源
│   ├── *.ts                  # TypeScript游戏脚本
│   ├── *.prefab              # 预制体资源
│   └── *.meta               # 资源元数据
├── server/                   # Node.js服务器
│   ├── game-server.js       # 主服务器文件
│   ├── package.json         # 服务器依赖
│   └── package-lock.json    # 依赖锁定
├── settings/                # Cocos Creator设置
└── readme.md               # 项目说明
```

## 贡献

欢迎提交Issue和Pull Request来改进这个游戏！

## 许可证

MIT License