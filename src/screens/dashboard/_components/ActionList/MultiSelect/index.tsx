import { useContext } from 'react'
import { Button, Divider, Flex, Text } from '@chakra-ui/react'
import { RawDraftContentState } from 'draft-js'
import { useSafeContext } from 'src/contexts/safeContext'
import { QBAdminsContext } from 'src/hooks/QBAdminsContext'
import useCustomToast from 'src/libraries/hooks/useCustomToast'
import logger from 'src/libraries/logger'
import { GrantsProgramContext } from 'src/pages/_app'
import { DashboardContext, FundBuilderContext, ModalContext } from 'src/screens/dashboard/Context'
import { getFieldStrings } from 'src/utils/formattingUtils'

function MultiSelect() {
	const buildComponent = () => {
		return (
			<Flex
				px={5}
				py={4}
				direction='column'>
				<Text fontWeight='500'>
					Batch actions
				</Text>
				<Button
					w='100%'
					variant='primaryMedium'
					bg='gray.3'
					mt={4}
					isDisabled={role !== 'admin'}
					onClick={
						() => {
							setIsSendAnUpdateModalOpen(true)
						}
					}>
					<Text
						variant='v2_body'
						fontWeight='500'>
						Send an update to selected builders
					</Text>
				</Button>
				<Flex
					align='center'
				>
					<Divider />
					<Text
						mx={3}
						variant='v2_body'
						fontWeight='500'
						color='gray.5'>
						OR
					</Text>
					<Divider />
				</Flex>
				<Button
					w='100%'
					mt={4}
					variant='primaryMedium'
					isDisabled={role !== 'admin'}
					onClick={
						() => {
							if(safeObj) {
								setIsDrawerOpen(true)
							} else {
								customToast({
									title: 'No multi sig connected for batched payout',
									status: 'error',
									duration: 3000,
								})
							}
						}
					}>
					<Text
						variant='v2_body'
						fontWeight='500'
						color='white'>
						Payout selected builders
					</Text>
				</Button>
				{
					isQbAdmin && (
						<Button
							w='100%'
							mt={4}
							variant='primaryMedium'
							isDisabled={role !== 'admin'}
							onClick={exportData}>
							<Text
								variant='v2_body'
								fontWeight='500'
								color='white'>
								Export data
							</Text>
						</Button>
					)
				}
			</Flex>
		)
	}

	const { isQbAdmin } = useContext(QBAdminsContext)!
	const { decryptedProposals } = useContext(DashboardContext)!
	const { role } = useContext(GrantsProgramContext)!
	const { setIsDrawerOpen } = useContext(FundBuilderContext)!
	const { setIsSendAnUpdateModalOpen } = useContext(ModalContext)!
	const { safeObj } = useSafeContext()
	const customToast = useCustomToast()

	const parseDetails = (details: RawDraftContentState) => {
		const blocks = details.blocks
		const mappedBlocks = blocks.map(
			block => (!block.text.trim() && '\n') || block.text
		)

		let newText = ''
		for(let i = 0; i < mappedBlocks.length; i++) {
			const block = mappedBlocks[i]

			// handle last block
			if(i === mappedBlocks.length - 1) {
				newText += block
			} else {
				// otherwise we join with \n, except if the block is already a \n
				if(block === '\n') {
					newText += block
				} else {
					newText += block + '\n'
				}
			}
		}

		return newText
	}

	const exportData = async() => {
		const rows = []
		for(const proposalId in decryptedProposals) {
			// logger.info('proposalId', proposalId)
			// logger.info('decryptedProposals[proposalId]', decryptedProposals[proposalId])

			const proposal = decryptedProposals[proposalId]
			const json: {[key: string]: string} = { 'ID': proposalId, 'State': proposal?.state }
			for(const field of proposal.fields) {
				if(field.id.includes('isMultipleMilestones') || field.id.includes('teamMembers') || field.id.includes('memberDetails')) {
					continue
				}

				let title = field.id.split('.')[1]
				if(field.values.length === 1) {
					if(title.startsWith('customField')) {
						title = title.split('-')[1].replaceAll('\\s', ' ').replaceAll('"', '').trim()
					} else {
						title = title.replace(/([A-Z])/g, ' $1')
						title = title.charAt(0).toUpperCase() + title.slice(1)
					}

					if(field.id.includes('projectDetails')) {
						json[title] = parseDetails(JSON.parse(field.values[0].value))
					} else {
						json[title] = field.values[0].value
					}
				}
			}

			json['Member Details'] = getFieldStrings(proposal, 'memberDetails')?.map((m: string, i: number) => `${i + 1}. ${m}`).join('\n')
			json['Milestones'] = proposal.milestones.map((m, i) => `${i + 1}. ${m.title} - ${m.amount} USD`).join('\n')

			rows.push(json)
		}

		logger.info(rows)
	}

	return buildComponent()
}

export default MultiSelect