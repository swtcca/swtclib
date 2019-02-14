# Documents
Usage for jingtum-lib

## Server
Server class connects jingtum with ws lib to keep long connection. It's packaged to `Remote` class, should not be used outside jingtum-lib.

## Remote
Main function class in jingtum-lib. It creates a handle with jingtum, makes request to jingtum, subscribes event to jingtum, ands gets info from jingtum.

* Remote(options)
* connect(callback)
* disconnect()
* requestServerInfo()
* requestLedgerClosed()
* requestLedger(options)
* requestTx(options)
* requestAccountInfo(options)
* requestAccountTums(options)
* requestAccountRelations(options)
* requestAccountOffers(options)
* requestAccountTx(options)
* requestOrderBook(options)
* requestPathFind(options)
* createAccountStub()
* createOrderBookStub()
* buildPaymentTx(options)
* buildRelationTx(options)
* buildAccountSetTx(options)
* buildOfferCreateTx(options)
* buildOfferCancelTx(options)


### Remote(options)
options for setup a remote, options including

    {
    	server: 'wss://ts.jingtum.com:5020',
    	local_sign: false
    }


`server` is string for jingtum websocket server url, `local_sign` checks if jingtum-lib sign transaction in local, it will be implemented later.

### connect(callback)
Each remote object should connect jingtum first. Now jingtum should connect manual, only then you can send request to backend.
callback as callback(err, ret), err checks error info, ret is restul result.

### disconnect
 Remote object can be disconnected manual, and no parameters are required.

### requestServerInfo

Create request object and get server info from jingtum, including

    { 
	    version: '0.29.60', //服务程序版本号
	    ledgers: '6753-14393', //该服务缓存的账本区间
	    node: 'n9LxdTZbjjQnuPiM5SgwPYQndfb64YHbmCp1mhsoch7uw5HQJ3k6', //节点公钥
	    state: 'full   34:35:40' //服务器当前状态：full可提供服务状态；proposing验证节点状态
    }


`version` is currenct jingtum version; `ledgers` are complted ledgers in system; `node` is jingtum node id; `state` is currenct jingtum node state.

### requestLedgerClosed
Create request object and get last closed ledger in system.
return data include ledger_index, ledger_hash and so on.

    { 
    	fee_base: 10,
    	ledger_hash: '326EF17272606D8DD72F96F6299E54839D76435DCEB6F68385D891105ABB0E6C',
    	ledger_index: 14402,
    	reserve_base: 10000000,
    	reserve_inc: 1000000,
    	txn_count: 0,
    	validated: '6753-14402'
    }
`fee_base` is current swt fee in each transaction. `ledger_hash` and `ledger_index` are last closed ledger height info. `reserve_base` and `reserve_in`c are reserve swt infomations. `txn_count` is transaction count in last closed ledger. `validated` is  current validated ledgers in last cloed ledger. 

### requestLedger(options)
options can be ledger index and ledger hash. If none is provided, then last closed ledger is returned.

    {
	    accepted: true,
	    ledger_hash: '32A1E3E58000183D5D50E9662133183DFA9BA695763B4D44B5FEDF71476A1DF1',
	    ledger_index: '14468',
	    parent_hash: '6CEBA5BC7EDDD3AD110F5F9933FE2301443A99BC7158DFF19C04AF5E7F5BABD3',
	    close_time: '2016-Nov-26 14:43:10',
	    total_coins: '600000000000000000'
    }

`accepted` marks the ledger is accepted. `ledger_hash` and `ledger_index` are ledger height informations. `parent_hash` is parent ledger hash. `close_time` is ledger closed time in UTC+8. `total_coins` is total swt in system. 

### requestTx(options)
requestTx is used to query one transaction information. Options should be proivide transaction hash as 

    {
    	hash: '6E7F4962B3B13E3D9C0D13120E17FE1B3DBF4EA677D1D19AAEC38C9B74EBF73B'
    }

