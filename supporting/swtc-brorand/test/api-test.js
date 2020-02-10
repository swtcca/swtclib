var brorand = require("../");
var assert = require("assert");

describe("Brorand", function() {
  xit("should generate random numbers under nativescript", function() {
    assert.equal(brorand(100).length, 100);
  });
});
