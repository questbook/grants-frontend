// Used for switching metamask network to correct one
const rpcUrls: {[key: number]: string} = {
	1: 'https://mainnet.infura.io/v3/',
	4: 'https://rinkeby.infura.io/v3/',
	5: 'https://goerli.infura.io/v3/',
	10: 'https://mainnet.optimism.io',
	100: 'https://rpc.gnosischain.com/',
	137: 'https://polygon-rpc.com/',
	42220: 'https://forno.celo.org',
}

export default rpcUrls