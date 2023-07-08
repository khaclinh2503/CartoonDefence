// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.game = cc.director.getScene().getChildByName('Canvas').getChildByName("Game").getComponent("Game");

    },

    start() {

    },

    setDame(dame){
        this.dame = dame
    },

    getDame(){
        return this.dame;
    },

    update(dt) {
        if(this.game.isRunning()){
            this.node.x += 5;
            if (this.node.x > 1100) {
                this.node.destroy();
            }
        }else{
            this.node.destroy();
        }
       
    },
});
