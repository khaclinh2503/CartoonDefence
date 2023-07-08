// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        lbGold:cc.Node,
        lbKill:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.game = cc.director.getScene().getChildByName('Canvas').getChildByName("Game").getComponent("Game");
    },

    start () {

    },
    loadData(data){
        this.lbGold.getComponent(cc.Label).string = data.numberGold;
        this.lbKill.getComponent(cc.Label).string = data.numberKill;
    },

    // update (dt) {},

    show_Popup: function() {
        this.node.active = true;
        this.node.opacity = 0;
        this.node.scale = 0.2;
        cc.tween(this.node)
            .to(0.2, { scale: 1, opacity: 255 }, { easing: "quartInOut" })
            .start();
    },
    hide_Popup: function() {
        cc.tween(this.node)
            .to(0.2, { scale: 0.1, opacity: 0 }, { easing: "quartInOut" })
            .call(() => { 
                this.node.active = false;
                this.game.createNewWave();
             })
            .start();
    }
});
