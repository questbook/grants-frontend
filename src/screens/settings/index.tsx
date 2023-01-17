import { ReactElement, useContext, useEffect, useRef, useState } from 'react'
import { Search2Icon, SettingsIcon } from '@chakra-ui/icons'
import { Box, Button, Divider, Flex, Grid, Image, Input, InputGroup, InputLeftElement, Spacer, Text, Tooltip } from '@chakra-ui/react'
import copy from 'copy-to-clipboard'
import router from 'next/router'
import { defaultChainId } from 'src/constants/chains'
import { ImageAdd } from 'src/generated/icons'
import { useNetwork } from 'src/hooks/gasless/useNetwork'
import useCustomToast from 'src/libraries/hooks/useCustomToast'
import logger from 'src/libraries/logger'
import BackButton from 'src/libraries/ui/BackButton'
import CopyIcon from 'src/libraries/ui/CopyIcon'
import ImageUpload from 'src/libraries/ui/ImageUpload'
import NavbarLayout from 'src/libraries/ui/navbarLayout'
import NetworkTransactionFlowStepperModal from 'src/libraries/ui/NetworkTransactionFlowStepperModal'
import { GrantsProgramContext } from 'src/pages/_app'
import AddMemberButton from 'src/screens/settings/_components/AddMemberButton'
import { DropdownIcon } from 'src/screens/settings/_components/DropdownIcon'
import useUpdateGrantProgram from 'src/screens/settings/_hooks/useUpdateGrantProgram'
import { SettingsFormContext, SettingsFormProvider } from 'src/screens/settings/Context'
import WorkspaceMemberCard from 'src/screens/settings/WorkspaceMemberCard'
import { formatAddress, getExplorerUrlForTxHash } from 'src/utils/formattingUtils'
import { getUrlForIPFSHash, uploadToIPFS } from 'src/utils/ipfsUtils'
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils'


