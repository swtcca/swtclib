'use strict';
var Event = require('events').EventEmitter;
var util = require('util');
var LRU = require('lru-cache');
var sha1 = require('sha1');

var Server = require('./server');
var Request = require('./request');
var Account = require('./account');
var Transaction = require('./transaction');
var OrderBook = require('./orderbook');
var utils = require('./utils');
var _ = require('lodash');
const currency = require('./config').currency;
var bignumber = require('bignumber.js');


var LEDGER_OPTIONS = ['closed', 'header', 'current'];

/**
 * main handler for backend system
 * one remote object one server, not many
 * options onfiguration Parameters:
 * {
 *   local_sign: false, // default sign tx in jingtumd
 *   server: 'wss://s.jingtum.com:5020', // only support one server
 * }
 * @param options
 * @constructor
 */
function Remote(options) {
    Event.call(this);

    var self = this;
    var _opts = options || {};

    self._local_sign = !!_opts.local_sign;

    if (typeof _opts.server !== 'string') {
        self.type = new TypeError('server config not supplied');
        return self;
    }
    self._url = _opts.server;
    self._server = new Server(self, self._url);
    self._status = {ledger_index: 0};
    self._requests = {};

    self._cache = LRU({max: 100, maxAge: 1000 * 60 * 5}); // 100 size, 5 min
    self._paths = LRU({max: 100, maxAge: 1000 * 60 * 5}); // 2100 size, 5 min

    self.on('newListener', function(type, listener) {
        if (!self._server.isConnected()) return;
        if (type === 'removeListener') return;
        if (type === 'transactions') {
            self.subscribe('transactions').submit();
        }
        if (type === 'ledger_closed') {
            self.subscribe('ledger').submit();
        }
    });
    self.on('removeListener', function(type) {
        if (!self._server.isConnected()) return;
        if (type === 'transactions') {
            self.unsubscribe('transactions').submit();
        }
        if (type === 'ledger_closed') {
            self.unsubscribe('ledger').submit();
        }
    });
}
util.inherits(Remote, Event);

/**
 * connect first on every case
 * callback(error, result)
 * @param callback
 * @returns {*}
 */
Remote.prototype.connect = function(callback) {
    if (!this._server) return callback('server not ready');
    this._server.connect(callback);
};

/**
 * disconnect manual, no reconnect
 */
Remote.prototype.disconnect = function() {
    if (!this._server) return;
    this._server.disconnect();
};

/**
 * check is remote is connected to jingtumd
 */
Remote.prototype.isConnected = function () {
    return this._server.isConnected();
};

/**
 * handle message from backend, and dispatch
 * @param data
 * @private
 */
Remote.prototype._handleMessage = function(data) {
    var self = this;
    try {
        data = JSON.parse(data);
    } catch(e) {}
    if (typeof data !== 'object') return;

    switch(data.type) {
        case 'ledgerClosed':
            self._handleLedgerClosed(data);
            break;
        case 'serverStatus':
            self._handleServerStatus(data);
            break;
        case 'response':
            self._handleResponse(data);
            break;
        case 'transaction':
            self._handleTransaction(data);
            break;
        case 'path_find':
            self._handlePathFind(data);
            break;
    }
};

/**
 * update server ledger status
 * TODO
 * supply data to outside include ledger, reserve and fee
 * @param data
 * @private
 */
Remote.prototype._handleLedgerClosed = function(data) {
    var self = this;
    if (data.ledger_index > self._status.ledger_index) {
        self._status.ledger_index = data.ledger_index;
        self._status.ledger_time = data.ledger_time;
        self._status.reserve_base = data.reserve_base;
        self._status.reserve_inc = data.reserve_inc;
        self._status.fee_base = data.fee_base;
        self._status.fee_ref = data.fee_ref;
        self.emit('ledger_closed', data);
    }
};

/**
 * TODO
 * supply data to outside about server status
 * @param data
 * @private
 */
Remote.prototype._handleServerStatus = function(data) {
    // TODO check data format
    this._updateServerStatus(data);
    this.emit('server_status', data);
};

/**
 * update remote state and server state
 * @param data
 * @private
 */
