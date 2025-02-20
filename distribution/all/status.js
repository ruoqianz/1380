
const status = function(config) {
  const context = {};
  context.gid = config.gid || 'all';

  return {
    get: (configuration, callback) => {
      
    },

    spawn: (configuration, callback) => {
      callback = callback || function() { };
      console.log(1)
      callback(configuration);
    },

    stop: (callback) => {
      callback = callback || function() { };
      callback(configuration);
    },
  };
};

module.exports = status;
