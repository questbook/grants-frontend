import React from 'react'
import {
	Box, Button, Divider, Flex, Image, Link,
	Text, } from '@chakra-ui/react'
import { BigNumber } from 'ethers'
import config from 'src/constants/config.json'
import { getSupportedChainIdFromSupportedNetwork } from 'src/utils/validationUtils'
import { formatAmount, getExplorerUrlForAddress } from '../../../utils/formattingUtils'
import AddFunds from '../../funds/add_funds_modal'
import Modal from '../../ui/modal'
import FloatingSidebar from '../../ui/sidebar/floatingSidebar'
import SendFundModalContent from './modals/sendFundModalContent'
import { GrantApplication } from 'src/generated/graphql'

interface Props {
  grant: any;
  assetInfo: any;
  milestones: any[];
  applicationId: string;
  decimals: number;
  applicationData: GrantApplication
}

function Sidebar({
	grant, assetInfo, milestones, applicationId, decimals, applicationData
}: Props) {
	const [isAddFundModalOpen, setIsAddFundModalOpen] = React.useState(false)
	const [isSendFundModalOpen, setIsSendFundModalOpen] = React.useState(false)
	const getStringField = (fieldName: string) => applicationData?.fields?.find(({ id }) => id.split('.')[1] === fieldName)

	return (
		<Box my="154px">
			<FloatingSidebar>
				<Button
					mt="22px"
					variant="outline"
					color="brand.500"
					borderColor="brand.500"
					h="48px"
					w="100%"
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
							title="Send Funds"
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
										chainId: 80001, //todo@madhavan assetInfo?.chainId
										decimals,
									}
								}
								onClose={() => setIsSendFundModalOpen(false)}
								grantId={grant.id}
								applicationId={applicationId}
								safe={{
									address: 'CFejqDTfiaGk3BE84ykcYugdQtYthcaZ4GL8ZngYDRE5', //todo@madhavan: grant.workspace.safe.address,
									chain: 80001,//todo@madhavan: grant.workspace.safe.chain,
								}}
								chainId={getSupportedChainIdFromSupportedNetwork(grant.workspace.supportedNetworks[0])}
								applicantReceivingAddress={(getStringField('receivingAddress') && getStringField('receivingAddress')!.values.length > 0) ? getStringField('receivingAddress')?.values[0].value : undefined}
							/>
						</Modal>
					)
				}
			</FloatingSidebar>
		</Box>
	)
}

export default Sidebar
