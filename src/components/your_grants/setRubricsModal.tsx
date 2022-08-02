import React from 'react'
import { AlertDialogOverlay, Box, Button, Flex, Heading, Image, Modal, ModalBody, ModalContent, Text } from '@chakra-ui/react'
import { Organization } from 'src/v2/assets/custom chakra icons/Organization'
import { NetworkSelectOption } from 'src/v2/components/Onboarding/SupportedNetworksData'
import ModalStep from 'src/v2/components/Onboarding/UI/CreateDaoModal/ModalStep'

const SetRubricsModal = ({
	isOpen,
	onClose,
	daoName,
	daoNetwork,
	daoImageFile,
	steps,
	currentStep,
}: {
	isOpen: boolean,
	onClose: () => void,
	redirect?: () => void,
  daoName: string | undefined,
  daoNetwork: NetworkSelectOption | undefined,
	daoImageFile: File | null,
	steps: string[],
	currentStep: number | undefined,
}) => {
	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			isCentered
			scrollBehavior={'outside'}
			size={'md'}
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
					<Heading
						fontSize={'2xl'}
						m={8}
						mb={5}>
            Creating DAO on-chain...
					</Heading>

					<Flex
						py={3}
						px={8}
						bg={'brandGrey.500'}
					>

						<Box pos={'relative'}>
							<Button
								bg={'#C2E7DA'}
								boxSize={'48px'}
								overflow={'hidden'}
								boxShadow={'0px 2px 0px #1f1f331a !important'}
							>
								{
									daoImageFile ? (
										<Image
											objectFit="cover"
											src={URL.createObjectURL(daoImageFile)}
											w="100%"
											h="100%"
											minH={'48px'}
											minW={'48px'}
										/>
									) : (

										<Organization
											color={'#389373'}
											boxSize={8} />
									)
								}
							</Button>
						</Box>

						<Flex
							ml={4}
							direction={'column'}>
							<Text
								fontWeight={'500'}
								fontSize={'17px'}
							>
								{daoName}
							</Text>
							<Box
								display={'inline-flex'}
								alignItems={'center'}
								p={0}
								m={0}
								mt={'3.32px'}
							>
								<Box boxSize={5}>
									{daoNetwork?.icon}
								</Box>
								<Text
									ml={1}
									mt={'1.5px'}
									fontSize={'sm'}
									color={'brandSubtext'}
								>
									{daoNetwork?.label}
								</Text>
							</Box>
						</Flex>
					</Flex>

					<Box mt={4} />

					{
						steps.map((step, index) => (
							<ModalStep
								key={`create-dao-step${index}`}
								loadingFinished={index < (currentStep || -1)}
								loadingStarted={index === currentStep}
								step={step}
								index={index}
							/>
						))
					}

					<Box mt={4} />

				</ModalBody>
			</ModalContent>

		</Modal>
	)
}

export default SetRubricsModal