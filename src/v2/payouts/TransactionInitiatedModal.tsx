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
import { CancelCircleFilled } from '../assets/custom chakra icons/CancelCircleFilled'

interface Props {
	isOpen: boolean;
	onClose: () => void;
	onComplete: () => void;
	proposalUrl: string;
}

function TransactionInitiatedModal({
	isOpen,
	onClose,
	onComplete,
	proposalUrl
}: Props) {

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
			<ModalOverlay maxH="100vh" />
			<ModalContent
				minW={528}
				// h="min(90vh, 560px)"
				overflowY="auto"
				borderRadius="4px">
				<Container
					px={6}
					py={6}>

					<Flex
						direction="row"
						align="center">
						<Flex
							flex={1}
							justifyContent={'center'}>
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
						textAlign={'center'}
					>
				Transaction initated
					</Text>

					<Flex
						bg='#F0F0F7'
						h={'1px'}
						mx={'-24px'}
						my={4}
					/>

					<Text
						fontSize='14px'
						lineHeight='20px'
						fontWeight='500'
					>
				Here’s what you can do next:
					</Text>

					<Flex mt={6}>
						<Box
							fontSize='14px'
							lineHeight='20px'
							fontWeight='400'
							h='20px'
							w='20px'
							bg='#F0F0F7'
							display='flex'
							justifyContent={'center'}
							alignItems={'center'}
							mr={4}
						>
              1
						</Box>
						<Text
							fontSize='14px'
							lineHeight='20px'
							fontWeight='400'
						>
				Open safe.
						</Text>
					</Flex>

					<Flex mt={4}>
						<Box
							fontSize='14px'
							lineHeight='20px'
							fontWeight='400'
							h='20px'
							w='20px'
							bg='#F0F0F7'
							display='flex'
							justifyContent={'center'}
							alignItems={'center'}
							mr={4}
						>
              2
						</Box>
						<Text
							fontSize='14px'
							lineHeight='20px'
							fontWeight='400'
						>
				Confirm the transaction which is in “Queue”.
						</Text>
					</Flex>

					<Flex my={4}>
						<Box
							fontSize='14px'
							lineHeight='20px'
							fontWeight='400'
							h='20px'
							w='20px'
							bg='#F0F0F7'
							display='flex'
							justifyContent={'center'}
							alignItems={'center'}
							mr={4}
						>
              3
						</Box>
						<Text
							fontSize='14px'
							lineHeight='20px'
							fontWeight='400'
						>
				Notify other owners on the safe to confirm the
transaction.
						</Text>
					</Flex>


					<Flex
						bg='#F0F0F7'
						h={'1px'}
						mx={'-24px'}
					/>

					<Flex
						mt={4}
						direction="row"
						align="center">

						<a
							target={'_blank'}
							style={{ marginLeft:'auto' }}
							href={proposalUrl}
							rel="noreferrer">
							<Button
								colorScheme={'brandv2'}
								onClick={
									() => {


									}
								}>
							Open Safe
							</Button>
						</a>

					</Flex>


				</Container>
			</ModalContent>
		</ModalComponent>
	)
}


export default TransactionInitiatedModal