Each result is one transaction information. The result is as follow

    {
    	"Account" : "jhYk8VyFaHYwQRgqNfrP9QcPkRmJoEFB6V",
      	"Fee" : "12",
      	"Flags" : 2148007936,
      	"LastLedgerSequence" : 4518373,
      	"Sequence" : 3,
      	"SigningPubKey" : "029E5D69804957211EB45BF973CDCCD994466BA672C997808892F657DE41A4CB1B",
      	"TakerGets" : "1000000",
      	"TakerPays" : {
	     	"currency" : "CNY",
	     	"issuer" : "jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS",
	     	"value" : "0.9499999999"
      	},
	    "TransactionType" : "OfferCreate",
	    "TxnSignature" : "30440220729E10A9A5F60DE4839E8284E0532BA5741539AACFD3598922102A7FD48E96C60220588921DE0F892241F863D0BB2436D55E15C4D7259A874A9023ACC8814C4D4B9C",
	    "date" : 533033560,
	    "hash" : "D2B8DBDBC4D8264DAE461A24CCA9AD790DEB10F091F5528DB97D3A74AE6C75C6",
	    "inLedger" : 4518365,
	    "ledger_index" : 4518365,
	    "meta" : {
     		"AffectedNodes" : [ {
       			"ModifiedNode" : {
	      			"FinalFields" : {
		     			"Account" : "j9eM8GiBb4QFRZZsrsde6XTPDenXEFnrkm",
		     			"Balance" : "13371029608006",
		     			"Flags" : 0,
		     			"OwnerCount" : 9,
		     			"Sequence" : 12
      				},
		      		"LedgerEntryType" : "AccountRoot",
		      		"LedgerIndex" : "9A70EC2B21AC5C85498444281EABF08CF63BB8844B407300B385371A0623F0D7",
		      		"PreviousFields" : {
		     			"Balance" : "13371028608006"
		      		},
		      		"PreviousTxnID" : "BBE8F8CFB2CA6EFA10C1884EFFD36154B30702D9446D10A6158106D168B65C83",
		      		"PreviousTxnLgrSeq" : 4465533
       			}
    		} ],
     		"TransactionIndex" : 0,
     		"TransactionResult" : "tesSUCCESS"
      	},
     	 "status" : "success",
      	"validated" : true
	}

### requestAccuontInfo(options)
It is used to get account info. Options should provie account, and ledger is optional. Options are as follow.

    {
    	account: 'jLiQ4FfNhezwFzQEgKAKNHBM35S2BnJwxj',
		ledger_index: '10000'
    }
And result is as follow

    {
    	account_data:  {
    		Account: 'jLiQ4FfNhezwFzQEgKAKNHBM35S2BnJwxj',
    		Balance: '1001999904',
    		Flags: 0,
    		LedgerEntryType: 'AccountRoot',
    		OwnerCount: 5,
    		PreviousTxnID: 'F39560463022FD9ED78BA378DB2D2DD6CC46ECCA5F2D5A052916BE22C1A1B845',
    		PreviousTxnLgrSeq: 8173,
    		Sequence: 9,
    		index: '7B12CC6E0B76FC0CA1CD11436488C1CE3C1709B93EF62CD9E6155C3A9D7554A0'
    	},
    	ledger_hash: 'F0F8799C2F7DCD3DE3F429831640F4520C1BAF5F55E505A9925DBF6B0C8D12E4',
    	ledger_index: 14531,
    	validated: true
    }
`account_data` is account data information. `ledger_index` and `ledger_hash` is ledger height for the account.

### requestAccountTums(options)
Each account helds many jingtum tums, and the received and sent tums can be found by requestAccountTums.
The Options are as follow

    {
    	account: 'jLiQ4FfNhezwFzQEgKAKNHBM35S2BnJwxj',
		ledger_index: '10000'
    }

`account` parameter is required and `ledger_inex` or `ledger_hash` or `ledger` are optional.

The result is as follow

    {
    	ledger_hash: '084769A988AFF8B430E71D1F9E6FBC1452C8DE06A84405BF6B5EE49D0B30ED6B',
    	ledger_index: 14559,
    	receive_currencies: [ 'CNY', 'EUR', 'USD' ],
    	send_currencies: [ 'CNY' ],
    	validated: true 
    }
`receive_currencies` is tums that can be received by this account, `send_currenies` is tums that will be sent by this account.

### requestAccountRelations(options)
Jingtum wallet is connected by many relations. Now jingtum support `trust`, `authorize` and `freeze` relation, all can be query by requestAccountRelations.
The query options is as follow

    {
		type: 'trust',
    	account: 'jLiQ4FfNhezwFzQEgKAKNHBM35S2BnJwxj',
		ledger_index: '10000'
    }
