var assert = require('assert');
var Wallet = require('../index.js').Wallet;
var expect = require('chai').expect;

var VALID_SECRET = 'sszWqvtbDzzMQEVWqGDSA5DbMYDBN';
var INVALID_SECRET1 = null;
var INVALID_SECRET2 = undefined;
var INVALID_SECRET3 = '';
var INVALID_SECRET4 = 'xxxx';
var INVALID_SECRET5 = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
var INVALID_SECRET6 = 'sszWqvtbDzzMQEVWqGDSA5DbMYDBNxx';
var INVALID_SECRET7 = 'zWqvtbDzzMQEVWqGDSA5DbMYDBN';
var INVALID_SECRET8 = 'sszWqvtbDzzMQEVWqGDSA5DbMYDBNsszWqvtbDzzMQEVWqGDSA5DbMYDBN';

var VALID_ADDRESS = 'jahbmVT3T9yf5D4Ykw8x6nRUtUfAAMzBRV';
var INVALID_ADDRESS1 = null;
var INVALID_ADDRESS2 = undefined;
var INVALID_ADDRESS3 = '';
var INVALID_ADDRESS4 = 'xxxx';
var INVALID_ADDRESS5 = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
var INVALID_ADDRESS6 = 'jahbmVT3T9yf5D4Ykw8x6nRUtUfAAMzBRVxxx';
var INVALID_ADDRESS7 = 'ahbmVT3T9yf5D4Ykw8x6nRUtUfAAMzBRV';
var INVALID_ADDRESS8 = 'jahbmVT3T9yf5D4Ykw8x6nRUtUfAAMzBRVjahbmVT3T9yf5D4Ykw8x6nRUtUfAAMzBRV';

var MESSAGE1 = "hello";
var SIGNATURE1 = "3045022100B53E6A54B71E44A4D449C76DECAE44169204744D639C14D22D941157F5A1418F02201D029783B31EE3DA88F18C56D055CF47606A9708FDCA9A42BAD9EFD335FA29FD";
var MESSAGE2 = null;
var MESSAGE3 = undefined;
var MESSAGE4 = '';
var MESSAGE5 = '';
for (var i = 0; i < 1000; ++i) {
	MESSAGE5 = MESSAGE5 + 'x';
}
var SIGNATURE5 = '3045022100E9532A94BF33D4E094C0E0DA131B8BFB28D8275F0004341A5D76218C3134B40802201C8A32706AD5A719B21297B590D9AC52726C08773A65F54FD027C61ED65BCC77';

