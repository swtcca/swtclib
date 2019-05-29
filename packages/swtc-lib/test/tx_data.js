const config = require("./config")
const { testAddress, testDestinationAddress } = config
const input1 = {
  meta: {
    AffectedNodes: [],
    TransactionIndex: 50,
    TransactionResult: "tesSUCCESS"
  },
  tx: {
    Account: "jhzL5Q2TZATYb3Q4GkWFzquHxjfZLnFkCD",
    Amount: "7500000",
    Destination: testAddress,
    Fee: "20",
    Flags: 0,
    Memos: [
      {
        Memo: {
          test: "test"
        }
      }
    ],
    Sequence: 1293,
    SigningPubKey:
      "03B35A1F42C4A01BD3E79B8CA1BE1F05661375BF557F5EEACA8EF699669702DC54",
    Timestamp: 588967263,
    TransactionType: "Payment",
    TxnSignature:
      "3045022100F507E42104CD93D00B1429B7514D76E4FC058E993EF299CB4CC34E02482F3FAA022007636929A141D226C1615DACA9AD9E37B3D7A5041CA5226E5195366735BA481B",
    date: 588967270,
    hash: "D6010549B714C87F555557FF4D5A3654D0F3863F8556FBD3F4406BB9BB039D0A",
    inLedger: 10580899,
    ledger_index: 10580899
  },
  validated: true
}

const input2 = {
  transaction: {
    Account: testAddress,
    Amount: "7500000",
    Destination: testAddress,
    Fee: "20",
    Flags: 0,
    Memos: [],
    Sequence: 1293,
    SigningPubKey:
      "03B35A1F42C4A01BD3E79B8CA1BE1F05661375BF557F5EEACA8EF699669702DC54",
    Timestamp: 588967263,
    TransactionType: "Payment",
    TxnSignature:
      "3045022100F507E42104CD93D00B1429B7514D76E4FC058E993EF299CB4CC34E02482F3FAA022007636929A141D226C1615DACA9AD9E37B3D7A5041CA5226E5195366735BA481B",
    hash: "D6010549B714C87F555557FF4D5A3654D0F3863F8556FBD3F4406BB9BB039D0A",
    inLedger: 10580899,
    ledger_index: 10580899
  },
  validated: true
}

const input3 = {
  Account: testAddress,
  Amount: "7500000",
  Destination: "jhzL5Q2TZATYb3Q4GkWFzquHxjfZLnFkCD",
  Fee: "20",
  Flags: 0,
  Memos: [],
  Sequence: 1293,
  SigningPubKey:
    "03B35A1F42C4A01BD3E79B8CA1BE1F05661375BF557F5EEACA8EF699669702DC54",
  Timestamp: 588967263,
  TransactionType: "Payment",
  TxnSignature:
    "3045022100F507E42104CD93D00B1429B7514D76E4FC058E993EF299CB4CC34E02482F3FAA022007636929A141D226C1615DACA9AD9E37B3D7A5041CA5226E5195366735BA481B",
  date: 588967270,
  hash: "D6010549B714C87F555557FF4D5A3654D0F3863F8556FBD3F4406BB9BB039D0A",
  inLedger: 10580899,
  ledger_index: 10580899
}

const input4 = {
  LimitAmount: {
    issuer: testAddress,
    value: "1",
    currency: "SWT"
  },
  Amount: "7500000",
  Fee: "20",
  Flags: 0,
  Memos: [],
  Sequence: 1293,
  Account: "jhzL5Q2TZATYb3Q4GkWFzquHxjfZLnFkCD",
  SigningPubKey:
    "03B35A1F42C4A01BD3E79B8CA1BE1F05661375BF557F5EEACA8EF699669702DC54",
  Timestamp: 588967263,
  TransactionType: "TrustSet",
  TxnSignature:
    "3045022100F507E42104CD93D00B1429B7514D76E4FC058E993EF299CB4CC34E02482F3FAA022007636929A141D226C1615DACA9AD9E37B3D7A5041CA5226E5195366735BA481B",
  date: 588967270,
  hash: "D6010549B714C87F555557FF4D5A3654D0F3863F8556FBD3F4406BB9BB039D0A",
  inLedger: 10580899,
  ledger_index: 10580899
}

const input5 = {
  LimitAmount: {
    issuer: testAddress,
    value: "1",
    currency: "SWT"
  },
  Amount: "7500000",
  Fee: "20",
  Flags: 0,
  Memos: [],
  Sequence: 1293,
  Account: testAddress,
  SigningPubKey:
    "03B35A1F42C4A01BD3E79B8CA1BE1F05661375BF557F5EEACA8EF699669702DC54",
  Timestamp: 588967263,
  TransactionType: "TrustSet",
  TxnSignature:
    "3045022100F507E42104CD93D00B1429B7514D76E4FC058E993EF299CB4CC34E02482F3FAA022007636929A141D226C1615DACA9AD9E37B3D7A5041CA5226E5195366735BA481B",
  date: 588967270,
  hash: "D6010549B714C87F555557FF4D5A3654D0F3863F8556FBD3F4406BB9BB039D0A",
  inLedger: 10580899,
  ledger_index: 10580899
}

const output1 = {
  date: 1535652070,
  hash: "D6010549B714C87F555557FF4D5A3654D0F3863F8556FBD3F4406BB9BB039D0A",
  type: "received",
  fee: "0.00002",
  result: "tesSUCCESS",
  memos: [
    {
      test: "\u0000\u0000"
    }
  ],
  counterparty: "jhzL5Q2TZATYb3Q4GkWFzquHxjfZLnFkCD",
  amount: {
    value: "7.5",
    currency: "SWT",
    issuer: ""
  },
  effects: []
}

const output2 = {
  date: 1535652063,
  hash: "D6010549B714C87F555557FF4D5A3654D0F3863F8556FBD3F4406BB9BB039D0A",
  type: "convert",
  fee: "0.00002",
  result: "failed",
  memos: [],
  spent: null,
  amount: {
    value: "7.5",
    currency: "SWT",
    issuer: ""
  },
  effects: []
}

const output3 = {
  date: 1535652070,
  hash: "D6010549B714C87F555557FF4D5A3654D0F3863F8556FBD3F4406BB9BB039D0A",
  type: "sent",
  fee: "0.00002",
  result: "failed",
  memos: [],
  counterparty: "jhzL5Q2TZATYb3Q4GkWFzquHxjfZLnFkCD",
  amount: {
    value: "7.5",
    currency: "SWT",
    issuer: ""
  },
  effects: []
}

const output4 = {
  date: 1535652070,
  hash: "D6010549B714C87F555557FF4D5A3654D0F3863F8556FBD3F4406BB9BB039D0A",
  type: "trusted",
  fee: "0.00002",
  result: "failed",
  memos: [],
  counterparty: "jhzL5Q2TZATYb3Q4GkWFzquHxjfZLnFkCD",
  amount: {
    value: "-1",
    currency: "SWT",
    issuer: "jhzL5Q2TZATYb3Q4GkWFzquHxjfZLnFkCD"
  },
  effects: []
}