Remote.prototype._updateServerStatus = function(data) {
    this._status.load_base = data.load_base;
    this._status.load_factor = data.load_factor;
    if (data.pubkey_node) {
         this._status.pubkey_node = data.pubkey_node;
    }
    this._status.server_status = data.server_status;
    var online = ~Server.onlineStates.indexOf(data.server_status);
    this._server._setState(online ? 'online' : 'offline');
};

/**
 * handle response by every websocket request
 * @param data
 * @private
 */
Remote.prototype._handleResponse = function(data) {
    var req_id = data.id;
    if (typeof req_id !== 'number'
        || req_id < 0 || req_id > this._requests.length) {
        return;
    }
    var request = this._requests[req_id];
    // pass process it when null callback
    delete this._requests[req_id];
    delete data.id;

    // check if data contain server info
    if (data.result && data.status === 'success'
            && data.result.server_status) {
        this._updateServerStatus(data.result);
    }

    // return to callback
    if (data.status === 'success') {
        var result = request.filter(data.result);
        request.callback(null, result);
    } else if (data.status === 'error') {
        request.callback(data.error_message || data.error_exception);
    }
};

/**
 * handle transaction type response
 * TODO supply more friendly transaction data
 * @param data
 * @private
 */
Remote.prototype._handleTransaction = function(data) {
    var self = this;
    var tx = data.transaction.hash;
    if (self._cache.get(tx)) return;
    self._cache.set(tx, 1);
    this.emit('transactions', data);
};

/**
 * emit path find date to other
 * TODO supply more friendly data
 * @param data
 * @private
 */
Remote.prototype._handlePathFind = function(data) {
    this.emit('path_find', data);
};

/**
 * request to server and backend
 * @param command
 * @param data
 * @param filter
 * @param callback
 * @private
 */
Remote.prototype._submit = function(command, data, filter, callback) {
    if (!callback || typeof callback !== 'function') {
        callback = function() {};
    }
    var req_id = this._server.sendMessage(command, data);
    this._requests[req_id] = {
        command: command,
        data: data,
        filter: filter,
        callback: callback
    };
};

// ---------------------- info request --------------------
/**
 * request server info
 * return version, ledger, state and node id
 * no option is required
 * @returns {Request}
 */
Remote.prototype.requestServerInfo = function() {
    return new Request(this, 'server_info', function(data) {
        return {
            complete_ledgers: data.info.complete_ledgers,
            ledger: data.info.validated_ledger.hash,
            public_key: data.info.pubkey_node,
            state: data.info.server_state,
            peers: data.info.peers,
            version: 'skywelld-' + data.info.build_version
        };
    });
};

/**
 * request peers info
 * return version, ledger, state and node id
 * no option is required
 * @returns {Request}
 */
Remote.prototype.requestPeers = function() {
    return new Request(this, 'peers', function(data) {
        return data;
    });
};
/**
 * request last closed ledger index and hash
 * @returns {Request}
 */
Remote.prototype.requestLedgerClosed = function () {
    return new Request(this, 'ledger_closed', function(data) {
        return {
            // fee_base: data.fee_base,
            ledger_hash: data.ledger_hash,
            ledger_index: data.ledger_index,
            // reserve_base: data.reserve_base,
            // reserve_inc: data.reserve_base,
            // txn_count: data.txn_count,
            // validated: data.validated_ledgers
        };
    });
};

/**
 * get one ledger info
 * options parameters : {
 *   ledger_index: Number,
 *   ledger_hash: hash, string
 * }
 * if no options, return last closed ledger
 * @param options
 * @returns {Request}
 */
