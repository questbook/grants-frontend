import TonWeb from 'tonweb'

export class TonWallet {

	provider: any
	tonReady: boolean = false
	tonWeb: any

	constructor() {
		this.provider = null
		this.tonReady = false
		this.tonWeb = new TonWeb()
	}

	checkTonReady(window: any) {
		if(window.ton) {
			this.provider = window.ton
			this.tonReady = true
			console.log('TON ready')
		}
	}

	connect = async() => {
		const accounts = await this.provider.send('ton_requestAccounts')
		// Accounts now exposed, use them
		const account = accounts[0] // We currently only ever provide a single account,
		// but the array gives us some room to grow.
		// showAccountAddress(account);

		console.log(await this.provider.send('ton_requestWallets'))
	}

	sendMoney = async(toAddress: string, amount: number) => {
		try {
			await this.connect()
			if(this.tonReady) {
				const result = await this.provider.send(
					'ton_sendTransaction',
					[{
						to: toAddress,
						value: amount * 10 ^ 8,
						data: 'dapp test',
						dataType: 'text'
					}]
				)
				console.log('result', result)
				return result
			}
		} catch(error) {
			// User denied or Error
			console.log(error)
		}
	}


	hello = () => {
		console.log('Hello TON!')
	}
}
