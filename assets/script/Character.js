// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,
    properties: {
        cSprite: cc.Node,
        gSprite: cc.Node,
        lbLevel: cc.Node,
        
    },

    onLoad() {
        this.game = cc.director.getScene().getChildByName('Canvas').getChildByName("Game").getComponent("Game");
        let animation = this.getComponent(cc.Animation);
        animation.play("Idle");
    },
    setLevel: function (level) {
        this.level = level;
        if (level < 1) level = 1;
        if (level > 10) level = 10;
        this.timeAttack =1.5/level;
        this.dame = Math.pow(2,level)*10;

        let cUrl = "Characters/Chickens and Guns/" + level + "c";
        let gUrl = "Characters/Chickens and Guns/" + level + "g";

        cc.loader.loadRes(cUrl, cc.SpriteFrame, function (error, spriteFrame) {
            if (!error) {
                var sprite1 = this.cSprite.getComponent(cc.Sprite);
                sprite1.spriteFrame = spriteFrame;

            }
        }.bind(this));

        cc.loader.loadRes(gUrl, cc.SpriteFrame, function (error, spriteFrame) {
            if (!error) {
                var sprite1 = this.gSprite.getComponent(cc.Sprite);
                sprite1.spriteFrame = spriteFrame;

            }
        }.bind(this));
        this.lbLevel.getComponent(cc.Label).string = level;
    },

    onUpgrade(){
        this.level+=1;
        this.setLevel(this.level);
    },

    onShoot() {
        let animation = this.getComponent(cc.Animation);
        animation.play("Shoot");
        animation.on('finished', function (event) {
            animation.play("Idle");
        });
        this.game.createBullet(this.node,this.level,this.dame);
    },

    start() {

    },

    update (dt) {
        if(this.game.isRunning()){
            this.timeAttack-=dt;
            if(this.timeAttack<=0){
                this.timeAttack = 1.5/this.level;
                this.onShoot();
            }
        }
    },
});
