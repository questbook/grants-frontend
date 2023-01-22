import { Box, Button, Flex, Text } from '@chakra-ui/react'
import { useSafeContext } from 'src/contexts/SafeContext'
import { Link } from 'src/generated/icons'

interface Props {
    safeProposalLink: string
}

const TransactionInitiated = ({ safeProposalLink }: Props) => {
	const buildComponent = () => (
		<Flex
			p={6}
			direction='column'
			align='center'
			w='100%'>
			<Text fontWeight='500'>
				Fund Builder
			</Text>

			<Flex
				direction='column'
				borderTopWidth='1px'
				borderBottomWidth='1px'
				borderTopColor='#F0F0F7'
				borderBottomColor='#F0F0F7'
				w='100%'
				mt='2rem'
				py='1rem'
			>
				<Text
					fontSize='16px'
					mb='1rem'>
					Here’s what you can do next:
				</Text>

				{
					safeObj?.getNextSteps().map((step: string, index: number) => (
						<Flex
							key={index}
							mb='1rem'
							alignItems='center'>
							<Flex
								bg='#E7E4DD'
								mr='1rem'
								w='2rem'
								h='2rem'
								justifyContent='center'
								alignItems='center'>
								<Text>
									{index + 1}
								</Text>
							</Flex>
							<Text>
								{step}
							</Text>
						</Flex>
					))
				}
			</Flex>

			<Box
				mt={8}
				w='100%'>
				<a
					href={safeProposalLink}
					target='_blank'
					rel='noreferrer'>
					<Button
						w='100%'
						variant='primaryLarge'>
						<Link
							mr='1rem' />
						<Text
							fontWeight='500'
							color='white'>
							Open multisig
						</Text>
					</Button>
				</a>
			</Box>

		</Flex>
	)

	const { safeObj } = useSafeContext()

	return buildComponent()
}

export default TransactionInitiated