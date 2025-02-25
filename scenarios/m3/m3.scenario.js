const distribution = require('../../config.js');
const id = distribution.util.id;

const n1 = { ip: '127.0.0.1', port: 9000 };
const n2 = { ip: '127.0.0.1', port: 9001 };
const n3 = { ip: '127.0.0.1', port: 9002 };
const allNodes = [n1, n2, n3];


test('(5 pts) (scenario) create group', (done) => {
/*
    Create a group with the nodes n1, n2, and n3.
    Then, fetch their NIDs using the distributed status service.
*/

  const groupA = {};
  groupA[id.getSID(n1)] = n1;
  groupA[id.getSID(n2)] = n2;
  groupA[id.getSID(n3)] = n3;
  const nids = allNodes.map((node) => id.getNID(node));

  // Use distribution.local.groups.put to add groupA to the local node
  distribution.local.groups.put({ gid: 'groupA' }, groupA, (e, v) => {

    // Fetch the group status
    distribution.groupA.status.get('nid', (e, v) => {
      expect(Object.values(v)).toEqual(expect.arrayContaining(nids));
      done();
    });
  })
});

test('(5 pts) (scenario) dynamic group membership', (done) => {
/*
  Dynamically add a node (n3) to groupB after the group is initially created
  with nodes n1 and n2. Validate that the distributed status service reflects
  the updated group membership on all nodes.
*/

  const groupB = {};
  const initialNodes = [n1, n2];
  const allNodes = [n1, n2, n3];

  // Create groupB...

  const config = {gid: 'groupB'};

  // Create the group with initial nodes
  distribution.local.groups.put(config, initialNodes, (e, v) => {
    // Add a new node dynamically to the group
      distribution.local.groups.add(config.gid,n3,(e,v) =>{
        distribution.groupB.status.get('nid', (e, v) => {
        try {
          expect(Object.values(v)).toEqual(expect.arrayContaining(
              allNodes.map((node) => id.getNID(node))));
          done();
        } catch (error) {
          done(error);
        }
      });
  });
});
});

test('(5 pts) (scenario) group relativity', (done) => {
/*
    Make it so that node n1 sees group groupC as containing only n2.
    while node n2 sees group groupC as containing n1 and n2.
*/
  const groupC_n1 = {};

  const groupC_n2 = {};
  groupC_n1[id.getSID(n2)] = n2;
  groupC_n2[id.getSID(n2)] = n2;
  groupC_n2[id.getSID(n1)] = n1;
  // Create groupC in an appropriate way...
  const initialNodes = [n1, n2];

  const config = {gid: 'groupC'};
  const message_n1 = [
    'groupC',groupC_n1
  ];
  const message_n2 = [
    'groupC',groupC_n2
  ];
  const remoteConfig_n1 = { node: n1, service: 'groups', method: 'put' };
  const remoteConfig_n2 = { node: n2, service: 'groups', method: 'put' };
  distribution.local.groups.put(config, initialNodes, (e, v) => {
    distribution.local.comm.send(message_n2, remoteConfig_n2, (e, v) => {
      distribution.local.comm.send(message_n1, remoteConfig_n1, (e, v) => {
      // Modify the local 'view' of the group...        
        distribution.groupC.groups.get('groupC', (e, v) => {
          const n1View = v[id.getSID(n1)];
          console.log("n1View",n1View)
          const n2View = v[id.getSID(n2)];
          try {
            expect(Object.keys(n2View)).toEqual(expect.arrayContaining(
                [id.getSID(n1), id.getSID(n2)],
            ));
            expect(Object.keys(n1View)).toEqual(expect.arrayContaining(
                [id.getSID(n2)],
            ));
            done();
          } catch (error) {
            done(error);
          }
        });
    });});
  });});

// test('(5 pts) (scenario) use the gossip service', (done) => {
// /*
//     First, create group groupD a number of nodes of your choosing.
//     Then, using the groups.put method,  a new group is created called 'newgroup'.
//     Add a new node to 'newgroup' using the gossip service to propagate the new group membership to all (or a subset of) nodes in groupD.

//     Experiment with:
//     1. The number of nodes in groupD
//     2. The subset function used in the gossip service
//     3. The expected number of nodes receiving the new group membership
//     4. The time delay between adding the new node to 'newgroup' and checking the group membership in groupD
// */

//   // Create groupD in an appropriate way...
//   const groupD = {};

//   // How many nodes are expected to receive the new group membership?
//   let nExpected = 0;

//   // Experiment with the subset function used in the gossip service...
//   let config = {gid: 'groupD', subset: (lst) => '?'};

//   // Instantiated groupD
//   distribution.local.groups.put(config, groupD, (e, v) => {
//     distribution.groupD.groups.put(config, groupD, (e, v) => {
//       // Created group 'newgroup' (this will be the group that we add a new node to)
//       distribution.groupD.groups.put('newgroup', {}, (e, v) => {
//         const newNode = {ip: '127.0.0.1', port: 4444};
//         const message = [
//           'newgroup',
//           newNode,
//         ];
//         const remote = {service: 'groups', method: 'add'};
//         // Adding a new node to 'newgroup' using the gossip service
//         distribution.groupD.gossip.send(message, remote, (e, v) => {
//           // Experiment with the time delay between adding the new node to 'newgroup' and checking the group membership in groupD...
//           let delay = 0;
//           setTimeout(() => {
//             distribution.groupD.groups.get('newgroup', (e, v) => {
//               let count = 0;
//               for (const k in v) {
//                 if (Object.keys(v[k]).length > 0) {
//                   count++;
//                 }
//               }
//               /* Gossip only provides weak guarantees */
//               try {
//                 expect(count).toBeGreaterThanOrEqual(nExpected);
//                 done();
//               } catch (error) {
//                 done(error);
//               }
//             });
//           }, delay);
//         });
//       });
//     });
//   });
// });


// /*
//     This is the setup for the test scenario.
//     Do not modify the code below.
// */

let localServer = null;

function startAllNodes(callback) {
  distribution.node.start((server) => {
    localServer = server;

    function startStep(step) {
      if (step >= allNodes.length) {
        callback();
        return;
      }

      distribution.local.status.spawn(allNodes[step], (e, v) => {
        if (e) {
          callback(e);
        }
        startStep(step + 1);
      });
    }
    startStep(0);
  });
}


function stopAllNodes(callback) {
  const remote = {method: 'stop', service: 'status'};

  function stopStep(step) {
    if (step == allNodes.length) {
      callback();
      return;
    }

    if (step < allNodes.length) {
      remote.node = allNodes[step];
      distribution.local.comm.send([], remote, (e, v) => {
        stopStep(step + 1);
      });
    }
  }

  if (localServer) localServer.close();
  stopStep(0);
}

beforeAll((done) => {
  // Stop any leftover nodes
  stopAllNodes(() => {
    startAllNodes(done);
  });
});

afterAll((done) => {
  stopAllNodes(done);
});

