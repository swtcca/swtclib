/**
 * Type definitions for binary format and
 * utils to handle format conversions.
 *
 * This file should not be included directly. Instead, find the format you're
 * trying to parse or serialize in binformat.js and pass that to
 * SerializedObject.parse() or SerializedObject.serialize().
 */

var assert = require('assert');
var extend = require('extend');
var base_wallet = require('jingtum-base-lib').Wallet;
var convertBytesToAddress = require('jingtum-base-lib/src/keypairs.js').convertBytesToAddress;
var convertAddressToBytes = require('jingtum-base-lib/src/keypairs.js').convertAddressToBytes;
var BN = require('bn-plus.js');
var UInt160 = require('./uint160').UInt160;
var tum = require('./TumAmount');
var Amount = tum.Amount;
const CURRENCY_NAME_LEN = 3;//货币长度
const CURRENCY_NAME_LEN2 = 6;//货币长度

/**
 * Data type map.
 *
 * Mapping of type ids to data types. The type id is specified by the high
 *
 */
var TYPES_MAP = [
    void(0),

    // Common
    'Int16',    // 1
    'Int32',    // 2
    'Int64',    // 3
    'Hash128',  // 4
    'Hash256',  // 5
    'Amount',   // 6
    'VL',       // 7
    'Account',  // 8

    // 9-13 reserved
    void(0),    // 9
    void(0),    // 10
    void(0),    // 11
    void(0),    // 12
    void(0),    // 13

    'Object',   // 14
    'Array',    // 15

    // Uncommon
    'Int8',     // 16
    'Hash160',  // 17
    'PathSet',  // 18
    'Vector256' // 19
];

/**
 * Field type map.
 *
 * Mapping of field type id to field type name.
 */

var FIELDS_MAP = {
    // Common types
    1: { // Int16
        1: 'LedgerEntryType',
        2: 'TransactionType'
    },
    2: { // Int32
        2: 'Flags',
        3: 'SourceTag',
        4: 'Sequence',
        5: 'PreviousTxnLgrSeq',
        6: 'LedgerSequence',
        7: 'CloseTime',
        8: 'ParentCloseTime',
        9: 'SigningTime',
        10: 'Expiration',
        11: 'TransferRate',
        12: 'WalletSize',
        13: 'OwnerCount',
        14: 'DestinationTag',
        // Skip 15
        15: "Timestamp", 
        16: 'HighQualityIn',
        17: 'HighQualityOut',
        18: 'LowQualityIn',
        19: 'LowQualityOut',
        20: 'QualityIn',
        21: 'QualityOut',
        22: 'StampEscrow',
        23: 'BondAmount',
        24: 'LoadFee',
        25: 'OfferSequence',
        26: 'FirstLedgerSequence',
        27: 'LastLedgerSequence',
        28: 'TransactionIndex',
        29: 'OperationLimit',
        30: 'ReferenceFeeUnits',
        31: 'ReserveBase',
        32: 'ReserveIncrement',
        33: 'SetFlag',
        34: 'ClearFlag',
        35: "RelationType", 
        36: 'Method',
        39: 'Contracttype'
    },
    3: { // Int64
        1: 'IndexNext',
        2: 'IndexPrevious',
        3: 'BookNode',
        4: 'OwnerNode',
        5: 'BaseFee',
        6: 'ExchangeRate',
        7: 'LowNode',
        8: 'HighNode'
    },
    4: { // Hash128
        1: 'EmailHash'
    },
    5: { // Hash256
        1: 'LedgerHash',
        2: 'ParentHash',
        3: 'TransactionHash',
        4: 'AccountHash',
        5: 'PreviousTxnID',
        6: 'LedgerIndex',
        7: 'WalletLocator',
        8: 'RootIndex',
        9: 'AccountTxnID',
        16: 'BookDirectory',
        17: 'InvoiceID',
        18: 'Nickname',
        19: 'Amendment',
        20: 'TicketID'
    },
    6: { // Amount
        1: 'Amount',
        2: 'Balance',
        3: 'LimitAmount',
        4: 'TakerPays',
        5: 'TakerGets',
        6: 'LowLimit',
        7: 'HighLimit',
        8: 'Fee',
        9: 'SendMax',
        16: 'MinimumOffer',
        17: 'JingtumEscrow',
        18: 'DeliveredAmount'
    },
    7: { // VL
        1: 'PublicKey',
        2: 'MessageKey',
        3: 'SigningPubKey',
        4: 'TxnSignature',
        5: 'Generator',
        6: 'Signature',
        7: 'Domain',
        8: 'FundCode',
        9: 'RemoveCode',
        10: 'ExpireCode',
        11: 'CreateCode',
        12: 'MemoType',
        13: 'MemoData',
        14: 'MemoFormat',
        15: 'Payload',
        17: 'ContractMethod',
        18: 'Parameter'
    },
    8: { // Account
        1: 'Account',
        2: 'Owner',
        3: 'Destination',
        4: 'Issuer',
        7: 'Target',
        8: 'RegularKey'
    },
    14: { // Object
        1: void(0),  //end of Object
        2: 'TransactionMetaData',
        3: 'CreatedNode',
        4: 'DeletedNode',
        5: 'ModifiedNode',
        6: 'PreviousFields',
        7: 'FinalFields',
        8: 'NewFields',
        9: 'TemplateEntry',
        10: 'Memo',
        11: 'Arg'
    },
    15: { // Array
        1: void(0),  //end of Array
        2: 'SigningAccounts',
        3: 'TxnSignatures',
        4: 'Signatures',
        5: 'Template',
        6: 'Necessary',
        7: 'Sufficient',
        8: 'AffectedNodes',
        9: 'Memos',
        10: 'Args'
    },

    // Uncommon types
    16: { // Int8
        1: 'CloseResolution',
        2: 'TemplateEntryType',
        3: 'TransactionResult'
    },
    17: { // Hash160
        1: 'TakerPaysCurrency',
        2: 'TakerPaysIssuer',
        3: 'TakerGetsCurrency',
        4: 'TakerGetsIssuer'
    },
    18: { // PathSet
        1: 'Paths'
    },
    19: { // Vector256
        1: 'Indexes',
        2: 'Hashes',
        3: 'Amendments'
    }
};

