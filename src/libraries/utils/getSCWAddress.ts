import { ethers } from 'ethers'
import ABI from 'src/contracts/abi/WalletAbi.json'

export const getSCWAddress = async(address: string) => {
	try {
		const scw = '0x050bca32264195976Fe00BcA566B548413A9E658'
		const fetchAddress = async(provider: string, address: string) => {
			const providerConfig = new ethers.providers.AlchemyProvider(provider, '8iYVobmm24k85ejRIS0fd8sBzSVbQtZv')
			const scwContract = new ethers.Contract(scw, ABI, providerConfig)
			const result = await scwContract.getAddressForCounterfactualWallet(address, 0)
			const check = await scwContract.isWalletExist(result)
			return check ? result : false
		}

		const optimismAddress = await fetchAddress('optimism', address)
		return { doesWalletExist: !!optimismAddress, walletAddress: optimismAddress ? optimismAddress : address }
	} catch(e) {
		throw new Error(`Error fetching address: ${e}`)
	}
}