The result is as follow

    {
    	account: 'jLiQ4FfNhezwFzQEgKAKNHBM35S2BnJwxj',
    	ledger_hash: '1565BD1869E0CE4E23B78DE09BA624E39E79E1DDDF22A0979881C1D3D937E391',
    	ledger_index: 14604,
    	lines: [
    	{
		    account: 'jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS',
		    balance: '0',
		    currency: 'USD',
		    limit: '1000',
		    limit_peer: '0',
		    no_skywell: true,
		    quality_in: 0,
		    quality_out: 0
	    },
	    {
		    account: 'jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS',
		    balance: '29997.5',
		    currency: 'CNY',
		    limit: '10000000000',
		    limit_peer: '0',
		    no_skywell: true,
		    quality_in: 0,
		    quality_out: 0
	    },
	    {
		    account: 'j6wtnp1LB23h4hRQjk2tA3hCzNMnRW1j3',
		    balance: '0',
		    currency: 'USD',
		    limit: '1000',
		    limit_peer: '0',
		    no_skywell: true,
		    quality_in: 0,
		    quality_out: 0
	    },
	    {
		    account: 'jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS',
		    balance: '0',
		    currency: 'EUR',
		    limit: '1000',
		    limit_peer: '0',
		    no_skywell: true,
		    quality_in: 0,
		    quality_out: 0
	    }
	    ],
	    validated: true
    }
    
### requestAccountOffers(options)
requestAccountOffers query account's current offer that is suspended on jingtum system, and will be filled by other accounts.
Options is the same as `requestAccountInfo` and `requestAccountTums`.
And The request is as follow.

    { 
		account: 'jLiQ4FfNhezwFzQEgKAKNHBM35S2BnJwxj',
      	ledger_hash: 'CB3F1AE7904E1F4676F8041848C1866280074C3D705D51C2ABC0FCB13C61ED9F',
      	ledger_index: 14630,
      	offers: 
       	[ { 
			flags: 131072,
       		seq: 3,
       		taker_gets: '2000000',
       		taker_pays: {
				value: '0.01',
				currency: 'USD',
				issuer: 'jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS'
			}
		} ],
      	validated: true
	}

### requestAccountTx(options)
It is used to query account transactions, and the options is same as `requestAccountInfo`.
The request is as array of transaction.

### requestOrderBook(options)
requestOrderBook is used to query order book info. The options is as follow.

    {
	    gets: {
		    currency: 'CNY',
		    issuer: 'jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS'
	    },
	    pays: {
		    currency: 'SWT',
		    issuer: ''
	    }
    }
Firstly , each order book has a currency pair, as AAA/BBB. When to quer the bid orders, gets is AAA and pays is BBB. When to query the ask orders, gets is BBB and pays is AAA.
The result is array of orders.

### requestPathFind(options)
It is used to query path from one curreny to another. Options is as follow.

    {
	    account: 'jpidrAsPWDTTHhbBf9BCn5suWHQJqhynVi', 
	    destination: 'jEo4AY8MFitgyRTNwnQCwSesn1XWjbY9Aa',
	    amount: {value: '0.001', currency: 'SWT', issuer: ''}
    }
And the result is as follow.

    [ { 
		choice:  {
			currency: 'BTC',
       		issuer: 'jpidrAsPWDTTHhbBf9BCn5suWHQJqhynVi',
       		value: '0.001' 
		},
    	key: '415aebe163e891e0f5cd63b328dbf0fee2fd51e8' 
	},
    { 
		choice:  { 
			currency: 'USD',
       		issuer: 'jpidrAsPWDTTHhbBf9BCn5suWHQJqhynVi',
       		value: '0.001' 
		},
    	key: 'f53b09afcf9e1758a7b647f2f738c86426cabfc1' 
	} ]

In this path find, the user want to send swt to another account. The system provides two choices, one is to use BTC and the other is to use USD.

In each choice, one `key` is presented. Key is used to `setPath` in transaction parameter setting.

### createAccountStub()
AcccountStub is account class, and is used to subscribe events of account. Each account is a event, and can be subscribed on account stub. 


### createOrderBookStub()
OrderBookStub is same as AccountStub. The event for OrderBookStub is orderbook currency pair, as `AAA:issuer/BBB:issuer`, and if `AAA` or `BBB` is SWT the part is `SWT` and no issuer is required.

### buildPaymentTx(options)
Normal payment transaction. More parameters can be set by transaction functions. The secret is requried, and others are optional.

One options is as follow

    {
	    from: 'jPgsnN1uRTiqiNsJinqDdshBaasHWzM4wD',
	    to: 'j9bouxUJLqw5QmtXWTarX7MpL8ohLJ57tJ',
	    amount: {
		    value: '1110.01',
		    currency: 'SWT',
		    issuer: ''
	    }
    }

### buildRelationTx(options)
Relation Transaction is built by this function. Now Jingtum supports `trust`, `authorize` and `freeze` relation setting.
Same as payment transaction parameter setting, secret is required and others are optional.

One options is as follow

    {
		type: 'trust',
	    account: 'jPgsnN1uRTiqiNsJinqDdshBaasHWzM4wD',
	    limit: {
		    value: '10000',
		    currency: 'CNY',
		    issuer: 'jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS'
	    }
    }
