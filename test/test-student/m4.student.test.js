/*
    In this file, add your own test cases that correspond to functionality introduced for each milestone.
    You should fill out each test case so it adequately tests the functionality you implemented.
    You are left to decide what the complexity of each test case should be, but trivial test cases that abuse this flexibility might be subject to deductions.

    Imporant: Do not modify any of the test headers (i.e., the test('header', ...) part). Doing so will result in grading penalties.
*/

const distribution = require('../../config.js');

const id = distribution.util.id;

test('(1 pts) student test', (done) => {
  const user1 = {first: 'Walter', last: 'White'};
  const user2 = {first: 'Jesse', last: 'Pinkman'};
  const key = 'overwritekey';

  distribution.local.mem.put(user1, key, (e, v) => {
    distribution.local.mem.put(user2, key, (e, v) => {
      distribution.local.mem.get(key, (e, v) => {
        try {
          expect(e).toBeFalsy();
          expect(v).toBe(user2); // Should return the updated value
          done();
        } catch (error) {
          done(error);
        }
      });
    });
  });
});


test('(1 pts) student test', (done) => {
  // Fill out this test case...
  const user = {first: 'Saul', last: 'Goodman'};
  const key = 'saulkey';
  const nonexistentKey = 'wrongkey';

  distribution.local.mem.put(user, key, (e, v) => {
    distribution.local.mem.get(nonexistentKey, (e, v) => {
      try {
        expect(e).toBeInstanceOf(Error); // Should error on nonexistent key
        expect(v).toBeFalsy();
        done();
      } catch (error) {
        done(error);
      }
    });
  });
});


test('(1 pts) student test', (done) => {
  // Fill out this test case...
  const user1 = {first: 'Hank', last: 'Schrader'};
  const user2 = {first: 'Skyler', last: 'White'};
  const key = 'overwritekey';

  distribution.mygroup.mem.put(user1, key, (e, v) => {
    distribution.mygroup.mem.put(user2, key, (e, v) => {
      distribution.mygroup.mem.get(key, (e, v) => {
        try {
          expect(e).toBeFalsy();
          expect(v).toEqual(user2); // Should return the overwritten value
          done();
        } catch (error) {
          done(error);
        }
      });
    });
  });
});

test('(1 pts) student test', (done) => {
  const user = {first: 'Mike', last: 'Ehrmantraut'};
  const key = 'mikekey';

  distribution.mygroup.mem.put(user, key, (e, v) => {
    distribution.all.mem.get(key, (e, v) => {
      try {
        expect(e).toBeFalsy();
        expect(v).toEqual(user); // Should retrieve the value across 'all'
        done();
      } catch (error) {
        done(error);
      }
    });
  });
});

test('(1 pts) student test', (done) => {
  const user = {first: 'Tuco', last: 'Salamanca'};
  const key = 'tucokey';
  const kid = id.getID(key);
  const nodes = Object.values(group1Group);
  const nids = nodes.map((node) => id.getNID(node));

  distribution.group1.mem.put(user, key, (e, v) => {
    const nid = id.consistentHash(kid, nids);
    const pickedNode = nodes.filter((node) => id.getNID(node) === nid)[0];

    const remote = {node: pickedNode, service: 'mem', method: 'del'};
    const message = [{gid: 'group1', key: key}];

    distribution.local.comm.send(message, remote, (e, v) => {
      distribution.group1.mem.get(key, (e, v) => {
        try {
          expect(e).toBeInstanceOf(Error);
          expect(v).toBeFalsy(); // Key should be deleted
          done();
        } catch (error) {
          done(error);
        }
      });
    });
  });
});

/*
  Testing infrastructure code.
*/

// This group is used for testing most of the functionality
const mygroupGroup = {};
// These groups are used for testing hashing
const group1Group = {};
const group2Group = {};
const group3Group = {};
// This group is used for {adding,removing} {groups,nodes}
const group4Group = {};

/*
   This hack is necessary since we can not
   gracefully stop the local listening node.
   This is because the process that node is
   running in is the actual jest process
*/
let localServer = null;

const n1 = {ip: '127.0.0.1', port: 8000};
const n2 = {ip: '127.0.0.1', port: 8001};
const n3 = {ip: '127.0.0.1', port: 8002};
const n4 = {ip: '127.0.0.1', port: 8003};
const n5 = {ip: '127.0.0.1', port: 8004};
const n6 = {ip: '127.0.0.1', port: 8005};


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
            });
          });
        });
      });
    });
  });

  mygroupGroup[id.getSID(n1)] = n1;
  mygroupGroup[id.getSID(n2)] = n2;
  mygroupGroup[id.getSID(n3)] = n3;

  group1Group[id.getSID(n4)] = n4;
  group1Group[id.getSID(n5)] = n5;
  group1Group[id.getSID(n6)] = n6;

  group2Group[id.getSID(n1)] = n1;
  group2Group[id.getSID(n3)] = n3;
  group2Group[id.getSID(n5)] = n5;

  group3Group[id.getSID(n2)] = n2;
  group3Group[id.getSID(n4)] = n4;
  group3Group[id.getSID(n6)] = n6;

  group4Group[id.getSID(n1)] = n1;
  group4Group[id.getSID(n2)] = n2;
  group4Group[id.getSID(n4)] = n4;

  // Now, start the base listening node
  distribution.node.start((server) => {
    localServer = server;

    const groupInstantiation = (e, v) => {
      const mygroupConfig = {gid: 'mygroup'};
      const group1Config = {gid: 'group1', hash: id.naiveHash};
      const group2Config = {gid: 'group2', hash: id.consistentHash};
      const group3Config = {gid: 'group3', hash: id.rendezvousHash};
      const group4Config = {gid: 'group4'};

      // Create some groups
      distribution.local.groups
          .put(mygroupConfig, mygroupGroup, (e, v) => {
            distribution.local.groups
                .put(group1Config, group1Group, (e, v) => {
                  distribution.local.groups
                      .put(group2Config, group2Group, (e, v) => {
                        distribution.local.groups
                            .put(group3Config, group3Group, (e, v) => {
                              distribution.local.groups
                                  .put(group4Config, group4Group, (e, v) => {
                                    done();
                                  });
                            });
                      });
                });
          });
    };

    // Start the nodes
    distribution.local.status.spawn(n1, (e, v) => {
      distribution.local.status.spawn(n2, (e, v) => {
        distribution.local.status.spawn(n3, (e, v) => {
          distribution.local.status.spawn(n4, (e, v) => {
            distribution.local.status.spawn(n5, (e, v) => {
              distribution.local.status.spawn(n6, groupInstantiation);
            });
          });
        });
      });
    });
  });
});

afterAll((done) => {
  distribution.mygroup.status.stop((e, v) => {
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
});