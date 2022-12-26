import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Box, Button, Drawer, DrawerCloseButton, DrawerContent, DrawerOverlay, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, Text, useToast } from '@chakra-ui/react'
import { SupportedPayouts } from '@questbook/supported-safes'
import { logger } from 'ethers'
import { defaultChainId } from 'src/constants/chains'
import { useSafeContext } from 'src/contexts/safeContext'
import useQBContract from 'src/hooks/contracts/useQBContract'
import { useBiconomy } from 'src/hooks/gasless/useBiconomy'
import { useQuestbookAccount } from 'src/hooks/gasless/useQuestbookAccount'
import useCustomToast from 'src/libraries/hooks/useCustomToast'
import { ApiClientsContext, WebwalletContext } from 'src/pages/_app'
import PayFromChoose from 'src/screens/dashboard/_components/FundBuilder/PayFromChoose'
import PayWithChoose from 'src/screens/dashboard/_components/FundBuilder/PayWithChoose'
import ProposalDetails from 'src/screens/dashboard/_components/FundBuilder/ProposalDetails'
import ToChoose from 'src/screens/dashboard/_components/FundBuilder/ToChoose'
import TransactionInitiated from 'src/screens/dashboard/_components/FundBuilder/TransactionInitiated'
import Verify from 'src/screens/dashboard/_components/FundBuilder/Verify'
import VerifyDrawer from 'src/screens/dashboard/_components/FundBuilder/VerifyDrawer'
import usePhantomWallet from 'src/screens/dashboard/_hooks/usePhantomWallet'
import { ProposalType } from 'src/screens/dashboard/_utils/types'
import { DashboardContext, FundBuilderContext } from 'src/screens/dashboard/Context'
import { getFieldString } from 'src/utils/formattingUtils'
import { bicoDapps, chargeGas, getTransactionDetails, sendGaslessTransaction } from 'src/utils/gaslessUtils'
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils'
import { getGnosisTansactionLink } from 'src/v2/utils/gnosisUtils'
import { getProposalUrl } from 'src/v2/utils/phantomUtils'

