import axios from 'axios'

export interface TokenDetailsInterface {
    tokenIcon: string
    tokenName: string
    symbol: string
    tokenValueAmount: number
    usdValueAmount: number
    mintAddress: string
    info: {
        decimals: number
        tokenAddress: string
        fiatConversion: number
    }
    fiatConversion: number
}
const getTokenUSDonDate = async(tokenName: string) => {
	try {
		const url = `https://api.coingecko.com/api/v3/simple/price?ids=${tokenName}&vs_currencies=usd`
		const tokenUsdValue = parseFloat((await axios.get(url)).data[tokenName].usd)
		localStorage.setItem(`tokenUsdValue-${tokenName}`, tokenUsdValue.toString())
		return tokenUsdValue
	} catch(e) {
		if(localStorage.getItem(`tokenUsdValue-${tokenName}`)) {
			return parseFloat(localStorage.getItem(`tokenUsdValue-${tokenName}`) as string)
		}

		return 0
	}
}

const getToken = async() => {
	const TONTokenId: string = 'axelar'

	// const currentTime = (new Date()).toLocaleDateString().split('/').join('-')

	const tonUsdRate = await getTokenUSDonDate(TONTokenId)
	const details: TokenDetailsInterface = {
		tokenIcon: '/v2/icons/toncoin.svg',
		tokenName: 'AXL',
		tokenValueAmount: 0,
		usdValueAmount: 0,
		mintAddress: '0x0000000',
		info: {
			decimals: 18,
			tokenAddress: TONTokenId,
			fiatConversion: tonUsdRate
		},
		fiatConversion: tonUsdRate,
		symbol: 'AXL'
	}
	return details
}

export default getToken