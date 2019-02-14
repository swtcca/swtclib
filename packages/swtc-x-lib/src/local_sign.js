const base = require('jingtum-base-lib').Wallet;
var jser = require('../lib/Serializer').Serializer;

function jingtum_sign_tx(in_tx, in_v) {
    var wt = new base(in_v.seed);
    in_tx.SigningPubKey = wt.getPublicKey();
    var prefix = 0x53545800;
    var hash = jser.from_json(in_tx).hash(prefix);
    in_tx.TxnSignature = wt.signTx(hash);
    return jser.from_json(in_tx).to_hex();
}


module.exports = jingtum_sign_tx;

