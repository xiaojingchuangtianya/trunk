import { _decorator, Component, Node } from 'cc';
import { Uimaneger } from './Uimaneger';
const { ccclass, property } = _decorator;

// 这里处理各种ui界面的逻辑，打开关闭界面，切换界面等



@ccclass('UIcontrol')
export class UIcontrol extends Component {
    start() {
        // 初始把操作面板的内容加载出来
        Uimaneger.instance.openPannel("UIGame");
        console.log("把界面的内容加载出来了")
    }

    update(deltaTime: number) {
        
    }
}