Remote.prototype.requestLedger = function(options) {
    // if (typeof options !== 'object') {
    //     return new Error('invalid options type');
    // }
    var cmd = 'ledger';
    var filter = true;
    var request = new Request(this, cmd, function(data) {
        var ledger = data.ledger || data.closed.ledger;
        if (!filter) {
            return ledger;
        }
        return {
            accepted: ledger.accepted,
            ledger_hash: ledger.hash,
            ledger_index: ledger.ledger_index,
            parent_hash: ledger.parent_hash,
            close_time: ledger.close_time_human,
            total_coins: ledger.total_coins
        };
    });
    if (typeof options !== 'object') {
        request.message.type = new Error('invalid options type');
        return request;
    }
    if (Number(options.ledger_index)) {
        request.message.ledger_index = Number(options.ledger_index);
    }
    if (utils.isValidHash(options.ledger_hash)) {
        request.message.ledger_hash = options.ledger_hash;
    }
    if ('full' in options && typeof(options.full) === 'boolean') {
        request.message['full'] = options.full;
        filter = false;
    }
    if ('expand' in options && typeof(options.expand) === 'boolean') {
        request.message['expand'] = options.expand;
        filter = false;
    }
    if ('transactions' in options && typeof(options.transactions) === 'boolean') {
        request.message['transactions'] = options.transactions;
        filter = false;
    }
    if ('accounts' in options && typeof(options.accounts) === 'boolean') {
        request.message['accounts'] = options.accounts;
        filter = false;
    }

    return request;
};

/**
 * for tx command
 * @param options
 * options: {
 *   hash: tx hash, string  
 * }
 * @returns {Request}
 */
Remote.prototype.requestTx = function(options) {
    var request = new Request(this, 'tx');
    if (typeof options !== 'object') {
        request.message.type = new Error('invalid options type');
        return request;
    }

    var hash = options.hash;
    if (!utils.isValidHash(hash)) {
        request.message.hash = new Error('invalid tx hash');
        return request;
    }

    request.message.transaction = hash;
    return request;
};

function getRelationType(type) {
    switch (type) {
        case 'trustline':
            return 0;
        case 'authorize':
            return 1;
        case 'freeze':
            return 3;

    }
}
/**
 * request account info, internal function
 * @param type
 * @param options
 * @returns {Request}
 * @private
 */
Remote.prototype.__requestAccount = function(type, options, request, filter) {
    // var request = new Request(this, type, filter);
    request._command = type;
    var account = options.account;
    var ledger = options.ledger;
    var peer = options.peer;
    var limit = options.limit;
    var marker = options.marker;
    // if (marker && (Number(ledger) <= 0 || !utils.isValidHash(ledger))) {
    //     throw new Error('marker needs a ledger_index or ledger_hash');
    // }
    request.message.relation_type = getRelationType(options.type);
    if (account) {
        if(!utils.isValidAddress(account)){
            request.message.account = new Error('invalid account');
            return request;
        }else {
            request.message.account = account;
        }
    }
    request.selectLedger(ledger);

    if (utils.isValidAddress(peer)) {
        request.message.peer = peer;
    }
    if (Number(limit)) {
        limit = Number(limit);
        if (limit < 0) limit = 0;
        if (limit > 1e9) limit = 1e9;
        request.message.limit = limit;
    }
    if (marker) {
        request.message.marker = marker;
    }
    return request;
};

/**
 * account info
 * @param options, options:
 *    account(required): the query account
 *    ledger(option): specify ledger, ledger can be:
 *    ledger_index=xxx, ledger_hash=xxx, or ledger=closed|current|validated
 * @returns {Request}
 */
Remote.prototype.requestAccountInfo = function(options) {
    var request = new Request(this);

    if (typeof options !== 'object') {
        request.message.type = new Error('invalid options type');
        return request;
    }
    return this.__requestAccount('account_info', options, request);
};

/**
 * account tums
 * return account supports currency, including
 *     send currency and receive currency
 * @param 
 *    account(required): the query account
 *    ledger(option): specify ledger, ledger can be:
 *    ledger_index=xxx, ledger_hash=xxx, or ledger=closed|current|validated 
 *    no limit
 * @returns {Request}
 */
Remote.prototype.requestAccountTums = function(options) {
    var request = new Request(this);

    if (typeof options !== 'object') {
        request.message.type = new Error('invalid options type');
        return request;
    }
    return this.__requestAccount('account_currencies', options, request);
};

/**
 * account relations
 * @param options
 *    type: relation type
 *    account(required): the query account
 *    ledger(option): specify ledger, ledger can be:
 *    ledger_index=xxx, ledger_hash=xxx, or ledger=closed|current|validated  
 *    limit min is 200,
 *    marker for more relations
 * @returns {Request}
 */
