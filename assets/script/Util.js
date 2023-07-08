function saveDataToCache(key, data) {
    cc.sys.localStorage.setItem(key, JSON.stringify(data));
}
 
function loadDataFromCache(key) {
    var data = cc.sys.localStorage.getItem(key);
    return data;
}
 
function loadIntFromCache(key) {
    var data = cc.sys.localStorage.getItem(key);
    if (!data) return 0;
    return parseInt(data);
}

var State = cc.Enum({
    Run : -1,
    Over: -1
});

function getDataGame(){
    let data  = loadDataFromCache("DataUser");
    if(!data){
        data = {};
        data.curGold = 0;
        data.curWave = 1;
        data.curLevelWall = 1;
        data.listCharacter = [1,1,1,1,1,1];
        return data;
    }else{
        return JSON.parse(data)
    }
}

function saveDataGame(data){
    saveDataToCache("DataUser",data);
}


 
module.exports = {
    saveDataToCache: saveDataToCache,
    loadDataFromCache: loadDataFromCache,
    loadIntFromCache: loadIntFromCache,
    saveDataGame:saveDataGame,
    getDataGame:getDataGame,
    State:State
}

