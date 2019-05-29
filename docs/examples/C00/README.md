# node.js 应用说明

## 准备

1. 进入playground目录
```bash
$ cd playground
```
2. (可选)生成一个默认配置文件package.json
```bash
$ npm init -y
```
3. 安装swtc-lib库
```bash
$ npm install swtc-lib
```

## 运行方式
1. 交互式运行
```bash
$ node
```
```javascript
> var Wallet = require('swtc-lib').Wallet
undefined
> Wallet.generate()
{ secret: 'snJT6UyLWWSpHd7BurPZnXjjvQgYE',
  address: 'jw6yC7peFmc9rKWPw5m7fiJE49GQDv5G2m' }
```
2. 脚本文件运行
```bash
$ echo -e "const Wallet = require('swtc-factory').Wallet\nvar wallet = new Wallet('snJT6UyLWWSpHd7BurPZnXjjvQgYE')\nconsole.log(wallet)" > file.js
$ cat file.js
const Wallet = require('swtc-wallet').Wallet
var wallet = new Wallet('snJT6UyLWWSpHd7BurPZnXjjvQgYE')
console.log(wallet)
$ node file.js
Wallet {
  _keypairs:
   { privateKey:
      '00E4196E425F79EC606D49AAC37AB46EF3A4DAC1748451099AA5906751F31C8238',
     publicKey:
      '02E0C89CE4D8A889153082E91C347B3F5BDA1D12FD26039DB402A6AE659B7E41FB' },
  _secret: 'snJT6UyLWWSpHd7BurPZnXjjvQgYE' }
```
3. 半交互式
```bash
$ echo -e "const Wallet = require('swtc-factory').Wallet\nvar wallet = Wallet.fromSecret('snJT6UyLWWSpHd7BurPZnXjjvQgYE')\n" >  file2.js
$ cat file2.js 
const Wallet = require('swtc-wallet').Wallet
var wallet = Wallet.fromSecret('snJT6UyLWWSpHd7BurPZnXjjvQgYE')
$ node
```
```javascript
> .load file2.js
const Wallet = require('swtc-wallet').Wallet
var wallet = Wallet.fromSecret('snJT6UyLWWSpHd7BurPZnXjjvQgYE')
 
undefined
> console.log(wallet)
{ secret: 'snJT6UyLWWSpHd7BurPZnXjjvQgYE',
  address: 'jw6yC7peFmc9rKWPw5m7fiJE49GQDv5G2m' }
undefined
> 
```