const output5 = {
  date: 1535652070,
  hash: "D6010549B714C87F555557FF4D5A3654D0F3863F8556FBD3F4406BB9BB039D0A",
  type: "trusting",
  fee: "0.00002",
  result: "failed",
  memos: [],
  counterparty: testAddress,
  amount: {
    issuer: testAddress,
    value: "1",
    currency: "SWT"
  },
  effects: []
}

const input6 = {
  meta: {
    AffectedNodes: [],
    TransactionIndex: 0,
    TransactionResult: "tesSUCCESS"
  },
  tx: {
    Account: testAddress,
    Fee: "10",
    Flags: 0,
    OfferSequence: 4581,
    Sequence: 4582,
    SigningPubKey:
      "030FC8DDB7C7CBB7E2D031B82D480C8B90692DCDF142B229CC18C544C09BD66FBE",
    TransactionType: "OfferCancel",
    TxnSignature:
      "3045022100CEC38432000E9A637920541C4868E412D649ED8048269A67F0B4FF2C6C9CB62A02205C7E1222C13B41DA0D8F0DEDA8B997FC5834F08FE1BDF196F71E369376074635",
    date: 588934000,
    hash: "CE7CCF09167696A7EADFA46506F511ED22953A1D0A3C006F572A73CBFF7B667B",
    inLedger: 10577572,
    ledger_index: 10577572
  },
  validated: true
}

const output6 = {
  date: 1535618800,
  hash: "CE7CCF09167696A7EADFA46506F511ED22953A1D0A3C006F572A73CBFF7B667B",
  type: "offercancel",
  fee: "0.00001",
  result: "tesSUCCESS",
  memos: [],
  offerseq: 4582,
  effects: []
}

const input7 = {
  meta: {
    AffectedNodes: [],
    TransactionIndex: 0,
    TransactionResult: "tesSUCCESS"
  },
  tx: {
    Account: testAddress,
    Fee: "10",
    Flags: 0,
    Sequence: 4583,
    SigningPubKey:
      "030FC8DDB7C7CBB7E2D031B82D480C8B90692DCDF142B229CC18C544C09BD66FBE",
    TakerGets: {
      currency: "CNY",
      issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
      value: "0.4"
    },
    TakerPays: {
      currency: "JJCC",
      issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
      value: "1"
    },
    TransactionType: "OfferCreate",
    TxnSignature:
      "304402206B5CC4C716473E38E677C7F97663BE7C00DE47F7377E26B1246356CDDC8F2A5E02203C7F5A318183C5275F580C932EB92CBAC9007FB866D5C2B37A0E912DDFC6334C",
    date: 588934160,
    hash: "0D5B0658C92E2F28FF6360AD8621D66F1F562F483C169D025548CA131A2677A7",
    inLedger: 10577588,
    ledger_index: 10577588
  },
  validated: true
}

const output7 = {
  date: 1535618960,
  hash: "0D5B0658C92E2F28FF6360AD8621D66F1F562F483C169D025548CA131A2677A7",
  type: "offernew",
  fee: "0.00001",
  result: "tesSUCCESS",
  memos: [],
  offertype: "buy",
  gets: {
    currency: "CNY",
    issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
    value: "0.4"
  },
  pays: {
    currency: "JJCC",
    issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
    value: "1"
  },
  seq: 4583,
  effects: []
}

const input8 = {
  meta: {
    AffectedNodes: [],
    TransactionIndex: 2,
    TransactionResult: "tesSUCCESS"
  },
  tx: {
    Account: testAddress,
    Fee: "10",
    Flags: 524288,
    Sequence: 4653,
    SigningPubKey:
      "030FC8DDB7C7CBB7E2D031B82D480C8B90692DCDF142B229CC18C544C09BD66FBE",
    TakerGets: {
      currency: "JMOAC",
      issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
      value: "2000"
    },
    TakerPays: {
      currency: "CNY",
      issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
      value: "80000"
    },
    TransactionType: "OfferCreate",
    TxnSignature:
      "304502210096928D82EDB2067F72E5BED86356BC6EF513BF6B5022E2FCBCD3FD890839BC4402205364BFF48FAAB90E25D5299D11CA2E01EECDF5554F091DE733C979168B4ADF4F",
    date: 590310500,
    hash: "3DDCE9C42466EF595A0F3DFF8B4BB8B75B5EB397C02B77DAE18C4721E48E10F0",
    inLedger: 10715222,
    ledger_index: 10715222
  },
  validated: true
}

const output8 = {
  date: 1536995300,
  hash: "3DDCE9C42466EF595A0F3DFF8B4BB8B75B5EB397C02B77DAE18C4721E48E10F0",
  type: "offernew",
  fee: "0.00001",
  result: "tesSUCCESS",
  memos: [],
  offertype: "sell",
  gets: {
    currency: "JMOAC",
    issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
    value: "2000"
  },
  pays: {
    currency: "CNY",
    issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
    value: "80000"
  },
  seq: 4653,
  effects: []
}

const input9 = {
  LimitAmount: "1",
  Amount: "7500000",
  Fee: "20",
  Flags: 0,
  Memos: [],
  RelationType: 3,
  Sequence: 1293,
  Account: testAddress,
  Target: "jwnqKpXJYJPeAnUdVUv3LfbxiJh5ZVXh78",
  SigningPubKey:
    "03B35A1F42C4A01BD3E79B8CA1BE1F05661375BF557F5EEACA8EF699669702DC54",
  Timestamp: 588967263,
  TransactionType: "RelationSet",
  TxnSignature:
    "3045022100F507E42104CD93D00B1429B7514D76E4FC058E993EF299CB4CC34E02482F3FAA022007636929A141D226C1615DACA9AD9E37B3D7A5041CA5226E5195366735BA481B",
  date: 588967270,
  hash: "D6010549B714C87F555557FF4D5A3654D0F3863F8556FBD3F4406BB9BB039D0A",
  inLedger: 10580899,
  ledger_index: 10580899
}

const output9 = {
  date: 1535652070,
  hash: "D6010549B714C87F555557FF4D5A3654D0F3863F8556FBD3F4406BB9BB039D0A",
  type: "relationset",
  fee: "0.00002",
  result: "failed",
  memos: [],
  counterparty: "jwnqKpXJYJPeAnUdVUv3LfbxiJh5ZVXh78",
  relationtype: "freeze",
  isactive: true,
  amount: {
    value: "0.000001",
    currency: "SWT",
    issuer: ""
  },
  effects: []
}

const input10 = {
  LimitAmount: "1",
  Amount: "7500000",
  Fee: "20",
  Flags: 0,
  Memos: [],
  RelationType: 2,
  Sequence: 1293,
  Account: testAddress,
  Target: testAddress,
  SigningPubKey:
    "03B35A1F42C4A01BD3E79B8CA1BE1F05661375BF557F5EEACA8EF699669702DC54",
  Timestamp: 588967263,
  TransactionType: "RelationSet",
  TxnSignature:
    "3045022100F507E42104CD93D00B1429B7514D76E4FC058E993EF299CB4CC34E02482F3FAA022007636929A141D226C1615DACA9AD9E37B3D7A5041CA5226E5195366735BA481B",
  date: 588967270,
  hash: "D6010549B714C87F555557FF4D5A3654D0F3863F8556FBD3F4406BB9BB039D0A",
  inLedger: 10580899,
  ledger_index: 10580899
}

