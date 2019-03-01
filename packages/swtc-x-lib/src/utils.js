/**
 * Created by Administrator on 2016/11/20.
 */
var extend = require('extend');
var baselib = require('swtc-wallet').Wallet;
var Transaction = require('./transaction');
var _extend = require('lodash/extend');
var _isEmpty = require('lodash/isEmpty');
var _ = require('lodash');
var utf8 = require('utf8');
var config = require('./config');
const currency = config.currency;
var bignumber = require('bignumber.js');

// Flags for ledger entries
var LEDGER_FLAGS = {
    // Account Root
    account_root: {
        PasswordSpent:   0x00010000, // True, if password set fee is spent.
        RequireDestTag:  0x00020000, // True, to require a DestinationTag for payments.
        RequireAuth:     0x00040000, // True, to require a authorization to hold IOUs.
        DisallowSWT:     0x00080000, // True, to disallow sending SWT.
        DisableMaster:   0x00100000  // True, force regular key.
    },

    // Offer
    offer: {
        Passive:           0x00010000,
        Sell:              0x00020000  // True, offer was placed as a sell.
    },

    // Skywell State
    state: {
        LowReserve:      0x00010000, // True, if entry counts toward reserve.
        HighReserve:     0x00020000,
        LowAuth:         0x00040000,
        HighAuth:        0x00080000,
        LowNoSkywell:    0x00100000,
        HighNoSkywell:   0x00200000
    }
};

var Flags = {
    OfferCreate: {
        Passive: 0x00010000,
        ImmediateOrCancel: 0x00020000,
        FillOrKill: 0x00040000,
        Sell: 0x00080000
    }
}

function hexToString(h) {
    var a = [];
    var i = 0;

    if (h.length % 2) {
        a.push(String.fromCharCode(parseInt(h.substring(0, 1), 16)));
        i = 1;
    }

    for (; i<h.length; i+=2) {
        a.push(String.fromCharCode(parseInt(h.substring(i, i+2), 16)));
    }

    return a.join('');
}

function stringToHex(s) {
    var result = '';
    for (var i=0; i<s.length; i++) {
        var b = s.charCodeAt(i);
        result += b < 16 ? '0' + b.toString(16) : b.toString(16);
    }
    return result;
}

/**
 * check {value: '', currency:'', issuer: ''}
 * @param amount
 * @returns {boolean}
 */
function isValidAmount(amount) {
    if (amount === null || typeof amount !== 'object') {
        return false;
    }
    // check amount value
    if ((!amount.value && amount.value !== 0)
            || Number(amount.value) === NaN) {
        return false;
    }
    // check amount currency
    if (!amount.currency || !isValidCurrency(amount.currency)) {
        return false;
    }
    // native currency issuer is empty
    if (amount.currency === currency && amount.issuer !== '') {
        return false;
    }
    // non native currency issuer is not allowed to be empty
    if (amount.currency !== currency
            && !baselib.isValidAddress(amount.issuer)) {
        return false;
    }
    return true;
}

/**
 * check {currency: '', issuer: ''}
 * @param amount
 * @returns {boolean}
 */
function isValidAmount0(amount) {
    if (amount === null || typeof amount !== 'object') {
        return false;
    }
    // check amount currency
    if (!amount.currency || !isValidCurrency(amount.currency)) {
        return false;
    }
    // native currency issuer is empty
    if (amount.currency === currency && amount.issuer !== '') {
        return false;
    }
    // non native currency issuer is not allowed to be empty
    if (amount.currency !== currency
        && !baselib.isValidAddress(amount.issuer)) {
        return false;
    }
    return true;
}

/**
 * parse amount and return uni format data
 *   {value: '', currency: '', issuer: ''}
 * @param amount
 * @returns {*}
 */
function parseAmount(amount) {
    if (typeof amount === 'string' && Number(amount) !== NaN) {
        var value = String(new bignumber(amount).dividedBy(1000000.0));
        return {value: value, currency: currency, issuer: ''};
    } else if (typeof amount === 'object' && isValidAmount(amount)) {
        return amount;
    } else {
        return null;
    }
}

var CURRENCY_RE = /^([a-zA-Z0-9]{3,6}|[A-F0-9]{40})$/;
function isValidCurrency(currency) {
    if (!currency || typeof currency !== 'string'
            || currency === '') {
        return false;
    }
    return CURRENCY_RE.test(currency);
}

var LEDGER_STATES = ['current', 'closed', 'validated'];

var HASH__RE = /^[A-F0-9]{64}$/;
/**
 * hash check for tx and ledger hash
 * @param hash
 * @returns {boolean}
 */
