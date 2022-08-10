import { useContext, useEffect, useState } from 'react'
import { Flex, Image, Skeleton, Spacer, Text } from '@chakra-ui/react'
import { BigNumber } from 'ethers'
import { formatEther } from 'ethers/lib/utils'
import { ApiClientsContext } from 'pages/_app'
import { CHAIN_INFO, defaultChainId, SupportedChainId } from 'src/constants/chains'
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils'
import { useProvider } from 'wagmi'

type NetworkFeeEstimateViewProps = {
	chainId?: SupportedChainId
	getEstimate: () => Promise<BigNumber | undefined>
}

const NetworkFeeEstimateView = ({ chainId, getEstimate }: NetworkFeeEstimateViewProps) => {
	const { workspace } = useContext(ApiClientsContext)!
	const [gasEstimate, setGasEstimate] = useState<string>()
	chainId = chainId || getSupportedChainIdFromWorkspace(workspace) || defaultChainId

	const provider = useProvider({ chainId })

	const symbol = CHAIN_INFO[chainId]?.nativeCurrency.symbol

	useEffect(() => {
		(async() => {
			setGasEstimate(undefined)
			try {
				const estimate = await getEstimate()
				if(estimate) {
					const gasPrice = await provider.getGasPrice()
					setGasEstimate(formatEther(estimate.mul(gasPrice)))
				} else {
					setGasEstimate(undefined)
				}
			} catch(e) {
				console.error('error in fetching gas estimate ', e)
				setGasEstimate('NaN')
			}
		})()
	}, [getEstimate, setGasEstimate, provider])

	return (
		<Skeleton isLoaded={gasEstimate !== undefined}>
			<Flex
				bg='#F0F0F7'
				align='center'
				borderRadius='base'
				p='1'
				px={3}>
				<Image
					src='/ui_icons/gas_station.svg'
					h='4' />
				<Spacer w='1' />
				<Text
					fontSize='xs'>
              		Network Fee:
					{' '}
					{gasEstimate}
					{' '}
					{symbol}
				</Text>
			</Flex>
		</Skeleton>
	)
}

export default NetworkFeeEstimateView