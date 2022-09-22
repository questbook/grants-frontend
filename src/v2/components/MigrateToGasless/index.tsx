import React, { useContext, useEffect, useState } from 'react'
import { Box, Button, Flex, Image, Modal, ModalCloseButton, ModalContent, ModalOverlay, Text, useToast } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { ApiClientsContext, WebwalletContext } from 'pages/_app'
import { ALL_SUPPORTED_CHAIN_IDS, CHAIN_INFO } from 'src/constants/chains'
import { useGetProfileDetailsQuery, useGetWorkspaceMembersQuery } from 'src/generated/graphql'
import SupportedChainId from 'src/generated/SupportedChainId'
import useQBContract from 'src/hooks/contracts/useQBContract'
import { useMultiChainQuery } from 'src/hooks/useMultiChainQuery'
import getErrorMessage from 'src/utils/errorUtils'
import { getExplorerUrlForTxHash } from 'src/utils/formattingUtils'
import { addAuthorizedOwner } from 'src/utils/gaslessUtils'
import { delay } from 'src/utils/generics'
import logger from 'src/utils/logger'
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils'
import ConnectWalletModal from 'src/v2/components/ConnectWalletModal'
import NetworkTransactionModal from 'src/v2/components/NetworkTransactionModal'
import { useAccount, useNetwork, useSigner, useSwitchNetwork } from 'wagmi'

const POINTERS = ['Zero gas fee across the app', 'No annoying sign transaction pop-ups']

