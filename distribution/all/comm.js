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
    
    const group = distribution.local.groups.get(context.gid, (e, v) => e ? console.log(e):null)
    const nodes = Object.values(group); 
    const responses = {}; 
    let pending = nodes.length; 
    let hasError = {}
    if (nodes.length === 0) {
      return callback(null, responses);
    }

    nodes.forEach(node => {
      const remoteConfig = {
        node: node,
        service: configuration.service,
        method: configuration.method,
      };
      
      distribution.local.comm.send(message, remoteConfig, (e, v) => {
        
        if (e) {
          hasError[distribution.util.id.getSID(node)] = e;
        } else {
          
          responses[distribution.util.id.getSID(node)] = v;
          
        }

        pending--;
        if (pending === 0) {
          
          callback(hasError, responses);
        }
      });
    });
  }
   
  return {send};
};

module.exports = comm;