/*
 * Inverse of the fields map
 * 
*/
var INVERSE_FIELDS_MAP = {
    LedgerEntryType: [1, 1],
    TransactionType: [1, 2],
    Flags: [2, 2],
    SourceTag: [2, 3],
    Sequence: [2, 4],
    PreviousTxnLgrSeq: [2, 5],
    LedgerSequence: [2, 6],
    CloseTime: [2, 7],
    ParentCloseTime: [2, 8],
    SigningTime: [2, 9],
    Expiration: [2, 10],
    TransferRate: [2, 11],
    WalletSize: [2, 12],
    OwnerCount: [2, 13],
    DestinationTag: [2, 14],
    Timestamp: [2, 15], 
    HighQualityIn: [2, 16],
    HighQualityOut: [2, 17],
    LowQualityIn: [2, 18],
    LowQualityOut: [2, 19],
    QualityIn: [2, 20],
    QualityOut: [2, 21],
    StampEscrow: [2, 22],
    BondAmount: [2, 23],
    LoadFee: [2, 24],
    OfferSequence: [2, 25],
    FirstLedgerSequence: [2, 26],
    LastLedgerSequence: [2, 27],
    TransactionIndex: [2, 28],
    OperationLimit: [2, 29],
    ReferenceFeeUnits: [2, 30],
    ReserveBase: [2, 31],
    ReserveIncrement: [2, 32],
    SetFlag: [2, 33],
    ClearFlag: [2, 34],
    RelationType: [2, 35], 
    Method: [2, 36],
    Contracttype: [2, 39],
    IndexNext: [3, 1],
    IndexPrevious: [3, 2],
    BookNode: [3, 3],
    OwnerNode: [3, 4],
    BaseFee: [3, 5],
    ExchangeRate: [3, 6],
    LowNode: [3, 7],
    HighNode: [3, 8],
    EmailHash: [4, 1],
    LedgerHash: [5, 1],
    ParentHash: [5, 2],
    TransactionHash: [5, 3],
    AccountHash: [5, 4],
    PreviousTxnID: [5, 5],
    LedgerIndex: [5, 6],
    WalletLocator: [5, 7],
    RootIndex: [5, 8],
    AccountTxnID: [5, 9],
    BookDirectory: [5, 16],
    InvoiceID: [5, 17],
    Nickname: [5, 18],
    Amendment: [5, 19],
    TicketID: [5, 20],
    Amount: [6, 1],
    Balance: [6, 2],
    LimitAmount: [6, 3],
    TakerPays: [6, 4],
    TakerGets: [6, 5],
    LowLimit: [6, 6],
    HighLimit: [6, 7],
    Fee: [6, 8],
    SendMax: [6, 9],
    MinimumOffer: [6, 16],
    JingtumEscrow: [6, 17],
    DeliveredAmount: [6, 18],
    PublicKey: [7, 1],
    MessageKey: [7, 2],
    SigningPubKey: [7, 3],
    TxnSignature: [7, 4],
    Generator: [7, 5],
    Signature: [7, 6],
    Domain: [7, 7],
    FundCode: [7, 8],
    RemoveCode: [7, 9],
    ExpireCode: [7, 10],
    CreateCode: [7, 11],
    MemoType: [7, 12],
    MemoData: [7, 13],
    MemoFormat: [7, 14],
    Payload: [7, 15],
    ContractMethod: [7, 17],
    Parameter: [7, 18],
    Account: [8, 1],
    Owner: [8, 2],
    Destination: [8, 3],
    Issuer: [8, 4],
    Target: [8, 7],
    RegularKey: [8, 8],
    undefined: [15, 1],
    TransactionMetaData: [14, 2],
    CreatedNode: [14, 3],
    DeletedNode: [14, 4],
    ModifiedNode: [14, 5],
    PreviousFields: [14, 6],
    FinalFields: [14, 7],
    NewFields: [14, 8],
    TemplateEntry: [14, 9],
    Memo: [14, 10],
    Arg: [14, 11],
    SigningAccounts: [15, 2],
    TxnSignatures: [15, 3],
    Signatures: [15, 4],
    Template: [15, 5],
    Necessary: [15, 6],
    Sufficient: [15, 7],
    AffectedNodes: [15, 8],
    Memos: [15, 9],
    Args: [15, 10],
    CloseResolution: [16, 1],
    TemplateEntryType: [16, 2],
    TransactionResult: [16, 3],
    TakerPaysCurrency: [17, 1],
    TakerPaysIssuer: [17, 2],
    TakerGetsCurrency: [17, 3],
    TakerGetsIssuer: [17, 4],
    Paths: [18, 1],
    Indexes: [19, 1],
    Hashes: [19, 2],
    Amendments: [19, 3]
};

var TRANSACTION_RESULTS = {
    tesSUCCESS: 0,
    tecCLAIM: 100,
    tecPATH_PARTIAL: 101,
    tecUNFUNDED_ADD: 102,
    tecUNFUNDED_OFFER: 103,
    tecUNFUNDED_PAYMENT: 104,
    tecFAILED_PROCESSING: 105,
    tecDIR_FULL: 121,
    tecINSUF_RESERVE_LINE: 122,
    tecINSUF_RESERVE_OFFER: 123,
    tecNO_DST: 124,
    tecNO_DST_INSUF_SWT: 125,
    tecNO_LINE_INSUF_RESERVE: 126,
    tecNO_LINE_REDUNDANT: 127,
    tecPATH_DRY: 128,
    tecMASTER_DISABLED: 130,
    tecNO_REGULAR_KEY: 131,
    tecOWNERS: 132,
    tecNO_ISSUER: 133,
    tecNO_AUTH: 134,
    tecNO_LINE: 135,
    tecINSUFF_FEE: 136,
    tecFROZEN: 137,
    tecNO_TARGET: 138,
    tecNO_PERMISSION: 139,
    tecNO_ENTRY: 140,
    tecINSUFFICIENT_RESERVE: 141
};

var SerializedType = function (methods) {
    extend(this, methods);
};

function isNumber(val) {
    return typeof val === 'number' && isFinite(val);
};

function isString(val) {
    return typeof val === 'string';
};

/*
 * Use RegExp match function 
 * perform case-insensitive matching
 * for HEX chars 0-9 and a-f
*/
function isHexInt64String(val) {
    return isString(val) && /^[0-9A-F]{0,16}$/i.test(val);
}

function isHexString(val) {
    return isString(val) && /^[0-9A-F]+$/i.test(val);
}

function isCurrencyString(val) {
    return isString(val) && /^[A-Z0-9]{3}$/.test(val);
}