const output10 = {
  date: 1535652070,
  hash: "D6010549B714C87F555557FF4D5A3654D0F3863F8556FBD3F4406BB9BB039D0A",
  type: "relationset",
  fee: "0.00002",
  result: "failed",
  memos: [],
  counterparty: testAddress,
  relationtype: "authorize",
  isactive: false,
  amount: {
    value: "0.000001",
    currency: "SWT",
    issuer: ""
  },
  effects: []
}

const input11 = {
  LimitAmount: "1",
  Amount: "7500000",
  Fee: "20",
  Flags: 0,
  Memos: [],
  RelationType: 3,
  Sequence: 1293,
  Account: testAddress,
  Target: "jwnqKpXJYJPeAnUdVUv3LfbxiJh5ZVXh78",
  SigningPubKey:
    "03B35A1F42C4A01BD3E79B8CA1BE1F05661375BF557F5EEACA8EF699669702DC54",
  Timestamp: 588967263,
  TransactionType: "RelationDel",
  TxnSignature:
    "3045022100F507E42104CD93D00B1429B7514D76E4FC058E993EF299CB4CC34E02482F3FAA022007636929A141D226C1615DACA9AD9E37B3D7A5041CA5226E5195366735BA481B",
  date: 588967270,
  hash: "D6010549B714C87F555557FF4D5A3654D0F3863F8556FBD3F4406BB9BB039D0A",
  inLedger: 10580899,
  ledger_index: 10580899
}

const output11 = {
  date: 1535652070,
  hash: "D6010549B714C87F555557FF4D5A3654D0F3863F8556FBD3F4406BB9BB039D0A",
  type: "relationdel",
  fee: "0.00002",
  result: "failed",
  memos: [],
  counterparty: "jwnqKpXJYJPeAnUdVUv3LfbxiJh5ZVXh78",
  relationtype: "unfreeze",
  isactive: true,
  amount: {
    value: "0.000001",
    currency: "SWT",
    issuer: ""
  },
  effects: []
}

const input12 = {
  LimitAmount: "1",
  Amount: "7500000",
  Fee: "20",
  Flags: 0,
  Memos: [],
  RelationType: 2,
  Sequence: 1293,
  Account: testAddress,
  Target: testAddress,
  SigningPubKey:
    "03B35A1F42C4A01BD3E79B8CA1BE1F05661375BF557F5EEACA8EF699669702DC54",
  Timestamp: 588967263,
  TransactionType: "RelationDel",
  TxnSignature:
    "3045022100F507E42104CD93D00B1429B7514D76E4FC058E993EF299CB4CC34E02482F3FAA022007636929A141D226C1615DACA9AD9E37B3D7A5041CA5226E5195366735BA481B",
  date: 588967270,
  hash: "D6010549B714C87F555557FF4D5A3654D0F3863F8556FBD3F4406BB9BB039D0A",
  inLedger: 10580899,
  ledger_index: 10580899
}

const output12 = {
  date: 1535652070,
  hash: "D6010549B714C87F555557FF4D5A3654D0F3863F8556FBD3F4406BB9BB039D0A",
  type: "relationdel",
  fee: "0.00002",
  result: "failed",
  memos: [],
  counterparty: testAddress,
  relationtype: "unknown",
  isactive: false,
  amount: {
    value: "0.000001",
    currency: "SWT",
    issuer: ""
  },
  effects: []
}

const input13 = {
  LimitAmount: "1",
  Amount: "7500000",
  Fee: "20",
  Flags: 0,
  Memos: [],
  RelationType: 2,
  Sequence: 1293,
  Account: testAddress,
  Target: testAddress,
  SigningPubKey:
    "03B35A1F42C4A01BD3E79B8CA1BE1F05661375BF557F5EEACA8EF699669702DC54",
  Timestamp: 588967263,
  TransactionType: "RelationDels",
  TxnSignature:
    "3045022100F507E42104CD93D00B1429B7514D76E4FC058E993EF299CB4CC34E02482F3FAA022007636929A141D226C1615DACA9AD9E37B3D7A5041CA5226E5195366735BA481B",
  date: 588967270,
  hash: "D6010549B714C87F555557FF4D5A3654D0F3863F8556FBD3F4406BB9BB039D0A",
  inLedger: 10580899,
  ledger_index: 10580899
}

const output13 = {
  date: 1535652070,
  hash: "D6010549B714C87F555557FF4D5A3654D0F3863F8556FBD3F4406BB9BB039D0A",
  type: "unknown",
  fee: "0.00002",
  result: "failed",
  memos: [],
  effects: []
}

const input14 = {
  Timestamp: 588967263,
  Account: testAddress,
  Fee: "20",
  TransactionType: "ConfigContract",
  date: 588967270,
  hash: "D6010549B714C87F555557FF4D5A3654D0F3863F8556FBD3F4406BB9BB039D0A",
  Method: 0,
  Payload: "11111"
}

const output14 = {
  date: 1535652070,
  hash: "D6010549B714C87F555557FF4D5A3654D0F3863F8556FBD3F4406BB9BB039D0A",
  type: "configcontract",
  fee: "0.00002",
  result: "failed",
  memos: [],
  params: [],
  method: "deploy",
  payload: "11111",
  effects: []
}

const input15 = {
  Timestamp: 588967263,
  TransactionType: "ConfigContract",
  Account: testAddress,
  Fee: "20",
  date: 588967270,
  hash: "D6010549B714C87F555557FF4D5A3654D0F3863F8556FBD3F4406BB9BB039D0A",
  Method: 1,
  Destination: "2222",
  Args: [
    {
      Arg: {
        Parameter: 111
      }
    }
  ]
}

const output15 = {
  date: 1535652070,
  hash: "D6010549B714C87F555557FF4D5A3654D0F3863F8556FBD3F4406BB9BB039D0A",
  type: "configcontract",
  fee: "0.00002",
  result: "failed",
  memos: [],
  params: [""],
  method: "call",
  destination: "2222",
  effects: []
}

const input16 = {
  Timestamp: 588967263,
  TransactionType: "ConfigContract",
  Account: testAddress,
  Fee: "20",
  date: 588967270,
  hash: "D6010549B714C87F555557FF4D5A3654D0F3863F8556FBD3F4406BB9BB039D0A",
  Destination: "2222",
  Args: [
    {
      Arg: {
        Parameter: 111
      }
    }
  ]
}

const output16 = {
  date: 1535652070,
  hash: "D6010549B714C87F555557FF4D5A3654D0F3863F8556FBD3F4406BB9BB039D0A",
  type: "configcontract",
  fee: "0.00002",
  result: "failed",
  memos: [],
  params: [""],
  effects: []
}

