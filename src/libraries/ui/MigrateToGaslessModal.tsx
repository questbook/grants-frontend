import React, { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Button, Flex, Image, Modal, ModalCloseButton, ModalContent, ModalOverlay, Text, useToast } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { ALL_SUPPORTED_CHAIN_IDS, CHAIN_INFO } from 'src/constants/chains'
import { GetWorkspaceMembersQuery, useGetProfileDetailsQuery, useGetWorkspaceMembersQuery } from 'src/generated/graphql'
import SupportedChainId from 'src/generated/SupportedChainId'
import useQBContract from 'src/hooks/contracts/useQBContract'
import { useMultiChainQuery } from 'src/hooks/useMultiChainQuery'
import { ApiClientsContext, WebwalletContext } from 'src/pages/_app'
import { MinimalWorkspace } from 'src/types'
import getErrorMessage from 'src/utils/errorUtils'
import { getExplorerUrlForTxHash } from 'src/utils/formattingUtils'
import { addAuthorizedOwner } from 'src/utils/gaslessUtils'
import { delay } from 'src/utils/generics'
import logger from 'src/utils/logger'
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils'
import ConnectWalletModal from 'src/v2/components/ConnectWalletModal'
import NetworkTransactionModal from 'src/v2/components/NetworkTransactionModal'
import { useAccount, useNetwork, useSigner, useSwitchNetwork } from 'wagmi'

type MigrationState = 'no-domain-found' | 'no-application-found' | 'no-profile-found' | 'no-profile-found-all-chains' | 'migrate'

