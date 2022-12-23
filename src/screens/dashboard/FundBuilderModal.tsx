import { useContext, useEffect, useMemo, useState } from 'react'
import { Button, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, Text } from '@chakra-ui/react'
import { logger } from 'ethers'
import { defaultChainId } from 'src/constants/chains'
import { useSafeContext } from 'src/contexts/safeContext'
import useQBContract from 'src/hooks/contracts/useQBContract'
import { useBiconomy } from 'src/hooks/gasless/useBiconomy'
import { useQuestbookAccount } from 'src/hooks/gasless/useQuestbookAccount'
import useCustomToast from 'src/libraries/hooks/useCustomToast'
import FlushedInput from 'src/libraries/ui/FlushedInput'
import { ApiClientsContext, WebwalletContext } from 'src/pages/_app'
import MilestoneChoose from 'src/screens/dashboard/_components/FundBuilder/MilestoneChoose'
import PayFromChoose from 'src/screens/dashboard/_components/FundBuilder/PayFromChoose'
import PayWithChoose from 'src/screens/dashboard/_components/FundBuilder/PayWithChoose'
import ToChoose from 'src/screens/dashboard/_components/FundBuilder/ToChoose'
import TransactionInitiated from 'src/screens/dashboard/_components/FundBuilder/TransactionInitiated'
import Verify from 'src/screens/dashboard/_components/FundBuilder/Verify'
import usePhantomWallet from 'src/screens/dashboard/_hooks/usePhantomWallet'
import { DashboardContext, FundBuilderContext } from 'src/screens/dashboard/Context'
import { getFieldString } from 'src/utils/formattingUtils'
import { bicoDapps, chargeGas, getTransactionDetails, sendGaslessTransaction } from 'src/utils/gaslessUtils'
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils'
import { getGnosisTansactionLink } from 'src/v2/utils/gnosisUtils'
import { getProposalUrl } from 'src/v2/utils/phantomUtils'

