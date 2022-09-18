import React from 'react'
import {
	Box,
	Button,
	Container,
	Flex,
	Image,
	Modal as ModalComponent,
	ModalContent,
	ModalOverlay,
	Text,
} from '@chakra-ui/react'
import { CancelCircleFilled } from 'src/v2/assets/custom chakra icons/CancelCircleFilled'
import { useTranslation } from 'react-i18next'
import { Safe } from '../types/safe'

interface Props {
	isOpen: boolean
	onClose: () => void
	proposalUrl: string
	numOfTransactionsInitiated: number,
	safe: Safe
}

function TransactionInitiatedModal({
	isOpen,
	onClose,
	proposalUrl,
	numOfTransactionsInitiated,
	safe
}: Props) {
	const { t } = useTranslation()
	return (
		<ModalComponent
			isCentered
			isOpen={isOpen}
			onClose={
				() => {
					onClose()
				}
			}
			closeOnOverlayClick={false}
		>
			<ModalOverlay maxH='100vh' />
			<ModalContent
				minW={528}
				// h="min(90vh, 560px)"
				overflowY='auto'
				borderRadius='4px'>
				<Container
					px={6}
					py={6}>

					<Flex
						direction='row'
						align='center'>
						<Flex
							flex={1}
							justifyContent='center'>
							<Image
								boxSize='48px'
								src='/ThumbsUpSafe.svg' />
						</Flex>

						<CancelCircleFilled
							mb='auto'
							color='#7D7DA0'
							h={6}
							w={6}
							onClick={
								() => {
									onClose()
								}
							}
							cursor='pointer'
						/>
					</Flex>

					<Text
						my={2}
						fontSize='20px'
						lineHeight='24px'
						fontWeight='500'
						textAlign='center'
					>
						Transaction initated
					</Text>

					<Flex
						bg='#F0F0F7'
						h='1px'
						mx='-24px'
						my={4}
					/>

					<Text
						fontSize='14px'
						lineHeight='20px'
						fontWeight='500'
					>
						{t('/your_grants/view_applicants.send_funds_next_steps')}
					</Text>

					{safe?.getNextSteps()?.map((step, index) => (
						<Flex mt={4}>
						<Box
							fontSize='14px'
							lineHeight='20px'
							fontWeight='400'
							h='20px'
							w='20px'
							bg='#F0F0F7'
							display='flex'
							justifyContent='center'
							alignItems='center'
							mr={4}
						>
							{index + 1}
						</Box>
						<Text
							fontSize='14px'
							lineHeight='20px'
							fontWeight='400'
						>
							{step}
						</Text>
					</Flex>
					))}

					<Flex
						bg='#F0F0F7'
						h='1px'
						mx='-24px'
					/>

					<Flex
						mt={4}
						direction='row'
						align='center'>

						<a
							target='_blank'
							style={{ marginLeft: 'auto' }}
							href={proposalUrl}
							rel='noreferrer'>
							<Button
								colorScheme='brandv2'>
								{t('/your_grants/view_applicants.send_funds_open_txn')}
							</Button>
						</a>

					</Flex>


				</Container>
			</ModalContent>
		</ModalComponent>
	)
}


export default TransactionInitiatedModal
