import { NetworkType } from 'src/constants/Networks'
import { SafeSelectOption } from 'src/v2/components/Onboarding/CreateDomain/SafeSelect'

export const ROLES = {
	admin: 0x0,
	reviewer: 0x1,
}

export const USD_THRESHOLD = 0

export const DEFAULT_NETWORK = process.env.NEXT_PUBLIC_IS_TEST === 'true' ? '5' : '10'

export const DEFAULT_NOTE = <SafeSelectOption>{
	safeAddress: '',
	networkType: NetworkType.EVM,
	networkId: '',
	networkName: '',
	networkIcon: '',
	safeType: '',
	safeIcon: '',
	amount: 0,
	isNote: true,
	noteDetails: {
		bgColor: 'blue.1',
		color: 'blue.2',
		text: `You will be asked to verify that you own the safe. and have tokens atleast worth ${USD_THRESHOLD} USD in your safe.`,
	}
}

export const INSUFFICIENT_FUNDS_NOTE = <SafeSelectOption>{
	safeAddress: '',
	networkType: NetworkType.EVM,
	networkId: '',
	networkName: '',
	networkIcon: '',
	safeType: '',
	safeIcon: '',
	amount: 0,
	isNote: true,
	noteDetails: {
		bgColor: 'orange.1',
		color: 'orange.2',
		text: `You don’t have tokens atleast worth ${USD_THRESHOLD} USD in your safe. Please add more funds to your safe`,
		link: '',
		linkText: '',
		linkTextColor: '',
	}
}