
const { id } = require("@brown-ds/distribution/distribution/util/util");
const log = require('../util/log');

const store = function(config) {
  const context = {};
  context.gid = config.gid || 'all';
  context.hash = config.hash || global.distribution.util.id.naiveHash;
  return {


    get: (configuration, callback) => { const group = global.distribution.local.groups.get(context.gid, (e, v) => e ? callback(e,null): null)

      const nodes = Object.values(group);
      const nids = nodes.map((node) => id.getNID(node));
      let kid = id.getID(configuration)
      const nid = context.hash(kid,nids)
      const pickedNode = nodes.filter((node) => id.getNID(node) === nid)[0];
      const remote = {node: pickedNode, service: 'store', method: 'get'};

      if(configuration == null){
        const config = {gid: context.gid, key : null}
        const remote = {service: 'store', method: 'get'};
        const message = [config];
        global.distribution[context.gid].comm.send(message,remote,(e,v) => {

          callback({}, Object.values(v).flat())

    })
      return
      }

      const config = {gid: context.gid, key : configuration}
      const message = [config]; // Arguments to the method
      console.log(remote)
      if(remote.node == undefined){
        callback(new Error ("no node"),null)
        return
      }
      global.distribution.local.comm.send(message,remote,(e,v) => {if (e) {
       
        callback(new Error ("no such nodeFile"),null)
        return
      }
     
    callback(null,v)})
    },




    put: (state, configuration, callback) => { const group =global.distribution.local.groups.get(context.gid, (e, v) => e ? callback(e,null): null)
      let config1 = configuration
      const nodes = Object.values(group);
      const nids = nodes.map((node) => id.getNID(node));
      
      if  (configuration == null){
        config1 = id.getID(state)
    }
    let kid = id.getID(config1)
      const value = state
      const nid = context.hash(kid,nids)
      const pickedNode = nodes.filter((node) => id.getNID(node) === nid)[0];
      const remote = {node: pickedNode, service: 'store', method: 'put'};
      const config = {gid: context.gid, key : config1}
      const message = [value,config]; // Arguments to the method
      global.distribution.local.comm.send(message,remote,(e,v) => {if (e) {
        callback(e,null)
        return
      }   
      
      
    callback(null,v)})
    },



    del: (configuration, callback) => {
      const group = global.distribution.local.groups.get(context.gid, (e, v) => e ? callback(e,null):null)
      const nodes = Object.values(group);
      const nids = nodes.map((node) => id.getNID(node));
            
      let kid = id.getID(configuration)

      if  (configuration == null){
        kid = id.getID(state)
    }

      const nid = context.hash(kid,nids)
      const pickedNode = nodes.filter((node) => id.getNID(node) === nid)[0];
      const remote = {node: pickedNode, service: 'store', method: 'del'};
      const config = {gid: context.gid, key : configuration}
      const message = [config]; // Arguments to the method
      if(remote.node == undefined){
        callback(new Error ("no node"),null)
        return
      }
      
      global.distribution.local.comm.send(message,remote,(e,v) => {if (e) {
        callback(new Error ("no such nodeFile"),null)
        return
      }
     
    callback(null,v)})
    },

    reconf: (configuration, callback) => {
    },

  };
};

module.exports = store;
