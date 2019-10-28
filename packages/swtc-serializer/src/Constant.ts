const REQUIRED = 0

const OPTIONAL = 1

const DEFAULT = 2

const BASE = [
  ["TransactionType", REQUIRED],
  ["Flags", OPTIONAL],
  ["SourceTag", OPTIONAL],
  ["LastLedgerSequence", OPTIONAL],
  ["Account", REQUIRED],
  ["Sequence", OPTIONAL],
  ["Fee", REQUIRED],
  ["OperationLimit", OPTIONAL],
  ["SigningPubKey", OPTIONAL],
  ["TxnSignature", OPTIONAL]
]

/* tslint:disable */
const TRANSACTION_TYPES = {
  AccountSet: [
    3,
    ...BASE,
    ...[
      ["EmailHash", OPTIONAL],
      ["WalletLocator", OPTIONAL],
      ["WalletSize", OPTIONAL],
      ["MessageKey", OPTIONAL],
      ["Domain", OPTIONAL],
      ["TransferRate", OPTIONAL]
    ]
  ],
  TrustSet: [
    20,
    ...BASE,
    ...[
      ["LimitAmount", OPTIONAL],
      ["QualityIn", OPTIONAL],
      ["QualityOut", OPTIONAL]
    ]
  ],
  RelationSet: [
    21,
    ...BASE,
    ...[
      ["Target", REQUIRED],
      ["RelationType", REQUIRED],
      ["LimitAmount", OPTIONAL]
    ]
  ],
  RelationDel: [
    22,
    ...BASE,
    ...[
      ["Target", REQUIRED],
      ["RelationType", REQUIRED],
      ["LimitAmount", OPTIONAL]
    ]
  ],
  OfferCreate: [
    7,
    ...BASE,
    ...[
      ["TakerPays", REQUIRED],
      ["TakerGets", REQUIRED],
      ["AppType", OPTIONAL],
      ["Expiration", OPTIONAL]
    ]
  ],
  OfferCancel: [8, ...BASE, ...[["OfferSequence", REQUIRED]]],
  SetRegularKey: [5, ...BASE, ...[["RegularKey", REQUIRED]]],
  Payment: [
    0,
    ...BASE,
    ...[
      ["Destination", REQUIRED],
      ["Amount", REQUIRED],
      ["SendMax", OPTIONAL],
      ["Paths", DEFAULT],
      ["InvoiceID", OPTIONAL],
      ["DestinationTag", OPTIONAL]
    ]
  ],
  Contract: [
    9,
    ...BASE,
    ...[
      ["Expiration", REQUIRED],
      ["BondAmount", REQUIRED],
      ["StampEscrow", REQUIRED],
      ["JingtumEscrow", REQUIRED],
      ["CreateCode", OPTIONAL],
      ["FundCode", OPTIONAL],
      ["RemoveCode", OPTIONAL],
      ["ExpireCode", OPTIONAL]
    ]
  ],
  RemoveContract: [10, ...BASE, ...[["Target", REQUIRED]]],
  EnableFeature: [100, ...BASE, ...[["Feature", REQUIRED]]],
  SetFee: [
    101,
    ...BASE,
    ...[
      ["Features", REQUIRED],
      ["BaseFee", REQUIRED],
      ["ReferenceFeeUnits", REQUIRED],
      ["ReserveBase", REQUIRED],
      ["ReserveIncrement", REQUIRED]
    ]
  ],
  ConfigContract: [
    30,
    ...BASE,
    ...[
      ["Method", REQUIRED],
      ["Payload", OPTIONAL],
      ["Destination", OPTIONAL],
      ["Amount", OPTIONAL],
      ["Contracttype", OPTIONAL],
      ["ContractMethod", OPTIONAL],
      ["Args", OPTIONAL]
    ]
  ],
  AlethContract: [
    31,
    ...BASE,
    ...[
      ["Method", REQUIRED],
      ["Contracttype", OPTIONAL],
      ["ContractMethod", OPTIONAL],
      ["Amount", OPTIONAL],
      ["Payload", OPTIONAL],
      ["Args", OPTIONAL],
      ["Destination", OPTIONAL]
    ]
  ],
  Brokerage: [
    205,
    ...BASE,
    ...[
      ["OfferFeeRateNum", REQUIRED],
      ["OfferFeeRateDen", REQUIRED],
      ["AppType", REQUIRED],
      ["Amount", REQUIRED]
    ]
  ],
  // add for multisign
  SignerListSet: [
    207,
    ...BASE,
    ...[["SignerQuorum", REQUIRED], ["SignerEntries", OPTIONAL]]
  ]
}

const SLE_BASE = [
  ["LedgerIndex", OPTIONAL],
  ["LedgerEntryType", REQUIRED],
  ["Flags", REQUIRED]
]

