import { ReactElement, useContext, useMemo, useState } from 'react'
import { Button, Flex, Text } from '@chakra-ui/react'
import { generateInputForAuthorisation } from '@questbook/anon-authoriser'
import { base58 } from 'ethers/lib/utils'
import { useRouter } from 'next/router'
import { defaultChainId, SupportedChainId } from 'src/constants/chains'
import useCustomToast from 'src/libraries/hooks/useCustomToast'
import useQBContract from 'src/libraries/hooks/useQBContract'
import useSetupProfile from 'src/libraries/hooks/useSetupProfile'
import FlushedInput from 'src/libraries/ui/FlushedInput'
import ImageUpload from 'src/libraries/ui/ImageUpload'
import NavbarLayout from 'src/libraries/ui/navbarLayout'
import NetworkTransactionFlowStepperModal from 'src/libraries/ui/NetworkTransactionFlowStepperModal'
import { getExplorerUrlForTxHash } from 'src/libraries/utils/formatting'
import { ApiClientsContext, GrantsProgramContext, WebwalletContext } from 'src/pages/_app'

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
						variant='heading3'
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
						isLoading={!scwAddress || isLoading}
						loadingText={isLoading ? 'Creating Profile' : 'Loading your wallet'}
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
										pathname: '/dashboard',
										query: { ...router.query, chainId: inviteInfo?.chainId }
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
	const [isLoading, setIsLoading] = useState<boolean>(false)

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
		return inviteInfo?.workspaceId
	}, [inviteInfo])

	const { setupProfile } = useSetupProfile(
		{
			workspaceId,
			memberId: `${workspaceId}.${scwAddress}`,
			chainId: inviteInfo?.chainId ?? defaultChainId,
			type: 'join-using-link',
			setNetworkTransactionModalStep,
			setTransactionHash,
		})

	const isDisabled = useMemo(() => {
		return name === '' || email === ''
	}, [name, email])

	const onCreateClick = async() => {
		setIsLoading(true)
		if(inviteInfo?.role === undefined || !signature) {
			return
		}

		const inviteinfo: {
			role: number
			privateKey: string
			workspaceId: string
			chainId: SupportedChainId
		} = {
			role: inviteInfo?.role,
			privateKey: base58.encode(inviteInfo.privateKey),
			workspaceId: inviteInfo?.workspaceId as string,
			chainId: inviteInfo?.chainId as SupportedChainId
		}

		await setupProfile({
			name, email, imageFile, role: inviteInfo.role, signature, inviteInfo: inviteinfo
		})
		setIsLoading(false)
	}

	const toast = useCustomToast()

	return buildComponent()
}

SetupProfile.getLayout = function(page: ReactElement) {
	return (
		<NavbarLayout>
			{page}
		</NavbarLayout>
	)
}

export default SetupProfile