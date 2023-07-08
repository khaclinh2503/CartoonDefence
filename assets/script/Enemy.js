// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        state: 0,
        progressBarHP:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.game = cc.director.getScene().getChildByName('Canvas').getChildByName("Game").getComponent("Game");
        let animation = this.getComponent(cc.Animation);
        animation.play("Walk");
    },

    setLevel(curWave){
        this.level = curWave;
        this.hp = curWave*10;
        this.maxHP = curWave*10;
        this.dame= curWave*5;
        this.speed = curWave/1000+1;
        this.timeAttack = 1/(curWave/1000)
        this.progressBarHP.getComponent(cc.ProgressBar).progress = 1;

    },
    onAttack() {
        if(this.hp<=0) return;
        this.timeAttack = 2;
        let animation = this.getComponent(cc.Animation);
        animation.play("Attack");
        animation.on('finished', function (event) {
            animation.play("Idle");
        });
        let dame = this.dame;
        if(this.type == 4||this.type == 9){
            this.hp = 0;
            dame = this.maxHP;
            this.onDead();
        }
        this.game.enemyAttack(dame);
    },
    onDead() {
        let animation = this.getComponent(cc.Animation);
        animation.play("Dead");
        animation.on('finished', function (event) {
            this.game.onEnemyDead(this.node, this.level)
            this.node.destroy();
        }.bind(this));
    },

    start() {

    },

    update(dt) {
        if(!this.game.isRunning()){
            this.node.destroy();
        }
        this.timeAttack -= dt;
        if (this.state == 0) {
            if (this.hp > 0) {
                this.node.x -= 1;
                if (this.node.x <= -455) {
                    this.node.x = -455;
                    this.state = 1;
                    this.onAttack();
                }
            }
        } else if (this.state == 1) {
            if (this.timeAttack <= 0) {
                this.onAttack();
            }
        }
    },
    onHit(dame) {
        this.hp -= dame;
        this.progressBarHP.getComponent(cc.ProgressBar).progress = this.hp/this.maxHP;
        if (this.hp <= 0) {
            this.onDead();
        }
    },

    onCollisionEnter: function (other, self) {
        if (this.hp > 0) {
            this.onHit(other.getComponent("Bullet").getDame());
            other.getComponent("Bullet").node.destroy();
        }
    },
});
