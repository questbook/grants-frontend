import { ReactElement, useContext, useEffect, useState } from 'react'
import { BsArrowLeft } from 'react-icons/bs'
import { ArrowForwardIcon, Search2Icon } from '@chakra-ui/icons'
import { Button, Checkbox, Divider, Flex, Image, Input, InputGroup, InputLeftElement, Spacer, Text } from '@chakra-ui/react'
import { SupportedPayouts } from '@questbook/supported-safes'
import { convertToRaw, EditorState } from 'draft-js'
import router from 'next/router'
import { NetworkType } from 'src/constants/Networks'
import { useNetwork } from 'src/hooks/gasless/useNetwork'
import useCustomToast from 'src/libraries/hooks/useCustomToast'
import logger from 'src/libraries/logger'
import ImageUpload from 'src/libraries/ui/ImageUpload'
import NavbarLayout from 'src/libraries/ui/navbarLayout'
import NetworkTransactionFlowStepperModal from 'src/libraries/ui/NetworkTransactionFlowStepperModal'
import TextEditor from 'src/libraries/ui/RichTextEditor/textEditor'
import VerifySignerModal from 'src/libraries/ui/VerifySignerModal'
import { getProjectDetails } from 'src/screens/proposal_form/_utils'
import SafeSelect, { SafeSelectOption } from 'src/screens/request_proposal/_components/SafeSelect'
import { DropdownIcon } from 'src/screens/settings/_components/DropdownIcon'
import SettingsInput from 'src/screens/settings/_components/SettingsInput'
import useLinkMultiSig from 'src/screens/settings/_hooks/useLinkMultiSig'
import useUpdateGrantProgram from 'src/screens/settings/_hooks/useUpdateGrantProgram'
import { SettingsFormContext, SettingsFormProvider } from 'src/screens/settings/Context'
import WorkspaceMemberCard from 'src/screens/settings/WorkspaceMemberCard'
import { getExplorerUrlForTxHash } from 'src/utils/formattingUtils'
import { uploadToIPFS } from 'src/utils/ipfsUtils'

