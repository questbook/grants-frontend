import { useContext } from 'react'
import { Checkbox, Flex, Image, Text } from '@chakra-ui/react'
import config from 'src/constants/config.json'
import { formatTime } from 'src/screens/dashboard/_utils/formatters'
import { ProposalType } from 'src/screens/dashboard/_utils/types'
import { DashboardContext } from 'src/screens/dashboard/Context'
import getAvatar from 'src/utils/avatarUtils'
import { getFieldString } from 'src/utils/formattingUtils'
import { getUrlForIPFSHash } from 'src/utils/ipfsUtils'

interface Props {
    index: number
    proposal: ProposalType
}

function ProposalCard({ index, proposal }: Props) {
	const buildComponent = () => {
		return (
			<Flex
				bg={selectedProposals[index] ? 'gray.1' : 'white'}
				direction='column'
				mt={2}
				pl={5}
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
						ml={role === 'admin' ? 2 : 0}
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
						src={role === 'builder' ? (proposal?.grant?.workspace?.logoIpfsHash === config.defaultDAOImageHash ? getAvatar(true, proposal?.grant?.workspace?.title) : getUrlForIPFSHash(proposal?.grant?.workspace?.logoIpfsHash!)) : getAvatar(false, proposal.applicantId)}
						boxSize='16px' />
					<Text
						ml={2}
						variant='v2_metadata'>
						{role === 'builder' ? proposal?.grant?.workspace?.title : getFieldString(proposal, 'applicantName')}
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