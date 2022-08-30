import React, { useContext } from 'react'
import {
	Button,
	Divider,
	Flex,
	Image,
	Text,
} from '@chakra-ui/react'
import { ApiClientsContext } from 'pages/_app'
import Loader from 'src/components/ui/loader'
import { CHAIN_INFO } from 'src/constants/chains'
import { formatAmount } from 'src/utils/formattingUtils'
import { getUrlForIPFSHash } from 'src/utils/ipfsUtils'
import { getAssetInfo } from 'src/utils/tokenUtils'
import {
	getSupportedChainIdFromSupportedNetwork,
	getSupportedChainIdFromWorkspace,
} from 'src/utils/validationUtils'

function Accept({
	onSubmit,
	applicationData,
	hasClicked,
}: {
  onSubmit: () => void
  applicationData: any
  hasClicked: boolean
}) {
	const { workspace } = useContext(ApiClientsContext)!
	const chainId = getSupportedChainIdFromWorkspace(workspace)
	let decimals: number
	let icon: string
	let label: string
	if(applicationData.grant.reward.token) {
		decimals = applicationData.grant.reward.token.decimal
		label = applicationData.grant.reward.token.label
		icon = getUrlForIPFSHash(applicationData.grant.reward.token.iconHash)
	} else {
		decimals = CHAIN_INFO[
			getSupportedChainIdFromSupportedNetwork(
				applicationData.grant.workspace.supportedNetworks[0],
			)
		]?.supportedCurrencies[
			applicationData.grant.reward.asset.toLowerCase()
		]?.decimals || 18
		label = getAssetInfo(applicationData?.grant?.reward?.asset, chainId)
			?.label
		icon = getAssetInfo(applicationData?.grant?.reward?.asset, chainId)
			?.icon
	}

	return (
		<Flex
			flexDirection='column'
			w='25vw'
			maxW='1260px'
			alignItems='stretch'
			pb={8}
			px={0}
			ml={0}
		>
			<Text
				fontSize='18px'
				lineHeight='26px'
				fontWeight='700'>
				Accept Grant Application
			</Text>
			<Flex
				direction='row'
				align='center'
				mt={2}>
				<Image src='/ui_icons/funding_asked.svg' />
				<Flex
					ml={4}
					direction='column'
					align='start'>
					<Text
						fontSize='16px'
						lineHeight='24px'
						fontWeight='700'>
						Total Funding Asked
					</Text>
					<Text
						fontSize='14px'
						lineHeight='20px'
						fontWeight='700'
						color='brand.500'
					>
						{
							applicationData
              && formatAmount(
              	applicationData?.fields?.find(
              		(fld: any) => fld?.id?.split('.')[1] === 'fundingAsk',
              	)?.values[0].value || '0',
              	decimals,
              )
						}
						{' '}
						{label}
					</Text>
				</Flex>
			</Flex>
			<Divider
				mt='22px'
				mb='16px' />
			<Text
				fontSize='18px'
				fontWeight='700'
				lineHeight='26px'
				color='#6200EE'>
				Funding split by milestones
			</Text>
			<Flex
				direction='column'
				justify='start'
				align='start'>
				{
					!!applicationData?.milestones?.length && applicationData?.milestones?.map((milestone: any, index: number) => (
						<Flex
							key={milestone.id}
							direction='column'
							mt={6}>
							<Text
								variant='applicationText'
								fontWeight='700'>
								Milestone
								{' '}
								{index + 1}
							</Text>
							<Text
								variant='applicationText'
								color='#717A7C'>
								{milestone?.title}
							</Text>
							<Flex
								direction='row'
								justify='start'
								align='center'
								mt={2}>
								<Image
									boxSize='36px'
									src={icon}
								/>
								<Flex
									direction='column'
									ml={3}>
									<Text
										variant='applicationText'
										fontWeight='700'>
										Milestone Reward
									</Text>
									<Text
										fontSize='14px'
										lineHeight='20px'
										fontWeight='700'
										color='brand.500'
									>
										{
											milestone?.amount
								&& applicationData
								&& formatAmount(
									milestone?.amount,
									decimals,
								)
										}
										{' '}
										{label}
									</Text>
								</Flex>
							</Flex>
						</Flex>
					))
				}
			</Flex>
			<Divider mt={7} />
			<Button
				onClick={() => (hasClicked ? {} : onSubmit())}
				w='100%'
				mt={10}
				py={hasClicked ? 2 : 0}
				variant='primary'
			>
				{hasClicked ? <Loader /> : 'Accept Application'}
			</Button>
		</Flex>
	)
}

export default Accept
