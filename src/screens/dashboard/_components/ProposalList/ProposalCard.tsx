import { useContext } from 'react'
import { Checkbox, Flex, Image, Text } from '@chakra-ui/react'
import { formatTime } from 'src/screens/dashboard/_utils/formatters'
import { ProposalType } from 'src/screens/dashboard/_utils/types'
import { DashboardContext } from 'src/screens/dashboard/Context'
import getAvatar from 'src/utils/avatarUtils'
import { getFieldString } from 'src/utils/formattingUtils'

interface Props {
    index: number
    proposal: ProposalType
}

function ProposalCard({ index, proposal }: Props) {
	const buildComponent = () => {
		return (
			<Flex
				direction='column'
				mt={2}
				pr={2}
				py={2}>
				<Flex align='center'>
					{
						role === 'admin' && (
							<Checkbox
								isChecked={selectedProposals[index]}
								spacing={1}
								onChange={
									() => {
										onClick()
									}
								} />
						)
					}
					<Text
						ml={2}
						variant='v2_body'
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
								variant='v2_metadata'
								color='black.3'>
								{`(${proposal.id})`}
							</Text>
						)
					}
					<Text
						ml='auto'
						color='gray.5'
						variant='v2_metadata'>
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
						variant='v2_metadata'>
						{getFieldString(proposal, 'applicantName')}
					</Text>
				</Flex>
			</Flex>
		)
	}

	const { role, selectedProposals, setSelectedProposals } = useContext(DashboardContext)!

	const onClick = (isText: boolean = false) => {
		const count = selectedProposals.filter((_) => _).length
		if(count === 1 && selectedProposals[index]) {
			return
		}

		const copy = isText ? Array(selectedProposals.length).fill(false) : [...selectedProposals]
		copy[index] = !copy[index]
		setSelectedProposals(copy)
	}

	return buildComponent()
}

export default ProposalCard