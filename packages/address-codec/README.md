# swtc-address-codec

## API

```js
> var api = require('@swtc/address-codec').addressCodec
> api.decodeSeed('snwJzMKPjEBodxVU8YqwAH7PpZe4j')
{
  version: [ 33 ],
  bytes: <Buffer b0 fb d4 e1 63 95 83 41 29 cf 9e e1 be b0 06 9c>,
  type: 'secp256k1'
}
> api.decodeAccountID('jPo32F1gUA4TtPzquhNBEq1L1wXmcghqUi')
<Buffer fa 0c 3b 4b 66 0d 76 1b 2d d8 8a e7 2b 38 e9 af d9 4b fc 14>
```

## And ?? There's more to the wonderful world then swtc

We give you the kitchen sink.

```js
> console.log(api)
{
  chain: 'jingtum',
  codec: Codec {
    sha256: [Function: sha256],
    alphabet: 'jpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65rkm8oFqi1tuvAxyz',
    codec: {
      encode: [Function: encode],
      decodeUnsafe: [Function: decodeUnsafe],
      decode: [Function: decode]
    },
    base: 58
  },
  encode: [Function: encode],
  decode: [Function: decode],
  encodeSeed: [Function: encodeSeed],
  decodeSeed: [Function: decodeSeed],
  isValidSeed: [Function: isValidSeed],
  encodeAccountID: [Function: encodeAccountID],
  decodeAccountID: [Function: decodeAccountID],
  encodeNodePublic: [Function: encodeNodePublic],
  decodeNodePublic: [Function: decodeNodePublic],
  encodeNodePrivate: [Function: encodeNodePrivate],
  decodeNodePrivate: [Function: decodeNodePrivate],
  isValidClassicAddress: [Function: isValidClassicAddress],
  isValidAddress: [Function: isValidClassicAddress],
  encodeAddress: [Function: encodeAccountID],
  decodeAddress: [Function: decodeAccountID]
}
```
