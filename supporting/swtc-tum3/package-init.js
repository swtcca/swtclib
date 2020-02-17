/* jshint ignore:start */


// Browser environment
if(typeof window !== 'undefined') {
    Tum3 = (typeof window.Tum3 !== 'undefined') ? window.Tum3 : require('tum3');
    BigNumber = (typeof window.BigNumber !== 'undefined') ? window.BigNumber : require('bignumber.js');
}


// Node environment
if(typeof global !== 'undefined') {
    Tum3 = (typeof global.Tum3 !== 'undefined') ? global.Tum3 : require('tum3');
    BigNumber = (typeof global.BigNumber !== 'undefined') ? global.BigNumber : require('bignumber.js');
}

/* jshint ignore:end */