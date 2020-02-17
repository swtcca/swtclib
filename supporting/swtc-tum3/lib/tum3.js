/*
    This file is part of chain3.js.

    chain3.js is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    chain3.js is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with chain3.js.  If not, see <http://www.gnu.org/licenses/>.
*/
/**
 * @file tum3.js
 * @Modified from file web3.js
 * @authors:
 *   Jeffrey Wilcke <jeff@ethdev.com>
 *   Marek Kotewicz <marek@ethdev.com>
 *   Marian Oancea <marian@ethdev.com>
 *   Fabian Vogelsteller <fabian@ethdev.com>
 *   Gav Wood <g@ethdev.com>
 * @date 2014
 * @authors:
   @MOAC tech
   @date 2018
 */

var RequestManager = require('./tum3/requestmanager');
var Iban = require('./tum3/iban');
var Mc = require('./tum3/methods/mc');
var Vnode = require('./tum3/methods/vnode');
var Scs = require('./tum3/methods/scs');
var Net = require('./tum3/methods/net');
var Personal = require('./tum3/methods/personal');
var Settings = require('./tum3/settings');
var version = require('./version.json');
var utils = require('./utils/utils');
var sha3 = require('./utils/sha3');
var extend = require('./tum3/extend');
var Batch = require('./tum3/batch');
var Property = require('./tum3/property');
var HttpProvider = require('./tum3/httpprovider');
var IpcProvider = require('./tum3/ipcprovider');
var BigNumber = require('bignumber.js');
var Coder = require('./solidity/coder');
var account = require('./utils/account.js');
var McDapp = require('./tum3/dapp.js');

function Tum3 (provider,scsProvider) {
    this._requestManager = new RequestManager(provider);
    this.currentProvider = provider;
    this._scsRequestManager = new RequestManager(scsProvider);
    this.scsCurrentProvider = scsProvider;
  
    this.mc = new Mc(this);
    this.vnode = new Vnode(this);
    this.scs = new Scs(this);
    this.net = new Net(this);
    this.personal = new Personal(this);
    this.settings = new Settings();


    this.version = {
        api: version.version
    };
    this.providers = {
        HttpProvider: HttpProvider,
        IpcProvider: IpcProvider
    };
    this._extend = extend(this);
    this._extend({
        properties: properties()
    });
}

// expose providers on the class
Tum3.providers = {
    HttpProvider: HttpProvider,
    IpcProvider: IpcProvider
};

Tum3.prototype.setProvider = function (provider) {
    this._requestManager.setProvider(provider);
    this.currentProvider = provider;
};

Tum3.prototype.setScsProvider = function (provider) {
    this._scsRequestManager.setProvider(provider);
    this.scsCurrentProvider = provider;
};

Tum3.prototype.reset = function (keepIsSyncing) {
    this._requestManager.reset(keepIsSyncing);
    this.settings = new Settings();
};

Tum3.prototype.BigNumber = BigNumber;
Tum3.prototype.toHex = utils.toHex;
Tum3.prototype.toAscii = utils.toAscii;
Tum3.prototype.toUtf8 = utils.toUtf8;
Tum3.prototype.fromAscii = utils.fromAscii;
Tum3.prototype.fromUtf8 = utils.fromUtf8;
Tum3.prototype.toDecimal = utils.toDecimal;
Tum3.prototype.fromDecimal = utils.fromDecimal;
Tum3.prototype.toBigNumber = utils.toBigNumber;
Tum3.prototype.toSha = utils.toSha;
Tum3.prototype.fromSha = utils.fromSha;
Tum3.prototype.isAddress = utils.isAddress;
Tum3.prototype.isChecksumAddress = utils.isChecksumAddress;
Tum3.prototype.toChecksumAddress = utils.toChecksumAddress;
Tum3.prototype.isIBAN            = utils.isIBAN;
Tum3.prototype.padLeft = utils.padLeft;
Tum3.prototype.padRight = utils.padRight;

//New functions to sign transaction
Tum3.prototype.intToHex = utils.BigIntToHex;

//New TX function
Tum3.prototype.signTransaction = account.signTransaction;

//Encode the input types and parameters
Tum3.prototype.encodeParams     = function(type, param) {
    return Coder.encodeParams(type, param);
};

Tum3.prototype.sha3 = function(string, options) {
    return '0x' + sha3(string, options);
};

/**
 * Transforms direct icap to address
 */
Tum3.prototype.fromICAP = function (icap) {
    var iban = new Iban(icap);
    return iban.address();
};

var properties = function () {
    return [
        new Property({
            name: 'version.node',
            getter: 'chain3_clientVersion'
        }),
        new Property({
            name: 'version.network',
            getter: 'net_version',
            inputFormatter: utils.toDecimal
        }),
        new Property({
            name: 'version.moac',
            getter: 'mc_protocolVersion',
            inputFormatter: utils.toDecimal
        })
    ];
};

Tum3.prototype.isConnected = function(){
    return (this.currentProvider && this.currentProvider.isConnected());
};

Tum3.prototype.isScsConnected = function(){
    return (this.scsCurrentProvider && this.scsCurrentProvider.isConnected());
};

Tum3.prototype.createBatch = function () {
    return new Batch(this);
};

//MicroChain DAPP object
Tum3.prototype.dapp = function (abi) {
    var microDapp = new McDapp(this.mc, this.scs, abi);
    return microDapp;
};

//New Verify Signature function
Tum3.prototype.verifyMcSignature = account.verifyMcSignature;
Tum3.prototype.signMcMessage = account.signMcMessage;

module.exports = Tum3;


