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
export const webHookId = '97d579e5-917d-4059-90af-d46d5ee88b43'

export const jsonRpcProviders: { [key: string]: ethers.providers.JsonRpcProvider } =
{
	'80001': new ethers.providers.JsonRpcProvider('https://polygon-mumbai.g.alchemy.com/v2/X6pnQlJfJq00b8MT53QihWBINEgHZHGp'),
	'4': new ethers.providers.JsonRpcProvider('https://eth-rinkeby.alchemyapi.io/v2/4CCa54H4pABZcHMOMLJfRySfhMkvQFrs'),
	'5': new ethers.providers.JsonRpcProvider('https://eth-goerli.g.alchemy.com/v2/Hr6VkBfmbJIhEW3fHJnl0ujE0xmWxcqH'),
	'137': new ethers.providers.JsonRpcProvider('https://polygon-mainnet.g.alchemy.com/v2/mmBX0eNrvs0k7UpEMwi0eIH6hC4Dqoss')
}

export const bicoDapps: { [key: string]: { apiKey: string, webHookId: string } } = {
	'5': {
		apiKey: 'cCEUGyH2y.37cd0d5e-704c-49e6-9f3d-e20fe5bb13d5',
		webHookId: '97d579e5-917d-4059-90af-d46d5ee88b43'
	},
	'137': {
		apiKey: 'kcwSbypnqq.f5fe6fbd-10e3-4dfe-a731-5eb4b6d85445',
		webHookId: '202501f8-639f-495a-a1ec-d52d86db8b2d'
	}
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

export const registerWebHook = async(authToken: string, apiKey: string, chainId: string) => {
	const url = 'https://api.biconomy.io/api/v1/dapp/register-webhook'

	const formData = new URLSearchParams({
		'webHook': 'https://2j6v8c5ee6.execute-api.ap-south-1.amazonaws.com/v0/check',
		'requestType': 'post', // post or get
	})

	const requestOptions = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'authToken': authToken,
			'apiKey': apiKey
		},
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

export const addAuthorizedOwner = async(workspace_id: number, webwallet_address: string, scw_address: string,
	chain_id: string, safe_address: string) => {

	const response = await axios.post('https://2j6v8c5ee6.execute-api.ap-south-1.amazonaws.com/v0/add_workspace_owner',
		{
			workspace_id,
			webwallet_address,
			scw_address,
			chain_id,
			safe_address
		})

	if(response.data && response.data.status) {
		return true
	}

	return false
}

export const addAuthorizedUser = async(webwallet_address: string) => {

	const response = await axios.post('https://2j6v8c5ee6.execute-api.ap-south-1.amazonaws.com/v0/add_user',
		{
			webwallet_address
		})

	if(response.data && response.data.authorize) {
		return true
	}

	return false
}

export const chargeGas = async(workspace_id: number, amount: number) => {
	const response = await axios.post('https://2j6v8c5ee6.execute-api.ap-south-1.amazonaws.com/v0charge_gas',
		{
			workspace_id,
			amount
		})
	if(response.data && response.data.status) {
		console.log(`charged workspace ${workspace_id} with ${amount} gas`)
		return true
	}

	return false

}

export const deploySCW = async(webwallet: Wallet, biconomyWalletClient: BiconomyWalletClient) => {
	console.log("I'm here", biconomyWalletClient)
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

	const g = new Promise((r) => {
		setTimeout(r, 25000)
	})
	g.then(() => { })

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

	console.log('HERE1', targetContractObject, targetContractMethod, targetContractArgs)
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
			'signedNonce': signedNonce,
			'nonce': nonce,
			'to': targetContractAddress,
			'chain_id': chainId
		},
	}
	console.log('HI')
	const response = await biconomyWalletClient.sendBiconomyWalletTransaction({ execTransactionBody: safeTxBody, walletAddress: scwAddress, signature: newSignature, webHookAttributes }) // signature appended
	console.log('HI2')
	return response
}

export const getTransactionReceipt = async(transactionHash: string | undefined, chainId: string) => {
	if(typeof (transactionHash) === 'undefined' || transactionHash === undefined) {
		return false
	}

	console.log('GOT HERE')
	await jsonRpcProviders[chainId].waitForTransaction(transactionHash, 1)
	return await jsonRpcProviders[chainId].getTransactionReceipt(transactionHash)
}

export const getTransactionDetails = async(transactionHash: string, chainId: string) => {
	const receipt = await getTransactionReceipt(transactionHash, chainId)

	if(!receipt) {
		throw new Error("Couldn't fetch transaction receipt!")
	}

	const gasPrice = (await jsonRpcProviders[chainId].getTransaction(transactionHash)).gasPrice

	if(!gasPrice) {
		throw new Error("Couldn't fetch gas price!")
	}

	const txFeeBigInt = gasPrice?.toBigInt() * receipt.gasUsed.toBigInt()
	const txFeeEther = ethers.utils.formatEther(txFeeBigInt)
	const txFee = Number(txFeeEther).toFixed(4).toString()

	return { receipt, txFee }
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