const LEDGER_ENTRY_TYPES = {
  AccountRoot: [
    97,
    ...SLE_BASE,
    ...[
      ["Sequence", REQUIRED],
      ["PreviousTxnLgrSeq", REQUIRED],
      ["TransferRate", OPTIONAL],
      ["WalletSize", OPTIONAL],
      ["OwnerCount", REQUIRED],
      ["EmailHash", OPTIONAL],
      ["PreviousTxnID", REQUIRED],
      ["AccountTxnID", OPTIONAL],
      ["WalletLocator", OPTIONAL],
      ["Balance", REQUIRED],
      ["MessageKey", OPTIONAL],
      ["Domain", OPTIONAL],
      ["Account", REQUIRED],
      ["RegularKey", OPTIONAL]
    ]
  ],
  Contract: [
    99,
    ...SLE_BASE,
    ...[
      ["PreviousTxnLgrSeq", REQUIRED],
      ["Expiration", REQUIRED],
      ["BondAmount", REQUIRED],
      ["PreviousTxnID", REQUIRED],
      ["Balance", REQUIRED],
      ["FundCode", OPTIONAL],
      ["RemoveCode", OPTIONAL],
      ["ExpireCode", OPTIONAL],
      ["CreateCode", OPTIONAL],
      ["Account", REQUIRED],
      ["Owner", REQUIRED],
      ["Issuer", REQUIRED]
    ]
  ],
  DirectoryNode: [
    100,
    ...SLE_BASE,
    ...[
      ["IndexNext", OPTIONAL],
      ["IndexPrevious", OPTIONAL],
      ["ExchangeRate", OPTIONAL],
      ["RootIndex", REQUIRED],
      ["Owner", OPTIONAL],
      ["TakerPaysCurrency", OPTIONAL],
      ["TakerPaysIssuer", OPTIONAL],
      ["TakerGetsCurrency", OPTIONAL],
      ["TakerGetsIssuer", OPTIONAL],
      ["Indexes", REQUIRED]
    ]
  ],
  EnabledFeatures: [102, ...SLE_BASE, ...[["Features", REQUIRED]]],
  FeeSettings: [
    115,
    ...SLE_BASE,
    ...[
      ["ReferenceFeeUnits", REQUIRED],
      ["ReserveBase", REQUIRED],
      ["ReserveIncrement", REQUIRED],
      ["BaseFee", REQUIRED],
      ["LedgerIndex", OPTIONAL]
    ]
  ],
  GeneratorMap: [103, ...SLE_BASE, ...[["Generator", REQUIRED]]],
  LedgerHashes: [
    104,
    ...SLE_BASE,
    ...[
      ["LedgerEntryType", REQUIRED],
      ["Flags", REQUIRED],
      ["FirstLedgerSequence", OPTIONAL],
      ["LastLedgerSequence", OPTIONAL],
      ["LedgerIndex", OPTIONAL],
      ["Hashes", REQUIRED]
    ]
  ],
  Nickname: [
    110,
    ...SLE_BASE,
    ...[
      ["LedgerEntryType", REQUIRED],
      ["Flags", REQUIRED],
      ["LedgerIndex", OPTIONAL],
      ["MinimumOffer", OPTIONAL],
      ["Account", REQUIRED]
    ]
  ],
  Offer: [
    111,
    ...SLE_BASE,
    ...[
      ["LedgerEntryType", REQUIRED],
      ["Flags", REQUIRED],
      ["Sequence", REQUIRED],
      ["PreviousTxnLgrSeq", REQUIRED],
      ["Expiration", OPTIONAL],
      ["BookNode", REQUIRED],
      ["OwnerNode", REQUIRED],
      ["PreviousTxnID", REQUIRED],
      ["LedgerIndex", OPTIONAL],
      ["BookDirectory", REQUIRED],
      ["TakerPays", REQUIRED],
      ["TakerGets", REQUIRED],
      ["Account", REQUIRED]
    ]
  ],
  SkywellState: [
    114,
    ...SLE_BASE,
    ...[
      ["LedgerEntryType", REQUIRED],
      ["Flags", REQUIRED],
      ["PreviousTxnLgrSeq", REQUIRED],
      ["HighQualityIn", OPTIONAL],
      ["HighQualityOut", OPTIONAL],
      ["LowQualityIn", OPTIONAL],
      ["LowQualityOut", OPTIONAL],
      ["LowNode", OPTIONAL],
      ["HighNode", OPTIONAL],
      ["PreviousTxnID", REQUIRED],
      ["LedgerIndex", OPTIONAL],
      ["Balance", REQUIRED],
      ["LowLimit", REQUIRED],
      ["HighLimit", REQUIRED]
    ]
  ]
}

const METADATA = [
  ["TransactionIndex", REQUIRED],
  ["TransactionResult", REQUIRED],
  ["AffectedNodes", REQUIRED]
]

