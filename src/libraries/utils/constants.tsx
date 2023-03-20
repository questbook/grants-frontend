import { Metamask, Phantom, WalletConnect } from 'src/generated/icons'

export const MONTH_MAP: {[key: string]: string} = {
	'01': 'Jan',
	'02': 'Feb',
	'03': 'Mar',
	'04': 'Apr',
	'05': 'May',
	'06': 'Jun',
	'07': 'Jul',
	'08': 'Aug',
	'09': 'Sep',
	'10': 'Oct',
	'11': 'Nov',
	'12': 'Dec',
}

export const chainNames = new Map<string, string>([
	['1', 'Ethereum Mainnet'],
	['5', 'Goerli Testnet'],
	['10', 'Optimism Mainnet'],
	['40', 'Telos Mainnet'],
	['137', 'Polygon Mainnet'],
	['42220', 'Celo Mainnet'],
	['9001', 'Solana'],
	['90001', 'Solana'],
	['900001', 'Solana'],
])

export const availableWallets = [{
	name: 'Metamask',
	icon: <Metamask
		h={8}
		w='33px' />,
	isPopular: true,
	id: 'injected',
}, {
	name: 'WalletConnect',
	icon: <WalletConnect
		h={8}
		w='33px' />,
	isPopular: false,
	id: 'walletConnect'
}]

export const solanaWallets = [{
	name: 'Phantom',
	icon: <Phantom
		h={8}
		w='33px' />,
	isPopular: false,
	id: 'phantom',
}]