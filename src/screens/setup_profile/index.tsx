import { ReactElement, useContext, useMemo, useState } from 'react'
import { Button, Flex, Text } from '@chakra-ui/react'
import { generateInputForAuthorisation } from '@questbook/anon-authoriser'
import { useRouter } from 'next/router'
import { defaultChainId } from 'src/constants/chains'
import useQBContract from 'src/hooks/contracts/useQBContract'
import useCustomToast from 'src/libraries/hooks/useCustomToast'
import useSetupProfile from 'src/libraries/hooks/useSetupProfile'
import FlushedInput from 'src/libraries/ui/FlushedInput'
import ImageUpload from 'src/libraries/ui/ImageUpload'
import NavbarLayout from 'src/libraries/ui/navbarLayout'
import NetworkTransactionFlowStepperModal from 'src/libraries/ui/NetworkTransactionFlowStepperModal'
import { ApiClientsContext, GrantsProgramContext, WebwalletContext } from 'src/pages/_app'
import { getExplorerUrlForTxHash } from 'src/utils/formattingUtils'

function SetupProfile() {
	const buildComponent = () => {
		return inviteInfo ? view() : errorView()
	}

	const errorView = () => {
		return (
			<Flex
				w='100%'
				h='calc(100vh - 64px)'
				justify='center'
				align='center'>
				<Text>
					Oops, something went wrong. Please try again with the invite link
				</Text>
			</Flex>
		)
	}

	const view = () => {
		return (
			<Flex
				w='100%'
				h='calc(100vh - 64px)'
				justify='center'
				align='center'>
				<Flex
					bg='white'
					w='80%'
					border='1px solid #E7E4DD'
					boxShadow='0px 2px 4px rgba(29, 25, 25, 0.1)'
					py={8}
					direction='column'
					align='center'
					overflowY='auto'>
					<Text
						variant='v2_heading_3'
						fontWeight='500'>
						Setup your profile
					</Text>
					<Text mt={1}>
						Others can you identify you better with a real name.
					</Text>
					<Flex
						w='60%'
						mt={8}
						px={6}
						py={8}
						direction='column'
						border='1px solid #E7E4DD'>
						<ImageUpload
							imageFile={{ file: imageFile }}
							setImageFile={
								(img) => {
									setImageFile(img.file)
								}
							} />
						<FlushedInput
							w='100%'
							flexProps={{ w: '100%', mt: 5 }}
							placeholder='Full Name'
							borderBottom='1px solid #E7E4DD'
							maxLength={300}
							textAlign='left'
							fontSize='16px'
							lineHeight='24px'
							fontWeight='400'
							value={name}
							onChange={
								(e) => {
									setName(e.target.value)
								}
							} />

						<FlushedInput
							w='100%'
							flexProps={{ w: '100%', mt: 5 }}
							placeholder='Email address'
							borderBottom='1px solid #E7E4DD'
							textAlign='left'
							fontSize='16px'
							lineHeight='24px'
							fontWeight='400'
							value={email}
							onChange={
								(e) => {
									setEmail(e.target.value)
								}
							} />
					</Flex>

					<Button
						mt={8}
						variant='primaryLarge'
						isDisabled={isDisabled}
						onClick={onCreateClick}>
						<Text color='white'>
							Create
						</Text>
					</Button>
				</Flex>
				<NetworkTransactionFlowStepperModal
					isOpen={networkTransactionModalStep !== undefined}
					currentStepIndex={networkTransactionModalStep || 0}
					viewTxnLink={getExplorerUrlForTxHash(inviteInfo?.chainId, transactionHash)}
					onClose={
						() => {
							setNetworkTransactionModalStep(undefined)
							setTransactionHash('')
							setRole(inviteInfo?.role === 0 ? 'admin' : 'reviewer')
							toast({
								title: 'Profile created successfully',
								status: 'success',
								duration: 1000,
								onCloseComplete: () => {
									router.push({
										pathname: '/dashboard'
									})
								}
							})
						}
					} />
			</Flex>
		)
	}

	const { inviteInfo } = useContext(ApiClientsContext)!
	const { setRole } = useContext(GrantsProgramContext)!
	const { scwAddress } = useContext(WebwalletContext)!
	const router = useRouter()

	const [name, setName] = useState<string>('')
	const [email, setEmail] = useState<string>('')

	const [imageFile, setImageFile] = useState<File | null>(null)
	const [networkTransactionModalStep, setNetworkTransactionModalStep] = useState<number>()
	const [transactionHash, setTransactionHash] = useState<string>('')

	const workspaceRegistry = useQBContract('workspace', inviteInfo?.chainId)
	const signature = useMemo(() => (
		(scwAddress && inviteInfo?.privateKey)
			? generateInputForAuthorisation(
				scwAddress!,
				workspaceRegistry.address,
				inviteInfo.privateKey,
			)
			: undefined
	), [scwAddress, workspaceRegistry.address, inviteInfo?.privateKey])

	const workspaceId = useMemo(() => {
		return `0x${inviteInfo?.workspaceId.toString(16)}`
	}, [inviteInfo])

	const { setupProfile, isBiconomyInitialised } = useSetupProfile(
		{
			workspaceId,
			memberId: `${workspaceId}.${scwAddress}`,
			chainId: inviteInfo?.chainId ?? defaultChainId,
			type: 'join',
			setNetworkTransactionModalStep,
			setTransactionHash,
		})

	const isDisabled = useMemo(() => {
		return name === '' || email === '' || !isBiconomyInitialised
	}, [name, email, isBiconomyInitialised])

	const onCreateClick = async() => {
		if(inviteInfo?.role === undefined || !signature) {
			return
		}

		setupProfile({
			name, email, imageFile, role: inviteInfo.role, signature
		})
	}

	const toast = useCustomToast()

	return buildComponent()
}

SetupProfile.getLayout = function(page: ReactElement) {
	return (
		<NavbarLayout renderSidebar={false}>
			{page}
		</NavbarLayout>
	)
}

export default SetupProfile