function FundBuilderModal() {
	const buildComponent = () => {
		return (
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
						{
							['unverified', 'verified'].includes(signerVerifiedState) && (
								<Flex
									p={6}
									direction='column'
									align='center'
									w='100%'>
									<Text fontWeight='500'>
										Fund Builder
									</Text>
									<Flex
										mt={7}
										w='100%'
										justify='center'
										align='start'>
										<Text>
											$
										</Text>
										<FlushedInput
											borderBottom='2px solid'
											textPadding={1}
											type='number'
											minW='5ch'
											value={amounts?.[0] || ''}
											onChange={
												(e) => {
													const val = parseFloat(e.target.value)
													setAmounts([val])
												}
											}
											placeholder='0' />
									</Flex>
									{
										amounts?.[0] > 0 && tokenInfo?.fiatConversion ? (
											<Text
												color='#53514F'
												fontSize='14px'
												mt='8px'>
												≈
												{' '}
												{(amounts?.[0] / parseFloat(tokenInfo?.fiatConversion!.toString())).toFixed(2)}
												{' '}
												{tokenInfo?.tokenName}
											</Text>
										) : null
									}
									{
										proposal && (
											<Flex
												mt={6}
												w='100%'
												direction='column'
												border='1px solid #E7E4DD'>
												<PayFromChoose />
												<PayWithChoose />
												<ToChoose
													type='single'
													proposal={proposal}
													index={0} />
												<MilestoneChoose
													proposal={proposal}
													index={0} />
											</Flex>
										)
									}

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
								<Verify
									signerVerifiedState={signerVerifiedState}
									setSignerVerifiedState={setSignerVerifiedState} />
							)
						}

						{
							['transaction_initiated'].includes(signerVerifiedState) && safeProposalLink && (
								<TransactionInitiated
									safeProposalLink={safeProposalLink!} />
							)
						}

					</ModalBody>
				</ModalContent>
			</Modal>
		)
	}

	const { safeObj } = useSafeContext()
	const { proposals, selectedProposals, selectedGrant } = useContext(DashboardContext)!
	const {
		isModalOpen,
		setIsModalOpen,
		amounts,
		setAmounts,
		milestoneIndices,
		setMilestoneIndices,
		tos,
		setTos,
		tokenInfo,
		signerVerifiedState,
		setSignerVerifiedState
	} = useContext(FundBuilderContext)!
	const { phantomWallet } = usePhantomWallet()
	const [safeProposalAddress, setSafeProposalAddress] = useState<string | undefined>(undefined)
	const [safeProposalLink, setSafeProposalLink] = useState<string | undefined>(undefined)

	const proposal = useMemo(() => {
		const index = selectedProposals.indexOf(true)

		if(index !== -1) {
			return proposals[index]
		}
	}, [proposals, selectedProposals])

	useEffect(() => {
		if(!proposal) {
			return
		}

		setTos([getFieldString(proposal, 'applicantAddress') ?? tos?.[0]])
		setMilestoneIndices([0])
	}, [proposal])

	const isDisabled = useMemo(() => {
		return !proposal || amounts?.[0] === undefined || !tos?.[0] || milestoneIndices?.[0] === undefined || !tokenInfo || amounts?.[0] <= 0
	}, [amounts, tos, milestoneIndices, tokenInfo])

	const onContinue = async() => {
		if(signerVerifiedState === 'unverified') {
			setSignerVerifiedState('initiate_verification')
		}
	}

	const toast = useCustomToast()

	const onInitiateTransaction = async() => {
		if(signerVerifiedState === 'verified') {
			const temp = [{
				from: safeObj?.safeAddress?.toString(),
				to: tos?.[0],
				applicationId: proposal?.id,
				selectedMilestone: milestoneIndices?.[0],
				selectedToken: { tokenName: tokenInfo?.tokenName, info: tokenInfo?.info },
				amount: amounts?.[0],
			}]

			let proposaladdress: any = ''
			if(safeObj.getIsEvm()) {
				proposaladdress = await safeObj?.proposeTransactions('', temp, '')
				if(proposaladdress?.error) {
					toast({
						title: 'An error occurred while creating transaction on Gnosis Safe',
						status: 'error',
						duration: 3000,
					})
					return
				}

				setSafeProposalAddress(proposaladdress as string)
				setSafeProposalLink(getGnosisTansactionLink(safeObj?.safeAddress, safeObj?.chainId))
				setSignerVerifiedState('transaction_initiated')
			} else {
				proposaladdress = await safeObj?.proposeTransactions(selectedGrant?.title, temp, phantomWallet)
				if(proposaladdress?.error) {
					toast({
						title: 'An error occurred while creating transaction on Multi-sig',
						status: 'error',
						duration: 3000,
					})
					return
				}

				setSafeProposalAddress(proposaladdress as string)
				setSafeProposalLink(getProposalUrl(safeObj.safeAddress, proposaladdress as string))
				setSignerVerifiedState('transaction_initiated')
			}

			// disburseRewardFromSafe(proposaladdress?.toString()!)
			// 	.then(() => {
			// 	// console.log('Sent transaction to contract - EVM', proposaladdress)
			// 	})
			// 	.catch((err) => {
			// 		console.log('sending transction error:', err)
			// 	})
		}

		const { workspace } = useContext(ApiClientsContext)!

		const workspacechainId = getSupportedChainIdFromWorkspace(workspace) || defaultChainId

		const { biconomyDaoObj: biconomy, biconomyWalletClient, scwAddress, loading: biconomyLoading } = useBiconomy({
			chainId: workspacechainId ? workspacechainId.toString() : defaultChainId.toString(),
		})
		const [isBiconomyInitialisedDisburse, setIsBiconomyInitialisedDisburse] = useState(false)

		useEffect(() => {

			if(biconomy && biconomyWalletClient && scwAddress && !biconomyLoading && workspacechainId &&
			biconomy.networkId && biconomy.networkId?.toString() === workspacechainId.toString()) {
				setIsBiconomyInitialisedDisburse(true)
			}
		}, [biconomy, biconomyWalletClient, scwAddress, biconomyLoading, isBiconomyInitialisedDisburse, workspacechainId])

		const { nonce } = useQuestbookAccount()
		const workspaceRegistryContract = useQBContract('workspace', workspacechainId)
		const { webwallet } = useContext(WebwalletContext)!

		const disburseRewardFromSafe = async(proposaladdress: string) => {
			try {
				logger.info({}, 'HERE 1')
				if(typeof biconomyWalletClient === 'string' || !biconomyWalletClient || !scwAddress) {
					return
				}

				logger.info({}, 'HERE 2')

				const methodArgs = [
					// initiateTransactionData.map((element: any) => (parseInt(element.applicationId, 16))),
					// initiateTransactionData.map((element: any) => (parseInt(element.selectedMilestone?.id?.split('.')[1]))),
					// rewardAssetAddress,
					// initiateTransactionData.map((element: any) => (element.selectedToken.tokenName.toLowerCase()))[0],
					// 'nonEvmAssetAddress-toBeChanged',
					// initiateTransactionData.map((element: any) => Math.floor(element.amount)),
					workspace?.id,
					proposaladdress
				]

				logger.info({}, 'HERE 3')

				logger.info({ methodArgs }, 'methodArgs')

				const transactionHash = await sendGaslessTransaction(
					biconomy,
					workspaceRegistryContract,
					'disburseRewardFromSafe',
					methodArgs,
					workspaceRegistryContract.address,
					biconomyWalletClient,
					scwAddress,
					webwallet,
					`${workspacechainId}`,
					bicoDapps[workspacechainId.toString()].webHookId,
					nonce
				)

				logger.info({}, 'HERE 4')


				if(!transactionHash) {
					throw new Error('No transaction hash found!')
				}

				const { txFee } = await getTransactionDetails(transactionHash, workspacechainId.toString())

				await chargeGas(Number(workspace?.id), Number(txFee), workspacechainId)

			} catch(e) {
				console.log('disburse error', e)
			}
		}
	}

	return buildComponent()
}

export default FundBuilderModal