function isBigInteger(val) {
    return val instanceof BigInteger;
}


/*
 * convert a HEX to dec number
 * 0-9 to the same digit
 * a-f, A-F to 10 - 15,
 * all others to 0
*/
function getDecFromHexChar(in_char) {
    if (in_char.length > 1)
        return 0;
    var asc_code = in_char.charCodeAt(0);
    if (asc_code > 48) {
        if (asc_code < 58) {
            //digit 1-9
            return asc_code - 48;
        }
        else {
            if (asc_code > 64) {
                if (asc_code < 91)
                //letter A-F
                    return asc_code - 55;
                else {
                    if (asc_code > 96 && asc_code < 123)
                        return asc_code - 87;
                }
            }
        }
    }
    return 0;
}

/*
 * Convert a HEX string to byte array
 * for a string, returns as byte array
 * Input is not even, add 0 to the end.
 * a0c -> a0 c0
 */
function convertHexToByteArray(in_str) {
    //If the input HEX string is odd,
    if (in_str.length % 2 != 0)
        in_str = in_str + '0';
    return new BN(in_str, 16).toArray(null, in_str.length / 2);

}

/*
 * Input:  HEX data in string format
 * Output: byte array
*/

function serializeHex(so, hexData, noLength) {
    var byteData = convertHexToByteArray(hexData);//bytes.fromBits(hex.toBits(hexData));
    if (!noLength) {
        SerializedType.serialize_varint(so, byteData.length);
    }
    so.append(byteData);
}


/*
 * Convert an Account to byte array
 * for serialization.
 * Input: a string represents the Account/Issuer.
 * Output: Bytes array contains the Account info.
 */
function convertUint160ToByteArray(in_str) {
    var i, out = [], len;
    var str = in_str.replace(/\s|0x/g, "");

    if (base_wallet.isValidAddress(str)) {
        out = convertAddressToBytes(str);
    } else {
        throw new Error('Invalid input account.');
    }

    return out;
}


/*
 * Convert the byte array to HEX values as String
 * Input is 32-bits(byte) array
 * Output is String with ordered sequence of 16-bit values contains only 0-9 and A-F
*/
function convertByteArrayToHex(byte_array) {
    return byte_array.map(function (byteValue) {
        var hex = byteValue.toString(16).toUpperCase();
        return hex.length > 1 ? hex : '0' + hex;
    }).join('');
}

/*
 * input: UTF8 coding string 
 * output: HEX code
*/
function convertStringToHex(in_str) {
    var str = unescape(encodeURIComponent(in_str));
    var out_str = "", i, tmp = 0;
    for (i = 0; i < str.length; i++) {
        out_str += (" 00" + Number(str.charCodeAt(i)).toString(16)).substr(-2);
    }
    return out_str.toUpperCase();//hex.fromBits(utf8.toBits(in_str)).toUpperCase());
}

function convertHexToString(hexString) {
    var out_str = "", i, tmp = 0;
    for (i = 0; i < hexString.length; i += 2) {
        var tmp = '0x' + (hexString.slice(i, i + 2));
        out_str += String.fromCharCode(parseInt(tmp));
    }
    return decodeURIComponent(escape(out_str));//out_str.toUpperCase();/
}

/* For test functions only*/
function typeTest(in_str) {
    var b1 = UInt160.from_json(in_str).to_bytes();
    var b2 = convertUint160ToByteArray(in_str);

    // base_wallet.
    console.log(typeof(b1), typeof(b2));
    if (b1.length == b2.length) {
        for (var i = 0; i < b1.length; i++)
            console.log(b1[i], ' vs ', b2[i]);
        if (b1[i] != b2[i])
            console.log("Not equal at ", i);
    } else
        console.log(b1.length, ' not equal ', b2.length);
    console.log("------------Test on convert to HEX----------\n");
    console.log(UInt160.from_json(in_str).to_hex());
    console.log(convertByteArrayToHex(b2));
    return;
}

exports.typeTest = typeTest;

/*
 * used by Amount serialize
*/
function arraySet(count, value) {
    var a = new Array(count);

    for (var i = 0; i < count; i++) {
        a[i] = value;
    }

    return a;
}

SerializedType.serialize_varint = function (so, val) {
    if (val < 0) {
        throw new Error('Variable integers are unsigned.');
    }

    if (val <= 192) {
        so.append([val]);
    } else if (val <= 12480) {
        val -= 193;
        so.append([193 + (val >>> 8), val & 0xff]);
    } else if (val <= 918744) {
        val -= 12481;
        so.append([241 + (val >>> 16), val >>> 8 & 0xff, val & 0xff]);
    } else {
        throw new Error('Variable integer overflow.');
    }
};

SerializedType.prototype.parse_varint = function (so) {
    var b1 = so.read(1)[0], b2, b3;
    var result;

    if (b1 > 254) {
        throw new Error('Invalid varint length indicator');
    }

    if (b1 <= 192) {
        result = b1;
    } else if (b1 <= 240) {
        b2 = so.read(1)[0];
        result = 193 + (b1 - 193) * 256 + b2;
    } else if (b1 <= 254) {
        b2 = so.read(1)[0];
        b3 = so.read(1)[0];
        result = 12481 + (b1 - 241) * 65536 + b2 * 256 + b3;
    }

    return result;
};

// In the following, we assume that the inputs are in the proper range. Is this correct?
// Helper functions for 1-, 2-, and 4-byte integers.

/**
 * Convert an integer value into an array of bytes.
 *
 * The result is appended to the serialized object ('so').
 */
function convertIntegerToByteArray(val, bytes) {
    if (!isNumber(val)) {
        throw new Error('Value is not a number', bytes);
    }

    if (val < 0 || val >= Math.pow(256, bytes)) {
        throw new Error('Value out of bounds');
    }

    var newBytes = [];

    for (var i = 0; i < bytes; i++) {
        newBytes.unshift(val >>> (i * 8) & 0xff);
    }

    return newBytes;
}

// Convert a certain number of bytes from the serialized object ('so') into an integer.
function readAndSum(so, bytes) {
    var sum = 0;

    if (bytes > 4) {
        throw new Error('This function only supports up to four bytes.');
    }

    for (var i = 0; i < bytes; i++) {
        var byte = so.read(1)[0];
        sum += (byte << (8 * (bytes - i - 1)));
    }

    // Convert to unsigned integer
    return sum >>> 0;
}

