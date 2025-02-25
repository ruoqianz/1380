/* Notes/Tips:

- Use absolute paths to make sure they are agnostic to where your code is running from!
  Use the `path` module for that.
*/
const log = require('../util/log');
module.exports = {put, get, del};
const serialization = require("../util/serialization");
const path = require('path');
const fs =  require('fs');
const distribution = require("@brown-ds/distribution");
const { id } = require("@brown-ds/distribution/distribution/util/util");


let nodeId = ""
distribution.local.status.get("nid",(e,v) => {if (e) {
    callback(new Error ("no such node") , null)
}
nodeId = v
}
)

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
    
    //determine if the node dir exist
    

    const groupPath = path.resolve(__dirname, gid);
    if (!fs.existsSync(groupPath)){
      fs.mkdirSync(groupPath)
    }

    const filePath = path.resolve(groupPath, nodeId);

    if (!fs.existsSync(filePath)){
      fs.mkdirSync(filePath)
    }
    log(4213)
    //put value to the node dir
    const dataPath = path.join(filePath,`${key}.txt`)
    fs.writeFile(dataPath, serialization.serialize(state), (err) => {
        if (err) {

          callback(new Error ("no such node123File"), null);
          return
        } else {

            callback(null,state);
        }})

    
};

function get(configuration, callback) {
    let gid = "local"
    let key = ""
    if (configuration instanceof Object) {
        key = configuration.key
        gid = configuration.gid
        if  (configuration.key == null){
          const filePath1 = path.resolve(__dirname, gid,nodeId);
          fs.readdir(filePath1, (err, data) => {
            if (err) {
              callback(new Error ("no such nodeFile"),null);
              return;
            }
            callback(null,data.map(name =>name.replace(/\.txt$/, '')))
            return
            });
        }
        
    }else{
        key = configuration
        if  (configuration == null){
          const filePath1 = path.resolve(__dirname, gid , nodeId);
          fs.readdir(filePath1, (err, data) => {
            if (err != null) {
              callback(new Error ("no such nodeFile"),null);
              return;
            }
            callback(null,data.map(name =>name.replace(/\.txt$/, '')))
            return
            });
        }}

    if (key != null){
    const filePath1 = path.resolve(__dirname, gid , nodeId,`${key}.txt`);

    fs.readFile(filePath1, (err, data) => {
      if (err) {
        callback(new Error ("no such nodeFile"),null);
        return;
      }
      
      callback(null,serialization.deserialize(data.toString()))
      });
    }
    
}

function del(configuration, callback) {

  let temp = ""
  let gid = "local"
  let key = ""
  if (configuration instanceof Object) {
      key = configuration.key
      gid = configuration.gid
  }else{
      key = configuration
      
  }

  const filePath = path.resolve(__dirname, gid,nodeId,`${key}.txt`);
  

  fs.readFile(filePath, (err, data) => {
    if (err) {
      callback(new Error ("no such nodeFile"),null);
      return;
    }
    temp = serialization.deserialize(data.toString())

    fs.unlink(filePath,(err) => {if(err){
      callback(new Error ("no such nodeFile", null));
    }
    callback(null,temp)
  
  })
    });
    

    
};

module.exports = {put, get, del};
