import { ChangeEvent, createElement, useContext, useEffect, useRef, useState } from 'react'
import { Box, Button, HStack, Image, Input, Modal, ModalCloseButton, ModalContent, ModalOverlay, Progress, Spacer, Text, useToast, VStack } from '@chakra-ui/react'
import { BigNumber } from 'ethers'
import ErrorToast from 'src/components/ui/toasts/errorToast'
import { ROLES } from 'src/constants'
import { useNetwork } from 'src/hooks/gasless/useNetwork'
import { useQuestbookAccount } from 'src/hooks/gasless/useQuestbookAccount'
import useDAOName from 'src/hooks/useDAOName'
import { WebwalletContext } from 'src/pages/_app'
import { InviteInfo, useJoinInvite } from 'src/screens/discover/_utils/invite'
import getErrorMessage from 'src/utils/errorUtils'
import { getExplorerUrlForTxHash } from 'src/utils/formattingUtils'
import { addAuthorizedUser } from 'src/utils/gaslessUtils'
import { delay } from 'src/utils/generics'
import logger from 'src/utils/logger'
import { ForwardArrow } from 'src/v2/assets/custom chakra icons/Arrows/ForwardArrow'
import RoleDataDisplay from 'src/v2/components/AcceptInviteModal/RoleDataDisplay'
import ControlBar from 'src/v2/components/ControlBar'
import NetworkTransactionModal from 'src/v2/components/NetworkTransactionModal'

export type AcceptInviteModalProps = {
	inviteInfo?: InviteInfo | undefined
	onClose: () => void
}

type DAOMemberProfile = {
	fullName: string
	walletAddress: string
	profileImageUrl: string
}

type DisplayProps = {
	daoName?: string
	workspaceId?: string
	role: number
	profile: DAOMemberProfile
	isBiconomyInitialised: boolean
	getJoinInviteGasEstimate: () => Promise<BigNumber | undefined>
	updateProfile<T extends keyof DAOMemberProfile>(key: T, value: DAOMemberProfile[T]): void
	nextStep: () => void
}

