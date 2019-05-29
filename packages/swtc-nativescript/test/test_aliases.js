var assert = require('assert');
var aliases = require('../').aliases;
var expect = require('chai').expect;


// Sign message can be an array or a hex string
describe('Aliases', function() {
	describe('type', function() {
		it('aliases should be object', function() {
			expect(typeof aliases).to.be.equal('object')
		})
	});
})