function MigrateToGasless() {
	const router = useRouter()
	const toast = useToast()
	const { waitForScwAddress, webwallet } = useContext(WebwalletContext)!
	const { subgraphClients } = useContext(ApiClientsContext)!

	const { address: walletAddress } = useAccount()
	const { data: signer } = useSigner()
	const { chain: walletChain } = useNetwork()
	const { switchNetwork } = useSwitchNetwork()

	const [isOpen, setIsOpen] = useState(false)
	const [isConnectWalletModalOpen, setIsConnectWalletModalOpen] = useState(false)

	const workspaceContract = useQBContract('workspace', walletChain?.id as SupportedChainId, false)

	const [networkModalStep, setNetworkModalStep] = useState<number>()
	const [transactionHash, setTransactionHash] = useState<string>()
	const [shouldMigrate, setShouldMigrate] = useState<{state: number, chainId?: SupportedChainId}>()
	const [ownedWorkspaces, setOwnedWorkspaces] = useState<any>([])

	const isMigrateYes = router?.query?.migrate === 'yes'

	const { results, fetchMore } = useMultiChainQuery({
		useQuery: useGetProfileDetailsQuery,
		options: {
			variables: {
				actorId: walletAddress ?? ''
			}
		}
	})

	const { results: ownedWorkspacesResults, fetchMore: fetchMoreOwnedWorkspaces } = useMultiChainQuery({
		useQuery: useGetWorkspaceMembersQuery,
		options: {
			variables: {
				actorId: walletAddress ?? ''
			}
		}
	})

	useEffect(() => {
		if(walletAddress && walletChain?.id) {
			setShouldMigrate({ state: 3 })
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

		const filteredOwnedWorkspaces: any = []

		if(walletAddress && walletChain?.id) {
			logger.info('ownedWorkspacesResults', ownedWorkspacesResults)
			const _ownedWorkspaces = ownedWorkspacesResults
				.filter(result => (result?.workspaceMembers?.length || 0) > 0)
				.reduce((prev, curr) => prev.concat(curr?.workspaceMembers ?? []), filteredOwnedWorkspaces)
				.map((prev: any) => prev.workspace)

			logger.info({ _ownedWorkspaces }, 'ownedWorkspaces')
			setOwnedWorkspaces(_ownedWorkspaces)
		}
	}, [ownedWorkspacesResults])

	useEffect(() => {
		logger.info({ results, walletAddress, walletChain }, 'Results')
		if(walletAddress && walletChain?.id) {
			// let chainIdFromMemberWorkspace: SupportedChainId
			// let chainIdFromApplicationWorkspace: SupportedChainId
			const workspaceFromMember = results.find((result) => (result?.workspaceMembers?.length || 0) > 0)?.workspaceMembers[0]?.workspace
			const workspaceFromApplication = results.find((result) => (result?.grantApplications.length || 0) > 0)?.grantApplications[0]?.grant?.workspace
			logger.info({ workspaceFromMember, workspaceFromApplication }, 'DAOs owned')
			const chainIdFromMemberWorkspace = getSupportedChainIdFromWorkspace(workspaceFromMember)
			const chainIdFromApplicationWorkspace = getSupportedChainIdFromWorkspace(workspaceFromApplication)

			// for (result of results) {

			// }

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

			logger.info({ hasProfileOnCurrentChain }, 'hasProfileOnCurrentChain')

			if((!chainIdFromMemberWorkspace && !chainIdFromApplicationWorkspace) || chainIdFromMemberWorkspace === walletChain?.id || chainIdFromApplicationWorkspace === walletChain?.id) {
				return
			}

			if((!(walletChain?.id in SupportedChainId)) || !hasProfileOnCurrentChain) {
				logger.info({ workspaceFromMember, chainIdFromMemberWorkspace, condition1: workspaceFromMember && chainIdFromMemberWorkspace && chainIdFromMemberWorkspace in SupportedChainId }, 'Condition 1')
				logger.info({ workspaceFromApplication, chainIdFromApplicationWorkspace, condition2: !workspaceFromMember && workspaceFromApplication && chainIdFromApplicationWorkspace && chainIdFromApplicationWorkspace in SupportedChainId }, 'Condition 2')
				if(workspaceFromMember && chainIdFromMemberWorkspace && chainIdFromMemberWorkspace in SupportedChainId) {
					logger.info({ workspaceFromMember }, 'DAO to migrate')
					logger.info({ chainIdFromMemberWorkspace }, 'DAO chainId')
					setShouldMigrate({ state: 0, chainId: chainIdFromMemberWorkspace })
				} else if(!workspaceFromMember && workspaceFromApplication && chainIdFromApplicationWorkspace && chainIdFromApplicationWorkspace in SupportedChainId) {
					logger.info({ workspaceFromApplication }, 'DAO to migrate')
					logger.info({ chainIdFromApplicationWorkspace }, 'DAO chainId')
					setShouldMigrate({ state: 1, chainId: chainIdFromApplicationWorkspace })
				} else {
					setShouldMigrate({ state: 2 })
				}
			} else {
				setShouldMigrate({ state: 3 })
			}
		}
	}, [results])

	useEffect(() => {
		logger.info({ shouldMigrate }, 'shouldMigrate')
	}, [shouldMigrate])

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

			logger.info({ walletChain, shouldMigrate, switchNetwork, webwallet }, 'Step 1')
			if(!walletChain || !shouldMigrate || !switchNetwork || !webwallet) {
				return
			}

			if(!(walletChain?.id in ALL_SUPPORTED_CHAIN_IDS)) {
				const { state, chainId } = shouldMigrate

				if(state === 0 && chainId) {
					toast({
						title: 'No DAO found to migrate',
						description: `The current network (${walletChain?.name}) your wallet is connected to has no DAO. Please switch your network to ${CHAIN_INFO[chainId]?.name} (or some other network) where you have DAOs`,
						status: 'warning',
						duration: 9000,
						isClosable: true,
					})
					switchNetwork(chainId)
					return
				} else if(state === 1 && chainId) {
					toast({
						title: 'No applications found to migrate',
						description: `The current network (${walletChain?.name}) your wallet is connected to has no applications. Please switch your network to ${CHAIN_INFO[chainId]?.name} (or some other network) where you have applications`,
						status: 'warning',
						duration: 9000,
						isClosable: true,
					})
					switchNetwork(chainId)
					return
				} else if(state === 2) {
					toast({
						title: 'No profile found to migrate',
						description: `No profile was found on questbook that mapped to the address ${walletAddress} on ${walletChain?.name}`,
						status: 'warning',
						duration: 9000,
						isClosable: true,
					})
				} else if(state !== 3) {
					return
				}
			}

			// if(!(walletChain?.id in SupportedChainId)) {
			// 	throw new Error('Switch your wallet\'s chain!')
			// }

			setNetworkModalStep(0)

			while(!signer) {
				delay(2000)
			}

			const scwAddress = await waitForScwAddress
			setNetworkModalStep(1)

			logger.info({ wallet: walletAddress, scwAddress }, 'migrating to gasless')
			logger.info({ signerFromWagmi: signer, signerFromContract: workspaceContract.signer }, 'Signer')
			logger.info({ walletChain }, 'Current Chain')
			const transaction = await workspaceContract.migrateWallet(walletAddress, scwAddress)

			setNetworkModalStep(2)
			const transactionData = await transaction.wait()
			setTransactionHash(transactionData.transactionHash)

			setNetworkModalStep(3)
			await subgraphClients[walletChain?.id].waitForBlock(transactionData.blockNumber)

			// adding the details of all workspaces owned by the user to the database

			try {
				await Promise.all(ownedWorkspaces.map((ownedWorkspace: any) => new Promise<void>(async(resolve, reject) => {
					try {
						logger.info({ ownedWorkspace: ownedWorkspace.id }, 'Migrating workspace')
						await addAuthorizedOwner(
							Number(ownedWorkspace.id),
							webwallet?.address,
							scwAddress,
						getSupportedChainIdFromWorkspace(ownedWorkspace)?.toString()!,
						'TO_BE_MODIFIED_SAFE_ADDRESS_JUST_PLACE_HOLDER'
						)
						logger.info({ ownedWorkspace: ownedWorkspace.id }, 'Migrated workspace')
						resolve()
					} catch{
						logger.info(
							{ ownedWorkspace: ownedWorkspace.id, chainId: getSupportedChainIdFromWorkspace(ownedWorkspace)?.toString()! },
							'Failed to migrate workspace - unsupported chain')
						reject()
					}
				})))
			} catch{
				logger.info({ ownedWorkspaces }, 'Failed to migrate workspaces on unsupported networks')
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

	return (
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
								Hey, 👋
								{' '}
							</Text>
							<Text
								fontWeight='500'
								variant='v2_heading_3'>
								We have an update for you!
							</Text>
							<Text
								mt={6}
								variant='v2_title'
								fontWeight='500'>
								Questbook is moving to in-app wallet.
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
									What it means to you:
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
									To continue using Questbook without losing any data, migrate to the in-app wallet.
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
								Migrate to In-App Wallet
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
							{walletAddress ?? ''}
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
}

export default MigrateToGasless