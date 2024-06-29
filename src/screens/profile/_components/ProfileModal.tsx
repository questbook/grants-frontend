import { useContext, useEffect, useRef, useState } from 'react'
import { Button, Flex, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Text, useToast } from '@chakra-ui/react'
import { logger } from 'ethers'
import { ImageAdd } from 'src/generated/icons'
import { createBuilderProfile } from 'src/generated/mutation/createBuilderProfile'
import { updateBuilderProfile } from 'src/generated/mutation/updateBuilderProfile'
import { executeMutation } from 'src/graphql/apollo'
import { getUrlForIPFSHash, uploadToIPFS } from 'src/libraries/utils/ipfs'
import { WebwalletContext } from 'src/pages/_app'
import { ProfileContext } from 'src/screens/profile/Context'

function ProfileModal() {
	const buildComponent = () => {
		return (
			<Modal
				isOpen={buildersProfileModal}
				size='xl'
				onClose={
					() => {
						setBuildersProfileModal(false)
					}
				}
				closeOnEsc
				isCentered
				scrollBehavior='outside'>
				<ModalOverlay />
				<ModalContent
					borderRadius='8px'
				>
					<ModalHeader
						fontSize='24px'
						fontWeight='700'
						lineHeight='32.4px'
						color='#07070C'
						alignItems='center'
					>
						{builder?._id ? 'Edit your Builder Profile' : 'Set up your Builder Profile'}
						<ModalCloseButton
							mt={1}
						/>
					</ModalHeader>
					<ModalBody>
						<Flex
							direction='column'
							alignContent='center'
							w='100%'
							gap='24px'
							padding='32px 10px'
							mx='auto'
							h='100%'>
							<Flex
								w='100px'
								h='100px'>
								<input
									style={{ visibility: 'hidden', height: 0, width: 0 }}
									ref={ref}
									type='file'
									name='myImage'
									onChange={handleImageChange}
									accept='image/jpg, image/jpeg, image/png' />
								{
									!(!imageFile || (imageFile?.file === null && !imageFile?.hash)) && (
										<Image
											src={imageFile?.file ? URL.createObjectURL(imageFile?.file) : imageFile?.hash ? getUrlForIPFSHash(imageFile?.hash) : ''}
											onClick={() => openInput()}
											cursor='pointer'
											fit='fill'
											w='100%'
											rounded='full'
											h='100%' />
									)
								}
								{
									(!imageFile || (imageFile?.file === null && !imageFile?.hash)) && (
										<Button
											w='100%'
											h='100%'
											bg='gray.300'
											borderRadius='2px'
											alignItems='center'
											justifyItems='center'
											rounded='full'
											onClick={() => openInput()}>
											<ImageAdd boxSize='26px' />
										</Button>
									)
								}
							</Flex>
							<Flex
								direction='column'
							>
								<Text
									fontWeight='500'
									color='#07070C'
									fontSize='18px'
									mt={2}
								>
									Profile Name
								</Text>

								<Input
									placeholder='Enter your full name'
									mt={2}
									value={formData.name}
									onChange={(e) => setFormData({ ...formData, name: e.target.value })}
									borderRadius='8px'
									border='1px solid #7E7E8F'
									padding='16px'
									fontSize='16px'
									fontWeight='400'
									color='#7E7E8F'
								/>
							</Flex>
							<Flex
								direction='column'
							>
								<Text
									fontWeight='500'
									color='#07070C'
									fontSize='18px'
									mt={2}
								>
									Telegram
								</Text>

								<Input
									placeholder='Enter your Telegram username'
									mt={2}
									value={formData.telegram}
									onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
									borderRadius='8px'
									border='1px solid #7E7E8F'
									padding='16px'
									fontSize='16px'
									fontWeight='400'
									color='#7E7E8F'
								/>
							</Flex>
							<Button
								mt={4}
								bgColor='#77AC06'
								_hover={{ bgColor: '#77AC06' }}
								color='white'
								isDisabled={formData.name === ''}
								borderRadius='8px'
								shadow='0px 1px 2px 0px rgba(22, 22, 22, 0.12)'
								fontSize='16px'
								fontWeight='600'
								onClick={
									async() => {
										const logoIpfsHash = imageFile?.file !== null ? (await uploadToIPFS(imageFile.file)).hash : imageFile?.hash !== undefined ? imageFile.hash : ''
										const variables = {
											username: formData.name,
											telegram: formData.telegram,
											imageURL: logoIpfsHash,
											address: scwAddress
										}
										const response = builder?._id ? await executeMutation(updateBuilderProfile, variables) : await executeMutation(createBuilderProfile, variables)
										if(response) {
											await toast({
												position: 'top',
												title: builder?._id ? 'Profile updated successfully' : 'Profile submitted successfully',
												status: 'info',
												duration: 5000
											})
											await refresh(true)
											await setBuildersProfileModal(false)
										} else {
											toast({
												position: 'top',
												title: 'Error submitting your profile',
												status: 'error',
												duration: 5000
											})
										}
									}
								}
							>
								{builder?._id ? 'Update Profile' : 'Save Profile'}
							</Button>
						</Flex>


					</ModalBody>
				</ModalContent>
			</Modal>
		)
	}


	const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if(event.target.files?.[0]) {
			const img = event.target.files[0]
			if(img.size / 1024 / 1024 <= maxImageSize) {
				const copy = { ...imageFile }
				copy.file = img
				setImageFile(copy)
			} else {
				toast({
					position: 'top',
					title: `Image size exceeds ${maxImageSize} MB`,
					status: 'error',
				})
			}

			// @ts-ignore
			event.target.value = null
		}
	}

	const maxImageSize = 2
	const [imageFile, setImageFile] = useState<{file: File | null, hash?: string}>({ file: null, hash: undefined })
	const [formData, setFormData] = useState<{
        name: string
        telegram: string
    }>({
    	name: '',
    	telegram: '',
    })

	const ref = useRef(null)
	const toast = useToast()
	const openInput = () => {
		if(ref.current) {
			(ref.current as HTMLInputElement).click()
		}
	}

	const { builder, refresh } = useContext(ProfileContext)!
	const { scwAddress } = useContext(WebwalletContext)!
	const { buildersProfileModal, setBuildersProfileModal } = useContext(WebwalletContext)!

	logger.info('builder', builder)
	useEffect(() => {
		if(builder) {
			setFormData({
				name: builder.username,
				telegram: builder.telegram,
			})
			setImageFile({ file: null, hash: builder.imageURL })
		}
	}, [builder])


	return buildComponent()

}

export default ProfileModal