const input17 = {
  Account: "jHdWAmh8AAjhjqG7zEDA5RBgAnQHyd2g5m",
  Fee: "10",
  Flags: 524288,
  Memos: [
    {
      Memo: []
    }
  ],
  Sequence: 30454,
  SigningPubKey:
    "03701F8B681517BE6DE4321C5FB173328C4FA0677CAA72E91D069534675BD13C25",
  TakerGets: {
    currency: "JJCC",
    issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
    value: "1841"
  },
  TakerPays: "78688022000",
  Timestamp: 585665044,
  TransactionType: "OfferCreate",
  TxnSignature:
    "30440220550420FAC7979F4EBF3D8446A2928C553B26670F4A037DB978D20DDD2E52CEC102205B41C103C4537A2178BD2C7E1761A2D217682AE6DE5912A24106A14D6D6EE2BB",
  date: 585665050,
  hash: "283F3227B25AE2ADAC26C1C4019CAB34596901F758B80729A2CAC342376683C3",
  inLedger: 10250677,
  ledger_index: 10250677,
  meta: {
    AffectedNodes: [
      {
        ModifiedNode: {
          FinalFields: {
            Account: testAddress,
            Balance: "410469854621",
            Flags: 1010101,
            OwnerCount: 0,
            Sequence: 14845556,
            TakerGets: {
              currency: "CNY",
              issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
              value: "0.4"
            },
            TakerPays: {
              currency: "JJCC",
              issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
              value: "1"
            },
            OfferFeeRateNum: 10000,
            OfferFeeRateDen: 111111
          },
          LedgerEntryType: "Offer",
          LedgerIndex:
            "109E80FB8CC6D82D4F7F7D77248C2C3C116ECCD4520B3D2A88421FFF94A57B1E",
          PreviousFields: {
            Balance: "410469854611",
            Sequence: 14845555
          },
          PreviousTxnID:
            "8C62CDFD2ADD995337EF5AA77B4DA8C6DD1744BA38008140C68D82D41437E1D1",
          PreviousTxnLgrSeq: 10577923
        }
      },
      {
        ModifiedNode: {
          FinalFields: {
            Account: testAddress,
            Balance: "410469854621",
            Flags: 0,
            OwnerCount: 0,
            Sequence: 14845559
          },
          LedgerEntryType: "Offer",
          LedgerIndex:
            "109E80FB8CC6D82D4F7F7D77248C2C3C116ECCD4520B3D2A88421FFF94A57B1E",
          PreviousFields: {
            Balance: "410469854611",
            Sequence: 14845555
          },
          PreviousTxnID:
            "8C62CDFD2ADD995337EF5AA77B4DA8C6DD1744BA38008140C68D82D41437E1D1",
          PreviousTxnLgrSeq: 10577923
        }
      },
      {
        DeletedNode: {
          FinalFields: {
            Account: testAddress,
            BookDirectory:
              "EEDDF861497F1B773BEB9A16C0E0C8D77E93204DA28748EB5508E1BC9BF04000",
            BookNode: "0000000000000000",
            Flags: 0,
            OwnerNode: "0000000000000001",
            PreviousTxnID:
              "0D5B0658C92E2F28FF6360AD8621D66F1F562F483C169D025548CA131A2677A7",
            PreviousTxnLgrSeq: 10577588,
            Sequence: 4583,
            TakerGets: null,
            OfferFeeRateNum: 10000,
            TakerPays: 1000000
          },
          PreviousFields: {
            TakerGets: {
              currency: "CNY",
              issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
              value: "0.00001"
            }
          },
          LedgerEntryType: "Offer",
          LedgerIndex:
            "CA0AB136B2F40CDB81206518ADEEB7E9E93565E7FBD208785CAAE9009ECEAD7B"
        }
      }
    ],
    TransactionIndex: 3,
    TransactionResult: "tesSUCCESS"
  },
  validated: true
}

const input18 = {
  Account: "jHdWAmh8AAjhjqG7zEDA5RBgAnQHyd2g5m",
  Fee: "10",
  Flags: 524288,
  Memos: [
    {
      Memo: []
    }
  ],
  Sequence: 30454,
  SigningPubKey:
    "03701F8B681517BE6DE4321C5FB173328C4FA0677CAA72E91D069534675BD13C25",
  TakerGets: {
    currency: "JJCC",
    issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
    value: "1841"
  },
  TakerPays: "78688022000",
  Timestamp: 585665044,
  TransactionType: "OfferCreate",
  TxnSignature:
    "30440220550420FAC7979F4EBF3D8446A2928C553B26670F4A037DB978D20DDD2E52CEC102205B41C103C4537A2178BD2C7E1761A2D217682AE6DE5912A24106A14D6D6EE2BB",
  date: 585665050,
  hash: "283F3227B25AE2ADAC26C1C4019CAB34596901F758B80729A2CAC342376683C3",
  inLedger: 10250677,
  ledger_index: 10250677,
  meta: {
    AffectedNodes: [
      {
        CreatedNode: {
          LedgerEntryType: "Offer",
          LedgerIndex:
            "703733408780DC3344D48EFD5EE42D6095C93D37130C80E2B220A5CEE9770FDC",
          NewFields: {
            Account: testAddress,
            BookDirectory:
              "EEDDF861497F1B773BEB9A16C0E0C8D77E93204DA28748EB5508E1BC9BF04000",
            OwnerNode: "0000000000000001",
            Sequence: 4585,
            TakerGets: {
              currency: "CNY",
              issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
              value: "0.4"
            },
            TakerPays: {
              currency: "JJCC",
              issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
              value: "1"
            }
          }
        }
      },
      {
        CreatedNode: {
          LedgerEntryType: "Offer",
          LedgerIndex:
            "703733408780DC3344D48EFD5EE42D6095C93D37130C80E2B220A5CEE9770FDC",
          NewFields: {
            Account: testAddress,
            BookDirectory:
              "EEDDF861497F1B773BEB9A16C0E0C8D77E93204DA28748EB5508E1BC9BF04000",
            OwnerNode: "0000000000000001",
            Sequence: 4585,
            TakerGets: 42540000,
            Flags: 1010101,
            TakerPays: {
              currency: "JJCC",
              issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
              value: "1"
            }
          }
        }
      }
    ],
    TransactionIndex: 3,
    TransactionResult: "tesSUCCESS"
  },
  validated: true
}

