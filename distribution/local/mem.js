
const datas = {}
let data = {}
const { id } = require("@brown-ds/distribution/distribution/util/util");
const log = require('../util/log');
function put(state, configuration, callback) {
    let gid = "local"
    let key = ""
    
    if (configuration instanceof Object) {
        key = configuration.key
        gid = configuration.gid
        if  (configuration.key == null){
            key = id.getID(state)
        }
    }
    else{
        key = configuration
        if  (configuration == null){
            key = id.getID(state)
        }
        
    }
    

    data[key] = state
    datas[gid] = data
   
    callback(null,state)
    
};

function get(configuration, callback) {
    let gid = "local"
    let key = ""
    if (configuration instanceof Object) {
        key = configuration.key
        gid = configuration.gid
        if  (configuration.key == null){
            callback(null, Object.keys(datas[gid]))
            return
        }
        
    }else{
        key = configuration
        if  (configuration == null){
            callback(null, Object.keys(datas[gid]))
            return
        }

    }
    if (!datas[gid]) {
        callback(new Error ("no such group have this key", null))
        return
    }

    if (!datas[gid][key]) {
        callback(new Error ("no such primary key", null))
        return
    }

    callback(null, datas[gid][key])
}

function del(configuration, callback) {
    let gid = "local"
    let key = ""
    if (configuration instanceof Object) {
        key = configuration.key
        gid = configuration.gid
    }else{
        key = configuration
        if  (configuration == null){
            key = id.getID(state)
        }
        
    }
    if (!datas[gid]) {
        callback(new Error ("no such group have this key", null))
        return
    }
    if (!datas[gid][key] ) {
        callback(new Error ("no such primary key", null))
        return
    }
    let temp = datas[gid][key]
    delete datas[gid][key]
    
    callback(null, temp)
};
module.exports = {put, get, del};