function Settings() {
	function buildComponent() {
		return (
			<>
				<Flex
					h='calc(100vh - 64px)'
					width='100vw'
					direction='column'
					justifyContent='flex-start'
					px={8}
					// py={4}
					gap={2}
				>
					<Button
						className='backBtn'
						variant='linkV2'
						// bgColor='gray.1'
						leftIcon={<BsArrowLeft />}
						width='fit-content'
						onClick={() => router.back()}>
						Back
					</Button>
					<Flex
						gap={2}
						p={2}>
						<Image
							boxSize={6}
							src='/v2/icons/settings.svg' />
						<Text
							variant='v2_subheading'
							fontWeight='500'>
							Settings
						</Text>
					</Flex>
					<Flex gap={8}>
						<Flex
							bg='white'
							width='70%'
							p={8}
							direction='column'
							gap={10}
							border='1px solid #E7E4DD'
							boxShadow='0px 2px 4px rgba(29, 25, 25, 0.1)'
						>
							<Flex
								width='100%'
								direction='column'
								gap={4}
							>
								<Flex>
									<Text
										variant='v2_body'
										fontWeight='500'>
										{' '}
										Builder Discovery
									</Text>
									<Spacer />
									<Button
										variant='primaryMedium'
										onClick={handleOnClickSave}
									>
										Save
									</Button>
								</Flex>
								<Divider />
							</Flex>

							<Flex
								alignItems='end'
								gap={8}>
								<SettingsInput
								// width='70%'
									value={grantProgramData?.title}
									helperText='Examples: Uniswap Foundation. Polygon Village DAO. Celo Climate Collective'
									onChange={(e) => onChange(e, 'title')}
								/>
								{/* <Image src={getUrlForIPFSHash(workspace?.logoIpfsHash)} /> */}
								<ImageUpload
									imageFile={imageFile}
									setImageFile={setImageFile} />
							</Flex>
							{
								workspace?.safe?.address || isMultisigLinked ? (
									<Flex
										w='100%'
										alignItems='center'
									>
										<Text
											variant='v2_title'
											fontWeight='500'
											width='15%'
										>
											Multisig Linked
										</Text>
										<SettingsInput
											isDisabled={true}
											width='100%'
											placeholder='0x2F05BFDc43e1bAAebdc3D507785fb942eE5cDFde'
											value={workspace?.safe?.address || multisigAddress}
											 />
									</Flex>
								)
									: (
										<>
											{renderLinkMultisigButton()}
											{renderLinkMultisigInput()}
										</>
									)
							}

							<Checkbox>
								<Text>
									Run the grant program in a community first fashion (recommended)
								</Text>
							</Checkbox>
							<SettingsInput
								placeholder='Add a brief intro'
								value={grantProgramData?.bio}
								onChange={(e) => onChange(e, 'bio')}
							 />
							<Flex gap={4}>
								<SettingsInput
									placeholder='Telegram username'
									value={getSocialValue('telegram')}
									onChange={(e) => onChangeSocialValue(e, 'telegram')}
								/>
								<SettingsInput
									placeholder='Discord server'
									value={getSocialValue('discord')}
									onChange={(e) => onChangeSocialValue(e, 'discord')}
								 />
								<SettingsInput
									placeholder='Twitter username'
									value={getSocialValue('twitter')}
									onChange={(e) => onChangeSocialValue(e, 'twitter')}
								/>
							</Flex>
							<Flex
								direction='column'
								gap={6}
							>
								<Text
									variant='v2_body'
									fontWeight='500'>
									More Info
								</Text>
								<Divider />
								<TextEditor
									value={moreInfo}
									placeholder='Details about opportunities in your ecosystem for builders. Additionally, you can write about various active grant, and bounty programs.'
									onChange={
										(e) => {
											setMoreInfo(e)
											const data = { ...grantProgramData }
											data.about = JSON.stringify(
												convertToRaw(e.getCurrentContent()),
											)
											setGrantProgramData(data)
										}
									} />
								{/* <Textarea
									variant='outline'
									minH='200px'
									value={grantProgramData?.about}
									onChange={(e) => onChange(e, 'about')}
									placeholder='Details about opportunities in your ecosystem for builders. Additionally, you can write about various active grant, and bounty programs.' /> */}
							</Flex>


						</Flex>

						{/* Right column */}
						<Flex
							w='30%'
							bg='white'
							p={4}
							direction='column'
							gap={4}
							border='1px solid #E7E4DD'
							boxShadow='0px 2px 4px rgba(29, 25, 25, 0.1)'
						>
							<Flex>
								<Text
									variant='v2_title'
									fontWeight='500'>
									Members
								</Text>
								<Spacer />
								<Button variant='secondaryV2'>
									Add members
								</Button>
							</Flex>
							<Divider />
							<InputGroup
								width='100%'
								borderRadius='2px'>
								<InputLeftElement pointerEvents='none'>
									<Search2Icon color='gray.4' />
								</InputLeftElement>
								<Input
									type='search'
									placeholder='Search'
									// size='md'
									borderRadius='2px'
									defaultValue={searchString}
									width='25vw'
									onChange={(e) => setSearchString(e.target.value)} />
							</InputGroup>
							<Flex
								gap={2}
								alignItems='center'>
								<Text>
									All
								</Text>
								<DropdownIcon />
							</Flex>

							<Flex
								direction='column'
								gap={8}>


								{
									workspaceMembers ?	workspaceMembers.map((member, index) => (
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
							</Flex>
						</Flex>
					</Flex>

				</Flex>
				<NetworkTransactionFlowStepperModal
					isOpen={isNetworkTransactionModalOpen}
					currentStepIndex={currentStepIndex!}
					viewTxnLink={getExplorerUrlForTxHash(network, txHash)}
					onClose={
						async() => {
							setCurrentStepIndex(undefined)
							const ret = await router.push({ pathname: '/dashboard' })
							if(ret) {
								router.reload()
							}
						}
					}
				/>
			</>
		)
	}

	const renderLinkMultisigButton = () => {
		return (
			<Flex
				alignItems='center'
				gap={2}
				display={isLinkMultisigButtonClicked ? 'none' : 'flex'}
			>
				<Text
					color='accent.azure'
					fontWeight='500'
					cursor='pointer'
					_hover={{ textDecoration: 'underline' }}
					onClick={
						() => {
							setIsLinkMultisigButtonClicked(true)
						}
					}
				>
					Link your multisig
				</Text>
				<ArrowForwardIcon
					width={6}
					height={6}
					color='accent.azure' />
			</Flex>
		)
	}

	const renderLinkMultisigInput = () => {
		return (
			<Flex
				direction='column'
				gap={4}
				display={!isLinkMultisigButtonClicked ? 'none' : 'flex'}
			>
				<Flex
					direction='column'
					width='70%'>
					<SettingsInput
						value={multisigAddress}
						onChange={
							(e) => {
								if(e.target.value.includes(':')) {
									setMultisigAddress(e.target.value.split(':')[1])
								} else {
									setMultisigAddress(e.target.value)
								}

							}
						}

						placeholder='Solana or EVM address' />
					{safeState === 'safe-searching' && renderSearchingSafe()}
					{safeState === 'safe-found' && renderSafeDropdown()}
				</Flex>

				<Flex
					mt={4}
					gap={4}
					alignItems='center'>
					<Button
						variant='secondaryV2'
						isDisabled={!selectedSafeNetwork}
						onClick={() => setIsVerifySignerModalOpen(true)}
					>
						Link Multisig
					</Button>
					<Button
						variant='linkV2'
						color='black.1'>
						Cancel
					</Button>
				</Flex>
				<VerifySignerModal
					owners={selectedSafeNetwork ? selectedSafeNetwork.owners : []}
					// setOwnerAddress={(newOwnerAddress) => setOwnerAddress(newOwnerAddress)}
					setIsOwner={
						(newState) => {
							setIsOwner(newState)
						}
					}
					networkType={selectedSafeNetwork?.networkType ?? NetworkType.EVM}
					isOpen={IsVerifySignerModalOpen}
					onClose={() => setIsVerifySignerModalOpen(false)} />
			</Flex>
		)
	}

	const renderSearchingSafe = () => {
		return (
			<Flex
				className='loaderHelperText'
				gap={2}
				// position='relative'
				// left='386px'
				// top='-40px'
			>
				<Image
					className='loader'
					src='/ui_icons/loader.svg'
					color='black.1'
				/>
				<Text
					variant='v2_body'
					color='black.3'>
					Searching for this address on different networks..
				</Text>
			</Flex>
		)
	}

	const renderSafeDropdown = () => {
		return (
			<>
				<Flex
					className='loaderHelperText'
					// position='relative'
					// left='386px'
					// top='-40px'
					gap={2}
					mb={4}
				>
					{
						safeNetworks.length > 0 ? (
							<>
								<Image
									src='/ui_icons/Done_all_alt_round.svg'
									color='#273B4A' />
								<Text
									variant='v2_body'>
									{`Looks like this address is on ${safeNetworks.length} network${safeNetworks.length > 1 ? 's' : ''}`}
								</Text>

							</>
						) : (
							<Button
								variant='link'
								color='red'
								fontSize='14px'
								style={{ cursor: 'pointer' }}
							>
								But this address doesn’t exist on any of the 20 supported chains.
							</Button>
						)
					}


				</Flex>
				{
					safeNetworks.length ? (
						<SafeSelect
							safesOptions={safeNetworks}
							label=''
							helperText=''
							value={selectedSafeNetwork}
							onChange={
								(safeSelected: SafeSelectOption | undefined) => {
									if(safeSelected) {
										setSelectedSafeNetwork(safeSelected)
									}
								}
							} />
					) : <></>
				}
			</>
		)
	}

	const onChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>, field: string) => {
		const { value } = e.target
		setGrantProgramData({ ...grantProgramData, [field]: value })
	}

	const onChangeSocialValue = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
		const { value } = e.target
		if(grantProgramData?.socials?.length === 0 || !grantProgramData?.socials) {
			setGrantProgramData({ ...grantProgramData, socials: [{ name, value }] })
			return
		}

		const socialItem = grantProgramData?.socials?.find((social) => social.name === name)

		if(socialItem) {
			const socials = grantProgramData?.socials?.map((social) => {
				if(social.name === name) {
					return { ...social, value }
				}

				return social
			})
			setGrantProgramData({ ...grantProgramData, socials })
			return
		} else {
			const s = grantProgramData?.socials.map(social => {
				return {
					name: social.name,
					value: social.value
				}
			})
			const socials = [...s!, { name, value }]
			setGrantProgramData({ ...grantProgramData, socials })
			return
		}


		// console.log('socials', socials)
		// setGrantProgramData({ ...grantProgramData, socials })
	}

	const handleOnClickSave = async() => {
		const logoIpfsHash = imageFile !== null ? (await uploadToIPFS(imageFile.file)).hash : ''
		setGrantProgramData({ ...grantProgramData, logoIpfsHash })
		updateGrantProgram()
	}

	const getSocialValue = (name: string) => {
		return grantProgramData?.socials?.find((social) => social.name === name)?.value ?? ''
	}

	const { workspace, workspaceMembers, grantProgramData, setGrantProgramData } = useContext(SettingsFormContext)!

	const [imageFile, setImageFile] = useState<{file: File | null, hash?: string}>({ file: null })
	const [searchString, setSearchString] = useState('')
	const [ moreInfo, setMoreInfo ] = useState<EditorState>(EditorState.createEmpty())

	const [multisigAddress, setMultisigAddress] = useState('')
	const [isLinkMultisigButtonClicked, setIsLinkMultisigButtonClicked] = useState(false)

	const [loadingSafeData, setLoadingSafeData] = useState(false)
	const [safeNetworks, setSafeNetworks] = useState<SafeSelectOption[]>([])
	const [safeState, setSafeState] = useState('')
	const [selectedSafeNetwork, setSelectedSafeNetwork] = useState<SafeSelectOption>()

	const [IsVerifySignerModalOpen, setIsVerifySignerModalOpen] = useState(false)
	const [isOwner, setIsOwner] = useState(false)

	const [isNetworkTransactionModalOpen, setIsNetworkTransactionModalOpen] = useState(false)
	const [currentStepIndex, setCurrentStepIndex] = useState<number| undefined>()

	const { network } = useNetwork()

	const { linkMultisig, isMultisigLinked } = useLinkMultiSig({ multisigAddress, selectedSafeNetwork })
	const { updateGrantProgram, txHash } = useUpdateGrantProgram(setCurrentStepIndex, setIsNetworkTransactionModalOpen)

	const customToast = useCustomToast()
	// const customToastRef = useRef()
	// const toast = useToast()

	useEffect(() => {
		getProjectDetails(grantProgramData?.about).then(setMoreInfo)
	}, [grantProgramData])

	useEffect(() => {
		logger.info('Multi-sig address entered', multisigAddress)
		const fetchSafeData = async() => {
			const supportedPayouts = new SupportedPayouts()
			supportedPayouts.getSafeByAddress(multisigAddress, (safe) => {
				setLoadingSafeData(false)
				setSafeNetworks(safe)
			})
		}

		setLoadingSafeData(true)
		setSelectedSafeNetwork(undefined)
		if(multisigAddress) {
			setSafeState('safe-searching')
		} else {
			setSafeState('')
		}

		fetchSafeData()
	}, [multisigAddress])

	useEffect(() => {
		if(multisigAddress && loadingSafeData && safeNetworks.length < 1) {
			//search for safe in supported safes
			setSafeState('safe-searching')
		} else if(multisigAddress && safeNetworks.length > 0) {
			// show dropdown
			setSafeState('safe-found')
		}

	}, [safeNetworks])

	useEffect(() => {
		if(isOwner) {
			setIsVerifySignerModalOpen(false)
		}
	}, [isOwner])

	useEffect(() => {
		if(isOwner && !IsVerifySignerModalOpen && !isMultisigLinked) {
			linkMultisig()
			// if(toast) {
			// 	customToastRef.current = customToast
			// }

			customToast({
				title: 'Linking your multisig',
				status: 'info',
				isClosable: true,
				duration: 30000,
				position: 'top',
			})
		}
	}, [isOwner, IsVerifySignerModalOpen])

	useEffect(() => {
		if(isMultisigLinked) {
			customToast({
				title: 'Multisig linked successfully!',
				status: 'success',
				isClosable: true,
				position: 'top',
			})
		}
	}, [isMultisigLinked])


	return buildComponent()
}

Settings.getLayout = function(page: ReactElement) {
	return (
		<NavbarLayout
			renderSidebar={false}
			navbarConfig={{ showDomains: true, showLogo: false, showOpenDashboard: true, showAddMembers: true, bg: 'gray.1', }}
		>
			<SettingsFormProvider>
				{page}
			</SettingsFormProvider>
		</NavbarLayout>
	)
}


export default Settings