/**
 * Data type map.
 *
 * Mapping of type ids to data types. The type id is specified by the high
 */
const TYPES_MAP = [
  void 0,
  // Common
  "Int16", // 1
  "Int32", // 2
  "Int64", // 3
  "Hash128", // 4
  "Hash256", // 5
  "Amount", // 6
  "VL", // 7
  "Account", // 8
  // 9-13 reserved
  void 0, // 9
  void 0, // 10
  void 0, // 11
  void 0, // 12
  void 0, // 13
  "Object", // 14
  "Array", // 15
  // Uncommon
  "Int8", // 16
  "Hash160", // 17
  "PathSet", // 18
  "Vector256" // 19
]

/**
 * Field type map.
 *
 * Mapping of field type id to field type name.
 */
const FIELDS_MAP = {
  // Common types
  1: {
    // Int16
    1: "LedgerEntryType",
    2: "TransactionType",
    3: "SignerWeight"
  },
  2: {
    // Int32
    2: "Flags",
    3: "SourceTag",
    4: "Sequence",
    5: "PreviousTxnLgrSeq",
    6: "LedgerSequence",
    7: "CloseTime",
    8: "ParentCloseTime",
    9: "SigningTime",
    10: "Expiration",
    11: "TransferRate",
    12: "WalletSize",
    13: "OwnerCount",
    14: "DestinationTag",
    // Skip 15
    15: "Timestamp",
    16: "HighQualityIn",
    17: "HighQualityOut",
    18: "LowQualityIn",
    19: "LowQualityOut",
    20: "QualityIn",
    21: "QualityOut",
    22: "StampEscrow",
    23: "BondAmount",
    24: "LoadFee",
    25: "OfferSequence",
    26: "FirstLedgerSequence",
    27: "LastLedgerSequence",
    28: "TransactionIndex",
    29: "OperationLimit",
    30: "ReferenceFeeUnits",
    31: "ReserveBase",
    32: "ReserveIncrement",
    33: "SetFlag",
    34: "ClearFlag",
    35: "RelationType",
    36: "Method",
    37: "AppType",
    38: "SignerQuorum",
    39: "Contracttype"
  },
  3: {
    // Int64
    1: "IndexNext",
    2: "IndexPrevious",
    3: "BookNode",
    4: "OwnerNode",
    5: "BaseFee",
    6: "ExchangeRate",
    7: "LowNode",
    8: "HighNode",
    9: "OfferFeeRateNum",
    10: "OfferFeeRateDen"
  },
  4: {
    // Hash128
    1: "EmailHash"
  },
  5: {
    // Hash256
    1: "LedgerHash",
    2: "ParentHash",
    3: "TransactionHash",
    4: "AccountHash",
    5: "PreviousTxnID",
    6: "LedgerIndex",
    7: "WalletLocator",
    8: "RootIndex",
    9: "AccountTxnID",
    16: "BookDirectory",
    17: "InvoiceID",
    18: "Nickname",
    19: "Amendment",
    20: "TicketID"
  },
  6: {
    // Amount
    1: "Amount",
    2: "Balance",
    3: "LimitAmount",
    4: "TakerPays",
    5: "TakerGets",
    6: "LowLimit",
    7: "HighLimit",
    8: "Fee",
    9: "SendMax",
    16: "MinimumOffer",
    17: "JingtumEscrow",
    18: "DeliveredAmount"
  },
  7: {
    // VL
    1: "PublicKey",
    2: "MessageKey",
    3: "SigningPubKey",
    4: "TxnSignature",
    5: "Generator",
    6: "Signature",
    7: "Domain",
    8: "FundCode",
    9: "RemoveCode",
    10: "ExpireCode",
    11: "CreateCode",
    12: "MemoType",
    13: "MemoData",
    14: "MemoFormat",
    15: "Payload",
    17: "ContractMethod",
    18: "Parameter",
    20: "MethodSignature"
  },
  8: {
    // Account
    1: "Account",
    2: "Owner",
    3: "Destination",
    4: "Issuer",
    7: "Target",
    8: "RegularKey",
    9: "FeeAccountID",
    13: "Platform"
  },
  14: {
    // Object
    1: void 0, // end of Object
    2: "TransactionMetaData",
    3: "CreatedNode",
    4: "DeletedNode",
    5: "ModifiedNode",
    6: "PreviousFields",
    7: "FinalFields",
    8: "NewFields",
    9: "TemplateEntry",
    10: "Memo",
    11: "Arg",
    12: "SignerEntry",
    13: "Signer"
  },
  15: {
    // Array
    1: void 0, // end of Array
    2: "SigningAccounts",
    3: "TxnSignatures",
    4: "Signatures",
    5: "Template",
    6: "Necessary",
    7: "Sufficient",
    8: "AffectedNodes",
    9: "Memos",
    10: "Args",
    11: "SignerEntries",
    12: "Signers"
  },

  // Uncommon types
  16: {
    // Int8
    1: "CloseResolution",
    2: "TemplateEntryType",
    3: "TransactionResult",
    4: "ContractParamsType"
  },
  17: {
    // Hash160
    1: "TakerPaysCurrency",
    2: "TakerPaysIssuer",
    3: "TakerGetsCurrency",
    4: "TakerGetsIssuer"
  },
  18: {
    // PathSet
    1: "Paths"
  },
  19: {
    // Vector256
    1: "Indexes",
    2: "Hashes",
    3: "Amendments"
  }
}

