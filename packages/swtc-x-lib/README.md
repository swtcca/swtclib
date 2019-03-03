
#The SWTC JavaScript Library

##SWTC heavily utilize jingtum-lib and jcc_jingtum_lib, but made it modular and **friendly** for developer
-  keep the same interface as jingtum-lib or jcc_jingtum_lib, pass all related tests
-  native node.js supporting LTS version including Boron-8, Carbon-10 and Dubnium-12
-  web applications with zero effort webpack support
-  nativescript mobile app support (use swtc-lib@nativescript)

##Getting `swtc-lib`

**Via npm for Node.js**

```
  $ npm install swtc-lib  // node.js and web app
  $ npm install swtc-lib@jcc   // if you wish to use jcc like interfaces
  $ npm install swtc-lib@nativescript   // mobile app
```

**Build from the source and test**

```
  $ git clone https://github.com/swtcca/swtc-lib.git
  $ npm install
  $ npm run build or npm run build:production
  $ npm run test
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
