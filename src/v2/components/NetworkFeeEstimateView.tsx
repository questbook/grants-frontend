import { useEffect, useState } from 'react'
import { Flex, Image, Skeleton, Spacer, Text } from '@chakra-ui/react'
import { BigNumber } from 'ethers'
import { formatEther } from 'ethers/lib/utils'
import { CHAIN_INFO, SupportedChainId } from 'src/constants/chains'
import useChainId from 'src/hooks/utils/useChainId'
import { useProvider } from 'wagmi'

type NetworkFeeEstimateViewProps = {
	chainId?: SupportedChainId
	getEstimate: () => Promise<BigNumber>
}

const NetworkFeeEstimateView = ({ chainId, getEstimate }: NetworkFeeEstimateViewProps) => {
	const inbuiltChainId = useChainId()
	const provider = useProvider()
	const [gasEstimate, setGasEstimate] = useState<string>()

	const symbol = CHAIN_INFO[chainId || inbuiltChainId]?.nativeCurrency.symbol

	useEffect(() => {
		(async() => {
			setGasEstimate(undefined)
			try {
				const estimate = await getEstimate()
				const gasPrice = await provider.getGasPrice()
				setGasEstimate(formatEther(estimate.mul(gasPrice)))
			} catch(e) {
				console.error('error in fetching gas estimate ', e)
				setGasEstimate('NaN')
			}
		})()
	}, [getEstimate, setGasEstimate, provider])

	return (
		<Flex
			mt={14}
			justifyContent={'center'}
		>
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
						fontSize={'xs'}>
              			Network Fee:
						{' '}
						{gasEstimate}
						{' '}
						{symbol}
					</Text>
				</Flex>
			</Skeleton>
		</Flex>
	)
}

export default NetworkFeeEstimateView