export default ({ inviteInfo, onClose }: AcceptInviteModalProps) => {
	const daoName = useDAOName(inviteInfo?.workspaceId, inviteInfo?.chainId)

	const { webwallet } = useContext(WebwalletContext)!

	const toast = useToast()

	const [currentStep, setCurrentStep] = useState(0)
	const [inviteJoinStep, setInviteJoinStep] = useState<number>()
	const [profile, setProfile] = useState<DAOMemberProfile>({
		fullName: '',
		walletAddress: '',
		profileImageUrl: '/ui_icons/default_profile_picture.png'
	})

	const [shouldRefreshNonce, setShouldRefreshNonce] = useState<boolean>(false)

	const { joinInvite, getJoinInviteGasEstimate, isBiconomyInitialised } = useJoinInvite(inviteInfo!, profile, shouldRefreshNonce)

	const { data: accountData, nonce } = useQuestbookAccount(shouldRefreshNonce)
	const { activeChain } = useNetwork()

	const [transactionHash, setTransactionHash] = useState<string>()

	useEffect(() => {

		if(!webwallet) {
			return
		}

		// console.log('webwallet exists', nonce)
		if(nonce && nonce !== 'Token expired') {
			return
		}

		// console.log('adding nonce')

		addAuthorizedUser(webwallet?.address)
			.then(() => {
				setShouldRefreshNonce(true)
				// console.log('Added authorized user', webwallet.address)
			})
			// .catch((err) => console.log("Couldn't add authorized user", err))
	}, [webwallet, nonce, shouldRefreshNonce])

	const walletAddress = accountData?.address

	const role = typeof inviteInfo?.role === 'undefined'
		? ROLES.reviewer
		: inviteInfo.role

	const displayProps: DisplayProps = {
		role,
		daoName,
		profile,
		isBiconomyInitialised,
		updateProfile(key, value) {
			setProfile(profile => ({ ...profile, [key]: value }))
		},
		nextStep: () => {
			if(currentStep === 0) {
				setCurrentStep(1)
			} else if(currentStep === 1) {
				startJoinInviteProcess()
			}
		},
		getJoinInviteGasEstimate,
	}

	const startJoinInviteProcess = async() => {
		try {
			setInviteJoinStep(0)
			await joinInvite(step => {
				if(step === 'ipfs-uploaded') {
					setInviteJoinStep(1)
				} else if(step === 'tx-signed') {
					setInviteJoinStep(2)
				} else if(step === 'tx-confirmed') {
					setInviteJoinStep(3)
				}
			}, setTransactionHash)

			if(inviteInfo?.chainId && inviteInfo?.workspaceId) {
				const newWorkspace = `chain_${inviteInfo?.chainId.toString()}-0x${inviteInfo?.workspaceId.toString(16)}`
				logger.info({ newWorkspace }, 'Setting workspace in cache')
				localStorage.setItem('currentWorkspace', newWorkspace)
			}

			setInviteJoinStep(5)

			await delay(3_000)

			toast({
				title: `All set! You're now a member of ${daoName}!`,
				status: 'success',
			})

			onClose()
		} catch(error) {
			logger.error({ error }, 'error in joining invite link')

			const msg = getErrorMessage(
				error as Error,
				'The invite link is invalid, has expired or already been used'
			)
			const toastId = toast({
				render: () => ErrorToast({
					title: `Failed to join "${daoName}"`,
					content: msg,
					close: () => {
						toast.close(toastId!)
					},
				}),
				duration: 9000,
			})
		} finally {
			setInviteJoinStep(undefined)
		}
	}

	useEffect(() => {
		if(walletAddress) {
			setProfile(profile => ({
				...profile,
				walletAddress,
			}))
		}
	}, [walletAddress, setProfile])

	return (
		<>
			<Modal
				isCentered={true}
				isOpen={!!inviteInfo}
				size='3xl'
				onClose={onClose}
			>
				<ModalOverlay />
				<ModalContent>
					<ModalCloseButton />
					<HStack
						spacing='0'
						align='stretch'
						justifyContent='stretch'>
						{createElement(STEP_DISPLAYS[currentStep].left, displayProps)}
						<VStack
							align='start'
							spacing='4'
							p='1.5rem'
							pt='1rem'
							minH='70vh'
							flexGrow={1}
						>
							<HStack
								w='100%'
								pr='3rem'>
								<ControlBar
									points={SECTIONS}
									currentIndex={currentStep} />
							</HStack>
							{createElement(STEP_DISPLAYS[currentStep].right, displayProps)}
						</VStack>
					</HStack>
				</ModalContent>
			</Modal>
			<NetworkTransactionModal
				currentStepIndex={inviteJoinStep || 0}
				isOpen={typeof inviteJoinStep !== 'undefined'}
				subtitle='creating profile'
				description={
					<HStack w='100%'>
						<VStack
							spacing='0'
							align='left'
							maxW='50%'>
							<Text
								fontWeight='bold'
								color='#3F8792'>
								{profile.fullName}
							</Text>
							<Text
								noOfLines={1}
								fontSize='sm'
								color='#3F8792'>
								{profile.walletAddress}
							</Text>
						</VStack>

						<Spacer />

						<Image
							boxSize='10'
							src={profile.profileImageUrl} />
					</HStack>
				}
				steps={
					[
						'Uploading data to IPFS',
						'Signing transaction with in-app wallet',
						'Wait for confirmation',
						'Indexing transaction on graph protocol',
						'Profile created on-chain'
					]
				}
				viewLink={getExplorerUrlForTxHash(activeChain, transactionHash)}
				onClose={
					() => {
						setInviteJoinStep(undefined)
					}
				}
			/>
			{/* <ConnectWalletModal
				isOpen={isDisconnected && !!inviteInfo}
				onClose={() => { }}
			/> */}
		</>
	)
}

const Step1LeftDisplay = () => {
	return (
		<Image
			w='40%'
			objectFit='cover'
			src='/accept-invite-side.png' />
	)
}