var STInt8 = exports.Int8 = new SerializedType({
    serialize: function (so, val) {
        so.append(convertIntegerToByteArray(val, 1));
    },
    parse: function (so) {
        return readAndSum(so, 1);
    }
});

STInt8.id = 16;

var STInt16 = exports.Int16 = new SerializedType({
    serialize: function (so, val) {
        so.append(convertIntegerToByteArray(val, 2));
    },
    parse: function (so) {
        return readAndSum(so, 2);
    }
});

STInt16.id = 1;

var STInt32 = exports.Int32 = new SerializedType({
    serialize: function (so, val) {
        so.append(convertIntegerToByteArray(val, 4));
    },
    parse: function (so) {
        return readAndSum(so, 4);
    }
});

STInt32.id = 2;

/*
 * Convert int64 big number input 
 * to HEX string, then serialize it.
 * -2,147,483,648 to +2,147,483,648
*/
var STInt64 = exports.Int64 = new SerializedType({
    serialize: function (so, val) {
        var big_num_in_hex_str;//NumObject;

        if (isNumber(val)) {
            val = Math.floor(val);
            if (val < 0) {
                throw new Error('Negative value for unsigned Int64 is invalid.');
            }
            //bigNumObject = new BigInteger(String(val), 10);
            var bn = new BN(val, 10);
            big_num_in_hex_str = bn.toString(16);
            // var a = new BN('dead', 16);
            // var b = new BN('101010', 2);
        } else if (isString(val)) {
            //
            if (!isHexInt64String(val)) {
                throw new Error('Not a valid hex Int64.');
            }

            big_num_in_hex_str = val;
        } else {
            throw new Error('Invalid type for Int64');
        }


        if (big_num_in_hex_str.length > 16) {
            throw new Error('Int64 is too large');
        }

        while (big_num_in_hex_str.length < 16) {
            big_num_in_hex_str = '0' + big_num_in_hex_str;
        }

        serializeHex(so, big_num_in_hex_str, true); //noLength = true
    },
    parse: function (so) {
        var bytes = so.read(8);
        // We need to add a 0, so if the high bit is set it won't think it's a
        // pessimistic numeric fraek. What doth lief?
        var result = new BigInteger([0].concat(bytes), 256);
        assert(result instanceof BigInteger);
        return result;
    }
});

STInt64.id = 3;

/*
 * serialize
 * Input: HEX value for a 128 bit Int
 * Output: byte array of the value appended to the buffer.
 * parse
 * Input: byte array
 * Output: HEX value
*/
var STHash128 = exports.Hash128 = new SerializedType({
    serialize: function (so, val) {
        //var hash = UInt128.from_json(val);
        if (isString(val) && /^[0-9A-F]{0,16}$/i.test(val)
            && val.length <= 32) {

            serializeHex(so, val, true); //noLength = true

        } else {
            throw new Error('Invalid Hash128');
        }

    },
    parse: function (so) {

        var val = so.read(16);
        if (!Array.isArray(val) || val.length !== 16) {
            //this._value = NaN;
            return NaN;
        } else {
            //this._value  = new BigInteger([0].concat(j), 256);
            //TODO: need to verify
            return NaN;//new BigNumber(val, 256);
        }
        //return UInt128.from_bytes(so.read(16));
    }
});

STHash128.id = 4;

var STHash256 = exports.Hash256 = new SerializedType({
    serialize: function (so, val) {
        if (isString(val) && /^[0-9A-F]{0,16}$/i.test(val)
            && val.length <= 64) {

            serializeHex(so, val, true); //noLength = true

        } else {
            throw new Error('Invalid Hash256');
        }

    },
    parse: function (so) {
        //return UInt256.from_bytes(so.read(32));
        console.log("TODO:");
        return NaN;
    }
});

STHash256.id = 5;

/*
 * Convert the HASH160 to bytes array
 * and back
*/
var STHash160 = exports.Hash160 = new SerializedType({
    serialize: function (so, val) {
        serializeHex(so, convertHexToByteArray(val), true);
    },
    parse: function (so) {
        return convertBytesToAddress(so.read(20));
    }
});

STHash160.id = 17;

// Internal
/*
 * Should handle 
*/
var STCurrency = new SerializedType({

  //Convert the input JSON format data INTO a BYTE array
  from_json_to_bytes: function(j, shouldInterpretSWT) {
    //return (new Currency()).parse_json(j, shouldInterpretSWT);
    console.log("Handle input json format currency:", j, typeof(j));
    
    var val = new Array(20);//return byte array representing currency code
  for (var i=0; i<20; i++) {
    val[i] = 0;
  }
    switch (typeof j){
      case 'string':
        //For Tum code with 40 chars, such as
        //800000000000000000000000A95EFD7EC3101635
        //treat as HEX string, convert to the 20 bytes array
        if ( isHexString(j) && j.length == 40 ) {
          
          val = convertHexToByteArray(j);
        }else if (isCurrencyString(j)) {
        //For Tum code with 3 letters/digits, such as
        //CNY, USD, 
        //treat 
        //   var currencyCode = j.toUpperCase();
          var currencyCode = j;

          if (currencyCode.length >= CURRENCY_NAME_LEN && currencyCode.length <= CURRENCY_NAME_LEN2){
              var end = 14;
              var len = currencyCode.length - 1;
              for(var x = len; x >= 0; x--){
                  val[end - x] = currencyCode.charCodeAt(len - x) & 0xff;
              }
          }

        }else{

          //Input not match the naming format
          //Throw error 
          throw new Error("Input tum code not valid!");
        }

        break;

      case 'number':
      //TODO, follow the Tum code rules
      console.log("Nmber");
      throw new Error("Input tum code not valid!");
        if (!isNaN(j)) {
          this.parse_number(j);
        }
        break;

      case 'object':
        console.log("Object");
        throw new Error("Input tum code not valid!");
        break;
      
    }

    return val;
  },

    serialize: function (so, val, swt_as_ascii) {
        var currencyData = val.to_bytes();
        if (!currencyData) {
            throw new Error('Tried to serialize invalid/unimplemented currency type.');
        }
        so.append(currencyData);
    },

    //Convert the Tum/Currency code from a 20 bytes array
    //TODO, check the parse value
    from_bytes: function(j) {
        if (!Array.isArray(j) || j.length !== 20) {
          return NaN;
        } else {
          return new bn([0].concat(j), 256);
        }
      
    },

    parse: function (so) {
        var bytes = so.read(20);
        var currency = this.from_bytes(bytes);
        // XXX Disabled check. Theoretically, the Currency class should support any
        //     UInt160 value and consider it valid. But it doesn't, so for the
        //     deserialization to be usable, we need to allow invalid results for now.
        //if (!currency.is_valid()) {
        //  throw new Error('Invalid currency: '+convertByteArrayToHex(bytes));
        //}
        return currency;
    }
});


