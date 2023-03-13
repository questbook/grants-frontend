import { useContext } from 'react'
import { Checkbox, Flex, FlexProps, forwardRef, Image, Text, Tooltip } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { CheckDouble, Close, Resubmit } from 'src/generated/icons'
import { getAvatar } from 'src/libraries/utils'
import { getFieldString, titleCase } from 'src/libraries/utils/formatting'
import { GrantsProgramContext, WebwalletContext } from 'src/pages/_app'
import { formatTime } from 'src/screens/dashboard/_utils/formatters'
import { ProposalType } from 'src/screens/dashboard/_utils/types'
import { DashboardContext } from 'src/screens/dashboard/Context'

type Props = {
	proposal: ProposalType
	step?: boolean
	setStep?: (value: boolean) => void
} & FlexProps

const ProposalCard = forwardRef<Props, 'div'>((props, ref) => {
	const buildComponent = () => (
		<Flex
			ref={ref}
			bg={selectedProposals.has(proposal.id) ? 'gray.1' : 'white'}
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
							color='black.3'>
							{`(${proposal.id}) - ${proposal.state}`}
						</Text>
					)
				}
				<Text
					ml='auto'
					color='gray.5'
					variant='metadata'>
					{formatTime(proposal.updatedAtS)}
				</Text>
			</Flex>
			<Flex
				align='center'
				mt={2}>
				<Image
					borderWidth='1px'
					borderColor='black.1'
					borderRadius='3xl'
					src={getAvatar(false, proposal.applicantId)}
					boxSize='16px' />
				<Text
					ml={2}
					variant='metadata'>
					{getFieldString(proposal, 'applicantName')}
				</Text>
				{
					(proposal?.state !== 'submitted') && (
						<Tooltip
							hasArrow
							label={proposal?.state === 'approved' ? 'Accepted Proposal' : proposal?.state === 'rejected' ? 'Rejected Proposal' : 'Awaiting resubmission'}>
							<Flex
								ml='auto'
								align='center'
								justify='center'
								transition='all .5s ease'
								p={2}
								w={selectedProposals.has(proposal.id) ? '96px' : '32px'}
								borderRadius={selectedProposals.has(proposal.id) ? '12px' : '4px'}
								bg={proposal?.state === 'approved' ? 'accent.columbia' : proposal?.state === 'rejected' ? 'accent.melon' : 'accent.vodka'}>
								{proposal?.state === 'approved' ? <CheckDouble /> : proposal?.state === 'rejected' ? <Close /> : <Resubmit />}
								{
									selectedProposals.has(proposal.id) && (
										<Text
											variant='metadata'
											fontWeight='500'
											ml={1}>
											{titleCase(proposal.state)}
										</Text>
									)
								}
							</Flex>
						</Tooltip>
					)
				}
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
			router.push({
				pathname: '/dashboard',
				query: { ...router.query, proposalId: proposal.id, isRenderingProposalBody: true }
			}, undefined, { shallow: true })
			return
		}

		if(selectedProposals.size === 1 && isText) {
			// Only 1 proposal was selected and the user clicked on its name
			setSelectedProposals(new Set<string>([proposal.id]))
			router.push({
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