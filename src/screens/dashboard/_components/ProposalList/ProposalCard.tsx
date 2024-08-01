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

type Props = {
	proposal: ProposalType
	step?: boolean
	setStep?: (value: boolean) => void
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
					(role === 'admin' || role === 'reviewer') && (
						<Flex
							align='center'
							w='fit-content'
							py={1}
							px={2}
							mt={0}
							ml={3}
							mr={2}
							borderRadius='10px'
							border='1px solid'
							bg='#0A84FF66'
							borderColor='#0A84FF66'
						>

							<Text
								variant='metadata'
								fontWeight='500'
								fontSize='10px'
							>
								{
									proposal?.reviews?.filter((review, index, self) => index === self.findIndex((r) => r.reviewer?.id === review.reviewer?.id)
									).reduce((acc: number, review) => {
										//@ts-ignore
										return acc + (review?.publicReviewDataHash?.items?.reduce((acc, item) => {
											return acc + item.rating
										}, 0) || 0)
									}, 0)
								}
							</Text>
						</Flex>
					)
				}

				<Text
					alignSelf='flex-start'
					ml='auto'
					color='gray.500'
					variant='metadata'>
					{formatTime(proposal.updatedAtS, true)}
				</Text>


			</Flex>

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