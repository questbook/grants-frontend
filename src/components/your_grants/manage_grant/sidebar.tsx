import React from 'react'
import {
	Box, Button, Divider, Flex, Image, Link,
	Text,
} from '@chakra-ui/react'
import { BigNumber } from 'ethers'
import AddFunds from 'src/components/funds/add_funds_modal'
import Modal from 'src/components/ui/modal'
import FloatingSidebar from 'src/components/ui/sidebar/floatingSidebar'
import ApproveFundModal from 'src/components/your_grants/manage_grant/modals/ApproveFundModalContent'
import SendFundModalContent from 'src/components/your_grants/manage_grant/modals/sendFundModalContent'
import config from 'src/constants/config.json'
import { formatAmount, getExplorerUrlForAddress } from 'src/utils/formattingUtils'
import { getSupportedChainIdFromSupportedNetwork } from 'src/utils/validationUtils'

interface Props {
	grant: any
	assetInfo: any
	milestones: any[]
	applicationId: string
	applicantId: string
	workspaceId: string
	decimals: number
}

function Sidebar({
	grant, assetInfo, milestones, applicationId, applicantId, workspaceId, decimals,
}: Props) {
	const [isAddFundModalOpen, setIsAddFundModalOpen] = React.useState(false)
	const [isSendFundModalOpen, setIsSendFundModalOpen] = React.useState(false)
	const [isApproveModalOpen, setIsApproveModalOpen] = React.useState(false)
	return (
		<Box my='154px'>
			<FloatingSidebar>
				<Text
					variant='applicationText'
					color='#414E50'>
					Funds available for disbursal
				</Text>
				<Flex
					direction='row'
					justify='start'
					align='center'>
					<Image
						h='26px'
						w='26px'
						src={assetInfo?.icon}
						alt='eth'
					/>
					<Box mx={1} />
					<Text
						fontWeight='700'
						fontSize='26px'
						lineHeight='40px'>
						{grant && grant.funding ? formatAmount(grant?.funding, decimals) : null}
					</Text>
					<Box mr={3} />
					{/* {
						grant && parseInt(grant.funding, 10) > 0 && (
							<Button
								variant="link"
								_focus={{}}
								color="brand.500"
								onClick={() => setIsAddFundModalOpen(true)}
							>
              Add Funds
							</Button>
						)
					} */}
				</Flex>
				{
					grant && parseInt(grant.funding, 10) === 0 && (
						<>
							<Text
								fontSize='14px'
								lineHeight='20px'
								letterSpacing={0.5}
								fontWeight='400'
								mt={3}
							>
								Is your DAO using a multi-sig?
							</Text>
							<Text
								fontSize='14px'
								lineHeight='20px'
								letterSpacing={0.5}
								fontWeight='400'
								mt={3}
							>
								One multi-sig approval for all milestones.
							</Text>
							<Text
								fontSize='14px'
								lineHeight='20px'
								letterSpacing={0.5}
								fontWeight='400'
								mt={3}
							>
								Add funds to your
								{' '}
								<Link
									href={
										getExplorerUrlForAddress(
											getSupportedChainIdFromSupportedNetwork(grant.workspace.supportedNetworks[0]),
											grant?.id || ''
										)
									}
									fontWeight='700'
									color='brand.500'
									isExternal
								>
									verified grant smart contract
									{' '}
									<Image
										src='/ui_icons/link.svg'
										alt='link'
										display='inline-block'
									/>
								</Link>
								{' '}
								to fund grantees in 1 click.
							</Text>
							<Button
								variant='primary'
								mt={6}
								onClick={() => setIsAddFundModalOpen(true)}
							>
								Add Funds
							</Button>
						</>
					)
				}
				<Divider mt={3} />
				<Text
					fontSize='14px'
					lineHeight='20px'
					letterSpacing={0.5}
					fontWeight='400'
					mt='19px'
				>
					{
						grant && parseInt(grant.funding, 10) > 0
							? 'Send funds from your wallet or verified grant smart contract'
							: 'Send funds from your wallet'
					}
				</Text>
				<Button
					variant='primary'
					mt={6}
					onClick={() => setIsAddFundModalOpen(true)}
				>
					Add Funds
				</Button>
				<Button
					mt='22px'
					variant='outline'
					color='Background.500'
					h='48px'
					w='100%'
					onClick={() => setIsApproveModalOpen(true)}>
					Approve Fund Disbursal
				</Button>
				<Button
					mt='22px'
					variant='outline'
					color='brand.500'
					borderColor='brand.500'
					h='48px'
					w='100%'
					onClick={() => setIsSendFundModalOpen(true)}
				>
					Send Funds
				</Button>
				{
					grant && (
						<AddFunds
							isOpen={isAddFundModalOpen}
							onClose={() => setIsAddFundModalOpen(false)}
							grantAddress={grant.id}
							rewardAsset={
								{
									address: grant.reward.asset,
									committed: BigNumber.from(grant.reward.committed),
									label: assetInfo?.label,
									icon: assetInfo?.icon,
								}
							}
						/>
					)
				}
				{
					grant && (
						<Modal
							isOpen={isSendFundModalOpen}
							onClose={() => setIsSendFundModalOpen(false)}
							title='Send Funds'
							rightIcon={
								(
									<Button
										_focus={{}}
										variant='link'
										color='#AA82F0'
										leftIcon={<Image src='/sidebar/discord_icon.svg' />}
										onClick={() => window.open(config.supportLink)}
									>
										Support 24*7
									</Button>
								)
							}
						>
							<SendFundModalContent
								isOpen={isSendFundModalOpen}
								milestones={milestones}
								rewardAsset={
									{
										address: grant.reward.asset,
										committed: BigNumber.from(grant.reward.committed),
										label: assetInfo?.label,
										icon: assetInfo?.icon,
										decimals,
									}
								}
								contractFunding={grant.funding}
								onClose={() => setIsSendFundModalOpen(false)}
								grantId={grant.id}
								applicantId={applicantId}
								applicationId={applicationId}
							/>
						</Modal>
					)
				}

				{
					grant && (
						<Modal
							isOpen={isApproveModalOpen}
							onClose={() => setIsApproveModalOpen(false)}
							title='Approve Fund Disbursal'
							modalWidth='600px'
							rightIcon={
								(
									<Button
										_focus={{}}
										variant='link'
										color='#AA82F0'
										onClick={() => window.open(config.supportLink)}
									>
										Why? Learn More Here
									</Button>
								)
							}
						>
							<ApproveFundModal
								isOpen={isApproveModalOpen}
								rewardAsset={
									{
										address: grant.reward.asset,
										committed: BigNumber.from(grant.reward.committed),
										label: assetInfo?.label,
										icon: assetInfo?.icon,
										decimals,
									}
								}
								onClose={() => setIsApproveModalOpen(false)} />
						</Modal>
					)
				}
			</FloatingSidebar>
		</Box>
	)
}

export default Sidebar