function FundBuilderDrawer() {
	const buildComponent = () => {
		return (
			<>
				<Drawer
					isOpen={isDrawerOpen}
					placement='right'
					onClose={
						() => {
							setIsDrawerOpen(false)
							setSignerVerifiedState('unverified')
						}
					}
					size='lg' >
					<DrawerOverlay />
					<DrawerCloseButton />
					<DrawerContent m={4}>
						{
							['unverified', 'verified'].includes(signerVerifiedState) && (
								<Flex
									p={6}
									direction='column'
									align='center'
									w='100%'
									h='100%'>
									<Text fontWeight='500'>
										Fund Builders
									</Text>

									<Flex
										mt={6}
										w='100%'
										h='100%'
										direction='column'
										border='1px solid #E7E4DD'
										overflowY='auto'>
										<PayFromChoose
											selectedMode={selectedMode} />
										<PayWithChoose selectedMode={selectedMode} />
										<ToChoose type='multi' />
										{
											selectedProposalsData?.map((selectedProposalData, index) => (
												<ProposalDetails
													key={selectedProposalData.id}
													proposal={selectedProposalData}
													index={index}
													tokenInfo={tokenInfo!} />
											))
										}
									</Flex>

									<Box mt='auto' />

									{
										signerVerifiedState === 'verified' ? (
											<Button
												isDisabled={isDisabled}
												mt={8}
												w='100%'
												variant='primaryLarge'
												onClick={onInitiateTransaction}>
												<Text
													fontWeight='500'
													color='white'>
													Initiate Transaction
												</Text>
											</Button>
										) : (
											<Button
												isDisabled={isDisabled}
												mt={8}
												w='100%'
												variant='primaryLarge'
												onClick={onContinue}>
												<Text
													fontWeight='500'
													color='white'>
													Continue
												</Text>
											</Button>
										)
									}
								</Flex>
							)
						}

						{
							['initiate_verification', 'verifying', 'failed' ].includes(signerVerifiedState) && (
								<VerifyDrawer
									signerVerifiedState={signerVerifiedState}
									setSignerVerifiedState={setSignerVerifiedState} />
							)
						}
					</DrawerContent>
				</Drawer>

				{
					['transaction_initiated'].includes(signerVerifiedState) && safeProposalLink && (
						<Modal
							isOpen={isModalOpen}
							size='2xl'
							onClose={
								() => {
									setIsModalOpen(false)
									setSignerVerifiedState('unverified')
								}
							}
							isCentered
							scrollBehavior='outside'>
							<ModalOverlay />
							<ModalContent>
								<ModalCloseButton />
								<ModalBody>

									<TransactionInitiated
										safeProposalLink={safeProposalLink!} />

								</ModalBody>
							</ModalContent>
						</Modal>
					)
				}
			</>
		)
	}

	const { safeObj } = useSafeContext()
	const {
		isModalOpen,
		setIsModalOpen,
		isDrawerOpen,
		setIsDrawerOpen,
		amounts,
		tos,
		setTos,
		milestoneIndices,
		setMilestoneIndices,
		tokenInfo,
		signerVerifiedState,
		setSignerVerifiedState
	} = useContext(FundBuilderContext)!
	const { phantomWallet } = usePhantomWallet()
	const [safeProposalAddress, setSafeProposalAddress] = useState<string | undefined>(undefined)
	const [safeProposalLink, setSafeProposalLink] = useState<string | undefined>(undefined)
	const [selectedMode, setSelectedMode] = useState<any>()
	const [payoutInProcess, setPayoutInProcess] = useState(false)

	const customToast = useCustomToast()
	const toast = useToast()
  	const payoutsInProcessToastRef = useRef<any>()

	const Safe = {
		logo: safeObj?.safeLogo,
		value: safeObj?.safeAddress ?? ''
	}

	const Wallets = new SupportedPayouts().getAllWallets().map((wallet) => {
		return {
			logo: wallet.logo,
			value: wallet.name
		}
	})

	useEffect(() => {
		setSelectedMode(safeObj ? Safe : Wallets[0])
	}, [safeObj])

	const { proposals, selectedProposals, selectedGrant } = useContext(DashboardContext)!
	const selectedProposalsData = useMemo(() => {
		if(!proposals || !selectedProposals) {
			return []
		}

		const p: ProposalType[] = []
		for(let i = 0; i < proposals.length; i++) {
			if(selectedProposals[i]) {
				p.push(proposals[i])
			}
		}

		return p
	}, [proposals, selectedProposals])

	useEffect(() => {
		if(!selectedProposalsData) {
			return
		}

		setTos(selectedProposalsData.map((p) => getFieldString(p, 'applicantAddress')))
		setMilestoneIndices(selectedProposalsData.map((p) => 0))
	}, [selectedProposalsData])

	const isDisabled = useMemo(() => {
		return !selectedProposalsData || !amounts?.every((amt) => amt !== undefined && amt > 0) || !tos?.every((to) => to !== undefined) || !milestoneIndices?.every((mi) => mi !== undefined) || !tokenInfo
	}, [selectedProposalsData, amounts, tos, milestoneIndices, tokenInfo])

	const onContinue = () => {
		if(signerVerifiedState === 'unverified') {
			setSignerVerifiedState('initiate_verification')
			return
		}
	}

	const onInitiateTransaction = async() => {
		if(signerVerifiedState === 'verified') {

			const transactionData = tos.map((to, i) => {
				return {
					from: safeObj?.safeAddress?.toString(),
					to: to,
					applicationId: proposals[i]?.id,
					selectedMilestone: milestoneIndices?.[i],
					selectedToken: { tokenName: tokenInfo?.tokenName, info: tokenInfo?.info },
					amount: amounts?.[i],
				}
			})
			let proposaladdress: any = ''
			if(safeObj.getIsEvm()) {
				proposaladdress = await safeObj?.proposeTransactions('', transactionData, '')
				if(proposaladdress?.error) {
					customToast({
						title: 'An error occurred while creating transaction on Gnosis Safe',
						status: 'error',
						duration: 3000,
					})
					return
				}

				setSignerVerifiedState('transaction_initiated')
				setIsDrawerOpen(false)
				setIsModalOpen(true)
				setSafeProposalAddress(proposaladdress)
				setSafeProposalLink(getGnosisTansactionLink(safeObj?.safeAddress, safeObj?.chainId))
			} else {
				proposaladdress = await safeObj?.proposeTransactions(selectedGrant?.title, transactionData, phantomWallet)
				if(proposaladdress?.error) {
					customToast({
						title: 'An error occurred while creating transaction on Multi-sig',
						status: 'error',
						duration: 3000,
					})
					return
				}

				setSignerVerifiedState('transaction_initiated')
				setIsDrawerOpen(false)
				setIsModalOpen(true)
				setSafeProposalAddress(proposaladdress)
				setSafeProposalLink(getProposalUrl(safeObj.safeAddress, proposaladdress))
			}

			// disburseRewardFromSafe(proposaladdress?.toString()!)
			// 	.then(() => {
			// 	// console.log('Sent transaction to contract - EVM', proposaladdress)
			// 	})
			// 	.catch((err) => {
			// 		console.log('sending transction error:', err)
			// 	})
		}
	}

	// const { workspace } = useContext(ApiClientsContext)!

	// const workspacechainId = getSupportedChainIdFromWorkspace(workspace) || defaultChainId

	// const { biconomyDaoObj: biconomy, biconomyWalletClient, scwAddress, loading: biconomyLoading } = useBiconomy({
	// 	chainId: workspacechainId ? workspacechainId.toString() : defaultChainId.toString(),
	// })
	// const [isBiconomyInitialisedDisburse, setIsBiconomyInitialisedDisburse] = useState(false)

	// useEffect(() => {

	// 	if(biconomy && biconomyWalletClient && scwAddress && !biconomyLoading && workspacechainId &&
	// 		biconomy.networkId && biconomy.networkId?.toString() === workspacechainId.toString()) {
	// 		setIsBiconomyInitialisedDisburse(true)
	// 	}
	// }, [biconomy, biconomyWalletClient, scwAddress, biconomyLoading, isBiconomyInitialisedDisburse, workspacechainId])

	// const { nonce } = useQuestbookAccount()
	// const workspaceRegistryContract = useQBContract('workspace', workspacechainId)
	// const { webwallet } = useContext(WebwalletContext)!

	// const disburseRewardFromSafe = async(proposaladdress: string) => {
	// 	try {
	// 		logger.info({}, 'HERE 1')
	// 		if(typeof biconomyWalletClient === 'string' || !biconomyWalletClient || !scwAddress) {
	// 			return
	// 		}

	// 		logger.info({}, 'HERE 2')

	// 		const methodArgs = [
	// 			// initiateTransactionData.map((element: any) => (parseInt(element.applicationId, 16))),
	// 			// initiateTransactionData.map((element: any) => (parseInt(element.selectedMilestone?.id?.split('.')[1]))),
	// 			// rewardAssetAddress,
	// 			// initiateTransactionData.map((element: any) => (element.selectedToken.tokenName.toLowerCase()))[0],
	// 			// 'nonEvmAssetAddress-toBeChanged',
	// 			// initiateTransactionData.map((element: any) => Math.floor(element.amount)),
	// 			workspace?.id,
	// 			proposaladdress
	// 		]

	// 		logger.info({}, 'HERE 3')

	// 		logger.info({ methodArgs }, 'methodArgs')

	// 		const transactionHash = await sendGaslessTransaction(
	// 			biconomy,
	// 			workspaceRegistryContract,
	// 			'disburseRewardFromSafe',
	// 			methodArgs,
	// 			workspaceRegistryContract.address,
	// 			biconomyWalletClient,
	// 			scwAddress,
	// 			webwallet,
	// 			`${workspacechainId}`,
	// 			bicoDapps[workspacechainId.toString()].webHookId,
	// 			nonce
	// 		)

	// 		logger.info({}, 'HERE 4')


	// 		if(!transactionHash) {
	// 			throw new Error('No transaction hash found!')
	// 		}

	// 		const { txFee } = await getTransactionDetails(transactionHash, workspacechainId.toString())

	// 		await chargeGas(Number(workspace?.id), Number(txFee), workspacechainId)

	// 	} catch(e) {
	// 		console.log('disburse error', e)
	// 	}
	// }

	useEffect(() => {
		if(payoutInProcess) {
			payoutsInProcessToastRef.current = customToast({ title: 'Payouts is in process', duration: null, status: 'info' })
		} else if(!payoutInProcess && payoutsInProcessToastRef.current) {
			toast.close(payoutsInProcessToastRef.current)
		}
	}, [payoutInProcess])

	return buildComponent()
}

export default FundBuilderDrawer