const input19 = {
  Account: "jHdWAmh8AAjhjqG7zEDA5RBgAnQHyd2g5m",
  Fee: "10",
  Flags: 524288,
  Memos: [
    {
      Memo: []
    }
  ],
  Sequence: 30454,
  SigningPubKey:
    "03701F8B681517BE6DE4321C5FB173328C4FA0677CAA72E91D069534675BD13C25",
  TakerGets: {
    currency: "JJCC",
    issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
    value: "1841"
  },
  TakerPays: "78688022000",
  Timestamp: 585665044,
  TransactionType: "OfferCreate",
  TxnSignature:
    "30440220550420FAC7979F4EBF3D8446A2928C553B26670F4A037DB978D20DDD2E52CEC102205B41C103C4537A2178BD2C7E1761A2D217682AE6DE5912A24106A14D6D6EE2BB",
  date: 585665050,
  hash: "283F3227B25AE2ADAC26C1C4019CAB34596901F758B80729A2CAC342376683C3",
  inLedger: 10250677,
  ledger_index: 10250677,
  meta: {
    AffectedNodes: [
      {
        DeletedNode: {
          FinalFields: {
            Account: testAddress,
            BookDirectory:
              "EEDDF861497F1B773BEB9A16C0E0C8D77E93204DA28748EB5508E1BC9BF04000",
            BookNode: "0000000000000000",
            Flags: 1010101,
            OwnerNode: "0000000000000001",
            PreviousTxnID:
              "0D5B0658C92E2F28FF6360AD8621D66F1F562F483C169D025548CA131A2677A7",
            PreviousTxnLgrSeq: 10577588,
            Sequence: 4583,
            TakerGets: {
              currency: "JMOAC",
              issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
              value: "2000"
            },
            OfferFeeRateNum: 10000,
            TakerPays: {
              currency: "CNY",
              issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
              value: "80000"
            }
          },
          PreviousFields: {
            Balance: "410469854611",
            Sequence: 14845555,
            TakerPays: {
              currency: "CNY",
              issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
              value: "80000"
            }
          },
          LedgerEntryType: "Offer",
          LedgerIndex:
            "CA0AB136B2F40CDB81206518ADEEB7E9E93565E7FBD208785CAAE9009ECEAD7B"
        }
      },
      {
        DeletedNode: {
          FinalFields: {
            Account: testAddress,
            BookDirectory:
              "EEDDF861497F1B773BEB9A16C0E0C8D77E93204DA28748EB5508E1BC9BF04000",
            BookNode: "0000000000000000",
            Flags: 0,
            OwnerNode: "0000000000000001",
            PreviousTxnID:
              "0D5B0658C92E2F28FF6360AD8621D66F1F562F483C169D025548CA131A2677A7",
            PreviousTxnLgrSeq: 10577588,
            Sequence: 4583,
            TakerGets: {
              currency: "JMOAC",
              issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
              value: "2000"
            },
            TakerPays: {
              currency: "CNY",
              issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
              value: "80000"
            }
          },
          PreviousFields: {
            Balance: "410469854611",
            Sequence: 14845555,
            TakerPays: {
              currency: "CNY",
              issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
              value: "80000"
            }
          },
          LedgerEntryType: "Offer",
          LedgerIndex:
            "CA0AB136B2F40CDB81206518ADEEB7E9E93565E7FBD208785CAAE9009ECEAD7B"
        }
      }
    ],
    TransactionIndex: 3,
    TransactionResult: "tesSUCCESS"
  },
  validated: true
}

const input20 = {
  Account: "jHdWAmh8AAjhjqG7zEDA5RBgAnQHyd2g5m",
  Fee: "10",
  Flags: 524288,
  Memos: [
    {
      Memo: []
    }
  ],
  Sequence: 30454,
  SigningPubKey:
    "03701F8B681517BE6DE4321C5FB173328C4FA0677CAA72E91D069534675BD13C25",
  TakerGets: {
    currency: "JJCC",
    issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
    value: "1841"
  },
  TakerPays: "78688022000",
  Timestamp: 585665044,
  TransactionType: "OfferCreate",
  TxnSignature:
    "30440220550420FAC7979F4EBF3D8446A2928C553B26670F4A037DB978D20DDD2E52CEC102205B41C103C4537A2178BD2C7E1761A2D217682AE6DE5912A24106A14D6D6EE2BB",
  date: 585665050,
  hash: "283F3227B25AE2ADAC26C1C4019CAB34596901F758B80729A2CAC342376683C3",
  inLedger: 10250677,
  ledger_index: 10250677,
  meta: {
    AffectedNodes: [
      {
        DeletedNode: {
          FinalFields: {
            Account: testAddress,
            BookDirectory:
              "EEDDF861497F1B773BEB9A16C0E0C8D77E93204DA28748EB5508E1BC9BF04000",
            BookNode: "0000000000000000",
            Flags: 0,
            OwnerNode: "0000000000000001",
            PreviousTxnID:
              "0D5B0658C92E2F28FF6360AD8621D66F1F562F483C169D025548CA131A2677A7",
            PreviousTxnLgrSeq: 10577588,
            Sequence: 4583,
            TakerGets: {
              currency: "JMOAC",
              issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
              value: "2000"
            },
            TakerPays: {
              currency: "CNY",
              issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
              value: "80000"
            }
          },
          LedgerEntryType: "Offer",
          LedgerIndex:
            "CA0AB136B2F40CDB81206518ADEEB7E9E93565E7FBD208785CAAE9009ECEAD7B"
        }
      },
      {
        DeletedNode: {
          FinalFields: {
            Account: testAddress,
            BookDirectory:
              "EEDDF861497F1B773BEB9A16C0E0C8D77E93204DA28748EB5508E1BC9BF04000",
            BookNode: "0000000000000000",
            Flags: 1010101,
            OwnerNode: "0000000000000001",
            PreviousTxnID:
              "0D5B0658C92E2F28FF6360AD8621D66F1F562F483C169D025548CA131A2677A7",
            PreviousTxnLgrSeq: 10577588,
            Sequence: 4583,
            TakerGets: {
              currency: "JMOAC",
              issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
              value: "2000"
            },
            TakerPays: {
              currency: "CNY",
              issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
              value: "80000"
            }
          },
          LedgerEntryType: "Offer",
          LedgerIndex:
            "CA0AB136B2F40CDB81206518ADEEB7E9E93565E7FBD208785CAAE9009ECEAD7B"
        }
      }
    ],
    TransactionIndex: 3,
    TransactionResult: "tesSUCCESS"
  },
  validated: true
}