function Settings() {

	function buildComponent() {
		return (
			<Flex
				h='calc(100vh - 64px)'
				width='100vw'
				direction='column'
				justifyContent='flex-start'
				px={8}
				// py={4}
				gap={2}
			>
				<BackButton alignSelf='flex-start' />
				<Flex
					bg='white'
					h='max-content'
					p={8}
					direction='column'
					gap={4.5}
					border='1px solid #E7E4DD'
					boxShadow='0px 2px 4px rgba(29, 25, 25, 0.1)'
				>
					<Flex>
						<SettingsIcon
							boxSize={6} />
						<Text
							variant='v2_subheading'
							fontWeight='500'>
							Settings
						</Text>
						<Spacer />
						<Button
						// isLoading={isNetworkTransactionModalOpen}
							variant='primaryMedium'
							disabled={!imageChanged}
							onClick={handleOnClickSave}
						>
							Save
						</Button>
					</Flex>
					<Divider />
					{/* Actions */}
					<Flex gap={6}>

						{/* Link multi sig card */}
						{
							workspace?.safe?.address ? (
								<>
									<Box
										border='1px solid #E7E4DD'
										p={4}
									>
										<Flex gap={2}>
											<Flex
											>
												<Image
													boxSize={8}
													src='/v2/icons/safe.svg'
												/>
											</Flex>

											<Flex
												direction='column'
												gap={2}
												alignItems='flex-start'
											>
												<Text
													variant='v2_title'
													fontWeight='500'
													cursor='pointer'
												>
													Your multisig is linked to your grant program
												</Text>
												<Button
													variant='link'
													rightIcon={
														<>
															<Flex
																gap={1}
															>
																<Tooltip label={tooltipLabel}>
																	<Image
																		src='/v2/icons/copy.svg'
																		onClick={
																			() => {
																				copy(workspace?.safe?.address!)
																				setTooltipLabel(copiedTooltip)
																			}
																		}
																	/>
																</Tooltip>

																<Image
																	src='/v2/icons/share.svg'
																	onClick={
																		() => {
																			window.open(safeURL, '_blank')
																		}
																	}
																/>
															</Flex>

														</>
													}>
													<Text
														fontWeight='400'
														variant='v2_subtitle'
														color='black.1'
													>
														{formatAddress(workspace.safe.address)}
													</Text>
												</Button>
											</Flex>
										</Flex>
									</Box>
								</>
							) : (
								<Box
									border='1px solid #E7E4DD'
									p={4}
								>
									<Flex
										gap={2}
										alignItems='center'
									>
										<Flex
										>
											<Image
												boxSize={8}
												src='/v2/icons/realms.svg'
											/>
											<Image
												boxSize={8}
												ml='-18px'
												src='/v2/icons/safe.svg'
											/>
											<Image
												boxSize={8}
												ml='-18px'
												src='/v2/icons/celo.svg'
											/>
										</Flex>

										<Flex
											direction='column'
											gap={2}
										>
											<Text
												variant='v2_title'
												fontWeight='500'
												cursor='pointer'
											>
												Link your multisig
											</Text>
											<Text
												variant='v2_subtitle'
											>
												Link your multisig to fund builders on Questbook
											</Text>
										</Flex>
									</Flex>
								</Box>
							)
						}


						{/* Update profile image */}
						<Box
							border='1px solid #E7E4DD'
							p={4}
						>
							<Flex
								gap={2}
								alignItems='center'>
								<Flex
									w='72px'
									h='72px'>
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
												h='100%' />
										)
									}
									{
										(!imageFile || (imageFile?.file === null && !imageFile?.hash)) && (
											<Button
												w='100%'
												h='100%'
												bg='gray.3'
												borderRadius='2px'
												alignItems='center'
												justifyItems='center'
												onClick={() => openInput()}>
												<ImageAdd boxSize='26px' />
											</Button>
										)
									}
								</Flex>
								<Flex
									direction='column'
									gap={2}
								>
									<Text
										variant='v2_title'
										fontWeight='500'
										cursor='pointer'
									>
										Your grant program logo
									</Text>
									<Flex
										gap={2}
									>
										<Text
											variant='textButton'
											onClick={() => openInput()}
										>
											Change
										</Text>
										{/* <Image src='/v2/icons/dot.svg' /> */}
										{/* <Text
											variant='textButton'
											onClick={
												() => {
													setImageFile(undefined)
												}
											}
										>
											Remove
										</Text> */}
									</Flex>
								</Flex>
							</Flex>
						</Box>

					</Flex>

					{/* Members Section */}
					<Flex
						direction='column'
						gap={4.5}
					>
						<Flex
							gap={2}
							alignItems='center'
						>
							<Text
								variant='v2_body'
								fontWeight='500'
							>
								Members
							</Text>
							<Spacer />
							<InputGroup
								className='search'
								width='195px'
							>
								<InputLeftElement pointerEvents='none'>
									<Search2Icon color='gray.4' />
								</InputLeftElement>
								<Input
									type='search'
									placeholder='Search'
									// size='md'
									borderRadius='2px'
									// alignSelf='flex-end'
									// defaultValue={searchString}
									value={searchString}
									width='25vw'
									onChange={(e) => setSearchString(e.target.value)}
								/>
							</InputGroup>
							<AddMemberButton />
						</Flex>
						<Divider />

						{/* Filter */}
						<Flex
							gap={2}
							alignItems='center'>
							<Text
								variant='v2_body'
							>
								All
							</Text>
							<DropdownIcon />
						</Flex>

						{/* Members grid */}
						<Grid
							templateColumns='repeat(4, 1fr)'
							gap={6}
						>
							{
								workspaceMembers ?	workspaceMembers.filter((member) => {
									if(searchString === '') {
										return true
									// eslint-disable-next-line sonarjs/no-duplicated-branches
									} else if(member.fullName && member.fullName!.toLowerCase().includes(searchString.toLowerCase())) {
										return true
									} else {
										return false
									}
								}).map((member, index) => (
									<WorkspaceMemberCard
										key={index}
										role={member.accessLevel}
										address={member.actorId}
										email={member.email!}
										name={member.fullName!}
										pfp={member.profilePictureIpfsHash!}
										 />
								))
									: null
							}
						</Grid>
					</Flex>
				</Flex>
				<NetworkTransactionFlowStepperModal
					isOpen={isNetworkTransactionModalOpen}
					currentStepIndex={currentStepIndex!}
					viewTxnLink={getExplorerUrlForTxHash(network, txHash)}
					onClose={
						async() => {
							setCurrentStepIndex(undefined)
							const ret = await router.push({ pathname: '/dashboard', query: { grantId: grant?.id, chainId: getSupportedChainIdFromWorkspace(workspace) ?? defaultChainId } })
							if(ret) {
								router.reload()
							}
						}
					}
				/>
			</Flex>
		)
	}

	const defaultTooltip = 'Copy'
	const copiedTooltip = 'Copied'

	const ref = useRef(null)
	const toast = useCustomToast()
	const openInput = () => {
		if(ref.current) {
			(ref.current as HTMLInputElement).click()
		}
	}

	const [tooltipLabel, setTooltipLabel] = useState(defaultTooltip)

	const [imageFile, setImageFile] = useState<{file: File | null, hash?: string}>({ file: null })
	const [searchString, setSearchString] = useState<string>('')

	const { network } = useNetwork()

	const [isNetworkTransactionModalOpen, setIsNetworkTransactionModalOpen] = useState(false)
	const [currentStepIndex, setCurrentStepIndex] = useState<number| undefined>()

	const [imageChanged, setImageChanged] = useState(false)

	const { workspace, workspaceMembers, grantProgramData, setGrantProgramData, safeURL } = useContext(SettingsFormContext)!
	const { grant } = useContext(GrantsProgramContext)!

	const { updateGrantProgram, txHash } = useUpdateGrantProgram(setCurrentStepIndex, setIsNetworkTransactionModalOpen)

	const handleOnClickSave = async() => {
		const logoIpfsHash = imageFile !== null ? (await uploadToIPFS(imageFile.file)).hash : ''
		const newGrantProgramData = { ...grantProgramData, logoIpfsHash }
		logger.info('newGrantProgramData', newGrantProgramData)
		setGrantProgramData(newGrantProgramData)
		updateGrantProgram(newGrantProgramData)
	}

	const maxImageSize = 2

	const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if(event.target.files?.[0]) {
			const img = event.target.files[0]
			if(img.size / 1024 / 1024 <= maxImageSize) {
				const copy = { ...imageFile }
				copy.file = img
				setImageFile(copy)
				setImageChanged(true)
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

	useEffect(() => {
		if(grantProgramData?.logoIpfsHash !== undefined && imageFile?.file === null) {
			setImageFile({ file: null, hash: grantProgramData.logoIpfsHash })
		}
	}, [grantProgramData])

	return buildComponent()
}

Settings.getLayout = function(page: ReactElement) {
	return (
		<NavbarLayout
			renderSidebar={false}
			navbarConfig={{ showDomains: true, showLogo: false, showOpenDashboard: true, showAddMembers: true, bg: 'gray.1' }}
		>
			<SettingsFormProvider>
				{page}
			</SettingsFormProvider>
		</NavbarLayout>
	)
}

export default Settings