const SERVER_INFO_SCHEMA = {
    title: 'test response of server info',
    type: 'object',
    required: ['complete_ledgers', 'ledger', 'public_key', 'state', 'peers', 'version'],
    properties: {
        complete_ledgers: {
            type: 'string'
        },
        ledger: {
            type: 'string'
        },
        public_key: {
            type: 'string'
        },
        state: {
            type: 'string'
        },
        version: {
            type: 'string'
        },
        peers: {
            type: 'number'
        }
    }
}

const LEDGER_CLOSED_SCHEMA = {
    title: 'test response of ledger closed',
    type: 'object',
    required: ['ledger_hash', 'ledger_index'],
    properties: {
        ledger_hash: {
            type: 'string'
        },
        ledger_index: {
            type: 'number'
        }
    }
}

const LEDGER_SCHEMA = {
    title: 'test response of ledger',
    type: 'object',
    required: ['accepted', 'ledger_hash', 'ledger_index', 'parent_hash', 'close_time', 'total_coins'],
    properties: {
        accepted: {
            type: 'boolean'
        },
        ledger_hash: {
            type: 'string'
        },
        ledger_index: {
            type: 'string'
        },
        parent_hash: {
            type: 'string'
        },
        total_coins: {
            type: 'string'
        }
    }
}

const TX_SCHEMA = {
    title: 'test response of tx',
    type: 'object',
    required: ['Account', 'Fee', 'Flags', 'Sequence', 'SigningPubKey', 'TransactionType', 'TxnSignature', 'date', 'hash', 'inLedger', 'ledger_index', 'meta', 'validated'],
    properties: {
        meta: {
            type: 'object',
            required: ['AffectedNodes', 'TransactionIndex', 'TransactionResult'],
            properties: {
                AffectedNodes: {
                    type: 'array'
                }
            }
        }
    }
}

const ACCOUNT_INFO_SCHEMA = {
    title: 'test response of account info',
    type: 'object',
    required: ['account_data', 'ledger_hash', 'ledger_index', 'validated'],
    properties: {
        account_data: {
            type: 'object',
            required: ['Account', 'Balance', 'Flags', 'LedgerEntryType', 'OwnerCount', 'PreviousTxnID', 'PreviousTxnLgrSeq', 'Sequence', 'index']
        }
    }
}

const ACCOUNT_TUMS_SCHEMA = {
    title: 'test response of account tums',
    type: 'object',
    required: ['ledger_hash', 'ledger_index', 'receive_currencies', 'send_currencies', 'validated'],
    properties: {
        account_data: {
            type: 'object',
            required: ['Account', 'Balance', 'Flags', 'LedgerEntryType', 'OwnerCount', 'PreviousTxnID', 'PreviousTxnLgrSeq', 'Sequence', 'index']
        },
        validated: {
            type: 'boolean'
        },
        receive_currencies: {
            type: 'array',
            minItems: 0,
            items: {
                type: 'string'
            }
        },
        send_currencies: {
            type: 'array',
            minItems: 0,
            items: {
                type: 'string'
            }
        }
    }
}

const ACCOUNT_RELATIONS_SCHEMA = {
    title: 'test response of account relations',
    type: 'object',
    required: ['account', 'ledger_index', 'lines', 'validated', 'ledger_hash'],
    properties: {
        lines: {
            type: 'array',
            minItems: 0,
            items: {
                type: 'object',
                required: ['account', 'balance', 'currency', 'limit', 'limit_peer', 'no_skywell', 'quality_in', 'quality_out']
            }
        },
        account: {
            type: 'string'
        },
        ledger_index: {
            type: 'number'
        },
        validated: {
            type: 'boolean'
        },
        ledger_hash: {
            type: 'string'
        }
    }
};

const ACCOUNT_OFFERS_SCHEMA = {
    title: 'test response of account offers',
    type: 'object',
    required: ['account', 'ledger_index', 'ledger_hash', 'offers', 'validated'],
    properties: {
        account: {
            type: 'string'
        },
        ledger_index: {
            type: 'number'
        },
        ledger_hash: {
            type: 'string'
        },
        offers: {
            type: 'array',
            minItems: 0,
            item: {
                type: 'object',
                required: ['flags', 'seq', 'taker_gets', 'taker_pays']
            }
        },
        validated: {
            type: 'boolean'
        },
    }
}

const ACCOUNT_TX_SCHEMA = {
    title: 'test response of account tx',
    type: 'object',
    required: ['account', 'ledger_index_max', 'ledger_index_min', 'transactions'],
    properties: {
        transactions: {
            type: 'array',
            item: {
                type: 'object',
                required: ['date', 'hash', 'type', 'fee', 'result', 'memos', 'counterparty', 'amount', 'effects']
            }
        }
    }
}

const ORDER_BOOK_SECHEMA = {
    title: 'test response of order book',
    type: 'object',
    required: ['ledger_current_index', 'offers', 'validated'],
    properties: {
        offers: {
            type: 'array',
            item: {
                type: 'object',
                required: ['Account', 'BookDirectory', 'BookNode', 'Flags', 'LedgerEntryType', 'OwnerNode', 'PreviousTxnID', 'PreviousTxnLgrSeq', 'Sequence', 'TakerGets', 'TakerPays', 'index', 'owner_funds', 'quality']
            }
        }
    }
}

const PATH_FIND_SCHEMA = {
    title: 'test response of path',
    type: 'array',
    item: {
        type: 'object',
        required: ['choice', 'key'],
        properties: {
            choice: {
                type: 'object',
                required: ['currency', 'issuer', 'value']
            },
            key: {
                type: 'string'
            }
        }
    }
}

const ORDER_SCHEMA = {
    title: 'test response of creating order',
    type: 'object',
    required: ['engine_result', 'engine_result_code', 'engine_result_message', 'tx_blob', 'tx_json'],
    properties: {
        tx_json: {
            type: 'object',
            required: ['Account', 'Fee', 'Flags', 'Sequence', 'SigningPubKey', 'TakerGets', 'TakerPays', 'TransactionType', 'TxnSignature', 'hash']
        }
    }
}

const PAYMENT_SCHEMA = {
    title: 'test response of payment',
    type: 'object',
    required: ['engine_result', 'engine_result_code', 'engine_result_message', 'tx_blob', 'tx_json'],
    properties: {
        tx_json: {
            type: 'object',
            required: ['Account', 'Amount', 'Destination', 'Fee', 'Flags', 'Memos', 'Sequence', 'SigningPubKey', 'TransactionType', 'TxnSignature', 'hash']
        }
    }
}

module.exports = {
    SERVER_INFO_SCHEMA,
    LEDGER_CLOSED_SCHEMA,
    LEDGER_SCHEMA,
    TX_SCHEMA,
    ACCOUNT_INFO_SCHEMA,
    ACCOUNT_TUMS_SCHEMA,
    ACCOUNT_RELATIONS_SCHEMA,
    ACCOUNT_OFFERS_SCHEMA,
    ACCOUNT_TX_SCHEMA,
    ORDER_BOOK_SECHEMA,
    PATH_FIND_SCHEMA,
    ORDER_SCHEMA,
    PAYMENT_SCHEMA
}