# 🎮 SceneController绑定指南

## 📋 如何将SceneController绑定到StartMatch.scene的按钮上

### 🔧 方法一：自动绑定（已配置）

我已经为您配置了自动绑定，SceneController会自动绑定场景中包含"start"或"begin"关键字的按钮：

1. **Start按钮** → 自动绑定到`onStartButtonClick()`
2. **Back按钮** → 自动绑定到`onBackButtonClick()`

### 🔧 方法二：手动绑定（推荐用于精确控制）

#### 步骤1：添加SceneController组件
1. 在Cocos Creator中打开`StartMatch.scene`
2. 在层级管理器中选择`UIRoot`节点
3. 在属性检查器中点击"添加组件"
4. 选择"用户脚本" → `SceneController`

#### 步骤2：配置场景名称
在SceneController组件中设置：
- **Target Scene**: `game` (要加载的游戏场景)
- **Back Scene**: `startMatch` (返回的场景)

#### 步骤3：绑定按钮事件
1. 在层级管理器中选择`Start`按钮节点
2. 在属性检查器中找到`Button`组件
3. 在`Click Events`中添加新事件
4. 拖拽`UIRoot`节点到`Target`字段
5. 在`Component`下拉菜单中选择`SceneController`
6. 在`Handler`下拉菜单中选择`onStartButtonClick`

### 📱 代码说明

#### SceneController提供的方法：

| 方法名 | 功能 | 使用场景 |
|--------|------|----------|
| `onStartButtonClick()` | 加载目标场景 | 开始游戏按钮 |
| `onBackButtonClick()` | 加载返回场景 | 返回按钮 |
| `onRestartButtonClick()` | 重新加载当前场景 | 重新开始按钮 |
| `loadSceneByName(name)` | 按名称加载任意场景 | 动态场景切换 |

#### 自动绑定规则：
- 节点名包含"start"/"begin" → 绑定到`onStartButtonClick()`
- 节点名包含"back"/"return" → 绑定到`onBackButtonClick()`

### 🎯 验证绑定成功

1. 点击Cocos Creator的"预览"按钮
2. 在浏览器中打开游戏
3. 点击"Start"按钮
4. 应该跳转到游戏场景

### 🔍 常见问题排查

#### 场景未切换？
- 检查场景名称是否正确（`game` vs `game-scene`）
- 确认场景文件存在于`assets/scenes/`目录
- 检查浏览器控制台是否有错误信息

#### 按钮无响应？
- 确认按钮的`Interactable`属性为true
- 检查按钮是否有`Button`组件
- 验证SceneController组件是否添加到节点上

### 📁 场景文件映射

| 场景文件名 | 代码中使用的名称 |
|------------|------------------|
| `game.scene` | `game` |
| `startMatch.scene` | `startMatch` |

现在您可以直接使用配置好的SceneController，所有按钮事件已经绑定完成！