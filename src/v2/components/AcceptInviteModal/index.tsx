import { createElement, useEffect, useRef, useState } from 'react'
import { Button, HStack, Image, Input, Modal, ModalCloseButton, ModalContent, ModalOverlay, Progress, Spacer, Text, useToast, VStack } from '@chakra-ui/react'
import { BigNumber } from 'ethers'
import { ROLES } from 'src/constants'
import useDAOName from 'src/hooks/useDAOName'
import { delay } from 'src/utils/generics'
import { InviteInfo, useJoinInvite } from 'src/utils/invite'
import { ForwardArrow } from 'src/v2/assets/custom chakra icons/Arrows/ForwardArrow'
import { useAccount, useConnect } from 'wagmi'
import ConnectWalletModal from '../ConnectWalletModal'
import ControlBar from '../ControlBar'
import NetworkFeeEstimateView from '../NetworkFeeEstimateView'
import NetworkTransactionModal from '../NetworkTransactionModal'
import RoleDataDisplay from './RoleDataDisplay'

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
	getJoinInviteGasEstimate: () => Promise<BigNumber | undefined>
	updateProfile<T extends keyof DAOMemberProfile>(key: T, value: DAOMemberProfile[T]): void
	nextStep: () => void
}

export default ({ inviteInfo, onClose }: AcceptInviteModalProps) => {
	const { data: accountData } = useAccount()
	const daoName = useDAOName(inviteInfo?.workspaceId, inviteInfo?.chainId)

	const { isDisconnected } = useConnect()

	const toast = useToast()

	const [currentStep, setCurrentStep] = useState(0)
	const [inviteJoinStep, setInviteJoinStep] = useState<number>()
	const [profile, setProfile] = useState<DAOMemberProfile>({
		fullName: '',
		walletAddress: '',
		profileImageUrl: '/ui_icons/default_profile_picture.png'
	})

	const { joinInvite, getJoinInviteGasEstimate } = useJoinInvite(inviteInfo!, profile)

	const walletAddress = accountData?.address

	const role = typeof inviteInfo?.role === 'undefined'
		? ROLES.reviewer
		: inviteInfo.role

	const displayProps: DisplayProps = {
		role,
		daoName,
		profile,
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
			})

			setInviteJoinStep(5)

			await delay(3_000)

			toast({
				title: `All set! You're now a member of ${daoName}!`,
				status: 'success',
			})

			onClose()
		} catch(error: any) {
			console.error('error in join ', error)

			toast({
				title: `Error in joining the DAO: "${error.message}"`,
				status: 'error'
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
				isOpen={!!inviteInfo && !isDisconnected}
				size='3xl'
				onClose={onClose}
			>
				<ModalOverlay />
				<ModalContent>
					<ModalCloseButton />
					<HStack
						align='stretch'
						justifyContent='stretch'>
						{createElement(STEP_DISPLAYS[currentStep].left, displayProps)}
						<VStack
							align='start'
							spacing={4}
							p='0.75rem'
							pr='2.5rem'
							pb='2.5rem'
							minH='70vh'
							flexGrow={1}
						>
							<ControlBar
								points={SECTIONS}
								currentIndex={currentStep} />
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
						'Sign transaction',
						'Wait for confirmation',
						'Waiting for transaction to index',
						'Profile created on-chain'
					]
				}
			/>
			<ConnectWalletModal
				isOpen={isDisconnected && !!inviteInfo}
				onClose={() => { }}
			/>
		</>
	)
}

const Step1LeftDisplay = () => {
	return (
		<Image
			w='50%'
			h='100%'
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

			<Text fontWeight='bold'>
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
					colorScheme='brandv2'>
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

const Step2LeftDisplay = ({ profile }: DisplayProps) => {
	const [profileImageUrl, setProfileImageUrl] = useState(profile.profileImageUrl)
	const imageUploadRef = useRef<HTMLInputElement>(null)

	const onImageUpdate = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]
		if(file) {
			const imgUrl = URL.createObjectURL(file)
			setProfileImageUrl(imgUrl)
		}
	}

	return (
		<VStack
			bg='#FDF2C3'
			p='3'
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
						<Text fontSize='sm'>
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

const Step2RightDisplay = ({ getJoinInviteGasEstimate, profile, updateProfile, nextStep }: DisplayProps) => {
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
									fontSize='sm'
									fontWeight='bold'>
									{label}
								</Text>
								<Text
									fontSize='sm'
									fontWeight='light'
									color='v2LightGrey'>
									{description}
								</Text>
								<Input
									variant='brandFlushed'
									disabled={!editable}
									placeholder={placeholder}
									fontWeight={'500'}
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
				<NetworkFeeEstimateView
					getEstimate={getJoinInviteGasEstimate} />
			</HStack>

			<Button
				disabled={!allFieldsTruthy}
				w='100%'
				onClick={nextStep}
				colorScheme='brandv2'>
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
		description: 'Others can identify you better',
		placeholder: 'John Doe',
		editable: true
	},
	{
		key: 'walletAddress',
		label: 'Wallet Address',
		description: 'Address associated with your profile',
		placeholder: '',
		editable: false
	}
] as const

const SECTIONS = [
	{ id: 'aboutUs', label: 'About Us' },
	{ id: 'profile', label: 'Profile' }
]