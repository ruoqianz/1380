const log = require('../util/log');

const status = {};
//status.spawn = require('@brown-ds/distribution/distribution/local/status').spawn; 
status.stop = require('@brown-ds/distribution/distribution/local/status').stop; 

global.moreStatus = {
  sid: global.distribution.util.id.getSID(global.nodeConfig),
  nid: global.distribution.util.id.getNID(global.nodeConfig),
  counts: 0,
};

status.get = function(configuration, callback) {
  callback = callback || function(e,v) {};
  if (configuration == 'sid'){
    callback(false,global.moreStatus.sid)
  }
  else if (configuration == 'nid'){
    callback(false,global.moreStatus.nid)
  }
  else if (configuration == 'ip'){
    callback(false,global.nodeConfig.ip)
  }
  else if (configuration == 'port'){
    callback(false,global.nodeConfig.port)
  }
  else if (configuration == 'counts'){
    callback(false,global.moreStatus.counts)
  }
  else if (configuration == 'heapTotal'){
    callback(false,process.memoryUsage().heapTotal)
  }
  else if (configuration == 'heapUsed'){
    callback(false,process.memoryUsage().heapUsed)
  }
  else{
    
    callback(new Error("Invalid or missing parameters"), null)
  }
};



status.spawn =  require('@brown-ds/distribution/distribution/local/status').spawn




module.exports = status;
