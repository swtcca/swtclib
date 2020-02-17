var Tum3 = require('./lib/tum3');

// dont override global variable
if (typeof window !== 'undefined' && typeof window.Tum3 === 'undefined') {
    window.Tum3 = Tum3;
}

// Add window moac
if ( typeof window !== 'undefined' && typeof window.moac === 'undefined'){
    window.moac = Tum3;
}

module.exports = Tum3;