Remote.prototype.requestAccountRelations = function(options) {
    var request = new Request(this);

    if (typeof options !== 'object') {
        request.message.type = new Error('invalid options type');
        return request;
    }
    if (!~Transaction.RelationTypes.indexOf(options.type)) {
        request.message.relation_type = new Error('invalid realtion type');
        return request;
    }
    switch (options.type) {
        case 'trust':
            return this.__requestAccount('account_lines', options, request);
        case 'authorize':
        case 'freeze':
            return this.__requestAccount('account_relation', options, request);
    }
    request.message.msg = new Error('relation should not go here');
    return request;
};

/**
 * account offers
 * options parameters
 * @param options
 *    account(required): the query account
 *    ledger(option): specify ledger, ledger can be:
 *    ledger_index=xxx, ledger_hash=xxx, or ledger=closed|current|validated  
 *    limit min is 200, marker
 * @returns {Request}
 */
Remote.prototype.requestAccountOffers = function(options) {
    var request = new Request(this);

    if (typeof options !== 'object') {
        request.message.type = new Error('invalid options type');
        return request;
    }
    return this.__requestAccount('account_offers', options, request);
};

/**
 * account tx
 * options parameters
 *    account(required): the query account
 *    ledger(option): specify ledger, ledger can be:
 *    ledger_index=xxx, ledger_hash=xxx, or ledger=closed|current|validated  
 *    limit limit output tx record
 *    ledger_min default 0, ledger_max default -1
 *    marker: {ledger:xxx, seq: x}
 *    descending, if returns recently tx records
 * @returns {Request}
 */
Remote.prototype.requestAccountTx = function(options) {
    var request = new Request(this, 'account_tx', function(data) {
        var results = [];
        for (var i = 0; i < data.transactions.length; ++i) {
            var _tx = utils.processTx(data.transactions[i], options.account);
            results.push(_tx);
        }
        data.transactions = results;
        return data;
    });

    if (typeof options !== 'object') {
        request.message.type = new Error('invalid options type');
        return request;
    }
    if (!utils.isValidAddress(options.account)) {
        request.message.account = new Error('account parameter is invalid');
        return request;
    }
    request.message.account = options.account;

    if (options.ledger_min && Number(options.ledger_min)) {
        request.message.ledger_index_min = Number(options.ledger_min);
    } else {
        request.message.ledger_index_min = 0;
    }
    if (options.ledger_max && Number(options.ledger_max)) {
        request.message.ledger_index_max = Number(options.ledger_max);
    } else {
        request.message.ledger_index_max = -1;
    }
    if (options.limit && Number(options.limit)) {
        request.message.limit = Number(options.limit);
    }
    if (options.offset && Number(options.offset)) {
        request.message.offset = Number(options.offset);
    }
    if (typeof(options.marker) === 'object'
            && Number(options.marker.ledger) !== NaN && Number(options.marker.seq) !== NaN) {
        request.message.marker = options.marker;
    }
    if(options.forward && typeof options.forward === 'boolean'){//true 正向；false反向
        request.message.forward = options.forward;
    }
    return request;
};

/**
 * request order book,
 * options {gets: {currency: , issuer: }, pays: {currency: ', issuer: '}}
 * for order pair AAA/BBB
 *    to get bids, gets=AAA, pays=BBB
 *    to get asks, gets=BBB, pays=AAA
 * for bids orders are ordered by price desc
 * for asks orders are ordered by price asc
 * TODO format data
 * @param options
 * @returns {Request}
 */
Remote.prototype.requestOrderBook = function(options) {
    var request = new Request(this, 'book_offers');
    if (typeof options !== 'object') {
        request.message.type = new Error('invalid options type');
        return request;
    }
    var taker_gets = options.taker_gets || options.pays;
    if (!utils.isValidAmount0(taker_gets)) {
        request.message.taker_gets = new Error('invalid taker gets amount');
        return request;
    }
    var taker_pays = options.taker_pays || options.gets;
    if (!utils.isValidAmount0(taker_pays)) {
        request.message.taker_pays = new Error('invalid taker pays amount');
        return request;
    }
    if (_.isNumber(options.limit)) {
        options.limit = parseInt(options.limit);
    }

    request.message.taker_gets = taker_gets;
    request.message.taker_pays = taker_pays;
    request.message.taker = options.taker ? options.taker : utils.ACCOUNT_ONE;
    request.message.limit = options.limit;
    return request;
};
// ---------------------- path find request --------------------
/**
 * @param options
 * {
 *   account: acccount|from|source, account to find path
 *   destination: destination|to|dst, destiantion account
 *   amount: the amount destination will received
 * }
 * @returns {Request}
 */
