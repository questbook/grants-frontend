import axios from 'axios'
import { Contract, ethers, Wallet } from 'ethers'
import { BiconomyWalletClient } from '../types/gasless'

const EIP712_WALLET_TX_TYPE = {
	WalletTx: [
		{ type: 'address', name: 'to' },
		{ type: 'uint256', name: 'value' },
		{ type: 'bytes', name: 'data' },
		{ type: 'uint8', name: 'operation' },
		{ type: 'uint256', name: 'targetTxGas' },
		{ type: 'uint256', name: 'baseGas' },
		{ type: 'uint256', name: 'gasPrice' },
		{ type: 'address', name: 'gasToken' },
		{ type: 'address', name: 'refundReceiver' },
		{ type: 'uint256', name: 'nonce' },
	]
}

// mumbai
// export const apiKey = "qypYydNmh.85fb44d4-bc3a-4434-8e51-a929f54de521"
// export const webHookId = "a36aa5b2-b761-4757-aad9-10348f3ec732"

// goerli
export const apiKey = 'cCEUGyH2y.37cd0d5e-704c-49e6-9f3d-e20fe5bb13d5' // apiKey from the dashboard
export const webHookId = '97d579e5-917d-4059-90af-d46d5ee88b43'

export const jsonRpcProviders: { [key: string]: ethers.providers.JsonRpcProvider } =
{
	'80001': new ethers.providers.JsonRpcProvider('https://polygon-mumbai.g.alchemy.com/v2/X6pnQlJfJq00b8MT53QihWBINEgHZHGp'),
	'4': new ethers.providers.JsonRpcProvider('https://eth-rinkeby.alchemyapi.io/v2/4CCa54H4pABZcHMOMLJfRySfhMkvQFrs'),
	'5': new ethers.providers.JsonRpcProvider('https://eth-goerli.g.alchemy.com/v2/Hr6VkBfmbJIhEW3fHJnl0ujE0xmWxcqH')
}

export const signNonce = async(webwallet: Wallet, nonce: string) => {
	const nonceHash = ethers.utils.hashMessage(nonce)
	const nonceSigString: string = await webwallet.signMessage(nonce)
	const nonceSig: ethers.Signature = ethers.utils.splitSignature(nonceSigString)

	return { v: nonceSig.v, r: nonceSig.r, s: nonceSig.s, transactionHash: nonceHash }
}

export const getNonce = async(webwallet: Wallet | undefined) => {
	if(!webwallet) {
		return
	}

	const response = await axios.post('https://2j6v8c5ee6.execute-api.ap-south-1.amazonaws.com/v0/refresh_nonce',
		{
			webwallet_address: webwallet.address
		})
	if(response.data && response.data.nonce !== 'Token expired') {
		return response.data.nonce
	}

	return false
}

export const registerWebHook = async(authToken: string, apiKey: string) => {
	const url = 'https://api.biconomy.io/api/v1/dapp/register-webhook'

	const formData = new URLSearchParams({
		'webHook': 'https://2j6v8c5ee6.execute-api.ap-south-1.amazonaws.com/v0/check',
		'requestType': 'post', // post or get
	})

	const requestOptions = {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'authToken': authToken, 'apiKey': apiKey },
		body: formData
	}

	const response = await fetch(url, requestOptions)
	const responseJSON = await response.json()

	let webHookId = false
	console.log(responseJSON)
	try {
		webHookId = responseJSON.data.webHookId
	} catch{
		throw Error("Couldn't register webhook for your app!")
	}

	return webHookId
}

export const addDapp = async(dappName: string, networkId: string, authToken: string | undefined) => {
	console.log('AUTH TOKEN', authToken)
	if(!authToken) {
		return false
	}

	const url = 'https://api.biconomy.io/api/v1/dapp/public-api/create-dapp'

	const formData = new URLSearchParams({
		'dappName': dappName,
		'networkId': networkId,
		'enableBiconomyWallet': 'true'
	})

	const requestOptions = {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'authToken': authToken },
		body: formData
	}

	const res = await fetch(url, requestOptions)
	const resJson = await res.json()

	console.log(resJson.data)

	return resJson.data
}

export const deploySCW = async(webwallet: Wallet, biconomyWalletClient: BiconomyWalletClient) => {
	console.log("I'm here")
	var { doesWalletExist, walletAddress } = await biconomyWalletClient.checkIfWalletExists({ eoa: webwallet.address })
	console.log("I'm not here")
	let scwAddress
	console.log('WEEEE', webwallet.address)
	if(!doesWalletExist) {
		console.log('Wallet does not exist')
		console.log('Deploying wallet')
		walletAddress = await biconomyWalletClient.checkIfWalletExistsAndDeploy({ eoa: webwallet.address }) // default index(salt) 0
		console.log('Wallet deployed at address', walletAddress)
		scwAddress = walletAddress
	} else {
		console.log(`Wallet already exists for: ${webwallet.address}`)
		console.log(`Wallet address: ${walletAddress}`)
		scwAddress = walletAddress
	}

	return scwAddress
}

