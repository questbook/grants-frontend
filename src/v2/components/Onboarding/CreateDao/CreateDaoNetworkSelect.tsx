import { useEffect, useState } from 'react'
import { Box, Flex, Heading, Text } from '@chakra-ui/react'
import { CHAIN_INFO } from 'src/constants/chains'
import useChainId from 'src/hooks/utils/useChainId'
import { NetworkSelectOption, supportedNetworks } from '../SupportedNetworksData'
import AlertBanner from '../UI/Misc/AlertBanner'
import ContinueButton from '../UI/Misc/ContinueButton'
import NetworkSelect from '../UI/Misc/NetworkSelect'


const CreateDaoNetworkSelect = ({
	onSubmit,
	daoNetwork,
}: {
	onSubmit: (network: NetworkSelectOption) => void,
	daoNetwork: NetworkSelectOption | undefined
}) => {
	const [newDaoSelectedNetwork, setNewDaoSelectedNetwork] = useState<NetworkSelectOption>()
	const chainId = useChainId()

	useEffect(() => {
		if(!newDaoSelectedNetwork && !daoNetwork) {
			const currentSupportedNetwork = supportedNetworks.find((network) => network.id === chainId)
			console.log(currentSupportedNetwork)
			setNewDaoSelectedNetwork(currentSupportedNetwork)
		}
	}, [chainId])

	useEffect(() => {
		if(daoNetwork) {
			setNewDaoSelectedNetwork(daoNetwork)
		}
	}, [daoNetwork])

	return (
		<>
			<Heading variant={'small'}>
      			Which network are your funds on?
			</Heading>
			<Text
				color={'brandSubtext'} 
				variant={'small'}>
					Select the network on which your multi-sig safe resides
			</Text>

			<Flex
				alignItems={'stretch'}
				mt={4}>
				<Flex
					flex={1}
					alignItems={'flex-start'}
				>
					<Text
						fontWeight={'500'}
						mt={2}>
					Network
					</Text>
					<Box mr={7} />
					<Flex
						w={'full'}
						direction={'column'}
						h={'full'}
					>
						<NetworkSelect
							value={newDaoSelectedNetwork}
							onChange={(newValue) => newValue && setNewDaoSelectedNetwork(newValue)}
							placeholder="Select a network"
						/>

					</Flex>
				</Flex>
				<ContinueButton
					onClick={() => onSubmit(newDaoSelectedNetwork!)}
					disabled={!newDaoSelectedNetwork}
					props={
						{
							ml: 5,
							mt: 16,
							variant: 'primaryLightV2'
						}
					}
				/>
			</Flex>
		</>
	)
}

export default CreateDaoNetworkSelect