Remote.prototype.requestPathFind = function(options) {
    var self = this;
    var request = new Request(self, 'path_find', function(data) {
        var request2 = new Request(self, 'path_find');
        request2.message.subcommand = 'close';
        request2.submit();
        var _result = [];
        for (var i = 0; i < data.alternatives.length; ++i) {
            var item = data.alternatives[i];
            var key = sha1(JSON.stringify(item));
            self._paths.set(key, {
                path: JSON.stringify(item.paths_computed),
                choice: item.source_amount
            });
            _result.push({
                choice: utils.parseAmount(item.source_amount), key: key
            });
        }
        return _result;
    });
    if (typeof options !== 'object') {
        request.message.type = new Error('invalid options type');
        return request;
    }

    var account = options.account;
    var dest = options.destination;
    var amount = options.amount;

    if (!utils.isValidAddress(account)) {
        request.message.source_account = new Error('invalid source account');
        return request;
    }
    if (!utils.isValidAddress(dest)) {
        request.message.destination_account = new Error('invalid destination account');
        return request;
    }
    if ((!utils.isValidAmount(amount))) {
        request.message.destination_amount = new Error('invalid amount');
        return request;
    }

    request.message.subcommand = 'create';
    request.message.source_account = account;
    request.message.destination_account = dest;
    request.message.destination_amount = ToAmount(amount);
    return request;
};

// ---------------------- subscribe --------------------
/**
 * @param streams
 * @returns {Request}
 */
Remote.prototype.subscribe = function(streams) {
    var request = new Request(this, 'subscribe');
    if (streams) {
        request.message.streams = Array.isArray(streams) ? streams : [streams];
    }
    return request;
};

/**
 * @param streams
 * @returns {Request}
 */
Remote.prototype.unsubscribe = function(streams) {
    var request = new Request(this, 'unsubscribe');
    if (streams) {
        request.message.streams = Array.isArray(streams) ? streams : [streams];
    }
    return request;
};

/**
 * stub function for account event
 * @returns {Account}
 */
Remote.prototype.createAccountStub = function() {
    return new Account(this);
};

/** stub function for order book
 *
 * @returns {OrderBook}
 */
Remote.prototype.createOrderBookStub = function() {
    return new OrderBook(this);
};

// ---------------------- transaction request --------------------
/**
 * return string if swt amount
 * @param amount
 * @returns {Amount}
 */
function ToAmount(amount) {
    if(amount.value && Number(amount.value) > 100000000000){
        return new Error('invalid amount: amount\'s maximum value is 100000000000');
    }
    if (amount.currency === currency) {
        // return new String(parseInt(Number(amount.value) * 1000000.00));
        return new String(parseInt(new bignumber(amount.value).mul(1000000.00)));
    }
    return amount;
}

/**
 * payment
 * @param options
 *    source|from|account source account, required
 *    destination|to destination account, required
 *    amount payment amount, required
 * @returns {Transaction}
 */
Remote.prototype.buildPaymentTx = function(options) {
    var tx = new Transaction(this);
    if (typeof options !== 'object') {
        tx.tx_json.obj = new Error('invalid options type');
        return tx;
    }
    var src = options.source || options.from || options.account;
    var dst = options.destination || options.to;
    var amount = options.amount;
    if (!utils.isValidAddress(src)) {
        tx.tx_json.src = new Error('invalid source address');
        return tx;
    }
    if (!utils.isValidAddress(dst)) {
        tx.tx_json.dst = new Error('invalid destination address');
        return tx;
    }
    if (!utils.isValidAmount(amount)) {
        tx.tx_json.amount = new Error('invalid amount');
        return tx;
    }

    tx.tx_json.TransactionType = 'Payment';
    tx.tx_json.Account = src;
    tx.tx_json.Amount = ToAmount(amount);
    tx.tx_json.Destination = dst;
    return tx
};