/*
 * Inverse of the fields map
 *
 */
/* tslint:disable */
const INVERSE_FIELDS_MAP = {
  Flags: [2, 2],
  LedgerEntryType: [1, 1],
  TransactionType: [1, 2],
  SignerWeight: [1, 3],
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
  AppType: [2, 37],
  SignerQuorum: [2, 38],
  Contracttype: [2, 39],
  IndexNext: [3, 1],
  IndexPrevious: [3, 2],
  BookNode: [3, 3],
  OwnerNode: [3, 4],
  BaseFee: [3, 5],
  ExchangeRate: [3, 6],
  LowNode: [3, 7],
  HighNode: [3, 8],
  OfferFeeRateNum: [3, 9],
  OfferFeeRateDen: [3, 10],
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
  MethodSignature: [7, 20],
  Account: [8, 1],
  Owner: [8, 2],
  Destination: [8, 3],
  Issuer: [8, 4],
  Target: [8, 7],
  RegularKey: [8, 8],
  FeeAccountID: [8, 9],
  Platform: [8, 13],
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
  // arg: [14, 11],
  Arg: [14, 11],
  SignerEntry: [14, 12],
  Signer: [14, 13],
  SigningAccounts: [15, 2],
  TxnSignatures: [15, 3],
  Signatures: [15, 4],
  Template: [15, 5],
  Necessary: [15, 6],
  Sufficient: [15, 7],
  AffectedNodes: [15, 8],
  Memos: [15, 9],
  // args: [15, 10],
  Args: [15, 10],
  SignerEntries: [15, 11],
  Signers: [15, 12],
  CloseResolution: [16, 1],
  TemplateEntryType: [16, 2],
  TransactionResult: [16, 3],
  ContractParamsType: [16, 4],
  TakerPaysCurrency: [17, 1],
  TakerPaysIssuer: [17, 2],
  TakerGetsCurrency: [17, 3],
  TakerGetsIssuer: [17, 4],
  Paths: [18, 1],
  Indexes: [19, 1],
  Hashes: [19, 2],
  Amendments: [19, 3]
}

const MIN_CURRENCY_LEN = 3
const MAX_CURRENCY_LEN = 6
const TUM_NAME_LEN = 40

const AMOUNT_CONSTS = {
  currency_one: 1,
  currency_xns: 0,
  xns_precision: 6,

  // BigInteger values prefixed with bi_.
  bi_5: 5, // new BigInteger('5'),
  bi_7: 7, // new BigInteger('7'),
  bi_10: 10, // new BigInteger('10'),
  bi_1e14: 1e14, // new BigInteger(String(1e14)),
  bi_1e16: 1e16, // new BigInteger(String(1e16)),
  bi_1e17: 1e17, // new BigInteger(String(1e17)),
  bi_1e32: 1e32, // new BigInteger('100000000000000000000000000000000'),
  bi_man_max_value: 9999999999999999, // new BigInteger('9999999999999999'),
  bi_man_min_value: 1e15, // new BigInteger('1000000000000000'),
  bi_xns_max: 9e18, // new BigInteger('9000000000000000000'), // Json wire limit.
  bi_xns_min: -9e18, // new BigInteger('-9000000000000000000'),// Json wire limit.
  bi_xns_unit: 1e6, // new BigInteger('1000000'),

  cMinOffset: -96,
  cMaxOffset: 80,

  // Maximum possible amount for non-SWT currencies using the maximum mantissa
  // with maximum exponent. Corresponds to hex 0xEC6386F26FC0FFFF.
  max_value: "9999999999999999e80",
  // Minimum possible amount for non-SWT currencies.
  min_value: "-1000000000000000e-96"
}

export {
  REQUIRED,
  TRANSACTION_TYPES,
  LEDGER_ENTRY_TYPES,
  METADATA,
  TYPES_MAP,
  FIELDS_MAP,
  INVERSE_FIELDS_MAP,
  MIN_CURRENCY_LEN,
  MAX_CURRENCY_LEN,
  TUM_NAME_LEN,
  AMOUNT_CONSTS
}