var STAmount = exports.Amount = new SerializedType({
    serialize: function (so, val) {
        var amount = Amount.from_json(val);

        if (!amount.is_valid()) {
            throw new Error('Not a valid Amount object.');
        }

        // Amount (64-bit integer)
        var valueBytes = arraySet(8, 0);


        //For SWT, offset is 0
        //only convert the value
        if (amount.is_native()) {
            var bn = new BN(amount._value, 10);
            var valueHex = bn.toString(16);

            // Enforce correct length (64 bits)
            if (valueHex.length > 16) {
                throw new Error('Amount Value out of bounds');
            }

            while (valueHex.length < 16) {
                valueHex = '0' + valueHex;
            }

            //Convert the HEX value to bytes array
            valueBytes = convertHexToByteArray(valueHex);//bytes.fromBits(hex.toBits(valueHex));

            // Clear most significant two bits - these bits should already be 0 if
            // Amount enforces the range correctly, but we'll clear them anyway just
            // so this code can make certain guarantees about the encoded value.
            valueBytes[0] &= 0x3f;

            if (!amount.is_negative()) {
                valueBytes[0] |= 0x40;
            }

            so.append(valueBytes);

        } else {

            //For other non-native currency
            //1. Serialize the currency value with offset
            //Put offset
            var hi = 0, lo = 0;

            // First bit: non-native
            hi |= 1 << 31;

            if (!amount.is_zero()) {
                // Second bit: non-negative?
                if (!amount.is_negative()) {
                    hi |= 1 << 30;
                }

                // Next eight bits: offset/exponent
                hi |= ((97 + amount._offset) & 0xff) << 22;
                // Remaining 54 bits: mantissa
                hi |= amount._value.shrn(32).toNumber() & 0x3fffff;
                lo = amount._value.toNumber() & 0xffffffff;
            }

            /** Convert from a bitArray to an array of bytes.
             **/
            var arr = [hi, lo];
            var l = arr.length, x, bl, i, tmp;

            if (l === 0) {
                bl = 0;
            } else {
                x = arr[l - 1];
                bl = (l - 1) * 32 + (Math.round(x / 0x10000000000) || 32);
            }

            //Setup a new byte array and filled the byte data in
            //Results should not longer than 8 bytes as defined earlier
            var tmparray = [];

            for (i = 0; i < bl / 8; i++) {
                if ((i & 3) === 0) {
                    tmp = arr[i / 4];
                }
                tmparray.push(tmp >>> 24);
                // console.log("newPush:", i, tmp >>>24);
                tmp <<= 8;
            }
            if (tmparray.length > 8) {
                throw new Error('Invalid byte array length in AMOUNT value representation');
            }
            valueBytes = tmparray;

            so.append(valueBytes);

            //2. Serialize the currency info with currency code
            //   and issuer
            //console.log("Serial non-native AMOUNT ......");
            // Currency (160-bit hash)
            var tum_bytes = amount.tum_to_bytes();
            so.append(tum_bytes);

            // Issuer (160-bit hash)
            //so.append(amount.issuer().to_bytes());
            so.append(convertAddressToBytes(amount.issuer()));

        }

    },
    parse: function (so) {
        var amount = new Amount();
        var value_bytes = so.read(8);
        var is_zero = !(value_bytes[0] & 0x7f);

        for (var i = 1; i < 8; i++) {
            is_zero = is_zero && !value_bytes[i];
        }

        if (value_bytes[0] & 0x80) {
            //non-native
            var currency = STCurrency.parse(so);

            var issuer_bytes = so.read(20);

            var issuer = convertBytesToAddress(issuer_bytes);//UInt160.from_bytes(issuer_bytes);

            issuer.set_version(Base.VER_ACCOUNT_ID);
            var offset = ((value_bytes[0] & 0x3f) << 2) + (value_bytes[1] >>> 6) - 97;
            var mantissa_bytes = value_bytes.slice(1);
            mantissa_bytes[0] &= 0x3f;

            var value = new BigInteger(mantissa_bytes, 256);

            if (value.equals(BigInteger.ZERO) && !is_zero) {
                throw new Error('Invalid zero representation');
            }

            amount._value = value;
            amount._offset = offset;
            amount._currency = currency;
            amount._issuer = issuer;
            amount._is_native = false;
        } else {
            //native
            var integer_bytes = value_bytes.slice();
            integer_bytes[0] &= 0x3f;
            amount._value = new BigInteger(integer_bytes, 256);
            amount._is_native = true;
        }
        amount._is_negative = !is_zero && !(value_bytes[0] & 0x40);
        return amount;
    }
});

STAmount.id = 6;

var STVL = exports.VariableLength = exports.VL = new SerializedType({
    serialize: function (so, val) {

        if (typeof val === 'string') {
            serializeHex(so, val);
        } else {
            throw new Error('Unknown datatype.');
        }
    },
    parse: function (so) {
        var len = this.parse_varint(so);
        return convertByteArrayToHex(so.read(len));
    }
});

STVL.id = 7;

/*
 * the input need to be Address string.
 * Return a string instead of 
*/
var STAccount = exports.Account = new SerializedType({
    serialize: function (so, val) {
        var byte_data = convertAddressToBytes(val);
        SerializedType.serialize_varint(so, byte_data.length);
        so.append(byte_data);
    },
    parse: function (so) {
        var len = this.parse_varint(so);

        if (len !== 20) {
            throw new Error('Non-standard-length account ID');
        }

        var result = convertBytesToAddress(so.read(len));//UInt160.from_bytes(so.read(len));
        result.set_version(Base.VER_ACCOUNT_ID);

        if (false && !result.is_valid()) {
            throw new Error('Invalid Account');
        }

        return result;
    }
});

STAccount.id = 8;