describe('Wallet', function() {
	describe('generate', function() {
		it('should generate one wallet', function() {
			var wallet = Wallet.generate();
			expect(wallet.address).to.not.be.null;
			expect(wallet.secret).to.not.be.null;
		});
	});

	describe('fromSecret', function() {
		it('should generate one from secret', function() {
			var wallet = Wallet.fromSecret(VALID_SECRET);
			expect(wallet).to.not.be.null;
		});

		it('should fail when null secret', function() {
			var wallet = Wallet.fromSecret(INVALID_SECRET1);
			expect(wallet).to.be.null;
		});

		it('should fail when undefined secret', function() {
			var wallet = Wallet.fromSecret(INVALID_SECRET2);
			expect(wallet).to.be.null;
		});

		it('should fail when empty secret', function() {
			var wallet = Wallet.fromSecret(INVALID_SECRET3);
			expect(wallet).to.be.null;
		});

		it('should fail when too short secret', function() {
			var wallet = Wallet.fromSecret(INVALID_SECRET4);
			expect(wallet).to.be.null;
		});

		it('should fail when too long secret', function() {
			var wallet = Wallet.fromSecret(INVALID_SECRET5);
			expect(wallet).to.be.null;
		});

		it('should fail when tail string', function() {
			var wallet = Wallet.fromSecret(INVALID_SECRET6);
			expect(wallet).to.be.null;
		});

		it('should fail when not start with s', function() {
			var wallet = Wallet.fromSecret(INVALID_SECRET7);
			expect(wallet).to.be.null;
		});

		it('should fail when double secret', function() {
			var wallet = Wallet.fromSecret(INVALID_SECRET8);
			expect(wallet).to.be.null;
		});
	});

	describe('isValidSecret', function() {
		it('should generate one from secret', function() {
			var ret = Wallet.isValidSecret(VALID_SECRET);
			expect(ret).to.be.true;
		});

		it('should fail when null secret', function() {
			var ret = Wallet.isValidSecret(INVALID_SECRET1);
			expect(ret).to.be.false;
		});

		it('should fail when undefined secret', function() {
			var ret = Wallet.isValidSecret(INVALID_SECRET2);
			expect(ret).to.be.false;
		});

		it('should fail when empty secret', function() {
			var ret = Wallet.isValidSecret(INVALID_SECRET3);
			expect(ret).to.be.false;
		});

		it('should fail when too short secret', function() {
			var ret = Wallet.isValidSecret(INVALID_SECRET4);
			expect(ret).to.be.false;
		});

		it('should fail when too long secret', function() {
			var ret = Wallet.isValidSecret(INVALID_SECRET5);
			expect(ret).to.be.false;
		});

		it('should fail when tail string', function() {
			var ret = Wallet.isValidSecret(INVALID_SECRET6);
			expect(ret).to.be.false;
		});

		it('should fail when not start with s', function() {
			var ret = Wallet.isValidSecret(INVALID_SECRET7);
			expect(ret).to.be.false;
		});

		it('should fail when double secret', function() {
			var ret = Wallet.isValidSecret(INVALID_SECRET8);
			expect(ret).to.be.false;
		});
	});

	describe('isValidAddress', function() {
		it('should success when valid address', function() {
			var ret = Wallet.isValidAddress(VALID_ADDRESS);
			expect(ret).to.be.true;
		});

		it('should fail when null address', function() {
			var ret = Wallet.isValidAddress(INVALID_ADDRESS1);
			expect(ret).to.be.false;
		});

		it('should fail when undefined address', function() {
			var ret = Wallet.isValidAddress(INVALID_ADDRESS2);
			expect(ret).to.be.false;
		});

		it('should fail when empty address', function() {
			var ret = Wallet.isValidAddress(INVALID_ADDRESS3);
			expect(ret).to.be.false;
		});

		it('should fail when too short address', function() {
			var ret = Wallet.isValidAddress(INVALID_ADDRESS4);
			expect(ret).to.be.false;
		});

		it('should fail when too long address', function() {
			var ret = Wallet.isValidAddress(INVALID_ADDRESS5);
			expect(ret).to.be.false;
		});

		it('should fail when tail string address', function() {
			var ret = Wallet.isValidAddress(INVALID_ADDRESS6);
			expect(ret).to.be.false;
		});

		it('should fail when not start with j', function() {
			var ret = Wallet.isValidAddress(INVALID_ADDRESS7);
			expect(ret).to.be.false;
		});

		it('should fail when double address', function() {
			var ret = Wallet.isValidAddress(INVALID_ADDRESS8);
			expect(ret).to.be.false;
		});
	});

	describe('init', function() {
		it('init with valid secret', function() {
			var wallet = new Wallet(VALID_SECRET);
			expect(wallet.secret()).to.be.equal(VALID_SECRET);
		});
		it('init with null secret', function() {
			var wallet = new Wallet(INVALID_SECRET1);
			expect(wallet.secret()).to.be.equal(null);
		});
		it('init with undefined secret', function() {
			var wallet = new Wallet(INVALID_SECRET2);
			expect(wallet.secret()).to.be.equal(null);
		});
		it('init with empty secret', function() {
			var wallet = new Wallet(INVALID_SECRET3);
			expect(wallet.secret()).to.be.equal(null);
		});
		it('init with too short secret', function() {
			var wallet = new Wallet(INVALID_SECRET4);
			expect(wallet.secret()).to.be.equal(null);
		});
		it('init with too long secret', function() {
			var wallet = new Wallet(INVALID_SECRET5);
			expect(wallet.secret()).to.be.equal(null);
		});
		it('init with tail string secret', function() {
			var wallet = new Wallet(INVALID_SECRET6);
			expect(wallet.secret()).to.be.equal(null);
		});
		it('init with secret without start s', function() {
			var wallet = new Wallet(INVALID_SECRET7);
			expect(wallet.secret()).to.be.equal(null);
		});
		it('init with double secret', function() {
			var wallet = new Wallet(INVALID_SECRET8);
			expect(wallet.secret()).to.be.equal(null);
		});
	});

	describe('sign', function() {
		it('sign with normal message', function() {
			var wallet = new Wallet(VALID_SECRET);
			expect(wallet.sign(MESSAGE1)).to.be.equal(SIGNATURE1);
		});
		it('sign with null', function() {
			var wallet = new Wallet(VALID_SECRET);
			expect(wallet.sign(MESSAGE2)).to.be.equal(null);
		});
		it('sign with undefined', function() {
			var wallet = new Wallet(VALID_SECRET);
			expect(wallet.sign(MESSAGE3)).to.be.equal(null);
		});
		it('sign with empty message', function() {
			var wallet = new Wallet(VALID_SECRET);
			expect(wallet.sign(MESSAGE4)).to.be.equal(null);
		});
		it('sign with long message', function() {
			var wallet = new Wallet(VALID_SECRET);
			expect(wallet.sign(MESSAGE5)).to.be.equal(SIGNATURE5);
		});
	});
});
