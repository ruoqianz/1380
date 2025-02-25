const distribution = global.distribution;

const groups = function(config) {
  const context = {};
  context.gid = config.gid || 'all';

  return {
    put: (config, group, callback) => {
      distribution[context.gid].comm.send([config, group], {  gid: context.gid, service: "groups", method: "put", }, callback);
    },

    del: (name, callback) => {
      distribution[context.gid].comm.send([name], { gid: context.gid, service: "groups", method: "del" }, callback);
    },

    get: (name, callback) => {
      distribution[context.gid].comm.send([name], { gid: context.gid, service: "groups", method: "get"}, callback);
    },

    add: (name, node, callback) => {
      distribution[context.gid].comm.send([name, node], {  gid: context.gid, service: "groups", method: "add" }, callback);
    },

    rem: (name, node, callback) => {
      distribution[context.gid].comm.send([name, node], { gid: context.gid, service: "groups", method: "rem" }, callback);
    },
  };
};

module.exports = groups;
