var r;

module.exports = function rand(len) {
  if (!r) r = new Rand(null);

  return r.generate(len);
};

function Rand(rand) {
  this.rand = rand;
}
module.exports.Rand = Rand;

Rand.prototype.generate = function generate(len) {
  return this._rand(len);
};

// Emulate crypto API using randy
Rand.prototype._rand = function _rand(n) {
  if (this.rand.getBytes) return this.rand.getBytes(n);

  var res = new Uint8Array(n);
  for (var i = 0; i < res.length; i++) res[i] = this.rand.getByte();
  return res;
};

try {
  var randomBytes = require("nativescript-randombytes");
  if (typeof randomBytes === "function")
    Rand.prototype._rand = function _rand(n) {
      return randomBytes(n);
    };
} catch (e) {}