/**
 * contract
 * @param options
 *    account, required
 *    amount, required
 *    payload, required
 * @returns {Transaction}
 */
Remote.prototype.deployContractTx = function(options) {
    var tx = new Transaction(this);
    if (typeof options !== 'object') {
        tx.tx_json.obj = new Error('invalid options type');
        return tx;
    }
    var account = options.account;
    var amount = options.amount;
    var payload = options.payload;
    var params = options.params;
    if (!utils.isValidAddress(account)) {
        tx.tx_json.account = new Error('invalid address');
        return tx;
    }
    if (isNaN(amount)) {
        tx.tx_json.amount = new Error('invalid amount');
        return tx;
    }
    if(typeof payload !== 'string'){
        tx.tx_json.payload = new Error('invalid payload: type error.');
        return tx;
    }
    if (params && !Array.isArray(params)) {
        tx.tx_json.params =  new Error('invalid options type');
        return tx;
    }

    tx.tx_json.TransactionType = 'ConfigContract';
    tx.tx_json.Account = account;
    tx.tx_json.Amount = Number(amount) * 1000000;
    tx.tx_json.Method = 0;
    tx.tx_json.Payload = payload;
    tx.tx_json.Args = [];
    for(var i in params){
        var obj = {};
        obj.Arg = {Parameter : utils.stringToHex(params[i])};
        tx.tx_json.Args.push(obj);
    }
    return tx
};

/**
 * contract
 * @param options
 *    account, required
 *    des, required
 *    params, required
 * @returns {Transaction}
 */
Remote.prototype.callContractTx = function(options) {
    var tx = new Transaction(this);
    if (typeof options !== 'object') {
        tx.tx_json.obj =  new Error('invalid options type');
        return tx;
    }
    var account = options.account;
    var des = options.destination;
    var params = options.params;
    var foo = options.foo; //函数名
    if (!utils.isValidAddress(account)) {
        tx.tx_json.account = new Error('invalid address');
        return tx;
    }
    if (!utils.isValidAddress(des)) {
        tx.tx_json.des = new Error('invalid destination');
        return tx;
    }

    if (params && !Array.isArray(params)) {
        tx.tx_json.params =  new Error('invalid options type');
        return tx;
    }
    if(typeof foo !== 'string'){
        tx.tx_json.foo =  new Error('foo must be string');
        return tx;
    }

    tx.tx_json.TransactionType = 'ConfigContract';
    tx.tx_json.Account = account;
    tx.tx_json.Method = 1;
    tx.tx_json.ContractMethod = utils.stringToHex(foo);
    tx.tx_json.Destination = des;
    tx.tx_json.Args = [];
    for(var i in params){
        if(typeof params[i] !== 'string'){
            tx.tx_json.params =  new Error('params must be string');
            return tx;
        }
        var obj = {};
        obj.Arg = {Parameter : utils.stringToHex(params[i])};
        tx.tx_json.Args.push(obj);
    }
    return tx;
};

Remote.prototype.buildSignTx = function(options) {
    var tx = new Transaction(this);
    if (typeof options !== 'object') {
        tx.tx_json.obj =  new Error('invalid options type');
        return tx;
    }

    tx.tx_json.TransactionType = 'Signer';
    tx.tx_json.blob = options.blob;

    return tx;
};

Remote.prototype.__buildTrustSet = function(options, tx) {
    // var tx = new Transaction(this);
    // if (typeof options !== 'object') {
    //     tx.tx_json.obj =  new Error('invalid options type');
    //     return tx;
    // }
    var src = options.source || options.from || options.account;
    var limit = options.limit;
    var quality_out = options.quality_out;
    var quality_in = options.quality_in;

    if (!utils.isValidAddress(src)) {
        tx.tx_json.src = new Error('invalid source address');
        return tx;
    }
    if (!utils.isValidAmount(limit)) {
        tx.tx_json.limit = new Error('invalid amount');
        return tx;
    }

    tx.tx_json.TransactionType = 'TrustSet';
    tx.tx_json.Account = src;
    if (limit !== void(0)) {
        tx.tx_json.LimitAmount = limit;
    }
    if (quality_in) {
        tx.tx_json.QualityIn = quality_in;
    }
    if (quality_out) {
        tx.tx_json.QualityOut = quality_out;
    }
    return tx;
};