`type` is required to separate relation types.

### buildAccountSetTx(options)
AccountSet Transaction is used to set account attribute. Now Jingtum supoorts three account attributes setting, as `property`, `delegate` and `signer`. `property` is used to set normal account info, `delegate` is used to set delegate account for this account, and `signer` is used to set signers for this acccount.

Same as payment transaction parameter setting, secret is required and others are optional.

One `options` is as follow

    {
	    type: 'delegate',
	    source: jPgsnN1uRTiqiNsJinqDdshBaasHWzM4wD,
	    delegate_key: 'j9zm131bYDNqaeZQvkRxwyLx3VD69KgmGi'
    }
 `type` is required to separate account setting types.   


### buildOfferCreateTx(options)
Create one offer and submit to system. 

One `options` is as follow

    {
    	source: 'jPgsnN1uRTiqiNsJinqDdshBaasHWzM4wD',
    	type: 'Sell',
    	gets: {"value": "1", "currency": "USD", "issuer": "jHVgw3zejmLbKaGEsM6go2HRXffWE9AJr4"} ,
    	pays: {"value": "1", "currency": "SWT", "issuer": ""} 
    }
`type` can be `Sell` or `Buy`, and is required. `gets` is the amount to get, `pays` is the amount can to exchange out.


### buildOfferCancelTx(optoins)
Order can be cancel by order sequence. The sequence can be get when order is submitted or from offer query operation.

One `options` is as follow

    {
    	source: 'jPgsnN1uRTiqiNsJinqDdshBaasHWzM4wD',
    	sequence: 16
    }
`sequence` is number and is requred.


### Events

#### transactions
* Listening all transactions occur in the system.

#### ledger_closed
* Listening all last closed ledger event.

#### server_status
* Listening all server status change event.

## Request

Request is used to get server, account, orderbook and path info. Request is not secret required, and will be public to every one. All request is asynchronized and should provide a callback. Each callback has two parameter, one is error and the other is result.

* selectLedger(ledger)
* submit(callback)

### selectLedger(ledger)

select one ledger for current request, ledger can be follow options,

* ledger index
* ledger hash
* current, validated, closed 

After ledger is selected, the result is for the specified ledger.

### submit(callback)

Callback entry for request. Each callback has two parameter, one is error and the other is result.


## Transaction

Transaction is used to make transaction and collect transaction parameter. Each transaction is secret required, and transaction can be signed local or remote. Now remote sign is supported, local sign will be suport soon. All transaction is asynchronized and should provide a callback. Each callback has two parameter, one is error and the other is result.

* getAccount()
* getTransactionType()
* setSecret(secret)
* addMemo(memo)
* setPath(key)
* setSendMax(amount)
* setTransferRate(rate)
* setFlags(flags)
* submit(callback)

### getAccount()
Each transaction has `account`, `source`, or `from` account, and its secret should be set.

Account can be master account, delegate account or operation account.

### getTransactionType()

Get transaction type. Now Jingtum supports `Payment`, `OfferCreate`, `OfferCancel`, `AccountSet` and so on. 


GetTransactionType return transaction type string.

### setSecret(secret)

Set Transaction secret, this function is required before transaction submit.

### addMemo(memo)
Add one memo to transaction, memo is string and is limited to 2k. Memo is one way to add payload to transaction. But payload should be add in another way.

### setPath(key)

Set path for one transaction. The key parameter is request by requestPathFind. When the key is set, `SendMax` parameter is also set.

### setSendMax(amount)

Set payment transaction max amount when needed. It is set by `setPath` default.

### setTransferRate(rate)

Set transaction transfer rate. It should be check with fee. 

TO CHECK

### setFlags(flags)

Set transaction flags. It is used to set Offer type mainly. As follows

    setFlags('Sell')
    
### submit(callback)

Submit entry for transaction.

## Account

Account is account stub for account events. One Account stub can subscribe many account events. Each event name is account address. 

### on('account')

Subscribe `account` event.

### un('account')

Unsubscribe `account` event.

## OrderBook
OrderBook is order book stub for order book events. One OrderBook stub can subscribe many order book events. 

Each event name is order book pair. As follows


    SWT:CNY/jPgsnN1uRTiqiNsJinqDdshBaasHWzM4wD

or


    CNY/jPgsnN1uRTiqiNsJinqDdshBaasHWzM4wD:USD/jPgsnN1uRTiqiNsJinqDdshBaasHWzM4wD


### on('orderbook')

Subscribe `orderbook` event.

### un('orderbook')

Unsubscribe `orderbook` event.

