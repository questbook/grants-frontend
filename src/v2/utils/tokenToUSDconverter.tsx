import axios from 'axios'
const API = 'https://api.coingecko.com/api/v3'

// let allAssets

export function loadAssetId(chainId: string){
    const url = `${API}/asset_platforms`
    return axios.get(url).then(res => {
        console.log('chain Id', chainId )
        console.log('all assets', res)
        const result = res.data.filter((asset) => asset.chain_identifier === parseInt(chainId))
        console.log('filtered assets', result)
        return result
    })
    
}

export function tokenToUSD(id: string, contractAddress: string, ) {
    const API_URL = `${API}/simple/token_price/${id}?contract_addresses=${contractAddress}&vs_currencies=usd`
    return axios.get(API_URL)
}

 