import React, { useEffect, useState } from 'react'
import { AlertDialogOverlay, Box, Button, Flex, Heading, Image, Modal, ModalBody, ModalContent, Text } from '@chakra-ui/react'
import { Organization } from 'src/v2/assets/custom chakra icons/Organization'
import { NetworkSelectOption } from '../SupportedNetworksData'

const CreateDaoModal = ({
	isOpen,
	onClose,
	daoName,
	daoNetwork,
	daoImageFile,
}: {
	isOpen: boolean,
	onClose: () => void,
	redirect?: () => void,
  daoName: string | undefined,
  daoNetwork: NetworkSelectOption | undefined,
	daoImageFile: File | null,
}) => {

	const [loadingStarted, setLoadingStarted] = useState(false)
	useEffect(() => {
		setTimeout(() => {
			console.log(loadingStarted)
			setLoadingStarted(true)
		}, 25000)
	}, [])

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

					<Flex
						mt={4}
						alignItems={'center'}>

						{
							loadingStarted ? (
								<Box
									minW={4}
									minH={4}
									p={'2px'}
									bg={'linear-gradient(180deg, #89A6FB 5.88%, #B6F72B 94.12%)'}
									style={
										{
											aspectRatio: '1',
											WebkitMask: 'conic-gradient(#0000,#000), linear-gradient(#000 0 0) content-box',
											WebkitMaskComposite: 'source-out'
										}
									}
									borderRadius={'50%'}
									boxSizing={'border-box'}
									animation={'spinner 0.45s linear infinite'}
							 />
							) : (
								<Box
									minW={4}
									minH={4}
									p={'2px'}
									bg={'linear-gradient(180deg, #89A6FB 5.88%, #B6F72B 94.12%)'}
									style={
										{
											aspectRatio: '1',
											WebkitMask: 'conic-gradient(#0000,#000), linear-gradient(#000 0 0) content-box',
											WebkitMaskComposite: 'source-out'
										}
									}
									borderRadius={'50%'}
									boxSizing={'border-box'}
									animation={'spinner 0.45s linear infinite'}
							 />
							)
						}

						<Text
							fontWeight={'500'}
							ml={3}>
              Uploading data to IPFS
						</Text>
					</Flex>

					<Flex
						mt={4}
						alignItems={'center'}>
						<Box
							minW={4}
							minH={4}
							borderColor={'#E0E0EC'}
							borderWidth={'2px'}

							borderRadius={'50%'}
							boxSizing={'border-box'}
						 />
						<Text
							fontWeight={'500'}
							ml={3}>
              Uploading data to IPFS
						</Text>
					</Flex>

				</ModalBody>
			</ModalContent>

		</Modal>
	)
}

export default CreateDaoModal