const input21 = {
  Account: testAddress,
  Fee: "10",
  Flags: 524288,
  Memos: [
    {
      Memo: []
    }
  ],
  Sequence: 30454,
  SigningPubKey:
    "03701F8B681517BE6DE4321C5FB173328C4FA0677CAA72E91D069534675BD13C25",
  TakerGets: {
    currency: "JJCC",
    issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
    value: "1841"
  },
  TakerPays: "78688022000",
  Timestamp: 585665044,
  TransactionType: "OfferCancel",
  TxnSignature:
    "30440220550420FAC7979F4EBF3D8446A2928C553B26670F4A037DB978D20DDD2E52CEC102205B41C103C4537A2178BD2C7E1761A2D217682AE6DE5912A24106A14D6D6EE2BB",
  date: 585665050,
  hash: "283F3227B25AE2ADAC26C1C4019CAB34596901F758B80729A2CAC342376683C3",
  inLedger: 10250677,
  ledger_index: 10250677,
  meta: {
    AffectedNodes: [
      {
        DeletedNode: {
          FinalFields: {
            Account: testAddress,
            BookDirectory:
              "EEDDF861497F1B773BEB9A16C0E0C8D77E93204DA28748EB5508E1BC9BF04000",
            BookNode: "0000000000000000",
            Flags: 1010101,
            OwnerNode: "0000000000000001",
            PreviousTxnID:
              "0D5B0658C92E2F28FF6360AD8621D66F1F562F483C169D025548CA131A2677A7",
            PreviousTxnLgrSeq: 10577588,
            Sequence: 4583,
            TakerGets: {
              currency: "JMOAC",
              issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
              value: "2000"
            },
            TakerPays: {
              currency: "CNY",
              issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
              value: "80000"
            }
          },
          LedgerEntryType: "Offer",
          LedgerIndex:
            "CA0AB136B2F40CDB81206518ADEEB7E9E93565E7FBD208785CAAE9009ECEAD7B"
        }
      }
    ],
    TransactionIndex: 3,
    TransactionResult: "tesSUCCESS"
  },
  validated: true
}
const input22 = {
  Account: testAddress,
  Fee: "10",
  Flags: 524288,
  Memos: [
    {
      Memo: []
    }
  ],
  Sequence: 30454,
  SigningPubKey:
    "03701F8B681517BE6DE4321C5FB173328C4FA0677CAA72E91D069534675BD13C25",
  TakerGets: {
    currency: "JJCC",
    issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
    value: "1841"
  },
  TakerPays: "78688022000",
  Timestamp: 585665044,
  TransactionType: "OfferCancel",
  TxnSignature:
    "30440220550420FAC7979F4EBF3D8446A2928C553B26670F4A037DB978D20DDD2E52CEC102205B41C103C4537A2178BD2C7E1761A2D217682AE6DE5912A24106A14D6D6EE2BB",
  date: 585665050,
  hash: "283F3227B25AE2ADAC26C1C4019CAB34596901F758B80729A2CAC342376683C3",
  inLedger: 10250677,
  ledger_index: 10250677,
  meta: {
    AffectedNodes: [
      {
        DeletedNode: {
          PreviousFields: {
            Balance: "410469854611",
            Sequence: 14845555,
            Account: "1010100101010010101010",
            TakerGets: {
              currency: "JMOAC",
              issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
              value: "2000"
            },
            TakerPays: {
              currency: "CNY",
              issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
              value: "80000"
            }
          },
          PreviousTxnID:
            "D6314BDE941C25CE66F26355A50D027146D1C4D4442CEA086A8C5CF206ADF67F",
          LedgerEntryType: "Offer",
          LedgerIndex:
            "CA0AB136B2F40CDB81206518ADEEB7E9E93565E7FBD208785CAAE9009ECEAD7B"
        }
      },
      {
        DeletedNode: {
          PreviousFields: {
            Balance: "410469854611",
            Sequence: 14845555,
            Account: "1010100101010010101010",
            TakerGets: {
              currency: "JMOAC",
              issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
              value: "2000"
            },
            PreviousTxnID:
              "D6314BDE941C25CE66F26355A50D027146D1C4D4442CEA086A8C5CF206ADF67F",
            Flags: 1010101,
            TakerPays: {
              currency: "CNY",
              issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
              value: "80000"
            }
          },
          LedgerEntryType: "Offer",
          LedgerIndex:
            "CA0AB136B2F40CDB81206518ADEEB7E9E93565E7FBD208785CAAE9009ECEAD7B"
        }
      },
      {
        DeletedNode: {
          PreviousFields: {
            Balance: "410469854611",
            Sequence: 14845555,
            Account: "1010100101010010101010",
            TakerGets: {
              currency: "JMOAC",
              issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
              value: "2000"
            },
            PreviousTxnID:
              "D6314BDE941C25CE66F26355A50D027146D1C4D4442CEA086A8C5CF206ADF67F",
            Flags: 1010101,
            TakerPays: {
              currency: "CNY",
              issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
              value: "80000"
            },
            OfferFeeRateNum: 10000,
            OfferFeeRateDen: 111111
          },
          LedgerEntryType: "Brokerage",
          LedgerIndex:
            "CA0AB136B2F40CDB81206518ADEEB7E9E93565E7FBD208785CAAE9009ECEAD7B"
        }
      }
    ],
    TransactionIndex: 3,
    TransactionResult: "tesSUCCESS"
  },
  validated: true
}

const input23 = {
  Account: "jHdWAmh8AAjhjqG7zEDA5RBgAnQHyd2g5m",
  Fee: "10",
  Flags: 524288,
  Memos: [
    {
      Memo: []
    }
  ],
  Sequence: 30454,
  SigningPubKey:
    "03701F8B681517BE6DE4321C5FB173328C4FA0677CAA72E91D069534675BD13C25",
  TakerGets: {
    currency: "JJCC",
    issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
    value: "1841"
  },
  TakerPays: "78688022000",
  Timestamp: 585665044,
  TransactionType: "OfferCreate",
  TxnSignature:
    "30440220550420FAC7979F4EBF3D8446A2928C553B26670F4A037DB978D20DDD2E52CEC102205B41C103C4537A2178BD2C7E1761A2D217682AE6DE5912A24106A14D6D6EE2BB",
  date: 585665050,
  hash: "283F3227B25AE2ADAC26C1C4019CAB34596901F758B80729A2CAC342376683C3",
  inLedger: 10250677,
  ledger_index: 10250677,
  meta: {
    AffectedNodes: [
      {
        ModifiedNode: {
          FinalFields: {
            Account: "jHdWAmh8AAjhjqG7zEDA5RBgAnQHyd2g5m",
            Balance: "153357491867924",
            Flags: 0,
            OwnerCount: 1077,
            Sequence: 30455,
            RegularKey: testAddress
          },
          LedgerEntryType: "AccountRoot",
          LedgerIndex:
            "0E5BAB543168C6458A36E99AD88A868C32218BC18E4796F5FB6EEDDA9A816165",
          PreviousFields: {
            Balance: "153274646867934",
            Sequence: 30454
          },
          PreviousTxnID:
            "D6314BDE941C25CE66F26355A50D027146D1C4D4442CEA086A8C5CF206ADF67F",
          PreviousTxnLgrSeq: 10250677
        }
      },
      {
        ModifiedNode: {
          FinalFields: [
            {
              Account: testAddress,
              BookDirectory:
                "EC6ECEC8051D20F4A03B1944C5FC468500B9459A04068FF94D07E5196E2AE38E",
              BookNode: "0000000000000000",
              Flags: 0,
              OwnerNode: "0000000000000001",
              Sequence: 4335,
              TakerGets: "154125000000",
              TakerPays: {
                currency: "JJCC",
                issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                value: "3425"
              }
            }
          ],
          LedgerEntryType: "Offer",
          LedgerIndex:
            "78E56FF59046ED314E455592AF62C998F0C1EFD12C867ECFAF40E294A9191A4B",
          PreviousFields: [
            {
              TakerGets: "236970000000",
              TakerPays: {
                currency: "JJCC",
                issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                value: "5266"
              }
            }
          ],
          PreviousTxnID:
            "D6314BDE941C25CE66F26355A50D027146D1C4D4442CEA086A8C5CF206ADF67F",
          PreviousTxnLgrSeq: 10250677
        }
      },
      {
        ModifiedNode: {
          FinalFields: [
            {
              Account: testAddress,
              Balance: "825746016645",
              Flags: 0,
              OwnerCount: 18,
              Sequence: 4336
            }
          ],
          LedgerEntryType: "AccountRoot",
          LedgerIndex:
            "89A83145155F38F60A58D6A6F1184291BBAD10DDC7018A4873E88BAC127C4F31",
          PreviousFields: [
            {
              Balance: "908591016645"
            }
          ],
          PreviousTxnID:
            "D6314BDE941C25CE66F26355A50D027146D1C4D4442CEA086A8C5CF206ADF67F",
          PreviousTxnLgrSeq: 10250677
        }
      },
      {
        ModifiedNodes: {
          FinalFields: [
            {
              Balance: {
                currency: "JJCC",
                issuer: "jjjjjjjjjjjjjjjjjjjjBZbvri",
                value: "40575"
              },
              Flags: 1114112,
              HighLimit: {
                currency: "JJCC",
                issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                value: "0"
              },
              HighNode: "0000000000001A27",
              LowLimit: {
                currency: "JJCC",
                issuer: testAddress,
                value: "10000000000"
              },
              LowNode: "0000000000000001"
            }
          ],
          LedgerEntryType: "SkywellState",
          LedgerIndex:
            "DD28F001E1CBEB8E02911176777684413D5C42DBEA92B800F48F8DAD6027CE5B",
          PreviousFields: [
            {
              Balance: {
                currency: "JJCC",
                issuer: "jjjjjjjjjjjjjjjjjjjjBZbvri",
                value: "38734"
              }
            }
          ],
          PreviousTxnID:
            "D6314BDE941C25CE66F26355A50D027146D1C4D4442CEA086A8C5CF206ADF67F",
          PreviousTxnLgrSeq: 10250677
        }
      }
    ],
    TransactionIndex: 3,
    TransactionResult: "tesSUCCESS"
  },
  validated: true
}

