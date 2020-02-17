var chai = require('chai');
var assert = chai.assert; 
var Chain3 = require('../index.js');
var chain3 = new Chain3();
var u = require('./helpers/test.utils.js');


describe('chain3.mc', function() {
    describe('methods', function() {
        u.methodExists(chain3.mc, 'getBalance');
        // u.methodExists(tum3.mc, 'getStorageAt');
        // u.methodExists(tum3.mc, 'getTransactionCount');
        // u.methodExists(tum3.mc, 'getCode');
        // u.methodExists(tum3.mc, 'sendTransaction');
        // u.methodExists(tum3.mc, 'call');
        // u.methodExists(tum3.mc, 'getBlock');
        // u.methodExists(tum3.mc, 'getTransaction');
        // u.methodExists(tum3.mc, 'getUncle');
        // u.methodExists(tum3.mc, 'getBlockTransactionCount');
        // u.methodExists(tum3.mc, 'getBlockUncleCount');
        // u.methodExists(tum3.mc, 'filter');
        // u.methodExists(tum3.mc, 'contract');
        // u.methodExists(tum3, 'encodeParams');

        // u.propertyExists(tum3.mc, 'coinbase');
        // u.propertyExists(tum3.mc, 'mining');
        // u.propertyExists(tum3.mc, 'gasPrice');
        // u.propertyExists(tum3.mc, 'accounts');
        // u.propertyExists(tum3.mc, 'defaultBlock');
        u.propertyExists(chain3.mc, 'blockNumber');
        // u.propertyExists(tum3.mc, 'protocolVersion');

        
    });
});

// describe('tum3.vnode', function() {
//     describe('methods', function() {
//         u.methodExists(tum3.vnode, 'getBalance');
//         u.methodExists(tum3.vnode, 'getBlock');
//         u.methodExists(tum3.vnode, 'getBlockNumber');
//         u.methodExists(tum3.vnode, 'getNonce');
//     });
// });

// describe('tum3.scs', function() {
//     describe('methods', function() {
//         u.methodExists(tum3.scs, 'getBalance');
//         u.methodExists(tum3.scs, 'getBlock');
//         u.methodExists(tum3.scs, 'getBlockNumber');
//         u.methodExists(tum3.scs, 'getNonce');
//         u.methodExists(tum3.scs, 'getTransactionReceipt');
//         u.methodExists(tum3.scs, 'getSCSId');
//     });
// });
