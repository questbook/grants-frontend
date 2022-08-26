const NETWORK_PREFIX: {[key: string]: string} = {
    "4": "rin",
    "137": "matic"
}

export default function getGnosisTansactionLink(safeAddress: string, chainId: string) {
    if(chainId === '42220'){
        return `https://safe.celo.org/#/safes/${safeAddress}/transactions`
    } else {
        console.log('Safe Address', safeAddress)
        return `https://gnosis-safe.io/app/${NETWORK_PREFIX[chainId]}:${safeAddress}/transactions/queue`
    }
    
}