function MigrateToGasless() {
	const buildComponent = () => (
		<>
			<Modal
				isCentered={true}
				isOpen={isOpen}
				size='3xl'
				onClose={onClose}
			>
				<ModalOverlay
					backdropFilter='blur(12px)' />
				<ModalContent>
					<ModalCloseButton />
					<Flex>
						<Image
							w='40%'
							objectFit='cover'
							src='/accept-invite-side.png' />
						<Flex
							w='60%'
							direction='column'
							m={6}>
							<Text
								fontWeight='500'
								variant='v2_heading_3'>
								{t('/migrate_to_gasless.greeting_line_1')}
								{' '}
							</Text>
							<Text
								fontWeight='500'
								variant='v2_heading_3'>
								{t('/migrate_to_gasless.greeting_line_2')}
							</Text>
							<Text
								mt={6}
								variant='v2_title'
								fontWeight='500'>
								{t('/migrate_to_gasless.in_app_wallet')}
							</Text>
							<Flex
								direction='column'
								mt={2}
								p={4}
								boxShadow='inset 1px 1px 0px #F0F0F7, inset -1px -1px 0px #F0F0F7'
								borderRadius='4px'>
								<Text
									variant='v2_body'
									color='black.2'>
									{t('/migrate_to_gasless.what_it_means_to_you.title')}
								</Text>
								{
									POINTERS.map((pointer, index) => (
										<Flex
											align='center'
											key={index}
											mt={2}>
											<Image
												src={`/ui_icons/migrate-to-gasless/${index + 1}.svg`}
												boxSize='28px' />
											<Text
												variant='v2_body'
												color='black.2'
												fontWeight='500'
												ml={3}>
												{pointer}
											</Text>
										</Flex>
									))
								}
							</Flex>
							<Flex
								bg='lightBlue.1'
								borderLeft='4px solid'
								borderColor='lightBlue.2'
								p={4}
								mt={6}>
								<Image
									src='/ui_icons/migrate-to-gasless/info.svg'
									boxSize='24px' />
								<Text
									variant='v2_body'
									ml={4}>
									{t('/migrate_to_gasless.auxillary')}
								</Text>
							</Flex>
							<Box mt={6} />

							<Button
								ml='auto'
								px={4}
								py={2}
								// disabled={!shouldMigrate}
								variant='primaryV2'
								rightIcon={
									<Image
										src='/ui_icons/arrow-right-fill.svg'
										boxSize='20px' />
								}
								mt='auto'
								onClick={migrate}>
								{t('/migrate_to_gasless.button')}
							</Button>
						</Flex>
					</Flex>
				</ModalContent>
			</Modal>
			<ConnectWalletModal
				isOpen={isConnectWalletModalOpen}
				onClose={() => setIsConnectWalletModalOpen(false)} />
			<NetworkTransactionModal
				currentStepIndex={networkModalStep || 0}
				isOpen={networkModalStep !== undefined}
				subtitle='Migrating your profile'
				description={
					<Flex
						direction='column'
						align='start'
						maxW='100%'>
						<Text
							fontWeight='bold'
							color='#3F8792'>
							Migrating wallet for
						</Text>
						<Text
							noOfLines={1}
							fontSize='sm'
							color='#3F8792'>
							{walletAddress || ''}
						</Text>
					</Flex>
				}
				steps={
					[
						'Setting up ZeroWallet',
						'Sign Migration Transaction',
						'Waiting for confirmation',
						'Waiting for indexing to complete',
						'Migration successful'
					]
				}
				viewLink={getExplorerUrlForTxHash(walletChain?.id, transactionHash)}
				onClose={
					() => {
						setNetworkModalStep(undefined)
						router.reload()
					}
				}
			/>
		</>
	)

	const { t } = useTranslation()
	const POINTERS = [t('/migrate_to_gasless.what_it_means_to_you.1'), t('/migrate_to_gasless.what_it_means_to_you.2')]

	// useContexts defined here
	const { waitForScwAddress, webwallet } = useContext(WebwalletContext)!
	const { subgraphClients } = useContext(ApiClientsContext)!

	// useStates start here
	const [isOpen, setIsOpen] = useState(false)
	const [isConnectWalletModalOpen, setIsConnectWalletModalOpen] = useState(false)
	const [networkModalStep, setNetworkModalStep] = useState<number>()
	const [transactionHash, setTransactionHash] = useState<string>()
	const [shouldMigrate, setShouldMigrate] = useState<{state: MigrationState, chainId?: SupportedChainId}>()
	const [ownedWorkspaces, setOwnedWorkspaces] = useState<MinimalWorkspace[]>([])

	// custom hooks
	const { address: walletAddress } = useAccount()
	const { data: signer } = useSigner()
	const { chain: walletChain } = useNetwork()
	const { switchNetwork } = useSwitchNetwork()
	const router = useRouter()
	const toast = useToast()
	const workspaceContract = useQBContract('workspace', walletChain?.id as SupportedChainId, false)

	const { results, fetchMore } = useMultiChainQuery({
		useQuery: useGetProfileDetailsQuery,
		options: {
			variables: {
				actorId: walletAddress || ''
			}
		}
	})

	const { results: ownedWorkspacesResults, fetchMore: fetchMoreOwnedWorkspaces } = useMultiChainQuery({
		useQuery: useGetWorkspaceMembersQuery,
		options: {
			variables: {
				actorId: walletAddress || ''
			}
		}
	})

	// variables required
	const isMigrateYes = router?.query?.migrate === 'yes'

	// functions start here
	const onClose = (done?: boolean) => {
		// if we're done
		// reload the page to reflect the latest changes
		if(done) {
			window.location.href = window.location.pathname
		} else {
			const newQuery = { ...router.query }
			delete newQuery.migrate

			router.push({ query: newQuery })
			setIsOpen(false)
		}
	}

	const migrate = async() => {
		try {
			if(!walletAddress) {
				setIsConnectWalletModalOpen(true)
				return
			}

			if(!walletChain || !shouldMigrate || !switchNetwork || !webwallet) {
				return
			}

			if(!(walletChain.id in ALL_SUPPORTED_CHAIN_IDS)) {
				const { state, chainId } = shouldMigrate

				if(state === 'no-domain-found' && chainId) {
					toast({
						title: 'No DAO found to migrate',
						description: `The current network (${walletChain?.name}) your wallet is connected to has no DAO. Please switch your network to ${CHAIN_INFO[chainId]?.name} (or some other network) where you have DAOs`,
						status: 'warning',
						duration: 9000,
						isClosable: true,
					})
					switchNetwork(chainId)
					return
				} else if(state === 'no-application-found' && chainId) {
					toast({
						title: 'No applications found to migrate',
						description: `The current network (${walletChain?.name}) your wallet is connected to has no applications. Please switch your network to ${CHAIN_INFO[chainId]?.name} (or some other network) where you have applications`,
						status: 'warning',
						duration: 9000,
						isClosable: true,
					})
					switchNetwork(chainId)
					return
				} else if(state === 'no-profile-found') {
					toast({
						title: 'No profile found to migrate',
						description: `No profile was found on questbook that mapped to the address ${walletAddress} on ${walletChain?.name}`,
						status: 'warning',
						duration: 9000,
						isClosable: true,
					})
					return
				} else if(state === 'no-profile-found-all-chains') {
					// Case when no profile on any network
					toast({
						title: 'No profile found to migrate',
						description: `No profile was found on questbook that mapped to the address ${walletAddress} on any of the supported networks`,
						status: 'warning',
						duration: 9000,
						isClosable: true,
					})
					return
				} else if(state !== 'migrate') {
					return
				}
			}

			// Will reach here only if state === 3

			setNetworkModalStep(0)

			while(!signer) {
				delay(2000)
			}

			const scwAddress = await waitForScwAddress
			setNetworkModalStep(1)

			const transaction = await workspaceContract.migrateWallet(walletAddress, scwAddress)

			setNetworkModalStep(2)
			const transactionData = await transaction.wait()
			setTransactionHash(transactionData.transactionHash)

			setNetworkModalStep(3)
			await subgraphClients[walletChain?.id].waitForBlock(transactionData.blockNumber)

			// adding the details of all workspaces owned by the user to the database

			try {
				await Promise.all(ownedWorkspaces.map((ownedWorkspace: MinimalWorkspace) => new Promise<void>(async(resolve, reject) => {
					try {
						await addAuthorizedOwner(
							Number(ownedWorkspace.id),
							webwallet?.address,
							scwAddress,
						getSupportedChainIdFromWorkspace(ownedWorkspace)?.toString()!,
						'TO_BE_MODIFIED_SAFE_ADDRESS_JUST_PLACE_HOLDER'
						)
						resolve()
					} catch{
						reject()
					}
				})))
			} catch(e) {
				logger.error({ ownedWorkspaces, e }, 'Failed to migrate workspaces on unsupported networks')
			}

			setNetworkModalStep(5)

			// set to ensure ensure migration doesn't occur again
			localStorage.setItem('didMigrate', 'true')
			onClose(true)
		} catch(err) {
			setNetworkModalStep(undefined)
			logger.error({ err }, 'Error migrating wallet')

			const msg = getErrorMessage(err as Error)
			toast({
				title: `Migration error "${msg}"`,
				status: 'warning',
				duration: 9000,
				isClosable: true,
			})
		}
	}

	// useEffects start here
	useEffect(() => {
		if(walletAddress && walletChain?.id) {
			setShouldMigrate({ state: 'migrate' })
			fetchMore({
				actorId: walletAddress
			}, true)

			fetchMoreOwnedWorkspaces({
				actorId: walletAddress
			}, true)
		}
	}, [walletAddress, walletChain?.id])

	useEffect(() => {
		if(!ownedWorkspacesResults) {
			return
		}

		const filteredOwnedWorkspaces: GetWorkspaceMembersQuery['workspaceMembers'] = []

		if(walletAddress && walletChain?.id) {
			const _ownedWorkspaces = ownedWorkspacesResults
				.filter(result => result?.workspaceMembers?.length)
				.reduce((prev, curr) => prev.concat(curr?.workspaceMembers || []), filteredOwnedWorkspaces)
				.map((prev) => prev.workspace)

			setOwnedWorkspaces(_ownedWorkspaces)
		}
	}, [ownedWorkspacesResults])

	useEffect(() => {
		if(walletAddress && walletChain?.id) {
			const workspaceFromMember = results.find((result) => result?.workspaceMembers?.length)?.workspaceMembers[0]?.workspace
			const workspaceFromApplication = results.find((result) => result?.grantApplications.length)?.grantApplications[0]?.grant?.workspace
			const chainIdFromMemberWorkspace = getSupportedChainIdFromWorkspace(workspaceFromMember)
			const chainIdFromApplicationWorkspace = getSupportedChainIdFromWorkspace(workspaceFromApplication)

			let hasProfileOnCurrentChain = false
			for(const result of results) {
				if(result?.workspaceMembers?.length && getSupportedChainIdFromWorkspace(result?.workspaceMembers[0]?.workspace) === walletChain.id) {
					hasProfileOnCurrentChain = true
					break
				}

				if(result?.grantApplications?.length && getSupportedChainIdFromWorkspace(result?.grantApplications[0]?.grant?.workspace) === walletChain.id) {
					hasProfileOnCurrentChain = true
					break
				}
			}

			if((!chainIdFromMemberWorkspace && !chainIdFromApplicationWorkspace) || chainIdFromMemberWorkspace === walletChain?.id || chainIdFromApplicationWorkspace === walletChain?.id) {
				if(!chainIdFromMemberWorkspace && !chainIdFromApplicationWorkspace) {
					setShouldMigrate({ state: 'no-profile-found-all-chains' })
				}

				if(chainIdFromMemberWorkspace === walletChain?.id) {
					setShouldMigrate({ state: 'migrate', chainId: chainIdFromMemberWorkspace })
				} else if(chainIdFromApplicationWorkspace === walletChain?.id) {
					setShouldMigrate({ state: 'migrate', chainId: chainIdFromApplicationWorkspace })
				}

				return
			}

			if(ALL_SUPPORTED_CHAIN_IDS.indexOf(walletChain.id) === -1 || !hasProfileOnCurrentChain) {
				if(workspaceFromMember && chainIdFromMemberWorkspace && ALL_SUPPORTED_CHAIN_IDS.indexOf(chainIdFromMemberWorkspace) !== -1) {
					setShouldMigrate({ state: 'no-domain-found', chainId: chainIdFromMemberWorkspace })
				} else if(!workspaceFromMember && workspaceFromApplication && chainIdFromApplicationWorkspace && ALL_SUPPORTED_CHAIN_IDS.indexOf(chainIdFromApplicationWorkspace) !== -1) {
					setShouldMigrate({ state: 'no-application-found', chainId: chainIdFromApplicationWorkspace })
				} else {
					setShouldMigrate({ state: 'no-profile-found' })
				}
			} else {
				setShouldMigrate({ state: 'migrate' })
			}
		}
	}, [results])

	useEffect(() => {
		if(walletAddress) {
			setIsConnectWalletModalOpen(false)
		}
	}, [walletAddress])

	useEffect(() => {
		if(isMigrateYes) {
			setIsOpen(isMigrateYes)
		}
	}, [isMigrateYes])

	return buildComponent()
}

export default MigrateToGasless