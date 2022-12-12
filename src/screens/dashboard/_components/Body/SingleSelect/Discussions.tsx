import { useContext, useMemo } from 'react'
import { Button, Flex, Image, Text, Textarea } from '@chakra-ui/react'
import { ApiClientsContext } from 'src/pages/_app'
import useQuickReplies from 'src/screens/dashboard/_hooks/useQuickReplies'
import { DashboardContext } from 'src/screens/dashboard/Context'
import getAvatar from 'src/utils/avatarUtils'

function Discussions() {
	const buildComponents = () => {
		return (
			<Flex
				px={5}
				py={4}
				w='100%'
				h='35%'
				overflowY='auto'
				boxShadow='0px 2px 4px rgba(29, 25, 25, 0.1)'
				bg='white'
				direction='column'>
				<Text fontWeight='500'>
					Discussion
				</Text>
				<Flex
					mt={4}
					w='100%'>
					<Image
						src='/v2/images/qb-discussion.svg'
						boxSize='36px' />
					<Flex
						ml={4}
						direction='column'>
						<Text
							variant='v2_metadata'
							fontWeight='500'
							color='gray.6'>
							FEW WAYS TO START THE DISCUSSION.
						</Text>
						<Flex
							direction='column'
						>
							{
								Array.from(Array(Math.floor(quickReplies[role].length / 2)).keys()).map((_, index) => {
									const reply1 = quickReplies[role]?.[index * 2]
									const reply2 = quickReplies[role]?.[index * 2 + 1]
									return (
										<Flex
											key={index}
											mt={3}>
											{
												reply1 && (
													<Button
														key={index}
														// w='100%'
														justifyContent='start'
														py={1}
														px={3}
														bg='gray.2'
														borderRadius='2px'
														leftIcon={
															<Image
																boxSize='24px'
																src={reply1.icon} />
														}
													>
														<Text fontWeight='400'>
															{reply1.title}
														</Text>
													</Button>
												)
											}
											{
												reply2 && (
													<Button
														key={index + 1}
														ml={3}
														// w='100%'
														justifyContent='start'
														py={1}
														px={3}
														bg='gray.2'
														borderRadius='2px'
														leftIcon={
															<Image
																boxSize='24px'
																src={reply2.icon} />
														}
													>
														<Text fontWeight='400'>
															{reply2.title}
														</Text>
													</Button>
												)
											}
										</Flex>
									)
								})
							}
						</Flex>
					</Flex>
				</Flex>
				<Flex
					mt={4}
					w='100%'>
					<Image
						borderRadius='3xl'
						boxSize='36px'
						src={getAvatar(false, proposal?.applicantId)}
					/>
					<Flex
						ml={4}
						direction='column'
						border='1px solid #C1BDB7'
						px={3}
						pb={2}
						w='100%'>
						<Textarea
							w='100%'
							textAlign='left'
							placeholder='Ask a question or post an update'
							fontSize='16px'
							fontWeight='400'
							lineHeight='24px'
							size='sm'
							variant='unstyled'
							resize='none'
						/>
						<Button
							ml='auto'
							variant='primaryMedium'>
							Post
						</Button>
					</Flex>
				</Flex>
			</Flex>
		)
	}

	const { role } = useContext(ApiClientsContext)!
	const { proposals, selectedProposals } = useContext(DashboardContext)!
	const { quickReplies } = useQuickReplies()

	const proposal = useMemo(() => {
		const index = selectedProposals.indexOf(true)

		if(index !== -1) {
			return proposals[index]
		}
	}, [proposals, selectedProposals])

	return buildComponents()
}

export default Discussions