const output17 = {
  date: 1532349850,
  hash: "283F3227B25AE2ADAC26C1C4019CAB34596901F758B80729A2CAC342376683C3",
  type: "offereffect",
  fee: "0.00001",
  result: "tesSUCCESS",
  memos: [[]],
  effects: [
    {
      effect: "offer_partially_funded",
      counterparty: {
        account: "jHdWAmh8AAjhjqG7zEDA5RBgAnQHyd2g5m",
        seq: 30454,
        hash: "283F3227B25AE2ADAC26C1C4019CAB34596901F758B80729A2CAC342376683C3"
      },
      remaining: true,
      gets: {
        currency: "CNY",
        issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
        value: "0.4"
      },
      pays: {
        currency: "JJCC",
        issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
        value: "1"
      },
      got: {
        value: -0.9414062465075401,
        currency: "JJCC",
        issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or"
      },
      paid: {
        value: "-0.4",
        currency: "CNY",
        issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or"
      },
      type: "sold",
      rate: 0.05859375349245986,
      seq: 14845556,
      price: "2.5"
    },
    {
      effect: "offer_partially_funded",
      counterparty: {
        account: "jHdWAmh8AAjhjqG7zEDA5RBgAnQHyd2g5m",
        seq: 30454,
        hash: "283F3227B25AE2ADAC26C1C4019CAB34596901F758B80729A2CAC342376683C3"
      },
      remaining: true,
      gets: null,
      pays: null,
      got: null,
      paid: null,
      type: "bought",
      seq: 14845559
    },
    {
      effect: "offer_partially_funded",
      counterparty: {
        account: "jHdWAmh8AAjhjqG7zEDA5RBgAnQHyd2g5m",
        seq: 30454,
        hash: "283F3227B25AE2ADAC26C1C4019CAB34596901F758B80729A2CAC342376683C3"
      },
      cancelled: true,
      gets: null,
      pays: null,
      got: null,
      paid: {
        currency: "CNY",
        issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
        value: "0.00001"
      },
      type: "bought",
      rate: NaN,
      seq: 4583,
      deleted: true
    }
  ]
}

const output18 = {
  date: 1532349850,
  hash: "283F3227B25AE2ADAC26C1C4019CAB34596901F758B80729A2CAC342376683C3",
  type: "offereffect",
  fee: "0.00001",
  result: "tesSUCCESS",
  memos: [[]],
  effects: [
    {
      effect: "offer_created",
      gets: {
        currency: "CNY",
        issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
        value: "0.4"
      },
      pays: {
        currency: "JJCC",
        issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
        value: "1"
      },
      type: "buy",
      seq: 4585,
      price: "0.4"
    },
    {
      effect: "offer_created",
      gets: null,
      pays: {
        currency: "JJCC",
        issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
        value: "1"
      },
      type: "sell",
      seq: 4585
    }
  ]
}

const output19 = {
  date: 1532349850,
  hash: "283F3227B25AE2ADAC26C1C4019CAB34596901F758B80729A2CAC342376683C3",
  type: "offereffect",
  fee: "0.00001",
  result: "tesSUCCESS",
  memos: [[]],
  effects: [
    {
      effect: "offer_funded",
      counterparty: {
        account: "jHdWAmh8AAjhjqG7zEDA5RBgAnQHyd2g5m",
        seq: 30454,
        hash: "283F3227B25AE2ADAC26C1C4019CAB34596901F758B80729A2CAC342376683C3"
      },
      got: {
        value: "0",
        currency: "CNY",
        issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or"
      },
      paid: {
        value: "-2000",
        currency: "JMOAC",
        issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or"
      },
      type: "sold",
      rate: NaN,
      seq: 4583,
      price: "0",
      deleted: true
    },
    {
      effect: "offer_funded",
      counterparty: {
        account: "jHdWAmh8AAjhjqG7zEDA5RBgAnQHyd2g5m",
        seq: 30454,
        hash: "283F3227B25AE2ADAC26C1C4019CAB34596901F758B80729A2CAC342376683C3"
      },
      got: {
        value: "0",
        currency: "CNY",
        issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or"
      },
      paid: {
        value: "-2000",
        currency: "JMOAC",
        issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or"
      },
      type: "bought",
      seq: 4583,
      price: "-Infinity",
      deleted: true
    }
  ]
}

const output20 = {
  date: 1532349850,
  hash: "283F3227B25AE2ADAC26C1C4019CAB34596901F758B80729A2CAC342376683C3",
  type: "offereffect",
  fee: "0.00001",
  result: "tesSUCCESS",
  memos: [[]],
  effects: [
    {
      effect: "offer_cancelled",
      hash: "0D5B0658C92E2F28FF6360AD8621D66F1F562F483C169D025548CA131A2677A7",
      gets: {
        currency: "JMOAC",
        issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
        value: "2000"
      },
      pays: {
        currency: "CNY",
        issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
        value: "80000"
      },
      type: "buy",
      seq: 4583,
      price: "0.025",
      deleted: true
    },
    {
      effect: "offer_cancelled",
      hash: "0D5B0658C92E2F28FF6360AD8621D66F1F562F483C169D025548CA131A2677A7",
      gets: {
        currency: "JMOAC",
        issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
        value: "2000"
      },
      pays: {
        currency: "CNY",
        issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
        value: "80000"
      },
      type: "sell",
      seq: 4583,
      price: "40",
      deleted: true
    }
  ]
}

const output21 = {
  date: 1532349850,
  hash: "283F3227B25AE2ADAC26C1C4019CAB34596901F758B80729A2CAC342376683C3",
  type: "offercancel",
  fee: "0.00001",
  result: "tesSUCCESS",
  memos: [[]],
  offerseq: 30454,
  effects: [
    {
      effect: "offer_cancelled",
      hash: "0D5B0658C92E2F28FF6360AD8621D66F1F562F483C169D025548CA131A2677A7",
      gets: {
        currency: "JMOAC",
        issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
        value: "2000"
      },
      pays: {
        currency: "CNY",
        issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
        value: "80000"
      },
      type: "sell",
      seq: 4583,
      price: "40",
      deleted: true
    }
  ],
  gets: {
    currency: "JMOAC",
    issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
    value: "2000"
  },
  pays: {
    currency: "CNY",
    issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
    value: "80000"
  }
}

