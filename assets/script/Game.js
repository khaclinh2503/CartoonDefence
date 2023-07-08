// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


import * as Util from "./Util";
cc.Class({
    extends: cc.Component,

    properties: {
        enemyPrefabs: [cc.Prefab],
        bulletPrefabs: [cc.Prefab],
        character: cc.Prefab,
        popupShop: cc.Prefab,
        popupClearWave: cc.Prefab,
        popupOffline: cc.Prefab,
        popupUpgrade: cc.Prefab,
        numberRow: 6,
        lbGold: cc.Node,
        lbWave: cc.Node,
        lbGoldUpgrade: cc.Node,
        lbGoldFix: cc.Node,
        lbUpgradeCharacter: cc.Node,
        progressBarHP: cc.Node,
        posXCharacter: {
            default: [],
            type: cc.Integer
        },
        posYCharacters: {
            default: [],
            type: cc.Integer
        },
        posYEnemys: {
            default: [],
            type: cc.Integer
        },
        posXEnemys: {
            default: [],
            type: cc.Integer
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.posXCharacter = [-725, -860];
        this.posYCharacters = [300, 185, 75, - 40, - 150, - 260];
        this.posYEnemys = [310, 200, 90, -20, -130, -240];
        this.posXEnemys = [1100, -443];
        this.numberWave = 1;
        this.numberEnemy = 0;
        this.listCharacter = [];

        this.initUIGame();
        this.loadDataGame();
        this.timeCreateWave = 0;
        this.setCollision();
    },

    initUIGame() {
        this.popupCW = cc.instantiate(this.popupClearWave);
        this.node.addChild(this.popupCW);
        this.popupCW.active = false;
    },


    loadDataGame() {
        let data = Util.getDataGame();
        this.curGold = data.curGold;
        this.curWave = data.curWave;
        this.curLevelWall = data.curLevelWall;
        this.curHPWall = data.curLevelWall * 1000;
        this.gameState = Util.State.Run;
        this.createNewWave();
        this.createCharacter(data.listCharacter);
        this.setGold();
        this.updateInfoWall();
    },
    setGold() {
        this.lbGold.getComponent(cc.Label).string = this.curGold;
    },

    setCollision() {
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        // manager.enabledDebugDraw = true;
        // manager.enabledDrawBoundingBox = true;
    },

    createCharacter(listCharacter) {
        for (let i = 0; i < listCharacter.length; i++) {
            let x = i > 5 ? 1 : 0;
            let y = i > 5 ? (i - 6) : i
            let character = cc.instantiate(this.character);
            character.getComponent("Character").setLevel(listCharacter[i]);
            character.setPosition(cc.v2(this.posXCharacter[x], this.posYCharacters[y]));
            this.node.addChild(character);
            this.listCharacter.push(character);
        }
        this.setInfoUpgrade();
    },

    createNewWave() {
        this.goldWave = 0;
        this.killEnemy = 0;
        this.gameState = Util.State.Run;
        this.maxEnemy = this.curWave * 10;
        this.setInfoWave();
        this.createEnemy();
    },
    setInfoWave() {
        this.lbWave.getComponent(cc.Label).string = "Wave: " + this.curWave;
    },
    createEnemy() {
        for (let i = 0; i < this.maxEnemy; i++) {
            let x = Math.floor(i / 6);
            let y = i % 6
            let index = Math.floor(Math.random() * 11);
            if (index >= 10) index = 9;
            let enemy = cc.instantiate(this.enemyPrefabs[index]);
            enemy.setPosition(cc.v2(this.posXEnemys[0] - x * 50, this.posYEnemys[y]));
            enemy.getComponent("Enemy").setLevel(this.curWave)
            this.node.addChild(enemy);
            this.numberEnemy++;
        }
        this.maxEnemy = 0;
    },

    createBullet(character, level, dame) {
        let index = Math.floor(level / 3) + 1;
        if (index > 2) index = 2;
        let bullet = cc.instantiate(this.bulletPrefabs[index]);
        bullet.getComponent("Bullet").setDame(dame)
        this.node.addChild(bullet);
        bullet.setPosition(character.getPosition());
    },

    start() {

    },
    isRunning() {
        return this.gameState == Util.State.Run;
    },

    update(dt) {
        this.checkWave();
    },

    checkWave() {
        console.log("checkWave", this.curHPWall)
        if (this.isRunning()) {
            if (this.curHPWall <= 0) {
                this.gameState = Util.State.Over;
                this.curHPWall = this.curLevelWall*1000;
                this.showUserLose();
            } else {
                if (this.numberEnemy == 0) {
                    if (this.maxEnemy == 0) {
                        this.gameState = Util.State.Over;
                        this.showUserWin();
                    } else this.createEnemy();
                }
            }
        }


    },

    showUserWin() {
        let dataCache = Util.getDataGame();
        this.curWave += 1;
        dataCache.curWave += 1;
        Util.saveDataGame(dataCache);
        this.popupCW.getComponent("PopupClearWave").loadData({
            numberKill: this.killEnemy,
            numberGold: this.goldWave
        });
        this.popupCW.getComponent("PopupClearWave").show_Popup();


    },
    showUserLose() {
        this.popupCW.getComponent("PopupClearWave").loadData({
            numberKill: this.killEnemy,
            numberGold: this.goldWave
        });
        this.popupCW.getComponent("PopupClearWave").show_Popup();
    },

    onEnemyDead(node, gold) {
        this.numberEnemy--;
        this.killEnemy++;
        this.goldWave += gold;
        this.curGold += gold;

        let data = Util.getDataGame();
        data.curGold = this.curGold;
        Util.saveDataGame(data);

        this.setGold();
    },
    upgradeWall() {
        this.curLevelWall += 1;
        this.curHPWall = this.curLevelWall * 1000;
        this.updateInfoWall();
        let data = Util.getDataGame();
        data.curWave = this.curLevelWall;
        Util.saveDataGame(data);
    },

    updateInfoWall() {
        this.lbGoldUpgrade.getComponent(cc.Label).string = this.curLevelWall * 2000;
        this.lbGoldFix.getComponent(cc.Label).string = this.curLevelWall * 1000 - this.curHPWall;
        this.progressBarHP.getComponent(cc.ProgressBar).progress = (this.curHPWall / (this.curLevelWall * 1000));
    },

    enemyAttack(dame) {
        this.curHPWall -= dame;
        this.updateInfoWall();
    },

    repairWall() {
        let dataCache = Util.getDataGame();
        let gold = this.curLevelWall * 1000 - this.curHPWall;
        if (gold <= this.curGold) {
            this.curGold -= gold;
            dataCache.curGold -= gold;
            this.curHPWall = this.curLevelWall * 1000;
            this.updateInfoWall();
            this.setGold();
        }
        Util.saveDataGame(dataCache)
    },

    getMinEnemy() {
        let min = 11;
        let character;
        let index;
        for (let i = 0; i < 12; i++) {
            character = this.listCharacter[i];
            if (!character) {
                return { index: i, node: null };
            } else {
                let level = character.getComponent("Character").level;
                if (level < min) {
                    min = level;
                    index = i;
                }
            }
        }
        console.log("getMinEnemy", index)
        return { index: index, node: this.listCharacter[index] };
    },
    upgradeCharacter() {
        let data = this.getMinEnemy();
        let dataCache = Util.getDataGame();
        let gold = this.getGoldUpgradeCharacter();
        if (gold <= this.curGold) {
            dataCache.curGold -= gold;
            this.curGold -= gold;
            if (data.node) {
                data.node.getComponent("Character").onUpgrade();
                dataCache.listCharacter[data.index] = data.node.getComponent("Character").level;
            } else {
                let x = data.index > 5 ? 1 : 0;
                let y = data.index > 5 ? (data.index - 6) : data.index
                let character = cc.instantiate(this.character);
                character.getComponent("Character").setLevel(1);
                character.setPosition(cc.v2(this.posXCharacter[x], this.posYCharacters[y]));
                this.node.addChild(character);
                this.listCharacter.push(character);
                dataCache.listCharacter.push(1);

            }
        }
        this.setInfoUpgrade();
        this.setGold();
        Util.saveDataGame(dataCache);
    },
    getGoldUpgradeCharacter() {
        let data = this.getMinEnemy();
        let gold = Math.pow(2, 0) * 10;
        if (data.node) {
            let level = data.node.getComponent("Character").level;
            gold = Math.pow(2, level + 1) * 20;
        }
        return gold
    },
    setInfoUpgrade() {
        this.lbUpgradeCharacter.getComponent(cc.Label).string = this.getGoldUpgradeCharacter();
    }
});
