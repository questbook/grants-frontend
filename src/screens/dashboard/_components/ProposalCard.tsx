import { useContext } from 'react'
import { Checkbox, Flex, Image, Text } from '@chakra-ui/react'
import { formatTime } from 'src/screens/dashboard/_utils/formatters'
import { Proposal } from 'src/screens/dashboard/_utils/types'
import { DashboardContext } from 'src/screens/dashboard/Context'
import getAvatar from 'src/utils/avatarUtils'
import { getFieldString } from 'src/utils/formattingUtils'

interface Props {
    index: number
    proposal: Proposal
}

function ProposalCard({ index, proposal }: Props) {
	const buildComponent = () => {
		return (
			<Flex
				direction='column'
				mt={2}
				py={2}>
				<Flex align='center'>
					<Checkbox
						isChecked={selectedProposals[index]}
						spacing={1}
						onChange={onClick}>
						<Text
							variant='body'
							fontWeight='500'
							cursor='pointer'
							_hover={{ textDecoration: 'underline' }}
						>
							{getFieldString(proposal, 'projectName')}
						</Text>
					</Checkbox>
					<Text
						ml='auto'
						color='gray.5'
						variant='metadata'>
						{formatTime(proposal.updatedAtS)}
					</Text>
				</Flex>
				<Flex
					align='center'
					mt={1}>
					<Image
						borderWidth='1px'
						borderColor='black.1'
						borderRadius='3xl'
						src={getAvatar(false, proposal.applicantId)}
						boxSize='16px' />
					<Text
						ml={1}
						variant='metadata'>
						{getFieldString(proposal, 'applicantName')}
					</Text>
				</Flex>
			</Flex>
		)
	}

	const { selectedProposals, setSelectedProposals } = useContext(DashboardContext)!

	const onClick = () => {
		const copy = [...selectedProposals]
		copy[index] = !copy[index]
		setSelectedProposals(copy)
	}

	return buildComponent()
}

export default ProposalCard