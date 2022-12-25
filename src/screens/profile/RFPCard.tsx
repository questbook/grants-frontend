import { Button, Divider, Flex, Text } from '@chakra-ui/react'
import { MONTH_MAP } from 'src/libraries/utils/constants'
import RFPStats from 'src/screens/profile/RFPStats'

interface Props {
	RFPTitle: string
	amountPaid: string
	startDate: string
	endDate: string
	numberOfProposals: number
	acceptingApplications: boolean
	grantProgramId: string
	chainId: number
}

function RFPCard({
	RFPTitle,
	amountPaid,
	startDate,
	endDate,
	numberOfProposals,
	acceptingApplications,
	grantProgramId,
	chainId }: Props) {

	const formattedStartDate = extractDate(startDate)
	const formattedEndDate = extractDate(endDate)

	const href = window.location.href.split('/')
	const protocol = href[0]
	const domain = href[2]

	const grantProgramUrl = `${protocol}//${domain}/proposal_form/?grantId=${grantProgramId}&chainId=${chainId}`

	return (
		<Flex
			direction='column'
			gap={4}
		>
			<Flex alignItems='center'>
				<Text
					variant='v2_subheading'
					fontWeight='500'
				>
					{' '}
					{RFPTitle}
					{' '}
				</Text>
				<Text
					variant='v2_body'
					fontWeight='500'
					ml={2}
					px={2}
					borderRadius='4px'
					bg={acceptingApplications ? 'accent.june' : 'accent.royal'}>
					{acceptingApplications ? 'OPEN' : 'CLOSED'}
				</Text>
			</Flex>

			<Flex
				w='100%'
				gap={4}
				// alignItems='center'
			>
				<RFPStats
					value={`$${amountPaid}`}
					text='paid' />
				<RFPStats
					value={`${formattedStartDate} - ${formattedEndDate}`}
					text='accepting proposals from' />
				<RFPStats
					value={numberOfProposals.toString()}
					text='proposals' />
				<Button
					variant='primaryMedium'
					onClick={
						() => {
							window.open(grantProgramUrl, '_blank')
						}
					}
				>
					Submit Proposal
				</Button>
			</Flex>
			<Divider />
		</Flex>
	)

	function extractDate(date: string) {
		if(!date) {
			return ''
		}

		const splittedDate = date.split('T')[0]
		const [year, month, day] = splittedDate.split('-')
		return `${day} ${MONTH_MAP[month]}, ${year}`
	}
}

export default RFPCard