const Step1RightDisplay = ({ daoName, role, nextStep }: DisplayProps) => {
	return (
		<>
			<Text
				fontWeight='bold'
				fontSize='2xl'>
				gm, 👋
				<br />
				Welcome to Questbook!
			</Text>

			<Text
				fontWeight='bold'
				fontSize='sm'>
				You are invited to
				{' '}
				{
					!!daoName
						? daoName
						: (
							<Progress
								w='4rem'
								display='inline-block'
								borderRadius='base'
								isIndeterminate />
						)
				}
			</Text>

			<RoleDataDisplay role={role} />

			<Spacer flexGrow={10} />

			<HStack w='100%'>
				<Spacer />
				<Button
					onClick={nextStep}
					variant='primaryV2'>
					Continue
					<Spacer w='2' />
					<ForwardArrow
						h='3'
						w='3' />
				</Button>
			</HStack>
		</>
	)
}

const Step2LeftDisplay = ({ role, profile }: DisplayProps) => {
	const [profileImageUrl, setProfileImageUrl] = useState(profile.profileImageUrl)
	const imageUploadRef = useRef<HTMLInputElement>(null)

	const onImageUpdate = (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]
		if(file) {
			const imgUrl = URL.createObjectURL(file)
			setProfileImageUrl(imgUrl)
		}
	}

	return (
		<VStack
			bg={role === ROLES.admin ? '#FDF2C3' : '#C8CBFC'}
			p='3'
			pl='4'
			align='start'
			w='35%'>
			<Text
				fontSize='xl'
				fontWeight='bold'>
				Setup Profile
			</Text>

			<Spacer maxH='2' />

			<VStack>
				<Image
					boxSize='7rem'
					borderRadius='full'
					src={profileImageUrl}
				/>
				<HStack>
					<Button
						onClick={() => imageUploadRef.current?.click()}
						variant='ghost'
						colorScheme='brandv2'>
						<Image
							src='ui_icons/upload_v2.svg'
							h='4' />
						<Spacer w='2' />
						<Text
							fontSize='sm'
							color='black'>
							Upload picture
						</Text>
					</Button>
					<Input
						style={{ display: 'none' }}
						ref={imageUploadRef}
						type='file'
						name='myImage'
						onChange={onImageUpdate}
						accept='image/jpg, image/jpeg, image/png'
					/>
				</HStack>
			</VStack>
		</VStack>
	)
}

const Step2RightDisplay = ({ profile, updateProfile, nextStep, isBiconomyInitialised }: DisplayProps) => {
	const allFieldsTruthy = Object.values(profile).every(v => !!v)

	return (
		<>
			{
				FIELD_INPUTS.map(
					({ key, label, description, placeholder, editable }) => {
						return (
							<VStack
								w='100%'
								p='2'
								key={key}
								align='start'
								spacing='0'>
								<Text
									fontSize='md'
									fontWeight='bold'>
									{label}
								</Text>
								<Text
									fontSize='sm'
									fontWeight='light'
									color='brandSubtext'>
									{description}
								</Text>

								<Box h='1' />

								<Input
									variant='brandFlushed'
									disabled={!editable}
									placeholder={placeholder}
									fontWeight='500'
									background='transparent'
									color={editable ? undefined : 'v2LightGrey'}
									value={profile[key] || ''}
									onChange={
										(e) => {
											updateProfile(key, e.target.value)
										}
									}
									errorBorderColor='red'
									isInvalid={false}
								/>
							</VStack>
						)
					}
				)
			}

			<Spacer />

			<HStack
				w='100%'
				align='center'
				justify='center'>
				{/* <NetworkFeeEstimateView
					getEstimate={getJoinInviteGasEstimate} /> */}
			</HStack>

			<Button
				disabled={!allFieldsTruthy || !isBiconomyInitialised}
				w='100%'
				onClick={nextStep}
				variant='primaryV2'>
				Create profile
			</Button>
		</>
	)
}

const STEP_DISPLAYS = [
	{ left: Step1LeftDisplay, right: Step1RightDisplay },
	{ left: Step2LeftDisplay, right: Step2RightDisplay }
]

const FIELD_INPUTS = [
	{
		key: 'fullName',
		label: 'Name',
		description: 'Others can identify you better.',
		placeholder: 'John Doe',
		editable: true
	},
] as const

const SECTIONS = [
	{ id: 'aboutUs', label: 'About Us' },
	{ id: 'profile', label: 'Profile' }
]