function isValidHash(hash) {
    if (!hash || typeof hash !== 'string'
        || hash === '') {
        return false;
    }
    return HASH__RE.test(hash);
}

/**
 * get meta node type
 * @param node
 * @returns {*}
 */
function getTypeNode(node) {
    var NODE_TYPES = ['CreatedNode', 'ModifiedNode', 'DeletedNode'];
    for (var index in NODE_TYPES) {
        var type = NODE_TYPES[index];
        if (node.hasOwnProperty(type)) {
            return node[type];
        }
    }
    return null;
}

function processAffectNode(an) {
    var result = {};

    ["CreatedNode", "ModifiedNode", "DeletedNode"].forEach(function (x) {
        if (an[x]) result.diffType = x;
    });

    if (!result.diffType) return {};

    an = an[result.diffType];

    result.entryType = an.LedgerEntryType;
    result.ledgerIndex = an.LedgerIndex;

    result.fields = _extend({}, an.PreviousFields, an.NewFields, an.FinalFields);
    result.fieldsPrev = an.PreviousFields || {};
    result.fieldsNew = an.NewFields || {};
    result.fieldsFinal = an.FinalFields || {};
    result.PreviousTxnID = an.PreviousTxnID;

    return result;
}

/**
 * get effect accounts
 * @param data
 * @returns {Array}
 */
function affectedAccounts(tx) {
    var accounts = {};
    accounts[tx.transaction.Account] = 1;

    if (tx.transaction.Destination) {
        accounts[tx.transaction.Destination] = 1;
    }
    if (tx.transaction.LimitAmount) {
        accounts[tx.transaction.LimitAmount.issuer] = 1;
    }
    var meta = tx.meta;
    if (meta && meta.TransactionResult === 'tesSUCCESS') {
        meta.AffectedNodes.forEach(function(n) {
            var node = processAffectNode(n);
            if (node.entryType === 'AccountRoot' && node.fields.Account) {
                accounts[node.fields.Account] = 1;
            }
            if (node.entryType === 'SkywellState') {
                if (node.fields.HighLimit.issuer) {
                    accounts[node.fields.HighLimit.issuer] = 1;
                }
                if (node.fields.LowLimit.issuer) {
                    accounts[node.fields.LowLimit.issuer] = 1;
                }
            }
            if (node.entryType === 'Offer' && node.fields.Account) {
                accounts[node.fields.Account] = 1;
            }
        });
    }

    return Object.keys(accounts);
}

/**
 * get affect order book
 * @param tx
 * @returns {Array}
 */
function affectedBooks(tx) {
    var data = tx.meta;
    if (typeof data !== 'object') return [];
    if (!Array.isArray(data.AffectedNodes)) return [];

    var books = {};
    for (var i = 0; i < data.AffectedNodes.length; ++i) {
        var node = getTypeNode(data.AffectedNodes[i]);
        if (!node || node.LedgerEntryType !== 'Offer') {
            continue;
        }
        var fields = extend({}, node.PreviousFields, node.NewFields, node.FinalFields);
        var gets = parseAmount(fields.TakerGets);
        var pays = parseAmount(fields.TakerPays);
        var getsKey = gets.currency === currency ? gets.currency : gets.currency + '/' + gets.issuer;
        var paysKey = pays.currency === currency ? pays.currency : pays.currency + '/' + pays.issuer;
        var key = getsKey + ':' + paysKey;

        if (tx.transaction.Flags & LEDGER_FLAGS.offer.Sell) {
            // sell
            key = paysKey + ':' + getsKey;
        } else {
            // buy
            key = getsKey + ':' + paysKey;
        }
        books[key] = 1;
    }
    return Object.keys(books);
}

/**
 * parse tx type to specific transaction type
 * @param tx
 * @param account
 * @returns {string}
 */
function txnType(tx, account) {
    if (tx.Account === account || tx.Target === account || (tx.Destination && tx.Destination === account)
            || (tx.LimitAmount && tx.LimitAmount.issuer === account)) {
        switch(tx.TransactionType) {
            case 'Payment':
                return tx.Account === account ?
                    tx.Destination === account ? 'convert' : 'sent' : 'received';
            case 'OfferCreate':
                return 'offernew';
            case 'OfferCancel':
                return 'offercancel';
            case 'TrustSet':
                return tx.Account === account ? 'trusting' : 'trusted';
            case 'RelationDel':
            case 'AccountSet':
            case 'SetRegularKey':
            case 'RelationSet':
            case 'SignSet':
            case 'Operation':
            case 'ConfigContract':
                // TODO to sub-class tx type
                return tx.TransactionType.toLowerCase();
            default :
                // TODO CHECK
                return 'unknown';
        }
    } else {
        return 'offereffect';
    }

}

