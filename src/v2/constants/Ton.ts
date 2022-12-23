// import TonWeb from 'tonweb'

// export class TonWallet {

// 	provider: any
// 	tonReady: boolean = false
// 	tonWeb: any
// 	address: string = ''

// 	constructor() {
// 		this.provider = null
// 		this.tonReady = false
// 		this.tonWeb = new TonWeb()
// 	}

// 	checkTonReady(window: any) {
// 		if(window.ton) {
// 			this.provider = window.ton
// 			this.tonReady = true
// 			console.log('TON ready')

// 			this.provider.on('accountsChanged', (accounts) => {
// 				console.log('TON accountsChanged', accounts)
// 				const account = accounts[0]
// 				this.address = account
// 			})
// 		}
// 	}

// 	connect = async() => {
// 		const accounts = await this.provider.send('ton_requestAccounts')
// 		console.log('TON accountsChanged', accounts)
// 		const account = accounts[0]
// 		this.address = account

// 		// const wallet = this.tonWeb.wallet.create({ address: this.address })
// 		// const seqno = await wallet.methods.seqno().call()
// 		// console.log('TON seqno', seqno)

// 		const transactions = await this.tonWeb.getTransactions(account, 20, undefined, undefined, undefined)
// 		console.log('TON transactions', transactions)

// 		console.log(await this.provider.send('ton_requestWallets'))
// 	}

// 	sendMoney = async(toAddress: string, amount: number) => {
// 		try {
// 			await this.connect()
// 			if(this.tonReady) {
// 				const result = await this.provider.send(
// 					'ton_sendTransaction',
// 					[{
// 						to: toAddress,
// 						value: amount * 10 ^ 8,
// 						data: 'dapp test',
// 						dataType: 'text'
// 					}]
// 				)
// 				console.log('result', result)
// 				return result
// 			}
// 		} catch(error) {
// 			// User denied or Error
// 			console.log(error)
// 		}
// 	}
// }
