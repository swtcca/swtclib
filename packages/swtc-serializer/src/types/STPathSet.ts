import SerializedType from "./SerializedType"

const STPathSet = new SerializedType({
  typeBoundary: 0xff,
  typeEnd: 0x00,
  typeAccount: 0x01,
  typeCurrency: 0x10,
  typeIssuer: 0x20,
  id: 18,
  serialize(so, val) {
    for (let i = 0, l = val.length; i < l; i++) {
      // Boundary
      if (i) {
        this.STInt8.serialize(so, this.typeBoundary)
      }

      for (let j = 0, l2 = val[i].length; j < l2; j++) {
        const entry = val[i][j]
        // if (entry.hasOwnProperty('_value')) {entry = entry._value;}
        let type = 0

        if (entry.account) {
          type |= this.typeAccount
        }
        if (entry.currency) {
          type |= this.typeCurrency
        }
        if (entry.issuer) {
          type |= this.typeIssuer
        }

        this.STInt8.serialize(so, type)
        if (entry.account) {
          // so.append(UInt160.from_json(entry.account).to_bytes());
          so.append(this.KeyPair.convertAddressToBytes(entry.account))
        }

        if (entry.currency) {
          const currencyBytes = this.STCurrency.from_json_to_bytes(
            entry.currency,
            entry.non_native
          )
          so.append(currencyBytes)
        }

        if (entry.issuer) {
          // so.append(UInt160.from_json(entry.issuer).to_bytes());
          so.append(this.KeyPair.convertAddressToBytes(entry.issuer))
        }
      }
    }

    this.STInt8.serialize(so, this.typeEnd)
  },
  parse(so) {
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

    const path_list = []
    let current_path = []
    let tag_byte

    // tslint:disable-next-line
    while ((tag_byte = so.read(1)[0]) !== this.typeEnd) {
      // TODO: try/catch this loop, and catch when we run out of data without reaching the end of the data structure.
      // Now determine: is this an end, boundary, or entry-begin-tag?
      // console.log('Tag byte:', tag_byte);

      if (tag_byte === this.typeBoundary) {
        // console.log('Boundary');
        if (current_path) {
          // close the current path, if there is one,
          path_list.push(current_path)
        }
        current_path = [] // and start a new one.
        continue
      }

      // It's an entry-begin tag.
      // console.log('It's an entry-begin tag.');
      const entry: any = {}

      if (tag_byte & this.typeAccount) {
        // console.log('entry.account');
        /* const bta = so.read(20);
                          console.log('BTA:', bta); */
        entry.account = this.STHash160.parse(so)
        // entry.account.set_version(Base.VER_ACCOUNT_ID);
      }
      if (tag_byte & this.typeCurrency) {
        // console.log('entry.currency');
        entry.currency = this.STCurrency.parse(so)
        if (entry.currency !== "SWT") {
          entry.non_native = true
        }
      }
      if (tag_byte & this.typeIssuer) {
        // console.log('entry.issuer');
        entry.issuer = this.STHash160.parse(so)
        // Enable and set correct type of base-58 encoding
        // entry.issuer.set_version(Base.VER_ACCOUNT_ID);
        // console.log('DONE WITH ISSUER!');
      }

      if (entry.account || entry.currency || entry.issuer) {
        current_path.push(entry)
      } else {
        throw new Error("Invalid path entry") // It must have at least something in it.
      }
    }

    if (current_path) {
      // close the current path, if there is one,
      path_list.push(current_path)
    }

    return path_list
  }
})

export default STPathSet