/**
 * get counterparty amount
 * @param amount
 * @param account
 * @returns {{value: string, currency: *, issuer: *}}
 */
function reverseAmount(amount, account) {
    return {
        value: String(-Number(amount.value)),
        currency: amount.currency,
        issuer: account
    };
}

function isAmountZero(amount) {
    if (!amount) return false;
    return Number(amount.value) < 1e-12;
}

function AmountNegate(amount) {
    if (!amount) return amount;
    return {
        value: String(- new bignumber(amount.value)),
        currency: amount.currency,
        issuer: amount.issuer
    };
}

function AmountAdd(amount1, amount2) {
    if (!amount1) return amount2;
    if (!amount2) return amount1;
    if (amount1 && amount2) {
        return {
            value: String(new bignumber(amount1.value).plus(amount2.value)),
            currency: amount1.currency,
            issuer: amount1.issuer
        };
    }
    return null;
}

function AmountSubtract(amount1, amount2) {
    return AmountAdd(amount1, AmountNegate(amount2));
}

function AmountRatio(amount1, amount2) {
    return String(new bignumber(amount1.value).dividedBy(amount2.value));
}

function getPrice(effect, funded) {
    var g = effect.got ? effect.got : effect.pays;
    var p = effect.paid ? effect.paid : effect.gets;
    if(!funded){
        return AmountRatio(g, p);
    } else {
        return AmountRatio(p, g);
    }
}
function formatArgs(args) {
    var newArgs = [];
    if(args)
        for(var i = 0; i < args.length; i++){
            newArgs.push(hexToString(args[i].Arg.Parameter));
        }
    return newArgs;
}
/**
 * process transaction in view of account
 * get basic transaction information,
 *   and transaction effects
 *
 * @param txn
 * @param account
 */
