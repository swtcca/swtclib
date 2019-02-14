
#The SWTC JavaScript Library

SWTC library for development with modern javascript in concern, functions include transactions and remote
`swtc-lib` makes working with Node.js and in the browser or even certain mobile app easy and fashion via webpack.
This library currently uses the same source code from jingtum-lib but properly package them for convenience.

##Getting `swtc-lib`

**Via npm for Node.js**

```
  $ npm install swtc-lib
```

**Build from the source and test**

```
  $ git clone https://github.com/swtcca/swtc-lib.git
  $ npm install
  $ npm run build or npm run build:production
  $ npm run test
```

Then use the `dist/swtc-lib-*.js` in your web application

##Quickstart
```
    var Wallet = require('swtc-lib').Wallet;
    var Remote = require('swtc-lib').Remote;
    var remote = new Remote({server: 'wss://c05.jingtum.com:5020', local_sign: true});
```

## Modern usage (ES 2015 module)
```
    import { Wallet, Remote, Transaction } from 'swtc-lib'
```

---------------------------------------------

# About Jingtum lib

Basic js lib to be used for interacting with jingtum blockchain network.
- Keep only one websocket connecttion to jingtum and handle exception
- Do transaction to jingtumd, and process response
- Subscribe events, include server, ledger, account and so on
- Get other information from jingtum

## INSTALL
```
$ npm install jingtum-lib
```

## Documents

For more information see `docs.md`