var STPathSet = exports.PathSet = new SerializedType({
    typeBoundary: 0xff,
    typeEnd: 0x00,
    typeAccount: 0x01,
    typeCurrency: 0x10,
    typeIssuer: 0x20,
    serialize: function (so, val) {
        for (var i = 0, l = val.length; i < l; i++) {
            // Boundary
            if (i) {
                STInt8.serialize(so, this.typeBoundary);
            }

            for (var j = 0, l2 = val[i].length; j < l2; j++) {
                var entry = val[i][j];
                //if (entry.hasOwnProperty('_value')) {entry = entry._value;}
                var type = 0;

                if (entry.account) {
                    type |= this.typeAccount;
                }
                if (entry.currency) {
                    type |= this.typeCurrency;
                }
                if (entry.issuer) {
                    type |= this.typeIssuer;
                }

                STInt8.serialize(so, type);

                if (entry.account) {
                    //so.append(UInt160.from_json(entry.account).to_bytes());
                    so.append(convertAddressToBytes(entry.account));
                }

                if (entry.currency) {
                    var currencyBytes = STCurrency.from_json_to_bytes(entry.currency, entry.non_native);
                    so.append(currencyBytes);
                }

                if (entry.issuer) {
                    //so.append(UInt160.from_json(entry.issuer).to_bytes());
                    so.append(convertAddressToBytes(entry.issuer));
                }
            }
        }

        STInt8.serialize(so, this.typeEnd);
    },
    parse: function (so) {
        // should return a list of lists:
        /*
           [
           [entry, entry],
           [entry, entry, entry],
           [entry],
           []
           ]

           each entry has one or more of the following attributes: amount, currency, issuer.
           */

        var path_list = [];
        var current_path = [];
        var tag_byte;

        while ((tag_byte = so.read(1)[0]) !== this.typeEnd) {

            //TODO: try/catch this loop, and catch when we run out of data without reaching the end of the data structure.
            //Now determine: is this an end, boundary, or entry-begin-tag?
            //console.log('Tag byte:', tag_byte);

            if (tag_byte === this.typeBoundary) {
                //console.log('Boundary');
                if (current_path) { //close the current path, if there is one,
                    path_list.push(current_path);
                }
                current_path = []; //and start a new one.
                continue;
            }

            //It's an entry-begin tag.
            //console.log('It's an entry-begin tag.');
            var entry = {};

            if (tag_byte & this.typeAccount) {
                //console.log('entry.account');
                /*var bta = so.read(20);
                  console.log('BTA:', bta);*/
                entry.account = STHash160.parse(so);
                entry.account.set_version(Base.VER_ACCOUNT_ID);
            }
            if (tag_byte & this.typeCurrency) {
                //console.log('entry.currency');
                entry.currency = STCurrency.parse(so);
                if (entry.currency.to_json() === 'SWT' && !entry.currency.is_native()) {
                    entry.non_native = true;
                }
            }
            if (tag_byte & this.typeIssuer) {
                //console.log('entry.issuer');
                entry.issuer = STHash160.parse(so);
                // Enable and set correct type of base-58 encoding
                entry.issuer.set_version(Base.VER_ACCOUNT_ID);
                //console.log('DONE WITH ISSUER!');
            }

            if (entry.account || entry.currency || entry.issuer) {
                current_path.push(entry);
            } else {
                throw new Error('Invalid path entry'); //It must have at least something in it.
            }
        }

        if (current_path) {
            //close the current path, if there is one,
            path_list.push(current_path);
        }

        return path_list;
    }
});

STPathSet.id = 18;

var STVector256 = exports.Vector256 = new SerializedType({
    serialize: function (so, val) { //Assume val is an array of STHash256 objects.
        var length_as_varint = SerializedType.serialize_varint(so, val.length * 32);
        for (var i = 0, l = val.length; i < l; i++) {
            STHash256.serialize(so, val[i]);
        }
    },
    parse: function (so) {
        var length = this.parse_varint(so);
        var output = [];
        // length is number of bytes not number of Hash256
        for (var i = 0; i < length / 32; i++) {
            output.push(STHash256.parse(so));
        }
        return output;
    }
});

STVector256.id = 19;

// Internal
var STMemo = exports.STMemo = new SerializedType({
    serialize: function (so, val, no_marker) {
        var keys = [];

        Object.keys(val).forEach(function (key) {
            // Ignore lowercase field names - they're non-serializable fields by
            // convention.
            if (key[0] === key[0].toLowerCase()) {
                return;
            }

            //Check the field
            if (typeof INVERSE_FIELDS_MAP[key] === 'undefined') {
                throw new Error('JSON contains unknown field: "' + key + '"');
            }

            keys.push(key);
        });


        // Sort fields
        keys = sort_fields(keys);

        // store that we're dealing with json
        var isJson = val.MemoFormat === 'json';

        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var value = val[key];
            switch (key) {

                // MemoType and MemoFormat are always ASCII strings
                case 'MemoType':
                case 'MemoFormat':
                    value = convertStringToHex(value);
                    break;

                // MemoData can be a JSON object, otherwise it's a string
                case 'MemoData':
                    if (typeof value !== 'string') {
                        if (isJson) {
                            try {
                                value = convertStringToHex(JSON.stringify(value));
                            } catch (e) {
                                throw new Error('MemoFormat json with invalid JSON in MemoData field');
                            }
                        } else {
                            throw new Error('MemoData can only be a JSON object with a valid json MemoFormat');
                        }
                    } else if (isString(value)) {
                        value = convertStringToHex(value);
                    }
                    break;
            }

            serialize(so, key, value);
        }

        if (!no_marker) {
            //Object ending marker
            STInt8.serialize(so, 0xe1);
        }

    },
    parse: function (so) {
        var output = {};
        while (so.peek(1)[0] !== 0xe1) {
            var keyval = parse(so);
            output[keyval[0]] = keyval[1];
        }

        if (output['MemoType'] !== void(0)) {
            output['parsed_memo_type'] = convertHexToString(output['MemoType']);
        }

        if (output['MemoFormat'] !== void(0)) {
            output['parsed_memo_format'] = convertHexToString(output['MemoFormat']);
        }

        if (output['MemoData'] !== void(0)) {

            // see if we can parse JSON
            if (output['parsed_memo_format'] === 'json') {
                try {
                    output['parsed_memo_data'] = JSON.parse(convertHexToString(output['MemoData']));
                } catch (e) {
                    // fail, which is fine, we just won't add the memo_data field
                }
            } else if (output['parsed_memo_format'] === 'text') {
                output['parsed_memo_data'] = convertHexToString(output['MemoData']);
            }
        }

        so.read(1);
        return output;
    }

});

exports.serialize = exports.serialize_whatever = serialize;

