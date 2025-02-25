/*
    In this file, add your own test cases that correspond to functionality introduced for each milestone.
    You should fill out each test case so it adequately tests the functionality you implemented.
    You are left to decide what the complexity of each test case should be, but trivial test cases that abuse this flexibility might be subject to deductions.

    Imporant: Do not modify any of the test headers (i.e., the test('header', ...) part). Doing so will result in grading penalties.
*/
const distribution = require('../../config.js');
const id = distribution.util.id;

const mygroupConfig = {gid: 'mygroup'};
const mygroupGroup = {};

/*
   This is necessary since we can not
   gracefully stop the local listening node.
   This is because the process that node is
   running in is the actual jest process
*/
let localServer = null;

const n1 = {ip: '127.0.0.1', port: 9001};
const n2 = {ip: '127.0.0.1', port: 9002};
const n3 = {ip: '127.0.0.1', port: 9003};
const n4 = {ip: '127.0.0.1', port: 9004};
const n5 = {ip: '127.0.0.1', port: 9005};
const n6 = {ip: '127.0.0.1', port: 9006};


test('(1 pts) student test', (done) => {
  const remote = {service: 'status', method: 'get'};

  distribution.mygroup.comm.send(['error'], remote, (e, v) => {
    try {
      Object.keys(mygroupGroup).forEach((sid) => {
        expect(e[sid]).toBeDefined();
        expect(e[sid]).toBeInstanceOf(Error);
        expect(v).toEqual({});
      });

      done();
    } catch (error) {
      done(error);
    }
  });
});


test('(1 pts) student test', (done) => {
  // Fill out this test case...
  const g = {
    '507aa': {ip: '127.0.0.1', port: 8080},
  };

  distribution.local.groups.put('browncs', g, (e, v) => {
    distribution.local.groups.get('browncs', (e, v) => {
        try {
          expect(e).toBeFalsy();
          expect(v).toBe(g);
          done();
        } catch (error) {
          done(error);
        }
    });
  });
});


test('(1 pts) student test', (done) => {
  const nids = Object.values(mygroupGroup).map((node) => id.getNID(node));
  const remote = {service: 'status', method: 'get'};

  distribution.mygroup.comm.send(['nid'], remote, (e, v) => {
    expect(e).toEqual({});
    try {
      expect(Object.values(v).length).toBe(nids.length);
      expect(Object.values(v)).toEqual(expect.arrayContaining(nids));
      done();
    } catch (error) {
      done(error);
    }
  });
});


test('(1 pts) student test', (done) => {
  const g = {
    '507aa': {ip: '127.0.0.1', port: 8080},
    '12ab0': {ip: '127.0.0.1', port: 8081},
  };

  distribution.local.groups.put('dummy', g, (e, v) => {
    distribution.local.groups.rem('dummy', '12ab0', (e, v) => {
      const expectedGroup = {
        '507aa': {ip: '127.0.0.1', port: 8080},
      };

      distribution.local.groups.get('dummy', (e, v) => {
        try {
          expect(e).toBeFalsy();
          expect(v).toEqual(expectedGroup);
          done();
        } catch (error) {
          done(error);
        }
      });
    });
  });
});

test('(1 pts) student test', (done) => {
  const g = {
    '507aa': {ip: '127.0.0.1', port: 8080},
  };

  distribution.local.groups.put('browncs', g, (e, v) => {
    distribution.local.groups.get('browncs', (e, v) => {
      distribution.local.groups.del('browncs', (e, v) => {
        try {
          expect(e).toBeFalsy();
          expect(v).toBe(g);
          done();
        } catch (error) {
          done(error);
        }
      });
    });
  });});

  beforeAll((done) => {
    // First, stop the nodes if they are running
    const remote = {service: 'status', method: 'stop'};
    
    remote.node = n1;
    distribution.local.comm.send([], remote, (e, v) => {
      
      remote.node = n2;
      distribution.local.comm.send([], remote, (e, v) => {
        remote.node = n3;
        distribution.local.comm.send([], remote, (e, v) => {
          remote.node = n4;
          distribution.local.comm.send([], remote, (e, v) => {
            remote.node = n5;
            distribution.local.comm.send([], remote, (e, v) => {
              remote.node = n6;
              distribution.local.comm.send([], remote, (e, v) => {
                startNodes();
              });
            });
          });
        });
      });
    }); 
    
    const startNodes = () => {
      mygroupGroup[id.getSID(n1)] = n1;
      mygroupGroup[id.getSID(n2)] = n2;
      mygroupGroup[id.getSID(n3)] = n3;
      mygroupGroup[id.getSID(n4)] = n4;
      mygroupGroup[id.getSID(n5)] = n5;
      
  
      const groupInstantiation = () => {
        // Create the groups
        distribution.local.groups
            .put(mygroupConfig, mygroupGroup, (e, v) => {
              done();
            });
      };
      
      // Now, start the nodes listening node
      distribution.node.start((server) => {
  
        localServer = server;
        // Start the nodes
        distribution.local.status.spawn(n1, (e, v) => {
          distribution.local.status.spawn(n2, (e, v) => {
            distribution.local.status.spawn(n3, (e, v) => {
              distribution.local.status.spawn(n4, (e, v) => {
                distribution.local.status.spawn(n5, (e, v) => {
                  distribution.local.status.spawn(n6, (e, v) => {
                    groupInstantiation();
                  });
                });
              });
            });
          });
        });
      }); ;
    };
  });
  
  afterAll((done) => {
    const remote = {service: 'status', method: 'stop'};
    remote.node = n1;
    distribution.local.comm.send([], remote, (e, v) => {
      remote.node = n2;
      distribution.local.comm.send([], remote, (e, v) => {
        remote.node = n3;
        distribution.local.comm.send([], remote, (e, v) => {
          remote.node = n4;
          distribution.local.comm.send([], remote, (e, v) => {
            remote.node = n5;
            distribution.local.comm.send([], remote, (e, v) => {
              remote.node = n6;
              distribution.local.comm.send([], remote, (e, v) => {
                localServer.close();
                done();
              });
            });
          });
        });
      });
    });
  });
  