import { _decorator, Component, director, Node, Button } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SceneController')
export class SceneController extends Component {
    @property({type:String})
    public targetScene:string="game";
    
    @property({type:String})
    public backScene:string="startMatch";

    start() {
        // 方式2：在父节点上挂载代码，然后找到Start节点，在按钮节点上绑定点击事件
        const startButton = this.node.getChildByName("Start")
        startButton.on(Button.EventType.CLICK, this.onStartButtonClick, this);

        
    }
    //方式1：在对应的按钮上的点击事件增加对应的clickEvent 
    // 执行加载界面的函数
    loadTargetScene(){
        director.loadScene(this.targetScene);
    }



    // 代码里增加监听事件，方式2
    onStartButtonClick(){
        console.log("按钮被点击了，开始游戏")
        this.loadTargetScene();
    }

}