export const sendGaslessTransaction = async(biconomy: any, targetContractObject: Contract, targetContractMethod: string,
	targetContractArgs: Array<any>, targetContractAddress: string, biconomyWalletClient: BiconomyWalletClient,
	scwAddress: string, webwallet: Wallet | undefined, chainId: string, webHookId: string, nonce: string | undefined) => {

	console.log(biconomy, targetContractObject, targetContractMethod, targetContractArgs, targetContractAddress,
		biconomyWalletClient, scwAddress, webwallet, chainId, webHookId, nonce)

	console.log('ffff', targetContractAddress)

	if(!biconomy) {
		alert('Biconomy is not ready! Please wait.')
		return false
	}

	if(!webwallet) {
		alert('WebWallet is not ready! Please wait.')
		return false
	}

	if(!nonce) {
		alert('Please log in with GitHub first!')
		return false
	}

	if(nonce === 'Token expired') {
		alert('Your Session has terminated. Please log in again.')
		return false
	}

	console.log('HERE1')
	const { data } = await targetContractObject.populateTransaction[targetContractMethod](...targetContractArgs)
	console.log('HERE2')
	console.log('HERE 00', biconomyWalletClient)
	console.log(biconomyWalletClient, data, targetContractAddress, scwAddress)
	const safeTxBody = await biconomyWalletClient.buildExecTransaction({ data, to: targetContractAddress, walletAddress: scwAddress })

	console.log('HERE3')

	const signature = await webwallet._signTypedData({ verifyingContract: scwAddress, chainId: ethers.BigNumber.from(chainId) }, EIP712_WALLET_TX_TYPE, safeTxBody)
	console.log('HERE4')

	let newSignature = '0x'
	newSignature += signature.slice(2)

	const signedNonce = await signNonce(webwallet, nonce)

	const webHookAttributes = {
		'webHookId': webHookId, // received from the webhook register API
		'webHookData': { // whatever data object to be passed to the webhook
			'data': {
				'signedNonce': signedNonce,
				'nonce': nonce
			}
		},
	}
	console.log('HI')
	const response = await biconomyWalletClient.sendBiconomyWalletTransaction({ execTransactionBody: safeTxBody, walletAddress: scwAddress, signature: newSignature }) // signature appended
	console.log('HI2')
	return response
}

export const getTransactionReceipt = async(transactionHash: string | undefined | boolean, chainId: string) => {
	if(typeof (transactionHash) === 'undefined' || typeof (transactionHash) === 'boolean') {
		return false
	}

	console.log('GOT HERE')
	await jsonRpcProviders[chainId].waitForTransaction(transactionHash, 1)
	return await jsonRpcProviders[chainId].getTransactionReceipt(transactionHash)
}

export const getEventData = async(receipt: any, eventName: string, contractABI: any) => {

	var eventInterface: ethers.utils.Interface

	const isValidEvent = (item: ethers.utils.Fragment) => {
		const fragmentItem = ethers.utils.Fragment.from(item)
		if(!fragmentItem.name || !fragmentItem.type) {
			return false
		}

		return fragmentItem.name === eventName && fragmentItem.type === 'event'
	}

	const isValidEventInReceipt = (item: ethers.providers.Log) => {
		try {
			eventInterface.parseLog(item)
			return true
		} catch{
			return false
		}
	}

	console.log('THIS IS RECEIPT', receipt)
	const abiInterface = new ethers.utils.Interface(contractABI) // this is contract's ABI
	const humanReadableABI: string | string[] = abiInterface.format(ethers.utils.FormatTypes.full) // convert to human readable ABI
	if(typeof (humanReadableABI) === 'string') {
		return false
	}

	const abiFragments = humanReadableABI.map(item => ethers.utils.Fragment.from(item))

	const eventFragment = abiFragments.filter(isValidEvent)

	if(eventFragment.length !== 1) {
		throw Error('Invalid Given Event!')
	}

	eventInterface = new ethers.utils.Interface(eventFragment)

	const eventLogs = receipt.logs.filter(isValidEventInReceipt)

	if(eventLogs.length !== 1) {
		throw Error('Invalid Given Event!')
	}

	const eventLog = eventInterface.parseLog(eventLogs[0])

	return eventLog
}