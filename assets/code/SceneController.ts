import { _decorator, Component, director, Node, Button } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SceneController')
export class SceneController extends Component {
    @property({type:String})
    public targetScene:string="game";
    
    @property({type:String})
    public backScene:string="startMatch";

    start() {
        // 自动绑定按钮点击事件
        this.bindButtonEvents();
    }

    loadTargetScene(){
        director.loadScene(this.targetScene);
    }

    loadBackScene(){
        director.loadScene(this.backScene);
    }

    loadSceneByName(sceneName: string){
        director.loadScene(sceneName);
    }

    reloadCurrentScene(){
        const currentScene = director.getScene()?.name;
        if(currentScene){
            director.loadScene(currentScene);
        }
    }

    // 绑定场景中所有按钮的点击事件
    bindButtonEvents() {
        const buttons = this.node.getComponentsInChildren(Button);
        buttons.forEach(button => {
            const nodeName = button.node.name.toLowerCase();
            if (nodeName.includes('start') || nodeName.includes('begin')) {
                button.node.on(Button.EventType.CLICK, this.loadTargetScene, this);
            } else if (nodeName.includes('back') || nodeName.includes('return')) {
                button.node.on(Button.EventType.CLICK, this.loadBackScene, this);
            }
        });
    }

    // 用于Inspector手动绑定的方法
    onStartButtonClick(){
        this.loadTargetScene();
    }

    onBackButtonClick(){
        this.loadBackScene();
    }

    onRestartButtonClick(){
        this.reloadCurrentScene();
    }
}

