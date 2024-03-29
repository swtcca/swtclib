/**
 * Utils for SM2 and SM3 module
 */

var utils = exports
var BN = require("bn.js")
var brorand = require("brorand")

utils.strToBytes = strToBytes
utils.hashToBN = hashToBN
utils.random = random
utils.padStart = padStart

function strToBytes(s) {
  var ch,
    st,
    re = []
  for (var i = 0; i < s.length; i++) {
    ch = s.charCodeAt(i) // get char
    st = [] // set up "stack"
    do {
      st.push(ch & 0xff) // push byte to stack
      ch = ch >> 8 // shift value down by 1 byte
    } while (ch)
    // add stack contents to result
    // done because chars have "wrong" endianness
    re = re.concat(st.reverse())
  }
  return re
}

function hashToBN(hash) {
  if (typeof hash == "string") {
    return new BN(hash, 16)
  } else {
    var hex = ""
    for (var i = 0; i < hash.length; i++) {
      var b = hash[i].toString(16)
      if (b.length == 1) {
        hex += "0"
      }
      hex += b
    }
    return new BN(hex, 16)
  }
}

/**
 * Pads supplied string with character to fill the desired length.
 *
 * @param {*} str String to pad
 * @param {*} length Desired length of result string
 * @param {*} padChar Character to use as padding
 */
function padStart(str, length, padChar) {
  if (str.length >= length) {
    return str
  } else {
    return padChar.repeat(length - str.length) + str
  }
}

/**
 * Generate cryptographic random value.
 *
 * @param {Number} n: byte length of the generated value
 */
function random(n) {
  return brorand(n).toString("hex")
}