const output22 = {
  date: 1532349850,
  hash: "283F3227B25AE2ADAC26C1C4019CAB34596901F758B80729A2CAC342376683C3",
  type: "offercancel",
  fee: "0.00001",
  result: "tesSUCCESS",
  memos: [[]],
  offerseq: 30454,
  effects: [
    {
      effect: "offer_bought",
      counterparty: {
        account: "1010100101010010101010",
        seq: 14845555,
        hash: "D6314BDE941C25CE66F26355A50D027146D1C4D4442CEA086A8C5CF206ADF67F"
      },
      paid: {
        value: "0",
        currency: "CNY",
        issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or"
      },
      got: {
        value: 0,
        currency: "JMOAC",
        issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or"
      },
      type: "sold",
      price: "NaN",
      rate: 0.05859375349245986
    },
    {
      effect: "offer_bought",
      counterparty: {
        account: "1010100101010010101010",
        seq: 14845555,
        hash: "D6314BDE941C25CE66F26355A50D027146D1C4D4442CEA086A8C5CF206ADF67F"
      },
      paid: {
        value: "0",
        currency: "CNY",
        issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or"
      },
      got: {
        value: 0,
        currency: "JMOAC",
        issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or"
      },
      type: "bought",
      price: "NaN",
      rate: 0.05859375349245986
    }
  ]
}

const output23 = {
  date: 1532349850,
  hash: "283F3227B25AE2ADAC26C1C4019CAB34596901F758B80729A2CAC342376683C3",
  type: "offereffect",
  fee: "0.00001",
  result: "tesSUCCESS",
  memos: [[]],
  effects: [
    {
      effect: "set_regular_key",
      type: "null",
      account: "jHdWAmh8AAjhjqG7zEDA5RBgAnQHyd2g5m",
      regularkey: testAddress
    }
  ]
}

const input24 = {
  transaction: {
    Account: testAddress
  }
}

const input25 = {
  transaction: {
    Account: testAddress,
    Destination: testDestinationAddress,
    LimitAmount: {
      issuer: testDestinationAddress
    }
  },
  meta: {
    TransactionResult: "tesSUCCESS",
    AffectedNodes: [
      {
        ModifiedNode: {
          FinalFields: {
            Account: "jHdWAmh8AAjhjqG7zEDA5RBgAnQHyd2g5s"
          },
          LedgerEntryType: "AccountRoot"
        }
      },
      {
        ModifiedNode: {
          FinalFields: {
            HighLimit: {
              issuer: "jHdWAmh8AAjhjqG7zEDA5RBgAnQHyd2g5x"
            },
            LowLimit: {
              issuer: "jHdWAmh8AAjhjqG7zEDA5RBgAnQHyd2g5c"
            }
          },
          LedgerEntryType: "SkywellState"
        }
      },
      {
        ModifiedNode: {
          FinalFields: {
            HighLimit: {},
            LowLimit: {}
          },
          LedgerEntryType: "SkywellState"
        }
      },
      {
        ModifiedNode: {
          FinalFields: {
            Account: "jHdWAmh8AAjhjqG7zEDA5RBgAnQHyd2g5d"
          },
          LedgerEntryType: "Offer"
        }
      }
    ]
  }
}
const output24 = [testAddress]

const output25 = [
  testAddress,
  testDestinationAddress,
  "jHdWAmh8AAjhjqG7zEDA5RBgAnQHyd2g5s",
  "jHdWAmh8AAjhjqG7zEDA5RBgAnQHyd2g5x",
  "jHdWAmh8AAjhjqG7zEDA5RBgAnQHyd2g5c",
  "jHdWAmh8AAjhjqG7zEDA5RBgAnQHyd2g5d"
]

const input26 = {
  transaction: {},
  meta: {
    AffectedNodes: [
      {
        ModifiedNode: {
          FinalFields: {
            TakerGets: {
              currency: "CNY",
              issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
              value: "0.4"
            },
            TakerPays: {
              currency: "JJCC",
              issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
              value: "1"
            }
          },
          LedgerEntryType: "Offer"
        }
      },
      {
        ModifiedNode: {
          FinalFields: {
            TakerGets: {
              currency: "CNY",
              issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
              value: "0.4"
            },
            TakerPays: {
              currency: "JJCC",
              issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
              value: "1"
            }
          },
          LedgerEntryType: "Offers"
        }
      },
      {
        ModifiedNodes: {
          FinalFields: {
            TakerGets: {
              currency: "CNY",
              issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
              value: "0.4"
            },
            TakerPays: {
              currency: "JJCC",
              issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
              value: "1"
            }
          },
          LedgerEntryType: "Offers"
        }
      }
    ]
  }
}

const input27 = {
  transaction: {
    Flags: 1010101
  },
  meta: {
    AffectedNodes: [
      {
        ModifiedNode: {
          FinalFields: {
            TakerGets: {
              currency: "CNY",
              issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
              value: "0.4"
            },
            TakerPays: {
              currency: "JJCC",
              issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
              value: "1"
            }
          },
          LedgerEntryType: "Offer"
        }
      },
      {
        ModifiedNode: {
          FinalFields: {
            TakerGets: {
              currency: "CNY",
              issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
              value: "0.4"
            },
            TakerPays: {
              currency: "JJCC",
              issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
              value: "1"
            }
          },
          LedgerEntryType: "Offer"
        }
      },
      {
        ModifiedNode: {
          FinalFields: {
            TakerGets: "0.4",
            TakerPays: {
              currency: "JJCC",
              issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
              value: "1"
            }
          },
          LedgerEntryType: "Offer"
        }
      },
      {
        ModifiedNode: {
          FinalFields: {
            TakerGets: {
              currency: "CNY",
              issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
              value: "0.4"
            },
            TakerPays: "1"
          },
          LedgerEntryType: "Offer"
        }
      }
    ]
  }
}

const output26 = [
  "CNY/jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or:JJCC/jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or"
]

const output27 = [
  "JJCC/jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or:CNY/jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
  "JJCC/jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or:SWT",
  "SWT:CNY/jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or"
]

module.exports = {
  input1,
  input2,
  input3,
  input4,
  input5,
  output1,
  output2,
  output3,
  output4,
  output5,
  input6,
  output6,
  input7,
  output7,
  input8,
  output8,
  input9,
  output9,
  input10,
  output10,
  input11,
  output11,
  input12,
  output12,
  input13,
  output13,
  input14,
  input15,
  output14,
  output15,
  input16,
  output16,
  input17,
  input18,
  input19,
  input20,
  input21,
  input22,
  input23,
  output17,
  output18,
  output19,
  output20,
  output21,
  output22,
  output23,
  input24,
  input25,
  output24,
  output25,
  input26,
  input27,
  output26,
  output27
}
