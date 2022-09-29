import { useMemo } from 'react'
import { Button, Flex, Image, Text } from '@chakra-ui/react'
import ActionItem from 'src/screens/proposal/_components/MilestoneItem/ActionItem'
import { ActionItemType, MilestoneItemType } from 'src/screens/proposal/_types'
import { formatAmount } from 'src/utils/formattingUtils'

function MilestoneItem({ milestone, index, token, disbursedMilestones, onModalOpen }: MilestoneItemType) {
	const buildComponent = () => {
		return (
			<Flex
				w='100%'
				direction='column'
				bg='white'
			>
				<Flex align='center'>
					<Text
						color='black.3'
						variant='v2_metadata'
						fontWeight='500'>
						{`Milestone ${index + 1}`}
					</Text>
					<Image
						mx={2}
						src='/ui_icons/ellipse.svg'
						boxSize='4px' />
					<Text
						color='black.3'
						variant='v2_metadata'
						fontWeight='500'>
						{`${formatAmount(milestone.amount, token?.decimals, true)} ${token?.label}`}
					</Text>
				</Flex>
				<Text
					mt={1}
					variant='v2_body'>
					{milestone.title}
				</Text>
				{
					actionItems.map((actionItem, index) => (
						<ActionItem
							key={index}
							item={actionItem} />
					))
				}
				{
					milestone.state !== 'approved' && (
						<Button
							mt={4}
							bg='white'
							borderRadius='2px'
							border='1px solid #785EF0'
							onClick={onModalOpen}>
							<Text
								variant='v2_body'
								fontWeight='500'
								color='violet.2'>
								Mark as Done
							</Text>
						</Button>
					)
				}
			</Flex>
		)
	}

	const actionItems = useMemo(() => {
		const items: ActionItemType[] = disbursedMilestones?.map((fundTransfer) => {
			return { type: 'fund_sent', amount: `${formatAmount(fundTransfer.amount, token?.decimals, true)} ${token?.label}`, time: fundTransfer.createdAtS }
		})

		if(milestone?.feedbackDao) {
			items.push({ type: 'feedback_dao', feedback: milestone?.feedbackDao, time: milestone.feedbackDaoUpdatedAtS! })
		}

		if(milestone?.feedbackDev) {
			items.push({ type: 'feedback_dev', feedback: milestone?.feedbackDev, time: milestone.feedbackDevUpdatedAtS! })
		}

		items.sort((a, b) => b.time - a.time)
		return items
	}, [])

	return buildComponent()
}

export default MilestoneItem