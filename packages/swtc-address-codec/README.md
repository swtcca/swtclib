# swtc-address-codec

## API

```js
> var api = require('swtc-address-codec');
> api.decodeSeed('snwJzMKPjEBodxVU8YqwAH7PpZe4j')
{ version: 33,
  bytes:
   [ 176, 251, 212, 225, 99, 149, 131, 65, 41, 207, 158, 225, 190, 176, 6, 156 ],
  type: 'secp256k1' }
> api.decodeAccountID('jPo32F1gUA4TtPzquhNBEq1L1wXmcghqUi')
[ 250,
  12,
  59,
  75,
  102,
  13,
  118,
  27,
  45,
  216,
  138,
  231,
  43,
  56,
  233,
  175,
  217,
  75,
  252,
  20 ]
```

## And ?? There's more to the wonderful world then swtc

We give you the kitchen sink.

```js
> console.log(api)
{ Codec: [Function: AddressCodec],
  codecs:
   { bitcoin:
      AddressCodec {
        alphabet: '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz',
        codec: [Object],
        base: 58 },
     ripple:
      AddressCodec {
        alphabet: 'rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz',
        codec: [Object],
        base: 58 },
     tipple:
      AddressCodec {
        alphabet: 'RPShNAF39wBUDnEGHJKLM4pQrsT7VWXYZ2bcdeCg65jkm8ofqi1tuvaxyz',
        codec: [Object],
        base: 58 },
     jingtum:
      AddressCodec {
        alphabet: 'jpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65rkm8oFqi1tuvAxyz',
        codec: [Object],
        base: 58 },
     bizain:
      AddressCodec {
        alphabet: 'bpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2jcdeCg65rkm8oFqi1tuvAxyz',
        codec: [Object],
        base: 58 },
     stellar:
      AddressCodec {
        alphabet: 'gsphnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCr65jkm8oFqi1tuvAxyz',
        codec: [Object],
        base: 58 } },
  decode: [Function: decode],
  encode: [Function: encode],
  decodeEdSeed: [Function],
  encodeEdSeed: [Function],
  isValidEdSeed: [Function],
  decodeSeed: [Function],
  encodeSeed: [Function],
  isValidSeed: [Function],
  decodeAccountID: [Function],
  encodeAccountID: [Function],
  isValidAccountID: [Function],
  decodeAddress: [Function],
  encodeAddress: [Function],
  isValidAddress: [Function],
  decodeNodePublic: [Function],
  encodeNodePublic: [Function],
  isValidNodePublic: [Function],
  decodeNodePrivate: [Function],
  encodeNodePrivate: [Function],
  isValidNodePrivate: [Function],
  decodeK256Seed: [Function],
  encodeK256Seed: [Function],
  isValidK256Seed: [Function] }
```