/*
 * return the transaction type in string
 * Data defined in the TRANSACTION_TYPES
*/
function get_transaction_type(structure) {
    var output;

    switch (typeof structure) {
        case 'number':

            switch (structure) {
                case 0:
                    output = 'Payment';
                    break;
                case 3:
                    output = 'AccountSet';
                    break;
                case 5:
                    output = 'SetRegularKey';
                    break;
                case 7:
                    output = 'OfferCreate';
                    break;
                case 8:
                    output = 'OfferCancel';
                    break;
                case 9:
                    output = 'Contract';
                    break;
                case 10:
                    output = 'RemoveContract';
                    break;
                case 20:
                    output = 'TrustSet';
                    break;
                case 21: 
                    output='RelationSet'; 
                    break;
                case 22:
                    output='RelationDel'; 
                    break;
                case 30:
                    output='ConfigContract'; 
                    break;
                case 100:
                    output = 'EnableFeature';
                    break;
                case 101:
                    output = 'SetFee';
                    break;
                default:
                    throw new Error('Invalid transaction type!');
            }
            break;
        case 'string':

            switch (structure) {
                case 'Payment':
                    output = 0;
                    break;
                case 'AccountSet':
                    output = 3;
                    break;
                case 'SetRegularKey':
                    output = 5;
                    break;
                case 'OfferCreate':
                    output = 7;
                    break;
                case 'OfferCancel':
                    output = 8;
                    break;
                case 'Contract':
                    output = 9;
                    break;
                case 'RemoveContract':
                    output = 10;
                    break;
                case 'TrustSet':
                    output = 20;
                    break;
                case 'RelationSet': 
                    output = 21;
                    break;
                case 'RelationDel': 
                    output = 22;
                    break;
                case 'ConfigContract': 
                    output = 30;
                    break;
                case 'EnableFeature':
                    output = 100;
                    break;
                case 'SetFee':
                    output = 101;
                    break;
                default:
                    throw new Error('Invalid transaction type!');
            }
            break;
        default:
            throw new Error('Invalid input type for transaction type!');
    }//end typeof structure

    console.log('Get tx type:', output);
    return output;
}

exports.get_transaction_type = get_transaction_type;

/*
 * return the transaction result in string
 * Data defined in the TRANSACTION_RESULTS
 *  tesSUCCESS               : 0,
  tecCLAIM                 : 100,
  tecPATH_PARTIAL          : 101,
  tecUNFUNDED_ADD          : 102,
  tecUNFUNDED_OFFER        : 103,
  tecUNFUNDED_PAYMENT      : 104,
  tecFAILED_PROCESSING     : 105,
  tecDIR_FULL              : 121,
  tecINSUF_RESERVE_LINE    : 122,
  tecINSUF_RESERVE_OFFER   : 123,
  tecNO_DST                : 124,
  tecNO_DST_INSUF_SWT      : 125,
  tecNO_LINE_INSUF_RESERVE : 126,
  tecNO_LINE_REDUNDANT     : 127,
  tecPATH_DRY              : 128,
  tecMASTER_DISABLED       : 130,
  tecNO_REGULAR_KEY        : 131,
  tecOWNERS                : 132,
  tecNO_ISSUER             : 133,
  tecNO_AUTH               : 134,
  tecNO_LINE               : 135,
  tecINSUFF_FEE            : 136,
  tecFROZEN                : 137,
  tecNO_TARGET             : 138,
  tecNO_PERMISSION         : 139,
  tecNO_ENTRY              : 140,
  tecINSUFFICIENT_RESERVE  : 141
*/
function get_transaction_result(structure) {
    var output;

    switch (typeof structure) {
        case 'number':

            switch (structure) {
                case 0:
                    output = 'tesSUCCESS';
                    break;
                case 100:
                    output = 'tecCLAIM';
                    break;
                case 101:
                    output = 'tecPATH_PARTIAL';
                    break;
                case 102:
                    output = 'tecUNFUNDED_ADD';
                    break;
                case 103:
                    output = 'tecUNFUNDED_OFFER';
                    break;
                case 104:
                    output = 'tecUNFUNDED_PAYMENT';
                    break;
                case 105:
                    output = 'tecFAILED_PROCESSING';
                    break;
                case 121:
                    output = 'tecDIR_FULL';
                    break;
                case 122:
                    output = 'tecINSUF_RESERVE_LINE';
                    break;
                case 141:
                    output = 'tecINSUFFICIENT_RESERVE';
                    break;
                default:
                    throw new Error('Invalid transaction result!');
            }
            break;
        case 'string':
            switch (structure) {
                case 'tesSUCCESS':
                    output = 0;
                    break;
                case 'tecCLAIM':
                    output = 100;
                    break;
                case 'tecPATH_PARTIAL':
                    output = 101;
                    break;
                case 'tecUNFUNDED_ADD':
                    output = 102;
                    break;
                case 'tecUNFUNDED_OFFER':
                    output = 103;
                    break;
                case 'tecUNFUNDED_PAYMENT':
                    output = 104;
                    break;
                case 'tecFAILED_PROCESSING':
                    output = 105;
                    break;
                case 'tecDIR_FULL':
                    output = 121;
                    break;
                case 'tecINSUF_RESERVE_LINE':
                    output = 122;
                    break;
                case 'tecINSUFFICIENT_RESERVE':
                    output = 141;
                    break;
                default:
                    throw new Error('Invalid transaction result!');
            }
            break;
        default:
            throw new Error('Invalid input type for transaction result!');
    }//end typeof structure

    console.log('Get tx result:', output);
    return output;
};

exports.get_transaction_result = get_transaction_result;