function processTx(txn, account) {
    var tx = txn.tx || txn.transaction || txn, meta = txn.meta;
    // basic information
    var result = {};
    result.date = (tx.date || tx.Timestamp) + 0x386D4380; // unix time
    result.hash = tx.hash;
    result.type = txnType(tx, account);
    result.fee = String(Number(tx.Fee) / 1000000.0);
    // if(tx.TransactionType !== 'RelationSet')
    result.result = meta ? meta.TransactionResult : 'failed';
    result.memos = [];
    switch(result.type) {
        case 'sent':
            result.counterparty = tx.Destination;
            result.amount = parseAmount(tx.Amount);
            break;
        case 'received':
            result.counterparty = tx.Account;
            result.amount = parseAmount(tx.Amount);
            break;
        case 'trusted':
            result.counterparty = tx.Account;
            result.amount = reverseAmount(tx.LimitAmount, tx.Account);
            break;
        case 'trusting':
            result.counterparty = tx.LimitAmount.issuer;
            result.amount = tx.LimitAmount;
            break;
        case 'convert':
            result.spent = parseAmount(tx.SendMax);
            result.amount = parseAmount(tx.Amount);
            break;
        case 'offernew':
            result.offertype = tx.Flags & Flags.OfferCreate.Sell ? 'sell' : 'buy';
            result.gets = parseAmount(tx.TakerGets);
            result.pays = parseAmount(tx.TakerPays);
            result.seq = tx.Sequence;
            break;
        case 'offercancel':
            result.offerseq = tx.Sequence;
            break;
        case 'relationset':
            result.counterparty = account === tx.Target ? tx.Account : tx.Target;
            result.relationtype = tx.RelationType === 3 ? 'freeze':'authorize';
            result.isactive = account === tx.Target ? false : true;
            result.amount = parseAmount(tx.LimitAmount);
            break;
        case 'relationdel':
            result.counterparty = account === tx.Target ? tx.Account : tx.Target;
            result.relationtype = tx.RelationType === 3 ? 'unfreeze':'unknown';
            result.isactive = account === tx.Target ? false : true;
            result.amount = parseAmount(tx.LimitAmount);
            break;
        case 'configcontract':
            result.params =  formatArgs(tx.Args);
            if(tx.Method === 0){
                result.method = 'deploy';
                result.payload = tx.Payload;
            }else  if(tx.Method === 1){
                result.method = 'call';
                result.destination = tx.Destination;
            }
            break;
        default :
            // TODO parse other type
            break;
    }
    // add memo
    if (Array.isArray(tx.Memos) && tx.Memos.length > 0) {
        for (var m = 0; m < tx.Memos.length; ++m) {
            var memo = tx.Memos[m].Memo;
            for (var property in memo) {
                try {
                    memo[property] = utf8.decode(hexToString(memo[property]));
                } catch (e) {
                    // TODO to unify to utf8
                    // memo[property] = memo[property];
                }
                
            }
            result.memos.push(memo);
        }
    }
    result.effects = [];
    // no effect, return now
    if (!meta || meta.TransactionResult !== 'tesSUCCESS') {
        return result;
    }

    // process effects
    meta.AffectedNodes.forEach(function(n) {
        var node = processAffectNode(n);
        var effect = {};
        /**
         * TODO now only get offer related effects, need to process other entry type
         */
        if (node.entryType === 'Offer') {
            // for new and cancelled offers
            var fieldSet = node.fields;
            var sell = node.fields.Flags & LEDGER_FLAGS.offer.Sell;

            // current account offer
            if (node.fields.Account === account) {
                // 1. offer_partially_funded
                if (node.diffType === 'ModifiedNode' || (node.diffType === 'DeletedNode' && node.fieldsPrev.TakerGets && !isAmountZero(parseAmount(node.fieldsFinal.TakerGets)))) {
                    effect.effect = 'offer_partially_funded';
                    effect.counterparty = {account: tx.Account, seq: tx.Sequence, hash: tx.hash};
                    if (node.diffType !== 'DeletedNode') {
                        // TODO no need partially funded must remains offers
                        effect.remaining = !isAmountZero(parseAmount(node.fields.TakerGets));
                    } else {
                        effect.cancelled = true;
                    }
                    effect.gets = parseAmount(fieldSet.TakerGets);
                    effect.pays = parseAmount(fieldSet.TakerPays);
                    effect.got = AmountSubtract(parseAmount(node.fieldsPrev.TakerPays), parseAmount(node.fields.TakerPays));
                    effect.paid = AmountSubtract(parseAmount(node.fieldsPrev.TakerGets), parseAmount(node.fields.TakerGets));
                    effect.type = sell ? 'sold' : 'bought';
                    if(node.fields.OfferFeeRateNum)
                        effect.rate = new bignumber(parseInt(node.fields.OfferFeeRateNum, 16)).div(parseInt(node.fields.OfferFeeRateDen, 16)).toNumber();
                } else {
                    // offer_funded, offer_created or offer_cancelled offer effect
                    effect.effect = node.diffType === 'CreatedNode' ? 'offer_created' : node.fieldsPrev.TakerPays ? 'offer_funded' : 'offer_cancelled';
                    // 2. offer_funded
                    if (effect.effect === 'offer_funded') {
                        fieldSet = node.fieldsPrev;
                        effect.counterparty = {account: tx.Account, seq: tx.Sequence, hash: tx.hash};
                        effect.got = AmountSubtract(parseAmount(node.fieldsPrev.TakerPays), parseAmount(node.fields.TakerPays));
                        effect.paid = AmountSubtract(parseAmount(node.fieldsPrev.TakerGets), parseAmount(node.fields.TakerGets));
                        effect.type = sell ? 'sold' : 'bought';
                        if(node.fields.OfferFeeRateNum)
                            effect.rate = new bignumber(parseInt(node.fields.OfferFeeRateNum, 16)).div(parseInt(node.fields.OfferFeeRateDen, 16)).toNumber();
                    }
                    // 3. offer_created
                    if (effect.effect === 'offer_created') {
                        effect.gets = parseAmount(fieldSet.TakerGets);
                        effect.pays = parseAmount(fieldSet.TakerPays);
                        effect.type = sell ? 'sell' : 'buy';
                    }
                    // 4. offer_cancelled
                    if (effect.effect === 'offer_cancelled') {
                        effect.hash = node.fields.PreviousTxnID;
                        // collect data for cancel transaction type
                        if (result.type === 'offercancel') {
                            result.gets = parseAmount(fieldSet.TakerGets);
                            result.pays = parseAmount(fieldSet.TakerPays);
                        }
                        effect.gets = parseAmount(fieldSet.TakerGets);
                        effect.pays = parseAmount(fieldSet.TakerPays);
                        effect.type = sell ? 'sell' : 'buy';
                    }
                }
                effect.seq = node.fields.Sequence;
            } else if (tx.Account === account && !_.isEmpty(node.fieldsPrev)) {
            // 5. offer_bought
                effect.effect = 'offer_bought';
                effect.counterparty =  { account: node.fields.Account, seq: node.fields.Sequence, hash: node.PreviousTxnID || node.fields.PreviousTxnID };
                effect.paid = AmountSubtract(parseAmount(node.fieldsPrev.TakerPays), parseAmount(node.fields.TakerPays));
                effect.got = AmountSubtract(parseAmount(node.fieldsPrev.TakerGets), parseAmount(node.fields.TakerGets));
                effect.type = sell ? 'bought' : 'sold';
            }
            // add price
            if ((effect.gets && effect.pays) || (effect.got && effect.paid)) {
                var created = effect.effect === 'offer_created' && effect.type === 'buy';
                var funded = effect.effect === 'offer_funded' && effect.type === 'bought';
                var cancelled = effect.effect === 'offer_cancelled' && effect.type === 'buy';
                var bought = effect.effect === 'offer_bought' && effect.type === 'bought';
                var partially_funded = effect.effect === 'offer_partially_funded' && effect.type === 'bought';
                effect.price = getPrice(effect, (created || funded || cancelled || bought ||  partially_funded ));
            }
        }
        if(result.type === 'offereffect' && node.entryType === 'AccountRoot'){
            if(node.fields.RegularKey === account){
                effect.effect = 'set_regular_key';
                effect.type = 'null';
                effect.account = node.fields.Account;
                effect.regularkey = account;
            }
        }
        if(node.entryType === 'Brokerage'){
            result.rate = new bignumber(parseInt(node.fields.OfferFeeRateNum, 16)).div(parseInt(node.fields.OfferFeeRateDen, 16)).toNumber();
        }

        // add effect
        if (!_.isEmpty(effect)) {
            if (node.diffType === 'DeletedNode' && effect.effect !== 'offer_bought') {
                effect.deleted = true;
            }
            result.effects.push(effect);
        }
    });

    /**
     * TODO check cross gateway when parse more effect, specially trust related effects, now ignore it
     *
     */
    for(var i = 0; i < result.effects.length; i++){
        var e = result.effects[i];
        if(result.rate && e.effect === 'offer_bought'){
            e.rate = result.rate;
            e.got.value = e.got.value * (1 - e.rate);
        }
        if(e.rate && (e.effect === 'offer_funded' || e.effect === 'offer_partially_funded')){
            e.got.value = e.got.value * (1 - e.rate);
        }
    }
    delete result.rate;
    return result;
}

