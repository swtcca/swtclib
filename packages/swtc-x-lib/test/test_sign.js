var assert = require('assert');
var Wallet = require('../index.js').Wallet;
var expect = require('chai').expect;

var wt = new Wallet('saai2npGJD7GKh9xLxARfZXkkc8Bf');
var pubkey = wt.getPublicKey();


// Sign message can be an array or a hex string
var sdata = "F95EFF5A4127E68D2D86F9847D9B6DE5C679EE7D9F3241EC8EC67F99C4CDA923";


// Signature MUST be either:
// 1) hex-string of DER-encoded signature; or
// 2) DER-encoded signature as buffer; or
// 3) object with two hex-string properties (r and s)
// Verify the signature 
describe('Wallet', function() {
	describe('signing', function() {
		it('sign should generate text', function() {
			var sign =wt.signTx(sdata);
			expect(sign).to.not.be.null;
		});
		it('verify sign should be true', function() {
			var sign =wt.signTx(sdata);
			expect(wt.verifyTx(sdata, sign)).to.be.true;
		});
	});
})
