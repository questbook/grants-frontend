import { useContext } from 'react'
import { Checkbox, Flex, FlexProps, forwardRef, Image, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { getAvatar } from 'src/libraries/utils'
import { getFieldString } from 'src/libraries/utils/formatting'
import { GrantsProgramContext, WebwalletContext } from 'src/pages/_app'
import StateTag from 'src/screens/dashboard/_components/StateTag'
import { formatTime } from 'src/screens/dashboard/_utils/formatters'
import { ProposalType } from 'src/screens/dashboard/_utils/types'
import { DashboardContext } from 'src/screens/dashboard/Context'
import StateButton from 'src/screens/discover/_components/stateButton'
import { completedProposals, inActiveProposals } from 'src/screens/grantees/_utils/constants'

type Props = {
	proposal: ProposalType
	step?: boolean
	setStep?: (value: boolean) => void
	type?: 'updatedAtS' | 'createdAtS'
} & FlexProps

const ProposalCard = forwardRef<Props, 'div'>((props, ref) => {
	const buildComponent = () => (
		<Flex
			ref={ref}
			bg={selectedProposals.has(proposal.id) ? 'gray.100' : 'white'}
			direction='column'
			// mt={2}
			pl={5}
			pr={2}
			py={4}
			borderBottom='1px solid #E7E4DD'
			{...props}>
			<Flex align='center'>
				{
					role === 'admin' && (
						<Checkbox
							isChecked={selectedProposals.has(proposal.id)}
							spacing={1}
							onChange={
								() => {
									onClick()
								}
							} />
					)
				}
				<Text
					ml={role === 'admin' ? 2 : 0}
					variant='body'
					fontWeight='500'
					cursor='pointer'
					maxWidth='80%'
					onClick={
						() => {
							onClick(true)
						}
					}
					_hover={{ textDecoration: 'underline' }}
				>
					{getFieldString(proposal, 'projectName')}
				</Text>
				{
					process.env.NODE_ENV === 'development' && (
						<Text
							ml={2}
							variant='metadata'
							color='black.300'>
							{`(${proposal.id}) - ${proposal.state}`}
						</Text>
					)
				}
				<Text
					alignSelf='flex-start'
					ml='auto'
					color='gray.500'
					variant='metadata'>
					{/* {formatTime(proposal.updatedAtS, true)} */}
					{formatTime(proposal[props.type || 'updatedAtS'], true)}
				</Text>
			</Flex>
			{
				proposal?.migratedFrom?.title && (
					<Flex
						align='center'
						w='fit-content'
						py={1}
						px={2}
						mt={2}
						borderRadius='18px'
						border='1px solid'
						bg='#0A84FF66'
						borderColor='#0A84FF66'
					>

						<Text
							variant='metadata'
							fontWeight='500'
							fontSize='10px'
						>
							{proposal?.migratedFrom?.title}
						</Text>
					</Flex>
				)
			}
			<Flex
				align='center'
				mt={2}>
				<Image
					borderWidth='1px'
					borderColor='black.100'
					borderRadius='3xl'
					src={getAvatar(false, proposal.applicantId)}
					boxSize='16px' />
				<Text
					ml={2}
					variant='metadata'>
					{getFieldString(proposal, 'applicantName')}
				</Text>
				<Flex
					ml='auto'
					gap={2}
				>
					{
						(proposal?.state === 'approved') && (inActiveProposals?.includes(proposal?.id)) && (
							<StateButton
								state='rejected'
								title='Inactive'
							/>
						)
					}
					{
						(proposal?.state === 'approved') && ((proposal.milestones.filter((milestone) => parseFloat(milestone.amountPaid) > 0).length === proposal.milestones.length) || completedProposals?.includes(proposal?.id)) && (
							<StateButton
								state='approved'
								title='Completed'
							/>
						)
					}
					{
						(proposal?.state !== 'submitted') && (
							<StateTag
								ml='auto'
								state={proposal?.state}
								isSelected={selectedProposals.has(proposal.id)}
							/>
						)
					}
				</Flex>

			</Flex>

		</Flex>
	)

	const router = useRouter()
	const { proposal } = props
	const { setDashboardStep } = useContext(WebwalletContext)!
	const { selectedProposals, setSelectedProposals } = useContext(DashboardContext)!
	const { role } = useContext(GrantsProgramContext)!
	// const { tags } = useProposalTags({ proposal })

	const onClick = (isText: boolean = false) => {
		if(selectedProposals.size === 1 && selectedProposals.has(proposal.id)) {
			// Only 1 proposal was selected and the user clicked on it again
			setDashboardStep(true)
			router.replace({
				pathname: '/dashboard',
				query: { ...router.query, proposalId: proposal.id, isRenderingProposalBody: true }
			}, undefined, { shallow: true })
			return
		}

		if(selectedProposals.size === 1 && isText) {
			// Only 1 proposal was selected and the user clicked on its name
			setSelectedProposals(new Set<string>([proposal.id]))
			router.replace({
				pathname: '/dashboard',
				query: { ...router.query, proposalId: proposal.id, isRenderingProposalBody: true }
			}, undefined, { shallow: true })
			setDashboardStep(true)
		} else {
			// Either more proposals are selected or the user clicked on the checkbox
			// In both cases, we want to add / remove the proposal to / from the set respectively

			const newSet = new Set<string>(selectedProposals)
			if(newSet.has(proposal.id)) {
				newSet.delete(proposal.id)
			} else {
				newSet.add(proposal.id)
			}

			setSelectedProposals(newSet)
		}
	}

	return buildComponent()
}
)
export default ProposalCard