function arraySet(count, value) {
    var a = new Array(count);

    for (var i=0; i<count; i++) {
        a[i] = value;
    }

    return a;
}

var ACCOUNT_ZERO =  config.ACCOUNT_ZERO;
var ACCOUNT_ONE  =  config.ACCOUNT_ONE;

// from jcc
var getCurrency = function (token) {
	let configs = require('./configs')
    var config = configs.find(function (conf) {
        return conf.currency.toLowerCase() === token.toLowerCase();
    })
    var currency = config ? config.currency : 'SWT';
    return currency;
}

var parseKey = function (key, token) {
    var parts = key.split(':');
    if (parts.length !== 2) return null;
    var currency = getCurrency(token);

    function parsePart(part) {
        if (part === currency) {
            return {
                currency: currency,
                issuer: ''
            };
        }
        var _parts = part.split('/');
        if (_parts.length !== 2) return null;
        if (!isValidCurrency(_parts[0])) return null;
        if (!baselib.isValidAddress(_parts[1], currency)) return null;
        return {
            currency: _parts[0],
            issuer: _parts[1]
        };
    }

    var gets = parsePart(parts[0]);
    var pays = parsePart(parts[1]);
    if (!gets || !pays) return null;
    return {
        gets: gets,
        pays: pays
    };
}

module.exports = {
    hexToString: hexToString,
    stringToHex: stringToHex,
    isValidAmount: isValidAmount,
    isValidAmount0: isValidAmount0,
    parseAmount: parseAmount,
    isValidCurrency: isValidCurrency,
    isValidHash: isValidHash,
    isValidAddress: baselib.isValidAddress,
    isValidSecret: baselib.isValidSecret,
    affectedAccounts: affectedAccounts,
    affectedBooks: affectedBooks,
    processTx: processTx,
    LEDGER_STATES: LEDGER_STATES,
    ACCOUNT_ZERO: ACCOUNT_ZERO,
    ACCOUNT_ONE: ACCOUNT_ONE,
    arraySet:arraySet,
	// from jcc
    getCurrency: getCurrency,
    getFee: () => 10000,
    getAccountZero: () => ACCOUNT_ZERO,
    getAccountOne: () => ACCOUNT_ONE,
    parseKey: parseKey
}

