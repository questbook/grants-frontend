import { USD_THRESHOLD } from "src/constants";
import { NetworkType } from "src/constants/Networks";
import { SafeSelectOption } from "../components/Onboarding/CreateDomain/SafeSelect";

const getTezosSafeDetails = async(tezosAddress: string): Promise<SafeSelectOption | null> => {
	// const tokenListAndBalance = await getTokenAndbalance(tezosAddress);
	let usdAmount = 0;
	// tokenListAndBalance.map((obj:any)=>{
	// 	usdAmount += obj.usdValueAmount
	// })
	return {
		safeAddress: tezosAddress,
		networkType: NetworkType.Tezos,
		networkId: '900002', // A costum value for Solana as it's not EVM.
		networkName: 'Tezos',
		networkIcon: '/ui_icons/tezos-xtz-logo.png',
		safeType: 'TzSign',
		safeIcon: '/ui_icons/tezos-xtz-logo.png',
		amount: usdAmount, // 1000
		isDisabled: usdAmount < USD_THRESHOLD
	}
}

export {getTezosSafeDetails}