Remote.prototype.__buildRelationSet = function(options, tx) {
    // TODO
    // var tx = new Transaction(this);
    // if (typeof options !== 'object') {
    //     tx.tx_json.obj =  new Error('invalid options type');
    //     return tx;
    // }

    var src = options.source || options.from || options.account;
    var des = options.target;
    var limit = options.limit;

    if (!utils.isValidAddress(src)) {
        tx.tx_json.src = new Error('invalid source address');
        return tx;
    }
    if (!utils.isValidAddress(des)) {
        tx.tx_json.des = new Error('invalid target address');
        return tx;
    }
    if (!utils.isValidAmount(limit)) {
        tx.tx_json.limit = new Error('invalid amount');
        return tx;
    }

    tx.tx_json.TransactionType =  options.type === 'unfreeze' ? 'RelationDel' : 'RelationSet';
    tx.tx_json.Account = src;
    tx.tx_json.Target = des;
    tx.tx_json.RelationType = options.type === 'authorize' ? 1 : 3;
    if (limit !== void(0)) {
        tx.tx_json.LimitAmount = limit;
    }
    return tx;
};

/**
 * add wallet relation set
 * @param options
 *    type: Transaction.RelationTypes
 *    source|from|account source account, required
 *    limit limt amount, required
 *    quality_out, optional
 *    quality_in, optional
 * @returns {Transaction}
 */
Remote.prototype.buildRelationTx = function(options) {
    var tx = new Transaction(this);
    if (typeof options !== 'object') {
        tx.tx_json.obj =  new Error('invalid options type');
        return tx;
    }
    if (!~Transaction.RelationTypes.indexOf(options.type)) {
        tx.tx_json.type = new Error('invalid relation type');
        return tx;
    }
    switch (options.type) {
        case 'trust':
            return this.__buildTrustSet(options, tx);
        case 'authorize':
        case 'freeze':
        case 'unfreeze':
            return this.__buildRelationSet(options, tx);
    }
    tx.tx_json.msg = new Error('build relation set should not go here');
    return tx;
};

/**
 * account information set
 * @param options
 *    set_flag, flags to set
 *    clear_flag, flags to clear
 * @returns {Transaction}
 */
Remote.prototype.__buildAccountSet = function(options, tx) {
    // var tx = new Transaction(this);
    // if (typeof options !== 'object') {
    //     tx.tx_json.obj =  new Error('invalid options type');
    //     return tx;
    // }

    var src = options.source || options.from || options.account;
    var set_flag = options.set_flag || options.set;
    var clear_flag = options.clear_flag || options.clear;
    if (!utils.isValidAddress(src)) {
        tx.tx_json.src = new Error('invalid source address');
        return tx;
    }

    tx.tx_json.TransactionType= 'AccountSet';
    tx.tx_json.Account = src;

    var SetClearFlags = Transaction.set_clear_flags.AccountSet;

    function prepareFlag(flag) {
        return (typeof flag === 'number')
            ? flag : (SetClearFlags[flag] || SetClearFlags['asf' + flag]);
    }

    if (set_flag && (set_flag = prepareFlag(set_flag))) {
        tx.tx_json.SetFlag = set_flag;
    }

    if (clear_flag && (clear_flag = prepareFlag(clear_flag))) {
        tx.tx_json.ClearFlag = clear_flag;
    }

    return tx;
};

/**
 * delegate key setting
 * @param options
 *    source|account|from, source account, required
 *    delegate_key, delegate account, required
 * @returns {Transaction}
 */
Remote.prototype.__buildDelegateKeySet = function(options, tx) {
    // var tx = new Transaction(this);
    // if (typeof options !== 'object') {
    //     tx.tx_json.obj =  new Error('invalid options type');
    //     return tx;
    // }

    var src = options.source || options.account || options.from;
    var delegate_key = options.delegate_key;

    if (!utils.isValidAddress(src)) {
        tx.tx_json.src = new Error('invalid source address');
        return tx;
    }
    if (!utils.isValidAddress(delegate_key)) {
        tx.tx_json.delegate_key = new Error('invalid regular key address');
        return tx;
    }

    tx.tx_json.TransactionType = 'SetRegularKey';
    tx.tx_json.Account = src;
    tx.tx_json.RegularKey = delegate_key;

    return tx;
};