/*
 * return the transaction type in string
 * Data defined in the ledger entry:
  AccountRoot: [97].concat(sleBase,[
  Contract: [99].concat(sleBase,[
  DirectoryNode: [100].concat(sleBase,[
  EnabledFeatures: [102].concat(sleBase,[
  FeeSettings: [115].concat(sleBase,[
  GeneratorMap: [103].concat(sleBase,[
  LedgerHashes: [104].concat(sleBase,[
  Nickname: [110].concat(sleBase,[
  Offer: [111].concat(sleBase,[
  SkywellState: [114].concat(sleBase,[

  TODO: add string input handles
*/
function get_ledger_entry_type(structure) {
    var output;

    switch (typeof structure) {
        case 'number':

            switch (structure) {
                case 97:
                    output = 'AccountRoot';
                    break;
                case 99:
                    output = 'Contract';
                    break;
                case 100:
                    output = 'DirectoryNode';
                    break;
                case 102:
                    output = 'EnabledFeatures';
                    break;
                case 115:
                    output = 'FeeSettings';
                    break;
                case 103:
                    output = 'GeneratorMap';
                    break;
                case 104:
                    output = 'LedgerHashes';
                    break;
                case 110:
                    output = 'Nickname';
                    break;
                case 111:
                    output = 'Offer';
                    break;
                case 114:
                    output = 'SkywellState';
                    break;
                default:
                    throw new Error('Invalid input type for ransaction result!');
            }
            break;
        case 'string':

            switch (structure) {
                case 'AccountRoot':
                    output = 97;
                    break;
                case 'Contract':
                    output = 99;
                    break;
                case 'DirectoryNode':
                    output = 100;
                    break;
                case 'EnabledFeatures':
                    output = 102;
                    break;
                case 'FeeSettings':
                    output = 115;
                    break;
                case 'GeneratorMap':
                    output = 103;
                    break;
                case 'LedgerHashes':
                    output = 104;
                    break;
                case 'Nickname':
                    output = 110;
                    break;
                case 'Offer':
                    output = 111;
                    break;
                case 'SkywellState':
                    output = 114;
                    break;
                default:
                    output = 0;//undefined results, should not come here.
            }
            break;
        default:
            output = 'UndefinedLedgerEntry';
    }//end typeof structure

    console.log('Get ledger entry type:', output);
    return output;
}

exports.get_ledger_entry_type = get_ledger_entry_type;


function serialize(so, field_name, value) {
    //so: a byte-stream to serialize into.
    //field_name: a string for the field name ('LedgerEntryType' etc.)
    //value: the value of that field.
    var field_coordinates = INVERSE_FIELDS_MAP[field_name];
    var type_bits = field_coordinates[0];
    var field_bits = field_coordinates[1];
    var tag_byte = (type_bits < 16 ? type_bits << 4 : 0) | (field_bits < 16 ? field_bits : 0);

    if ('string' === typeof value) {
        if (field_name === 'LedgerEntryType') {
            value = get_ledger_entry_type(value);
        } else if (field_name === 'TransactionResult') {
            value = get_transaction_type(value);//binformat.ter[value];
        }

    }


    STInt8.serialize(so, tag_byte);

    if (type_bits >= 16) {
        STInt8.serialize(so, type_bits);
    }

    if (field_bits >= 16) {
        STInt8.serialize(so, field_bits);
    }

    // Get the serializer class (ST...)
    var serialized_object_type;
    if (field_name === 'Memo' && typeof value === 'object') {
        // for Memo we override the default behavior with our STMemo serializer
        serialized_object_type = exports.STMemo;
    } else {
        // for a field based on the type bits.
        serialized_object_type = exports[TYPES_MAP[type_bits]];
    }

    try {
        serialized_object_type.serialize(so, value);
    } catch (e) {
        e.message += ' (' + field_name + ')';
        throw e;
    }
}

//Take the serialized object, figure out what type/field it is, and return the parsing of that.
exports.parse = exports.parse_whatever = parse;

function parse(so) {
    var tag_byte = so.read(1)[0];
    var type_bits = tag_byte >> 4;

    if (type_bits === 0) {
        type_bits = so.read(1)[0];
    }


    var field_bits = tag_byte & 0x0f;
    var field_name = (field_bits === 0)
        ? field_name = FIELDS_MAP[type_bits][so.read(1)[0]]
        : field_name = FIELDS_MAP[type_bits][field_bits];

    assert(field_name, 'Unknown field - header byte is 0x' + tag_byte.toString(16));

    // Get the parser class (ST...) for a field based on the type bits.
    var type = (field_name === 'Memo')
        ? exports.STMemo
        : exports[TYPES_MAP[type_bits]];

    assert(type, 'Unknown type - header byte is 0x' + tag_byte.toString(16));

    return [field_name, type.parse(so)]; //key, value
}

function sort_fields(keys) {
    function sort_field_compare(a, b) {
        var a_field_coordinates = INVERSE_FIELDS_MAP[a];
        var a_type_bits = a_field_coordinates[0];
        var a_field_bits = a_field_coordinates[1];

        var b_field_coordinates = INVERSE_FIELDS_MAP[b];
        var b_type_bits = b_field_coordinates[0];
        var b_field_bits = b_field_coordinates[1];

        // Sort by type id first, then by field id
        return a_type_bits !== b_type_bits ? a_type_bits - b_type_bits : a_field_bits - b_field_bits;
    }

    return keys.sort(sort_field_compare);
}

var STObject = exports.Object = new SerializedType({
    serialize: function (so, val, no_marker) {
        var keys = [];

        Object.keys(val).forEach(function (key) {
            // Ignore lowercase field names - they're non-serializable fields by
            // convention.
            if (key[0] === key[0].toLowerCase()) {
                return;
            }

            if (typeof INVERSE_FIELDS_MAP[key] === 'undefined') {
                throw new Error('JSON contains unknown field: "' + key + '"');
            }

            keys.push(key);
        });

        // Sort fields
        keys = sort_fields(keys);

        for (var i = 0; i < keys.length; i++) {
            serialize(so, keys[i], val[keys[i]]);
        }

        if (!no_marker) {
            //Object ending marker
            STInt8.serialize(so, 0xe1);
        }
    },

    parse: function (so) {
        var output = {};
        while (so.peek(1)[0] !== 0xe1) {
            var keyval = parse(so);
            output[keyval[0]] = keyval[1];
        }
        so.read(1);
        return output;
    }
});

STObject.id = 14;

var STArray = exports.Array = new SerializedType({
    serialize: function (so, val) {
        for (var i = 0, l = val.length; i < l; i++) {
            var keys = Object.keys(val[i]);

            if (keys.length !== 1) {
                throw Error('Cannot serialize an array containing non-single-key objects');
            }

            var field_name = keys[0];
            var value = val[i][field_name];
            serialize(so, field_name, value);
        }

        //Array ending marker
        STInt8.serialize(so, 0xf1);
    },

    parse: function (so) {
        var output = [];

        while (so.peek(1)[0] !== 0xf1) {
            var keyval = parse(so);
            var obj = {};
            obj[keyval[0]] = keyval[1];
            output.push(obj);
        }

        so.read(1);

        return output;
    }
});

STArray.id = 15;
