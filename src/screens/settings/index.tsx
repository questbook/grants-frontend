import { ReactElement, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Search2Icon, SettingsIcon } from '@chakra-ui/icons'
import { Box, Button, Divider, Flex, Grid, Image, Input, InputGroup, InputLeftElement, Spacer, Text, Tooltip } from '@chakra-ui/react'
import copy from 'copy-to-clipboard'
import router from 'next/router'
import { defaultChainId } from 'src/constants/chains'
import { Celo, Copy, Dot, ImageAdd, Realms, Safe, ShareBox } from 'src/generated/icons'
import { updateWorkspaceMemberMutation } from 'src/generated/mutation'
import { executeMutation } from 'src/graphql/apollo'
import { useNetwork } from 'src/libraries/hooks/gasless/useNetwork'
import useCustomToast from 'src/libraries/hooks/useCustomToast'
import useFunctionCall from 'src/libraries/hooks/useFunctionCall'
import logger from 'src/libraries/logger'
import BackButton from 'src/libraries/ui/BackButton'
import ConfimationModal from 'src/libraries/ui/ConfirmationModal'
import LinkYourMultisigModal from 'src/libraries/ui/LinkYourMultisigModal'
import NavbarLayout from 'src/libraries/ui/navbarLayout'
import NetworkTransactionFlowStepperModal from 'src/libraries/ui/NetworkTransactionFlowStepperModal'
import { formatAddress, getExplorerUrlForTxHash } from 'src/libraries/utils/formatting'
import { getUrlForIPFSHash, uploadToIPFS } from 'src/libraries/utils/ipfs'
import { getSupportedChainIdFromWorkspace } from 'src/libraries/utils/validations'
import { GrantsProgramContext } from 'src/pages/_app'
import AddMemberButton from 'src/screens/settings/_components/AddMemberButton'
import AdminTable from 'src/screens/settings/_components/AdminTable'
import DocuSignModal from 'src/screens/settings/_components/docuSignModal'
import { DropdownIcon } from 'src/screens/settings/_components/DropdownIcon'
import PendingTx from 'src/screens/settings/_components/PendingTx'
import SynapsModel from 'src/screens/settings/_components/SynapsModel'
import useUpdateGrantProgram from 'src/screens/settings/_hooks/useUpdateGrantProgram'
import { WorkspaceMembers } from 'src/screens/settings/_utils/types'
import { SettingsFormContext, SettingsFormProvider } from 'src/screens/settings/Context'
import WorkspaceMemberCard from 'src/screens/settings/WorkspaceMemberCard'


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
							variant='subheading'
							fontWeight='500'>
							Settings
						</Text>
						<Spacer />
						<Flex
							gap={2}
						>
							{
								(role === 'admin' || role === 'reviewer') && (
									<Button
										variant='primaryMedium'
										onClick={() => setShowPendingTx(!showPendingTx)}
									>
										{showPendingTx ? 'Hide Tx Table' : 'Show Tx Table'}
									</Button>
								)
							}
							{
								(role === 'admin' || role === 'reviewer') && (
									<Button
										variant='primaryMedium'
										onClick={() => setShowAdminTable(!showAdminTable)}
									>
										{showAdminTable ? 'Hide Table' : 'Show Table'}
									</Button>
								)
							}
							<Button
								// isLoading={isNetworkTransactionModalOpen}
								variant='primaryMedium'
								disabled={!imageChanged}
								onClick={handleOnClickSave}
							>
								Save
							</Button>
						</Flex>
					</Flex>
					<Divider />
					{/* Actions */}
					{showPendingTx ? <PendingTx /> : ''}
					{
						showAdminTable ?
							<AdminTable /> : (
								<>
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
																<Safe
																	boxSize={8}
																/>
															</Flex>

															<Flex
																direction='column'
																gap={2}
																alignItems='flex-start'
															>
																<Text
																	variant='title'
																	fontWeight='500'
																	cursor='pointer'
																>
																	Your multisig is linked to your grant program
																</Text>
																<Flex
																	gap={1}
																	align='center'>
																	<Text
																		fontWeight='400'
																		variant='subtitle'
																		color='black.100'
																	>
																		{formatAddress(workspace.safe.address)}
																	</Text>
																	<Tooltip label={tooltipLabel}>
																		<Copy
																			cursor='pointer'
																			onClick={
																				() => {
																					copy(workspace?.safe?.address!)
																					setTooltipLabel(copiedTooltip)
																				}
																			}
																		/>
																	</Tooltip>

																	<ShareBox
																		cursor='pointer'
																		onClick={
																			() => {
																				window.open(safeURL, '_blank')
																			}
																		}
																	/>

																	<Dot
																		boxSize='4px'
																		mx={1} />

																	<Button
																		variant='link'
																		onClick={() => setIsLinkYourMultisigModalOpen(true)}>
																		<Text
																			variant='body'
																			fontWeight='500'>
																			Change multisig
																		</Text>
																	</Button>
																</Flex>
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
															<Realms
																boxSize={8}

															/>
															<Safe
																boxSize={8}
																ml='-18px'
															/>
															<Celo
																boxSize={8}
																ml='-18px'
															/>
														</Flex>

														<Flex
															direction='column'
															gap={2}
															onClick={() => setIsLinkYourMultisigModalOpen(true)}
															cursor='pointer'
														>
															<Text
																variant='title'
																fontWeight='500'
																cursor='pointer'
															>
																Link your multisig
															</Text>
															<Text
																variant='subtitle'
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
																bg='gray.300'
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
														variant='title'
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
									<Flex
										direction='column'
										gap={4.5}
									>
										<Flex
											gap={2}
											alignItems='center'
										>
											<Text
												variant='body'
												fontWeight='500'
											>
												Third Party Apps
											</Text>
											<Spacer />
										</Flex>
										<Flex gap={6}>
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
															src='https://avatars.githubusercontent.com/u/63306624?s=280&v=4'
															boxSize='20' />
													</Flex>

													<Flex
														direction='column'
														gap={2}
														onClick={() => setIsLinkYourSynapsModalOpen(true)}
														cursor='pointer'
													>
														<Text
															variant='title'
															fontWeight='500'
															cursor='pointer'
														>
															Builder KYC
														</Text>
														<Text
															variant='subtitle'
														>
															Initiate and Verify KYC Status
														</Text>
														<Text
															variant='subtitle'
														>
															{grantProgramData?.synapsId ? 'Update ' : 'Connect '}
															 your Synaps account

														</Text>
													</Flex>
												</Flex>
											</Box>
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
															src='https://avatars.githubusercontent.com/u/25623857?s=280&v=4'
															boxSize='20' />
													</Flex>

													<Flex
														direction='column'
														gap={2}
														onClick={() => setIsLinkYourDocuSignModalOpen(true)}
														cursor='pointer'
													>
														<Text
															variant='title'
															fontWeight='500'
															cursor='pointer'
														>
															HelloSign (DocuSign)
														</Text>
														<Text
															variant='subtitle'
														>
															Initiate and Verify DocuSign Status
														</Text>
														<Text
															variant='subtitle'
														>
															{grantProgramData?.docuSign ? 'Update ' : 'Connect '}
															 your DocuSign account

														</Text>
													</Flex>
												</Flex>
											</Box>
										</Flex>
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
												variant='body'
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
													<Search2Icon color='gray.400' />
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
												variant='body'
											>
												All
											</Text>
											<DropdownIcon />
										</Flex>

										{/* Members grid */}
										<Grid
											templateColumns='repeat(3, 1fr)'
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
														member={member}
														setOpenConfirmationModal={setOpenConfirmationModal}
													/>
												))
													: null
											}
										</Grid>
									</Flex>
								</>
							)
					}
				</Flex>
				<ConfimationModal
					isOpen={openConfirmationModal !== undefined}
					onClose={() => setOpenConfirmationModal(undefined)}
					title={`${openConfirmationModal?.enabled ? 'Revoke' : 'Restore'} access for member?`}
					subTitle='Are you sure you want to modify the access level for the member? This cannot be undone.'
					actionText={`${openConfirmationModal?.enabled ? 'Revoke' : 'Restore'} Access`}
					action={
						() => {
							logger.info('revoke confirmed', openConfirmationModal)
							const address = openConfirmationModal?.actorId
							if(!address) {
								return
							}

							revokeOrRestoreAccess(address, openConfirmationModal?.accessLevel === 'reviewer' ? 1 : 0, !openConfirmationModal?.enabled)
							setOpenConfirmationModal(undefined)
						}
					}
					onCancel={() => setOpenConfirmationModal(undefined)}
				/>
				<NetworkTransactionFlowStepperModal
					isOpen={currentStepIndex !== undefined}
					currentStepIndex={currentStepIndex || 0}
					viewTxnLink={getExplorerUrlForTxHash(network, txHash ?? revokeTxHash)}
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
				<LinkYourMultisigModal
					isOpen={isLinkYourMultisigModalOpen}
					onClose={() => setIsLinkYourMultisigModalOpen(false)}
				/>
				<SynapsModel
					isOpen={isLinkYourSynapsModalOpen}
					onClose={() => setIsLinkYourSynapsModalOpen(false)}
				/>
				<DocuSignModal
					isOpen={isLinkYourDocuSignModalOpen}
					onClose={() => setIsLinkYourDocuSignModalOpen(false)}
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

	const [currentStepIndex, setCurrentStepIndex] = useState<number| undefined>()
	const [openConfirmationModal, setOpenConfirmationModal] = useState<WorkspaceMembers[number]>()
	const [isLinkYourMultisigModalOpen, setIsLinkYourMultisigModalOpen] = useState(false)
	const [isLinkYourSynapsModalOpen, setIsLinkYourSynapsModalOpen] = useState(false)
	const [isLinkYourDocuSignModalOpen, setIsLinkYourDocuSignModalOpen] = useState(false)
	const [revokeTxHash, setRevokeTxHash] = useState<string>('')

	const [imageChanged, setImageChanged] = useState(false)

	const { workspace, workspaceMembers, grantProgramData, setGrantProgramData, safeURL, refreshWorkspace, showAdminTable, setShowAdminTable, showPendingTx, setShowPendingTx } = useContext(SettingsFormContext)!
	const { grant, role } = useContext(GrantsProgramContext)!
	const chainId = useMemo(() => {
		return getSupportedChainIdFromWorkspace(grant?.workspace) ?? defaultChainId
	}, [grant])

	const { updateGrantProgram, txHash } = useUpdateGrantProgram(setCurrentStepIndex)

	const handleOnClickSave = async() => {
		const logoIpfsHash = imageFile !== null ? (await uploadToIPFS(imageFile.file)).hash : ''
		const newGrantProgramData = { ...grantProgramData, logoIpfsHash }
		logger.info('newGrantProgramData', newGrantProgramData)
		setGrantProgramData(newGrantProgramData)
		updateGrantProgram(newGrantProgramData)
		refreshWorkspace(true)
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

	const { } = useFunctionCall({ chainId, contractName: 'workspace', setTransactionStep: setCurrentStepIndex, setTransactionHash: setRevokeTxHash })

	const revokeOrRestoreAccess = async(address: string, role: number, enable: boolean) => {
		const update = await executeMutation(updateWorkspaceMemberMutation, {
			id: grant?.workspace?.id,
			members: [address],
			roles: [role],
			enabled: [false],
			metadataHashes: [{}]
		 })
		if(!update) {
			toast({
				position: 'top',
				title: 'Error updating access',
				status: 'error',
			})
		} else {
			toast({
				position: 'top',
				title: 'Access updated',
				status: 'success',
			})
			refreshWorkspace(true)
			logger.info({ update, enable }, 'updateWorkspaceMemberMutation')
		}
	}

	useEffect(() => {
		logger.info('setting image file', grantProgramData)
		if(grantProgramData?.logoIpfsHash !== undefined && imageFile?.file === null) {
			logger.info('setting image file', grantProgramData.logoIpfsHash)
			setImageFile({ file: null, hash: grantProgramData.logoIpfsHash })
		}
	}, [grantProgramData])

	return buildComponent()
}

Settings.getLayout = function(page: ReactElement) {
	return (
		<NavbarLayout
			openSignIn={true}
			navbarConfig={{ showDomains: true, showLogo: false, showOpenDashboard: true, showAddMembers: true, bg: 'gray.100' }}
		>
			<SettingsFormProvider>
				{page}
			</SettingsFormProvider>
		</NavbarLayout>
	)
}

export default Settings