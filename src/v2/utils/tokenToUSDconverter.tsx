import axios from 'axios'
const API = 'https://api.coingecko.com/api/v3'

// let allAssets

type Asset = {
    id: string
    chain_identifier: number
    name: string
    shortname: string
}

export function loadAssetId(chainId: string) {
	const url = `${API}/asset_platforms`
	return axios.get(url).then(res => {
		const result = res.data.filter((asset: Asset) => asset.chain_identifier === parseInt(chainId))
		return result
	})

}

export function tokenToUSD(id: string, contractAddress: string,) {
	const API_URL = `${API}/simple/token_price/${id}?contract_addresses=${contractAddress}&vs_currencies=usd`
	return axios.get(API_URL)
}

