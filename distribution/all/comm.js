/** @typedef {import("../types").Callback} Callback */

/**
 * NOTE: This Target is slightly different from local.all.Target
 * @typdef {Object} Target
 * @property {string} service
 * @property {string} method
 */

/**
 * @param {object} config
 * @return {object}
 */


function comm(config) {
  const context = {};
  context.gid = config.gid || 'all';

  /**
   * @param {Array} message
   * @param {object} configuration
   * @param {Callback} callback
   */
  function send(message, configuration, callback) {
    distribution.local.groups.get(context.gid, (e, group) => {
      if (e) {
        return callback(e, null);
      }

      const nodes = Object.values(group); 
      const responses = {}; 
      let pending = nodes.length; 
      let hasError = false;

      if (nodes.length === 0) {
        return callback(null, responses);
      }

      nodes.forEach(node => {
        const remoteConfig = {
          node: node,
          service: configuration.service,
          method: configuration.method,
        };

        distribution.local.comm.send(message, remoteConfig, (err, res) => {
          if (err) {
            console.log(err)
            hasError = true;
            responses[distribution.util.id.getNID(node)] = err.message;
          } else {
            responses[distribution.util.id.getNID(node)] = res;
          }

          pending--;
          if (pending === 0) {
            callback(hasError ? { error: "One or more requests failed" } : null, responses);
          }
        });
      });
    });
  }
    


  return {send};
};

module.exports = comm;
