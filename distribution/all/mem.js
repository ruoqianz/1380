
const { id } = require("@brown-ds/distribution/distribution/util/util");
const { idToNum } = require("../util/id");

function mem(config) {
  const context = {};
  context.gid = config.gid || 'all';
  context.hash = config.hash || global.distribution.util.id.naiveHash;




  /* For the distributed mem service, the configuration will
          always be a string */
  //��õ�ǰ�������nodes��nid

  //����ͬ�ڵ�����ܻ��õ���ͬ�Ĺ�ϣ����
  //ͬһ���ڵ�����ڲ�ͬ�Ľڵ����� ���Ǳ���Ҫȷ����object��Դ�Ľڵ�����òŷ��� ���򱨴�
  return {
    get: (configuration, callback) => {
      
      const group = global.distribution.local.groups.get(context.gid, (e, v) => e ? callback(e,null): console.log(v))

      const nodes = Object.values(group);
      nodes.forEach(node =>{
        node = idToNum(id.getNID(node))
      })
      let key = id.getID(configuration)
      const kid =  idToNum(key)
      const storeNode = context.hash(kid,nodes)
      const remote = {node: storeNode, service: 'mem', method: 'get'};

      if(configuration == null){
        const config = {gid: context.gid, key : null}
        const remote = {service: 'mem', method: 'get'};
        const message = [config];
        global.distribution[context.gid].comm.send(message,remote,(e,v) => {
         
          const re = {};
          for (i in Object.values(v).flat()){
            re[i] = Object.values(v).flat()[i]
          }
      callback({},re)
    })
      return
      }

      const config = {gid: context.gid, key : configuration}
      const message = [config]; // Arguments to the method
      
      global.distribution.local.comm.send(message,remote,(e,v) => {if (e) {
        callback(e,null)
        return
      }
    callback(null,v)})

    },

    put: (state, configuration, callback) => {

      const group =global.distribution.local.groups.get(context.gid, (e, v) => e ? callback(e,null): console.log(v))

      const nodes = Object.values(group);
      nodes.forEach(node =>{
        node = idToNum(id.getNID(node))
      })
      let key = id.getID(configuration)
      if  (configuration == null){
        key = id.getID(id.getID(state))
    }
    
      const value = state
      const kid =  idToNum(key)
      const storeNode = context.hash(kid,nodes)
      const remote = {node: storeNode, service: 'mem', method: 'put'};
      const config = {gid: context.gid, key : configuration}
      const message = [value,config]; // Arguments to the method
      
      global.distribution.local.comm.send(message,remote,(e,v) => {if (e) {
        callback(e,null)
        return
      }   
      
      
    callback(null,v)})
    },

    del: (configuration, callback) => { 
      const group = global.distribution.local.groups.get(context.gid, (e, v) => e ? callback(e,null): console.log(v))
      const nodes = Object.values(group);
      nodes.forEach(node =>{
        node = idToNum(id.getNID(node))
      })
      let key = id.getID(configuration)
      if  (configuration == null){
        key = id.getID(id.getID(state))
    }
    
      const kid =  idToNum(key)
      const storeNode = context.hash(kid,nodes)
      const remote = {node: storeNode, service: 'mem', method: 'del'};
      const config = {gid: context.gid, key : configuration}
      const message = [config]; // Arguments to the method

      
      global.distribution.local.comm.send(message,remote,(e,v) => {if (e) {
        callback(e,null)
        return
      }
    callback(null,v)})
      
    },

    reconf: (configuration, callback) => {
    },
  };
};

module.exports = mem;
