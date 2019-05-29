let chains = ['swt', 'bwt'];

let msg = '';
for (let i = 0; i < 1000; ++i) {
    msg += 'x';
}

let data = {
    swt: {
        validSecret: 'sszWqvtbDzzMQEVWqGDSA5DbMYDBN',
        validAddress: 'jahbmVT3T9yf5D4Ykw8x6nRUtUfAAMzBRV',
        invalidSecrets: [null, undefined, '', 'xxxx', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'sszWqvtbDzzMQEVWqGDSA5DbMYDBNxx', 'zWqvtbDzzMQEVWqGDSA5DbMYDBN', 'sszWqvtbDzzMQEVWqGDSA5DbMYDBNsszWqvtbDzzMQEVWqGDSA5DbMYDBN'],
        invalidAddresses: [null, undefined, '', 'xxxx', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'jahbmVT3T9yf5D4Ykw8x6nRUtUfAAMzBRVxxx', 'ahbmVT3T9yf5D4Ykw8x6nRUtUfAAMzBRV', 'jahbmVT3T9yf5D4Ykw8x6nRUtUfAAMzBRVjahbmVT3T9yf5D4Ykw8x6nRUtUfAAMzBRV'],
        validMsgs: [{
            msg: 'hello',
            sign: '3045022100B53E6A54B71E44A4D449C76DECAE44169204744D639C14D22D941157F5A1418F02201D029783B31EE3DA88F18C56D055CF47606A9708FDCA9A42BAD9EFD335FA29FD'
        }, {
            msg,
            sign: '3045022100E9532A94BF33D4E094C0E0DA131B8BFB28D8275F0004341A5D76218C3134B40802201C8A32706AD5A719B21297B590D9AC52726C08773A65F54FD027C61ED65BCC77'
        }],
        invalidMsgs: [null, undefined, '']
    },
    bwt: {
        validSecret: 'ssySqG4BhxpngV2FjAe1SJYFD4dcm',
        validAddress: 'bMAy4Pu8CSf5apR44HbYyLFKeC9Dbau16Q',
        invalidSecrets: [null, undefined, '', 'xxxx', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'ssySqG4BhxpngV2FjAe1SJYFD4dcmxx', 'zWqvtbDzzMQEVWqGDSA5DbMYDBN', 'ssySqG4BhxpngV2FjAe1SJYFD4dcmssySqG4BhxpngV2FjAe1SJYFD4dcm'],
        invalidAddresses: [null, undefined, '', 'xxxx', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'bMAy4Pu8CSf5apR44HbYyLFKeC9Dbau16Qxxx', 'ahbmVT3T9yf5D4Ykw8x6nRUtUfAAMzBRV', 'bMAy4Pu8CSf5apR44HbYyLFKeC9Dbau16QbMAy4Pu8CSf5apR44HbYyLFKeC9Dbau16Q'],
        validMsgs: [{
            msg: 'hello',
            sign: '3045022100C016C3D333287F86C1FC1488A0177D2F58DC979507EAFE03D852415F17584BA7022042D3D55270BB74B012B7CE2DC0E2EC8B755F9547BA0901BB2FED6AC4A75523DA'
        }, {
            msg,
            sign: '304402203994192A21C9B78952F3F0CF27BA4428844B0052917304BA64F755E46F03E3ED022041FFA4132274F6F584C6484C5EEAEB9A7447AC4A1B96360CF5592766AE9F60CD'
        }],
        invalidMsgs: [null, undefined, '']
    }
}

module.exports = {
    chains,
    data
}