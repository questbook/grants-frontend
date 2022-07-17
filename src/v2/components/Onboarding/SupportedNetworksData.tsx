import { Image } from '@chakra-ui/react'
import { OptionBase } from 'chakra-react-select'
import { ALL_SUPPORTED_CHAIN_IDS, CHAIN_INFO } from 'src/constants/chains'
import safeNetwork from 'src/constants/safeNetwork.json'
import SupportedChainId from 'src/generated/SupportedChainId'

export interface NetworkSelectOption extends OptionBase {
	id: SupportedChainId,
  label: string;
  icon: JSX.Element;
}

// export const supportedNetworks: { [networkName: string]: NetworkSelectOption } =
//   {
//   	polygon: {
//   		label: 'Polygon',
//   		icon: <Polygon />,
//   	},
//   	optimism: {
//   		label: 'Optimism',
//   		icon: <Optimism />,
//   	},
//   }


const solana = {
	id: safeNetwork['900001'].daoChainId,
	label: safeNetwork['900001'].name,
	icon: (
		<Image
			src={safeNetwork['900001'].icon}
			boxSize={5} />
	),
}

const allchains = ALL_SUPPORTED_CHAIN_IDS.map((chainId) => ({
	id: chainId,
	label: CHAIN_INFO[chainId].name,
	icon: (
		<Image
			src={CHAIN_INFO[chainId].icon}
			boxSize={5} />
	),
}))
export const supportedNetworks = [...allchains, solana]