Remote.prototype.__buildSignerSet = function(options, tx) {
    // TODO
    return null;
};

/**
 * account information set
 * @param options
 *    type: Transaction.AccountSetTypes
 * @returns {Transaction}
 */
Remote.prototype.buildAccountSetTx = function(options) {
    var tx = new Transaction(this);
    if (typeof options !== 'object') {
        tx.tx_json.obj =  new Error('invalid options type');
        return tx;
    }
    if (Transaction.AccountSetTypes.indexOf(options.type) === -1) {
        tx.tx_json.type = new Error('invalid account set type');
        return tx;
    }
    switch(options.type) {
        case 'property':
            return this.__buildAccountSet(options, tx);
        case 'delegate':
            return this.__buildDelegateKeySet(options, tx);
        case 'signer':
            return this.__buildSignerSet(options, tx);
    }

    tx.tx_json.msg = new Error('build account set should not go here');
    return tx;
};

/**
 * offer create
 * @param options
 *    type: 'Sell' or 'Buy'
 *    source|from|account maker account, required
 *    taker_gets|pays amount to take out, required
 *    taker_pays|gets amount to take in, required
 * @returns {Transaction}
 */
Remote.prototype.buildOfferCreateTx = function(options) {
    var tx = new Transaction(this);
    if (typeof options !== 'object') {
        tx.tx_json.obj =  new Error('invalid options type');
        return tx;
    }

    var offer_type = options.type;
    var src = options.source || options.from || options.account;
    var taker_gets = options.taker_gets || options.pays;
    var taker_pays = options.taker_pays || options.gets;

    if (!utils.isValidAddress(src)) {
        tx.tx_json.src = new Error('invalid source address');
        return tx;
    }
    if (typeof offer_type !== 'string' || !~Transaction.OfferTypes.indexOf(offer_type)) {
        tx.tx_json.offer_type = new Error('invalid offer type');
        return tx;
    }
    var taker_gets2, taker_pays2;
    if (typeof taker_gets === 'string' && !Number(taker_gets)) {
        tx.tx_json.taker_gets2 = new Error('invalid to pays amount');
        return tx;
    }
    if (typeof taker_gets === 'object' && !utils.isValidAmount(taker_gets)) {
        tx.tx_json.taker_gets2 = new Error('invalid to pays amount object');
        return tx;
    }
    if (typeof taker_pays === 'string' && !Number(taker_pays)) {
        tx.tx_json.taker_pays2 = new Error('invalid to gets amount');
        return tx;
    }
    if (typeof taker_pays === 'object' && !utils.isValidAmount(taker_pays)) {
        tx.tx_json.taker_pays2 = new Error('invalid to gets amount object');
        return tx;
    }

    tx.tx_json.TransactionType = 'OfferCreate';
    if (offer_type === 'Sell') tx.setFlags(offer_type);
    tx.tx_json.Account = src;
    tx.tx_json.TakerPays = taker_pays2 ? taker_pays2 : ToAmount(taker_pays);
    tx.tx_json.TakerGets = taker_gets2 ? taker_gets2 : ToAmount(taker_gets);

    return tx;
};

/**
 * offer cancel
 * @param options
 *    source|from|account source account, required
 *    sequence, required
 * @returns {Transaction}
 */
Remote.prototype.buildOfferCancelTx = function(options) {
    var tx = new Transaction(this);
    if (typeof options !== 'object') {
        tx.tx_json.obj =  new Error('invalid options type');
        return tx;
    }

    var src = options.source || options.from || options.account;
    var sequence = options.sequence;

    if (!utils.isValidAddress(src)) {
        tx.tx_json.src = new Error('invalid source address');
        return tx;
    }
    if (!Number(sequence)) {
        tx.tx_json.sequence = new Error('invalid sequence param');
        return tx;
    }

    tx.tx_json.TransactionType = 'OfferCancel';
    tx.tx_json.Account = src;
    tx.tx_json.OfferSequence = Number(sequence);

    return tx;
};

module.exports = Remote;

