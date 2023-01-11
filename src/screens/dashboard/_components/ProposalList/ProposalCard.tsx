import { useContext, useEffect } from 'react'
import { Checkbox, Flex, Image, Text } from '@chakra-ui/react'
import config from 'src/constants/config.json'
import { CheckDouble, Close } from 'src/generated/icons'
import logger from 'src/libraries/logger'
import useProposalTags from 'src/screens/dashboard/_hooks/useProposalTags'
import { formatTime } from 'src/screens/dashboard/_utils/formatters'
import { ProposalType } from 'src/screens/dashboard/_utils/types'
import { DashboardContext } from 'src/screens/dashboard/Context'
import getAvatar from 'src/utils/avatarUtils'
import { getFieldString } from 'src/utils/formattingUtils'
import { getUrlForIPFSHash } from 'src/utils/ipfsUtils'

interface Props {
    proposal: ProposalType
}

function ProposalCard({ proposal }: Props) {
	const buildComponent = () => {
		return (
			<Flex
				bg={selectedProposals.has(proposal.id) ? 'gray.1' : 'white'}
				direction='column'
				// mt={2}
				pl={5}
				pr={2}
				py={4}
				borderBottom='1px solid #E7E4DD'>
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
								{`(${proposal.id}) - ${proposal.state}`}
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
					{
						(proposal?.state === 'approved' || proposal?.state === 'rejected') && (
							<Flex
								ml='auto'
								p={2}
								borderRadius='4px'
								bg={proposal?.state === 'approved' ? 'accent.columbia' : 'accent.melon'}>
								{proposal?.state === 'approved' ? <CheckDouble /> : <Close />}
							</Flex>
						)
					}
				</Flex>
				<Flex gap={2}>
					{
						tags?.map((tag, index) => tag?.title !== '' && (
							<Text
								key={index}
								mt={2}
								bg={tag?.color}
								variant='v2_metadata'
								borderRadius='2px'
								px={1}>
								{tag?.title}
							</Text>
						))
					}
				</Flex>

			</Flex>
		)
	}

	const { role, selectedProposals, setSelectedProposals } = useContext(DashboardContext)!

	const { tags } = useProposalTags({ proposal })

	useEffect(() => {
		logger.info('useProposalTags ', tags)
	}, [tags])

	const onClick = (isText: boolean = false) => {
		if(selectedProposals.size === 1 && selectedProposals.has(proposal.id)) {
			return
		}

		if(selectedProposals.size === 1 && isText) {
			// Only 1 proposal was selected and the user clicked on its name
			setSelectedProposals(new Set<string>([proposal.id]))
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

export default ProposalCard