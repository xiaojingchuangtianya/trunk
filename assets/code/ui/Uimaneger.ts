import { _decorator, Component, error, find, instantiate, Node, Prefab, resources } from 'cc';
const { ccclass, property } = _decorator;
// UI管理器，最底层的代码操作


@ccclass('Uimaneger')
export class Uimaneger extends Component {
    // ui根节点,所有的ui都挂载到这个节点下,可以是node或者null类型,初始值为null
    private uiRoot:Node|null =null;
    // 所有面板的字典,key是string，value是node
    private pannels:Map<string,Node>=new Map();

    // 单例模式
    private static _instance:Uimaneger;
    // 懒加载
    static get instance():Uimaneger{
        // 如果第一次调用，那就加载创建实例
        if(!this._instance){
            this._instance=new Uimaneger();
        }
        // 如果不是第一次加载，直接访问该实例
        return this._instance
    }


    openPannel(prefabName:string){
        // 判断根节点是否存在
        if(!this.uiRoot){
            this.uiRoot=find("UIRoot");
            // console.log("加载uiRoot?")
        }

        if(this.pannels.has(prefabName)){
            // 如果面板已经存在，直接将对应界面置顶
            let pannel=this.pannels.get(prefabName);
            pannel.active=true;
            return;
        }
        // console.log("加载界面了")

        // 加载面板出来
        resources.load("ui/prefab/"+prefabName,Prefab,(err,data:Prefab)=>{
            // 创建实例化这个界面
            let node=instantiate(data);
            // 添加到uiRoot的子节点下
            this.uiRoot.addChild(node);
            // 缓存到字典中
            this.pannels.set(prefabName,node);
        }) 
    }
    closePannel(){}

    // opendialog(){}
    // closedialog(){}
}

