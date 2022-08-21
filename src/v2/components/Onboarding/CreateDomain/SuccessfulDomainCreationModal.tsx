import React from 'react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { AlertDialogOverlay, Button, Flex, Image, Link, Modal, ModalBody, ModalContent, Text } from '@chakra-ui/react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'

const SuccessfulDomainCreationModal = ({
	isOpen,
	onClose,
	redirect,
	networkName,
	daoLink
}: {
	isOpen: boolean,
	onClose: () => void,
	redirect?: () => void,
	daoLink?: string,
	networkName?: string,
}) => {
	const router = useRouter()
	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			isCentered
			scrollBehavior={'outside'}
			size="2xl"
		>
			<AlertDialogOverlay
				background={'rgba(240, 240, 247, 0.7)'}
				backdropFilter={'blur(10px)'}
			/>

			<ModalContent
				boxShadow={'none'}
				filter={'drop-shadow(2px 4px 40px rgba(31, 31, 51, 0.05))'}
				borderRadius={'base'}
				fontFamily={'Neue-Haas-Grotesk-Display, sans-serif'}
				fontSize={'1rem'}
			>
				<ModalBody
					p={0}
				>
					<Image
						src="/ui_icons/domain-created-top.svg"
						w="100%"
						h="23%" />
					<Image
						src="/ui_icons/domain-created-illustration.png"
						mt="-5%"
						w="45%"
						mx="auto"
					/>
					<Text
						mt="-5%"
						variant='v2_subheading'
						fontWeight="500"
						textAlign="center">
Success! Your DAO is created
					</Text>
					<Flex
						align="center"
						justify="center"
						w="100%"
						mt={2}>
						<NextLink
							href={daoLink ?? '#'}
							passHref>

							<Link isExternal>
								<Flex>
									<Text
										variant="v2_body"
										fontWeight="500">
										{networkName ?? 'Unknown'}
										{' '}
DAO
									</Text>
									<ExternalLinkIcon
										color="black.1"
										boxSize="15px"
										mx='2px' />
								</Flex>

							</Link>

						</NextLink>
						<Text
							ml={1}
							variant="v2_body"
							color="black.2">
is now on-chain.
						</Text>
					</Flex>
					<Text
						mt={12}
						textAlign="center">
Next create a grant or bounty to attract builders
					</Text>
					<Flex
						align="center"
						justify="center"
						w="100%"
						my={6}>
						<Button
							variant="secondaryV2"
							onClick={
								() => {
									router.push({ pathname: '/' })
								}
							}>
I’ll do it later
						</Button>
						<Button
							variant="primaryV2"
							ml={4}
							onClick={
								() => {
									router.push({
										pathname: '/your_grants/',
									})
								}
							}>
Create a grant
						</Button>
					</Flex>
				</ModalBody>
			</ModalContent>

		</Modal>
	)
}

export default SuccessfulDomainCreationModal

// height: 291px;
// width: 388.836181640625px;
// left: 591px;
// top: 53.54833984375px;
// border-radius: 0px;
