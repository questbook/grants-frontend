import { useState } from 'react'
import { Box, Flex, Heading, Text } from '@chakra-ui/react'
import { CHAIN_INFO } from 'src/constants/chains'
import useChainId from 'src/hooks/utils/useChainId'
import { NetworkSelectOption } from '../SupportedNetworksData'
import AlertBanner from '../UI/Misc/AlertBanner'
import ContinueButton from '../UI/Misc/ContinueButton'
import NetworkSelect from '../UI/Misc/NetworkSelect'


const CreateDaoNetworkSelect = ({
	onSubmit
}: {
	onSubmit: (network: NetworkSelectOption) => void
}) => {
	const [newDaoSelectedNetwork, setNewDaoSelectedNetwork] = useState<NetworkSelectOption>()
	const chainId = useChainId()
	return (
		<>
			<Heading variant={'small'}>
      Which network should the DAO be on?
			</Heading>

			<AlertBanner
				type={chainId ? 'info' : 'warning'}
				message={
					<>
						Your wallet is connected to
						{' '}
						<span style={{ fontWeight: 500, fontSize: '14px' }}>
							{chainId ? CHAIN_INFO[chainId].name : 'Unsupported Network'}
						</span>
						.
					</>
				}
			/>

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

						{
							newDaoSelectedNetwork && chainId !== newDaoSelectedNetwork.id && (
								<Text
									color={'brandSubtext'}
									fontSize={'sm'}
									mt={'auto'}
								>
							Before creating your DAO on-chain, you will be asked to switch the network in your wallet.
								</Text>
							)
						}

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