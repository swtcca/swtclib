const chai = require("chai")
const expect = chai.expect
const Serializer = require("../lib/Serializer").Factory()
const Wallet = require("swtc-wallet").Factory("jingtum")
const sign = (in_tx, secret) => {
  var wt = new Wallet(secret)
  in_tx.SigningPubKey = wt.getPublicKey()
  var prefix = 0x53545800
  var hash = Serializer.from_json(in_tx).hash(prefix)
  in_tx.TxnSignature = wt.signTx(hash)
  var so = Serializer.from_json(in_tx)
  var signature = so.to_hex()
  return {
    so,
    signature
  }
}

const serializer = signature => {
  const buf = Buffer.alloc(
    Buffer.byteLength(signature, "hex"),
    signature,
    "hex"
  )
  const arr = Array.prototype.slice.call(buf, 0)
  const data = new Serializer(buf).to_json()
  expect(data).to.deep.equal(new Serializer(signature).to_json())
  expect(data).to.deep.equal(new Serializer(arr).to_json())
  return data
}

describe("test signature", function() {
  it("when TransactionType is OfferCreate: buy jjcc with swt", function() {
    let data = {
      Account: "jpgWGpfHz8GxqUjz5nb6ej8eZJQtiF6KhH",
      Fee: "0.00001",
      Flags: 0,
      TakerGets: "1",
      TakerPays: {
        currency: "JJCC",
        issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
        value: "1"
      },
      TransactionType: "OfferCreate",
      Sequence: 1
    }
    let Sign = sign(data, "snfXQMEVbbZng84CcfdKDASFRi4Hf")
    let signature = Sign.signature
    let so = Sign.so
    expect(so.to_json()).to.deep.nested.include(data)
    expect(signature).to.equal(
      "1200072200000000240000000164D4838D7EA4C6800000000000000000000000004A4A43430000000000A582E432BFC48EEDEF852C814EC57F3CD2D415966540000000000F424068400000000000000A732102C13075B18C87A032226CE383AEFD748D7BB719E02CD7F5A8C1F2C7562DE7C12A744630440220316BEF2A5035F8E36CBB7B1844AC3EC7A673C4CD7DABF1A65EEB435EDB1526A90220736A99B7B5FF6A654B557B8BED2F5456D7CB179C0E3262B605E357D04903BB6381141270C5BE503A3A22B506457C0FEC97633B44F7DD"
    )
    data = {
      Account: "jpgWGpfHz8GxqUjz5nb6ej8eZJQtiF6KhH",
      Fee: "0.00001",
      Flags: 0,
      TakerGets: "1.1",
      TakerPays: {
        currency: "JJCC",
        issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
        value: "1"
      },
      TransactionType: "OfferCreate",
      Sequence: 1
    }
    Sign = sign(data, "snfXQMEVbbZng84CcfdKDASFRi4Hf")
    signature = Sign.signature
    so = Sign.so
    expect(serializer(signature)).to.deep.nested.include(data)
    expect(so.to_json()).to.deep.nested.include(data)
    expect(signature).to.equal(
      "1200072200000000240000000164D4838D7EA4C6800000000000000000000000004A4A43430000000000A582E432BFC48EEDEF852C814EC57F3CD2D4159665400000000010C8E068400000000000000A732102C13075B18C87A032226CE383AEFD748D7BB719E02CD7F5A8C1F2C7562DE7C12A74473045022100B36CD87BC6976D4140040515F4B1F89CB10FC59AB5604A0B1FE89304CF2E0961022035D214C9E669972A6D267DF801B2328D28DA9F4FE1008DEADCC97903DD4AEFB581141270C5BE503A3A22B506457C0FEC97633B44F7DD"
    )
  })

  it("when TransactionType is OfferCreate: buy jjcc with cny", function() {
    let data = {
      Account: "jpgWGpfHz8GxqUjz5nb6ej8eZJQtiF6KhH",
      Fee: "0.00001",
      Flags: 0,
      TakerGets: {
        currency: "CNY",
        issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
        value: "1"
      },
      TakerPays: {
        currency: "JJCC",
        issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
        value: "1"
      },
      TransactionType: "OfferCreate",
      Sequence: 1
    }
    let Sign = sign(data, "snfXQMEVbbZng84CcfdKDASFRi4Hf")
    let signature = Sign.signature
    let so = Sign.so
    expect(serializer(signature)).to.deep.nested.include(data)
    expect(so.to_json()).to.deep.nested.include(data)
    expect(signature).to.equal(
      "1200072200000000240000000164D4838D7EA4C6800000000000000000000000004A4A43430000000000A582E432BFC48EEDEF852C814EC57F3CD2D4159665D4838D7EA4C68000000000000000000000000000434E590000000000A582E432BFC48EEDEF852C814EC57F3CD2D4159668400000000000000A732102C13075B18C87A032226CE383AEFD748D7BB719E02CD7F5A8C1F2C7562DE7C12A74473045022100AB55D52FFBB6173564A243AD71DA87110A367F0F3A90C95EE895935FDCDE595C022076A0388A060F97AFED917A7E85B740BA7611FAE7464CDBBEA07C64D2246646F781141270C5BE503A3A22B506457C0FEC97633B44F7DD"
    )
    data = {
      Account: "jpgWGpfHz8GxqUjz5nb6ej8eZJQtiF6KhH",
      Fee: "0.00001",
      Flags: 0,
      TakerGets: {
        currency: "CNY",
        issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
        value: "1.1"
      },
      TakerPays: {
        currency: "JJCC",
        issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
        value: "1"
      },
      TransactionType: "OfferCreate",
      Sequence: 1
    }
    Sign = sign(data, "snfXQMEVbbZng84CcfdKDASFRi4Hf")
    signature = Sign.signature
    so = Sign.so
    expect(serializer(signature)).to.deep.nested.include(data)
    expect(so.to_json()).to.deep.nested.include(data)
    expect(signature).to.equal(
      "1200072200000000240000000164D4838D7EA4C6800000000000000000000000004A4A43430000000000A582E432BFC48EEDEF852C814EC57F3CD2D4159665D483E871B540C000000000000000000000000000434E590000000000A582E432BFC48EEDEF852C814EC57F3CD2D4159668400000000000000A732102C13075B18C87A032226CE383AEFD748D7BB719E02CD7F5A8C1F2C7562DE7C12A7446304402200B0EFD8900551EADCCEEC432AEAE5343B00F2654DD16DF3A380F7DE60D9E8EE70220304EB1CBAE1F9FE948E467528A39893D21576FFAA2D31469DB0E4704F668337A81141270C5BE503A3A22B506457C0FEC97633B44F7DD"
    )
  })

  it("when TransactionType is OfferCreate: sell jjcc with swt", function() {
    let data = {
      Account: "jpgWGpfHz8GxqUjz5nb6ej8eZJQtiF6KhH",
      Fee: "0.00001",
      Flags: 524288,
      TakerGets: {
        currency: "JJCC",
        issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
        value: "1"
      },
      TakerPays: "1",
      TransactionType: "OfferCreate",
      Sequence: 1
    }
    let Sign = sign(data, "snfXQMEVbbZng84CcfdKDASFRi4Hf")
    let signature = Sign.signature
    let so = Sign.so
    expect(serializer(signature)).to.deep.nested.include(data)
    expect(so.to_json()).to.deep.nested.include(data)
    expect(signature).to.equal(
      "120007220008000024000000016440000000000F424065D4838D7EA4C6800000000000000000000000004A4A43430000000000A582E432BFC48EEDEF852C814EC57F3CD2D4159668400000000000000A732102C13075B18C87A032226CE383AEFD748D7BB719E02CD7F5A8C1F2C7562DE7C12A744730450221009278D7D4F561A4B8F8901FC3153631BD532EDF06D24CFCE2767D95D2821721F702205E52C166E781A947E589A1463C5C24217AFC25FB2F9EFC5B5F12D776F8FC451481141270C5BE503A3A22B506457C0FEC97633B44F7DD"
    )
    data = {
      Account: "jpgWGpfHz8GxqUjz5nb6ej8eZJQtiF6KhH",
      Fee: "0.00001",
      Flags: 524288,
      TakerGets: {
        currency: "JJCC",
        issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
        value: "1"
      },
      TakerPays: "1.1",
      TransactionType: "OfferCreate",
      Sequence: 1
    }
    Sign = sign(data, "snfXQMEVbbZng84CcfdKDASFRi4Hf")
    signature = Sign.signature
    so = Sign.so
    expect(serializer(signature)).to.deep.nested.include(data)
    expect(so.to_json()).to.deep.nested.include(data)
    expect(signature).to.equal(
      "1200072200080000240000000164400000000010C8E065D4838D7EA4C6800000000000000000000000004A4A43430000000000A582E432BFC48EEDEF852C814EC57F3CD2D4159668400000000000000A732102C13075B18C87A032226CE383AEFD748D7BB719E02CD7F5A8C1F2C7562DE7C12A74463044022023A45DB73FFEE00E96D61BA556AE951E96AA1D98F9D68BA2423289A8F001D13C02207BBF76B35666940D043A5FD86BE3646CFCA768AFF808DECDC25F7D5C5A615F2881141270C5BE503A3A22B506457C0FEC97633B44F7DD"
    )
  })

  it("when TransactionType is OfferCreate: sell jjcc with cny", function() {
    let data = {
      Account: "jpgWGpfHz8GxqUjz5nb6ej8eZJQtiF6KhH",
      Fee: "0.00001",
      Flags: 524288,
      TakerGets: {
        currency: "JJCC",
        issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
        value: "1"
      },
      TakerPays: {
        currency: "CNY",
        issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
        value: "1"
      },
      TransactionType: "OfferCreate",
      Sequence: 1
    }
    let Sign = sign(data, "snfXQMEVbbZng84CcfdKDASFRi4Hf")
    let signature = Sign.signature
    let so = Sign.so
    expect(serializer(signature)).to.deep.nested.include(data)
    expect(so.to_json()).to.deep.nested.include(data)
    expect(signature).to.equal(
      "1200072200080000240000000164D4838D7EA4C68000000000000000000000000000434E590000000000A582E432BFC48EEDEF852C814EC57F3CD2D4159665D4838D7EA4C6800000000000000000000000004A4A43430000000000A582E432BFC48EEDEF852C814EC57F3CD2D4159668400000000000000A732102C13075B18C87A032226CE383AEFD748D7BB719E02CD7F5A8C1F2C7562DE7C12A74473045022100F6B87D5F5797A7BD36E78565702D86AE0D4E86F4A9B2A8562DDCEAC1DDCEEFE2022077713A46E987213D3DFD63C2E31E879E7ADA3F9521B67F907120D640898AEB6F81141270C5BE503A3A22B506457C0FEC97633B44F7DD"
    )
    data = {
      Account: "jpgWGpfHz8GxqUjz5nb6ej8eZJQtiF6KhH",
      Fee: "0.00001",
      Flags: 524288,
      TakerGets: {
        currency: "JJCC",
        issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
        value: "1"
      },
      TakerPays: {
        currency: "CNY",
        issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
        value: "1.1"
      },
      TransactionType: "OfferCreate",
      Sequence: 1
    }
    Sign = sign(data, "snfXQMEVbbZng84CcfdKDASFRi4Hf")
    signature = Sign.signature
    so = Sign.so
    expect(serializer(signature)).to.deep.nested.include(data)
    expect(so.to_json()).to.deep.nested.include(data)
    expect(signature).to.equal(
      "1200072200080000240000000164D483E871B540C000000000000000000000000000434E590000000000A582E432BFC48EEDEF852C814EC57F3CD2D4159665D4838D7EA4C6800000000000000000000000004A4A43430000000000A582E432BFC48EEDEF852C814EC57F3CD2D4159668400000000000000A732102C13075B18C87A032226CE383AEFD748D7BB719E02CD7F5A8C1F2C7562DE7C12A74463044022011282EEB5A0144E919BEC41DB7D28D47EC89F55C4890402C1E41FC6F3B0D542A02205CA75473478A250F474F66428B01FFFD3353CDBDD6575825EBA87DC4A1418E4681141270C5BE503A3A22B506457C0FEC97633B44F7DD"
    )
  })

  it("when TransactionType is OfferCancel", function() {
    let data = {
      Account: "jpgWGpfHz8GxqUjz5nb6ej8eZJQtiF6KhH",
      Fee: "0.00001",
      Flags: 0,
      OfferSequence: 0,
      TransactionType: "OfferCancel",
      Sequence: 1
    }
    let Sign = sign(data, "snfXQMEVbbZng84CcfdKDASFRi4Hf")
    let signature = Sign.signature
    let so = Sign.so
    expect(serializer(signature)).to.deep.nested.include(data)
    expect(so.to_json()).to.deep.nested.include(data)
    expect(signature).to.equal(
      "1200082200000000240000000120190000000068400000000000000A732102C13075B18C87A032226CE383AEFD748D7BB719E02CD7F5A8C1F2C7562DE7C12A74473045022100A050FB9E25C966875797F32649992D3EC2398155C0D7342C404F4A783F432EDC02201B7B72BE481679CD645E2401D39D9844FDEAB31781D655FE75008D733EDF7EB981141270C5BE503A3A22B506457C0FEC97633B44F7DD"
    )
  })

  it("when TransactionType is TrustSet", function() {
    let data = {
      TransactionType: "TrustSet",
      LimitAmount: "1",
      Account: "jpgWGpfHz8GxqUjz5nb6ej8eZJQtiF6KhH",
      QualityIn: 1,
      QualityOut: 1,
      Sequence: 1
    }
    let Sign = sign(data, "snfXQMEVbbZng84CcfdKDASFRi4Hf")
    let signature = Sign.signature
    let so = Sign.so
    expect(serializer(signature)).to.deep.nested.include(data)
    expect(so.to_json()).to.deep.nested.include(data)
    expect(signature).to.equal(
      "12001424000000012014000000012015000000016340000000000F4240732102C13075B18C87A032226CE383AEFD748D7BB719E02CD7F5A8C1F2C7562DE7C12A7446304402201AAC984859CE2108D9E8A301D26A729D94784AA80F375F924080013938B7964902206AB8BF030FAA4929C0BE4B853848CE47181217EC3DCD1EA77F53267AEE83E91081141270C5BE503A3A22B506457C0FEC97633B44F7DD"
    )
  })

  it("when TransactionType is RelationDel", function() {
    let data = {
      TransactionType: "RelationDel",
      LimitAmount: "1",
      Account: "jpgWGpfHz8GxqUjz5nb6ej8eZJQtiF6KhH",
      Target: "jPwdXkgPghbrdSRrajcJw5edDv1tohKmW7",
      RelationType: 1,
      Sequence: 1
    }
    let Sign = sign(data, "snfXQMEVbbZng84CcfdKDASFRi4Hf")
    let signature = Sign.signature
    let so = Sign.so
    expect(serializer(signature)).to.deep.nested.include(data)
    expect(so.to_json()).to.deep.nested.include(data)
    expect(signature).to.equal(
      "12001624000000012023000000016340000000000F4240732102C13075B18C87A032226CE383AEFD748D7BB719E02CD7F5A8C1F2C7562DE7C12A74473045022100DDA0DBAB870D8456EC7CE64F1A3D618733D860CE740C784FDEEC783D4FF6E74E0220685C94F8C62512F8BA38860CB6C66DC3C02D0118D8D224F7E4A6F12AE430715181141270C5BE503A3A22B506457C0FEC97633B44F7DD8714F325013A4E7EEA8BB68D9C58BAFC98D4175F2BC1"
    )
  })

  it("when TransactionType is RelationSet", function() {
    let data = {
      TransactionType: "RelationSet",
      LimitAmount: "1",
      Account: "jpgWGpfHz8GxqUjz5nb6ej8eZJQtiF6KhH",
      Target: "jPwdXkgPghbrdSRrajcJw5edDv1tohKmW7",
      RelationType: 3,
      Sequence: 1
    }
    let Sign = sign(data, "snfXQMEVbbZng84CcfdKDASFRi4Hf")
    let signature = Sign.signature
    let so = Sign.so
    expect(serializer(signature)).to.deep.nested.include(data)
    expect(so.to_json()).to.deep.nested.include(data)
    expect(signature).to.equal(
      "12001524000000012023000000036340000000000F4240732102C13075B18C87A032226CE383AEFD748D7BB719E02CD7F5A8C1F2C7562DE7C12A74473045022100FDAD81C89CA136ACE8A3EA6D6F8174A72178330DE26B3EEAEBB108FB40ED81AF022054EC3C9FF74B66EB645565A657C5211D749801F1EE3E13301B4F4A147EB1DFF781141270C5BE503A3A22B506457C0FEC97633B44F7DD8714F325013A4E7EEA8BB68D9C58BAFC98D4175F2BC1"
    )
  })

  it("when TransactionType is SetRegularKey", function() {
    let data = {
      TransactionType: "SetRegularKey",
      Account: "jpgWGpfHz8GxqUjz5nb6ej8eZJQtiF6KhH",
      RegularKey: "jPwdXkgPghbrdSRrajcJw5edDv1tohKmW7",
      Sequence: 1
    }
    let Sign = sign(data, "snfXQMEVbbZng84CcfdKDASFRi4Hf")
    let signature = Sign.signature
    let so = Sign.so
    expect(serializer(signature)).to.deep.nested.include(data)
    expect(so.to_json()).to.deep.nested.include(data)
    expect(signature).to.equal(
      "1200052400000001732102C13075B18C87A032226CE383AEFD748D7BB719E02CD7F5A8C1F2C7562DE7C12A74463044022013283ECD607AEF4C41EB7F40F89F456428BEB6D8450AA9F583E683F0A785C399022042708BC474A3CC13A2BBBE3E4266D978B3220B229F3859F3A1BE6A25E08824ED81141270C5BE503A3A22B506457C0FEC97633B44F7DD8814F325013A4E7EEA8BB68D9C58BAFC98D4175F2BC1"
    )
  })

  it("when TransactionType is ConfigContract", function() {
    let data = {
      Account: "jpgWGpfHz8GxqUjz5nb6ej8eZJQtiF6KhH",
      Args: [
        {
          Arg: {
            Parameter:
              "3DB4C3DAED80A0215352F8ABF120BA3C77A67030AB4FE18E976C2415BA88EFBC"
          }
        }
      ],
      Payload:
        "726573756C743D7B7D3B2066756E6374696F6E20496E697428742920726573756C743D73634765744163636F756E7442616C616E63652874292072657475726E20726573756C7420656E643B2066756E6374696F6E20666F6F28742920726573756C743D73634765744163636F756E7442616C616E63652874292072657475726E20726573756C7420656E64",
      Method: 0,
      TransactionType: "ConfigContract",
      Amount: "10000000",
      Sequence: 1
    }
    let Sign = sign(data, "snfXQMEVbbZng84CcfdKDASFRi4Hf")
    let signature = Sign.signature
    let so = Sign.so
    expect(serializer(signature)).to.deep.nested.include(data)
    expect(so.to_json()).to.deep.nested.include(data)
    expect(signature).to.equal(
      "12001E240000000120240000000061400009184E72A000732102C13075B18C87A032226CE383AEFD748D7BB719E02CD7F5A8C1F2C7562DE7C12A74473045022100C6BEC24AA594D25F301652B80599A2740C4382C04A2DEB6401A095DC245736D7022053E2CA8A2473A6D74E589643351B88D5B58FF1775C7920ECEF82C01A4DC4334B7F8C726573756C743D7B7D3B2066756E6374696F6E20496E697428742920726573756C743D73634765744163636F756E7442616C616E63652874292072657475726E20726573756C7420656E643B2066756E6374696F6E20666F6F28742920726573756C743D73634765744163636F756E7442616C616E63652874292072657475726E20726573756C7420656E6481141270C5BE503A3A22B506457C0FEC97633B44F7DDFAEB7012203DB4C3DAED80A0215352F8ABF120BA3C77A67030AB4FE18E976C2415BA88EFBCE1F1"
    )
  })

  it("when TransactionType is Payment: transfer jjcc", function() {
    let data = {
      Account: "jpgWGpfHz8GxqUjz5nb6ej8eZJQtiF6KhH",
      Amount: {
        currency: "820000000F000020170017000000000020000001",
        issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
        value: "1"
      },
      Destination: "jPwdXkgPghbrdSRrajcJw5edDv1tohKmW7",
      Fee: "0.00001",
      Flags: 0,
      Memos: [
        {
          Memo: {
            MemoData: "memo"
          }
        },
        {
          Memo: {
            MemoType: "number"
          }
        },
        {
          Memo: {
            MemoData:
              "E08F9A595F9FCF47B912A08737BD2107E95FE4F1F7714524C7A1E2F3125DE6AC",
            MemoFormat: "hex"
          }
        },
        {
          Memo: {
            MemoData: { data: "test" },
            MemoFormat: "json"
          }
        }
      ],
      TransactionType: "Payment",
      Sequence: 1
    }
    var { signature, so } = sign(data, "snfXQMEVbbZng84CcfdKDASFRi4Hf")
    expect(so.to_json()).to.deep.nested.include(
      Object.assign(data, {
        Memos: [
          { Memo: { MemoData: "6D656D6F", parsed_memo_data: "memo" } },
          { Memo: { MemoType: "6E756D626572", parsed_memo_type: "number" } },
          {
            Memo: {
              MemoData:
                "E08F9A595F9FCF47B912A08737BD2107E95FE4F1F7714524C7A1E2F3125DE6AC",
              MemoFormat: "686578",
              parsed_memo_format: "hex",
              parsed_memo_data:
                "E08F9A595F9FCF47B912A08737BD2107E95FE4F1F7714524C7A1E2F3125DE6AC"
            }
          },
          {
            Memo: {
              MemoData: "7B2264617461223A2274657374227D",
              MemoFormat: "6A736F6E",
              parsed_memo_format: "json",
              parsed_memo_data: { data: "test" }
            }
          }
        ]
      })
    )
    expect(serializer(signature)).to.deep.nested.include(
      Object.assign(data, {
        Memos: [
          { Memo: { MemoData: "6D656D6F", parsed_memo_data: "memo" } },
          { Memo: { MemoType: "6E756D626572", parsed_memo_type: "number" } },
          {
            Memo: {
              MemoData:
                "E08F9A595F9FCF47B912A08737BD2107E95FE4F1F7714524C7A1E2F3125DE6AC",
              MemoFormat: "686578",
              parsed_memo_format: "hex",
              parsed_memo_data:
                "E08F9A595F9FCF47B912A08737BD2107E95FE4F1F7714524C7A1E2F3125DE6AC"
            }
          },
          {
            Memo: {
              MemoData: "7B2264617461223A2274657374227D",
              MemoFormat: "6A736F6E",
              parsed_memo_format: "json",
              parsed_memo_data: { data: "test" }
            }
          }
        ]
      })
    )
    expect(signature).to.equal(
      "1200002200000000240000000161D4838D7EA4C68000820000000F000020170017000000000020000001A582E432BFC48EEDEF852C814EC57F3CD2D4159668400000000000000A732102C13075B18C87A032226CE383AEFD748D7BB719E02CD7F5A8C1F2C7562DE7C12A74463044022058C86A0A6077D8743BA62F674ACCEF54AEF2D6EC90242F0E8811FBF67A355C7E02206C0FF584BB214178272D902D04FCA72D2BC5BD6ACB9EC5A6EC6CC3D39581D1CB81141270C5BE503A3A22B506457C0FEC97633B44F7DD8314F325013A4E7EEA8BB68D9C58BAFC98D4175F2BC1F9EA7D046D656D6FE1EA7C066E756D626572E1EA7D20E08F9A595F9FCF47B912A08737BD2107E95FE4F1F7714524C7A1E2F3125DE6AC7E03686578E1EA7D0F7B2264617461223A2274657374227D7E046A736F6EE1F1"
    )
    data = {
      Account: "jpgWGpfHz8GxqUjz5nb6ej8eZJQtiF6KhH",
      Amount: {
        currency: "JJCC",
        issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
        value: "1.1"
      },
      Paths: [
        [
          {
            account: "jpgWGpfHz8GxqUjz5nb6ej8eZJQtiF6KhH",
            currency: "820000000F000020170017000000000020000001",
            issuer: "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
            non_native: true
          },
          {
            account: "jpgWGpfHz8GxqUjz5nb6ej8eZJQtiF6KhH",
            currency: "SWT"
          }
        ]
      ],
      Destination: "jPwdXkgPghbrdSRrajcJw5edDv1tohKmW7",
      Fee: "0.00001",
      Flags: 0,
      TransactionType: "Payment",
      Sequence: 1
    }
    var { signature, so } = sign(data, "snfXQMEVbbZng84CcfdKDASFRi4Hf")
    expect(so.to_json()).to.deep.nested.include(data)
    expect(serializer(signature)).to.deep.nested.include(data)
    expect(signature).to.equal(
      "1200002200000000240000000161D483E871B540C00000000000000000000000004A4A43430000000000A582E432BFC48EEDEF852C814EC57F3CD2D4159668400000000000000A732102C13075B18C87A032226CE383AEFD748D7BB719E02CD7F5A8C1F2C7562DE7C12A7446304402201A6DFAC5A31440C5364D9695414E844FE85ACF3088F6A2ABE6AFDC3C3F32012C02205CD6FBE4E20A94BC6C7F0CF4A74B101A5DF45FC5F2E35E4C0E64AC1DC6DC457581141270C5BE503A3A22B506457C0FEC97633B44F7DD8314F325013A4E7EEA8BB68D9C58BAFC98D4175F2BC10112311270C5BE503A3A22B506457C0FEC97633B44F7DD820000000F000020170017000000000020000001A582E432BFC48EEDEF852C814EC57F3CD2D41596111270C5BE503A3A22B506457C0FEC97633B44F7DD000000000000000000000000535754000000000000"
    )
  })

  it("when LedgerHashes", function() {
    let data = {
      LedgerEntryType: "LedgerHashes",
      Flags: 0,
      Indexes: [""]
    }
    let Sign = sign(data, "snfXQMEVbbZng84CcfdKDASFRi4Hf")
    let signature = Sign.signature
    let so = Sign.so
    expect(so.to_json()).to.deep.nested.include(
      Object.assign(data, { Indexes: [] })
    )
    expect(serializer(signature)).to.deep.nested.include(
      Object.assign(data, { Indexes: [] })
    )
    expect(signature).to.equal(
      "1100682200000000732102C13075B18C87A032226CE383AEFD748D7BB719E02CD7F5A8C1F2C7562DE7C12A74473045022100F2DA78182CB3BED71A41F803EAF7EDEACDFCAD0324BF022D01C39F94E3CDEF7602207BABD52A67A561F37F682FBF1A20A4F85375FACF215814BA7F9106DB61D53785011300"
    )
  })

  it("when TransactionType is Payment: transfer swt", function() {
    let data = {
      Account: "jpgWGpfHz8GxqUjz5nb6ej8eZJQtiF6KhH",
      Amount: "1",
      Destination: "jPwdXkgPghbrdSRrajcJw5edDv1tohKmW7",
      Fee: "0.00001",
      BaseFee: "1",
      Flags: 0,
      TransactionType: "Payment",
      Sequence: 1
    }
    let Sign = sign(data, "snfXQMEVbbZng84CcfdKDASFRi4Hf")
    let signature = Sign.signature
    let so = Sign.so
    expect(so.to_json()).to.deep.nested.include(data)
    expect(serializer(signature)).to.deep.nested.include(data)
    expect(signature).to.equal(
      "120000220000000024000000013500000000000000016140000000000F424068400000000000000A732102C13075B18C87A032226CE383AEFD748D7BB719E02CD7F5A8C1F2C7562DE7C12A74473045022100EC974CC354344E8CC918BE35099756B48C68E888ABF1B313ABB1DAA6563AC5D60220118594D35B8694DC3B8152F8AD68F1CE3F0F1AB626AA00EFDE8D3D503A56C3F081141270C5BE503A3A22B506457C0FEC97633B44F7DD8314F325013A4E7EEA8BB68D9C58BAFC98D4175F2BC1"
    )
    data = {
      Account: "jpgWGpfHz8GxqUjz5nb6ej8eZJQtiF6KhH",
      Amount: "1.1",
      Destination: "jPwdXkgPghbrdSRrajcJw5edDv1tohKmW7",
      Fee: "0.00001",
      Flags: 0,
      Memos: [
        { Memo: { MemoData: "memo", MemoType: "string" } },
        { Memo: { MemoData: "test", MemoType: "string" } }
      ],
      TransactionType: "Payment",
      Sequence: 1
    }
    Sign = sign(data, "snfXQMEVbbZng84CcfdKDASFRi4Hf")
    signature = Sign.signature
    expect(signature).to.equal(
      "1200002200000000240000000161400000000010C8E068400000000000000A732102C13075B18C87A032226CE383AEFD748D7BB719E02CD7F5A8C1F2C7562DE7C12A74463044022034F9AD3CD390B8C4A54E94337E7F539B7DF6AAD84E248A784B35419095BFA4FF022009B09336B41037F381BCC9518FC6D380F399B4DC368D251863F401D681C0B30981141270C5BE503A3A22B506457C0FEC97633B44F7DD8314F325013A4E7EEA8BB68D9C58BAFC98D4175F2BC1F9EA7C06737472696E677D046D656D6FE1EA7C06737472696E677D0474657374E1F1"
    )
  })

  it("when LedgerHashes", function() {
    let data = {
      LedgerEntryType: "DirectoryNode",
      RootIndex: "ECB2566AC95B",
      Indexes: [],
      TakerGetsIssuer: "a"
    }
    let { signature } = sign(data, "snfXQMEVbbZng84CcfdKDASFRi4Hf")
    expect(signature).to.equal(
      "11006458ECB2566AC95B732102C13075B18C87A032226CE383AEFD748D7BB719E02CD7F5A8C1F2C7562DE7C12A7446304402207E62081D9A1593CDF31F06424B1CD2005C37DD7998C1162FB98ABFA382B2B6520220707EC3E173F649B89FF819FEACB93D9962BD17DB41E56C8A0E4A54F290FE57E0041116000113"
    )
  })

  it("when TransactionType is Brokerage", function() {
    let data = {
      Account: "jpgWGpfHz8GxqUjz5nb6ej8eZJQtiF6KhH",
      OfferFeeRateNum: 10,
      OfferFeeRateDen: 20,
      AppType: 1,
      TransactionType: "Brokerage",
      Amount: 1,
      Sequence: 1
    }
    let Sign = sign(data, "snfXQMEVbbZng84CcfdKDASFRi4Hf")
    let signature = Sign.signature
    expect(signature).to.equal(
      "1200CD240000000120250000000139000000000000000A3A00000000000000146140000000000F4240732102C13075B18C87A032226CE383AEFD748D7BB719E02CD7F5A8C1F2C7562DE7C12A74463044022048CF9CAD4B5D2AA59E0290AB4A2AE246DA5CAF42697A9BC0B1F7ECCE346C3295022043C05C0D181138F9AE270CD7B119E95711850B6A6653CBB1F6ADF42F16CF6EBB81141270C5BE503A3A22B506457C0FEC97633B44F7DD"
    )
  })

  it("when TransactionType is AccountSet", function() {
    let data = {
      TransactionType: "AccountSet",
      Account: "jpgWGpfHz8GxqUjz5nb6ej8eZJQtiF6KhH",
      Sequence: 1,
      EmailHash: "429122535EB8C905D4B00DD650AB1B33"
    }
    let Sign = sign(data, "snfXQMEVbbZng84CcfdKDASFRi4Hf")
    let signature = Sign.signature
    let so = Sign.so
    expect(signature).to.equal(
      "120003240000000141429122535EB8C905D4B00DD650AB1B33732102C13075B18C87A032226CE383AEFD748D7BB719E02CD7F5A8C1F2C7562DE7C12A7446304402204273F25DF53826272A7808684B39EE165B163E3C36B6D701D37A97492EF1604B02205561F949DAFBAC2386299F67E445A95C612AC5C6EF35FDB165E3B73D2CB322BE81141270C5BE503A3A22B506457C0FEC97633B44F7DD"
    )
    expect(so.to_json()).to.nested.include(data)
    expect(serializer(signature)).to.deep.nested.include(data)
  })
})
