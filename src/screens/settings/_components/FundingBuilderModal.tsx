'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Asset, AssetList } from '@chain-registry/types'
import { ExternalLinkIcon, InfoIcon } from '@chakra-ui/icons'
import { Box, Button, Flex, FormControl, FormLabel, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, Switch, Text, Tooltip, useToast } from '@chakra-ui/react'
import { StdFee } from '@cosmjs/amino'
// import { useAccount, useBalance, useSendTokens, useStargateSigningClient } from 'graz'
// import { useConnect as keplrConnect, WalletType } from 'graz'
import { useChain } from '@cosmos-kit/react'
import { SupportedPayouts } from '@questbook/supported-safes'
import { assets } from 'chain-registry'
import { cosmos } from 'juno-network'
import { defaultChainId } from 'src/constants/chains'
import { useSafeContext } from 'src/contexts/safeContext'
import { DisburseRewardSafeMutation, reSubmitProposalMutation } from 'src/generated/mutation'
import { DisburseRewardsFromWalletMutation } from 'src/generated/mutation/disburseRewardsFromWallet'
import { executeMutation } from 'src/graphql/apollo'
import useCustomToast from 'src/libraries/hooks/useCustomToast'
import useFunctionCall from 'src/libraries/hooks/useFunctionCall'
import logger from 'src/libraries/logger'
import FlushedInput from 'src/libraries/ui/FlushedInput'
import { AmplitudeContext } from 'src/libraries/utils/amplitude'
import { getFieldString } from 'src/libraries/utils/formatting'
import { getGnosisTansactionLink, getProposalUrl } from 'src/libraries/utils/multisig'
import { getSupportedChainIdFromWorkspace } from 'src/libraries/utils/validations'
import { GrantsProgramContext, WebwalletContext } from 'src/pages/_app'
import MilestoneChoose from 'src/screens/dashboard/_components/FundBuilder/MilestoneChoose'
import PaidByWallet from 'src/screens/dashboard/_components/FundBuilder/PaidByWallet'
import PayFromChoose from 'src/screens/dashboard/_components/FundBuilder/PayFromChoose'
import PayWithChoose from 'src/screens/dashboard/_components/FundBuilder/PayWithChoose'
import ToChoose from 'src/screens/dashboard/_components/FundBuilder/ToChoose'
import TransactionInitiated from 'src/screens/dashboard/_components/FundBuilder/TransactionInitiated'
import Verify from 'src/screens/dashboard/_components/FundBuilder/Verify'
import usePhantomWallet from 'src/screens/dashboard/_hooks/usePhantomWallet'
import usetonWallet from 'src/screens/dashboard/_hooks/useTonWallet'
import getToken from 'src/screens/dashboard/_utils/tonWalletUtils'
import { Proposals } from 'src/screens/dashboard/_utils/types'
import { FundBuilderContext } from 'src/screens/dashboard/Context'
import { SettingsFormContext } from 'src/screens/settings/Context'
import TonWeb from 'tonweb'


interface Props {
	payWithSafe: boolean
    proposals: Proposals
    selectedProposals: Set<string>
}
function FundingBuilderModal({
	payWithSafe,
	proposals,
	selectedProposals,
}: Props) {
	const buildComponent = () => {
		logger.info('proposals', grant)
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
							['unverified', 'verified', 'initiate_TON_transaction'].includes(signerVerifiedState) && (
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
										align='center'
										gap={1}>
										{
											grant?.reward?.token?.label === 'USD' && (
												<Text
													fontSize='lg'
													fontWeight='medium'>
													$
												</Text>
											)
										}
										<FlushedInput
											borderBottom='2px solid'
											type='number'
											minW='5ch'
											fontSize='lg'
											textAlign='center'
											value={amounts?.[0] || ''}
											onChange={
												(e) => {
													if(e.target.value?.includes('.')) {
														return
													}

													try {
														const val = parseInt(e.target.value)
														logger.info({ entered: e.target.value, parsed: val }, 'FundBuilderModal: entered amount')
														setAmounts([val])
													} catch(e) {
														logger.error(e, 'FundBuilderModal: error parsing entered amount')
													}
												}
											}
											placeholder='0'
										/>
										{
											grant?.reward?.token?.label !== 'USD' && (
												<Text
													fontSize='lg'
													fontWeight='medium'
													ml={1}>
													{selectedTokenInfo?.tokenName}
												</Text>
											)
										}
									</Flex>
									{
										grant?.reward?.token?.label !== 'USD' && amounts?.[0] > 0 && selectedTokenInfo?.fiatConversion ? (
											<Text
												color='#53514F'
												fontSize='14px'
												mt='8px'>
												≈
												{' '}
												{(amounts?.[0] * (selectedTokenInfo?.fiatConversion)).toFixed(2)}
												{' '}
												USD
											</Text>
										) :
											amounts?.[0] > 0 && selectedTokenInfo?.fiatConversion ? (
												<Text
													color='#53514F'
													fontSize='14px'
													mt='8px'>
													≈
													{' '}
													{(amounts?.[0] / (selectedTokenInfo?.fiatConversion)).toFixed(2)}
													{' '}
													AXL
												</Text>
											) : null
									}
									<Button
										alignSelf='flex-end'
										mr={4}
										variant='outline'
										colorScheme='blue'
										size='sm'
										leftIcon={<ExternalLinkIcon />}
										onClick={
											() => {
												window.open(`${window.location.origin}/dashboard/?grantId=${grant?.id}&proposalId=${proposal?.id}&chainId=10`, '_blank')
											}
										}
									>
										View Proposal
									</Button>
									{
										proposal && (
											<Flex
												mt={6}
												w='100%'
												direction='column'
												border='1px solid #E7E4DD'>

												<PayFromChoose
													selectedMode={selectedMode} />
												<PayWithChoose selectedMode={selectedMode!} />
												<ToChoose
													type='single'
													proposal={proposal}
													index={0} />
												{
													milestones?.length > 1 && (
														<FormControl
															display='flex'
															alignItems='center'
															px={4}
															py={3}
															borderTop='1px solid #E7E4DD'
															gap={3}>
															<FormLabel
																htmlFor='batch-switch'
																mb='0'
																fontSize='sm'
																fontWeight='medium'
																display='flex'
																alignItems='center'
																gap={2}>
																Batch Milestones
																<Tooltip
																	label='Pay all remaining milestones at once'
																	fontSize='xs'
																	hasArrow>
																	<InfoIcon
																		boxSize={3}
																		color='gray.500'
																		cursor='help' />
																</Tooltip>
															</FormLabel>
															<Switch
																id='batch-switch'
																isChecked={batchTx}
																onChange={(e) => setBatchTx(e.target.checked)}
															/>
														</FormControl>
													)
												}
												{
													!batchTx && (
														<MilestoneChoose
															proposal={proposal}
															index={0} />
													)
												}

											</Flex>
										)
									}

									{
										(proposal?.state === 'submitted') && (
											<Text
												mt={8}
												variant='body'
												color='gray.500'>
												This proposal would be auto-accepted once payout is initiated for it.
											</Text>
										)
									}

									<Box mt={proposal?.state === 'submitted' ? 2 : 8} />
									<Text
										alignSelf='flex-end'
										fontSize='xs'
										color='gray.500'
										textAlign='right'
										mr={4}
										mb={2}
									>
										*Please verify payout address before initiating payment
									</Text>
									{
										signerVerifiedState === 'verified' ? (
											<Button
												isDisabled={isDisabled}
												w='100%'
												isLoading={payoutInProcess}
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
												w='100%'
												isLoading={payoutInProcess}
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
							['initiate_verification', 'verifying', 'failed'].includes(signerVerifiedState) && (
								<Verify
									signerVerifiedState={signerVerifiedState}
									setSignerVerifiedState={setSignerVerifiedState} />
							)
						}

						{
							['transaction_initiated'].includes(signerVerifiedState) && safeProposalLink && (
								<TransactionInitiated
									safeProposalLink={safeProposalLink!}
									setIsModalOpen={setIsModalOpen}
								/>
							)
						}

						{
							['transaction_done_wallet'].includes(signerVerifiedState) && (
								<PaidByWallet />
							)
						}

					</ModalBody>
				</ModalContent>
			</Modal>
		)
	}

	const { safeObj } = useSafeContext()!
	const { grant } = useContext(GrantsProgramContext)!
	const {
		isModalOpen,
		setIsModalOpen,
		amounts,
		setAmounts,
		milestoneIndices,
		setMilestoneIndices,
		tos,
		setTos,
		selectedTokenInfo,
		setSelectedTokenInfo,
		signerVerifiedState,
		setSignerVerifiedState,
	} = useContext(FundBuilderContext)!
	const { phantomWallet } = usePhantomWallet()
	const { tonWallet } = usetonWallet()
	const [safeProposalLink, setSafeProposalLink] = useState<string | undefined>(undefined)
	// const [selectedMode, setSelectedMode] = useState<{logo: string | undefined, value: string | undefined}>()
	const [payoutInProcess, setPayoutInProcess] = useState(false)
	const [safeAddress, setSafeAddress] = useState('')
	const [batchTx, setBatchTx] = useState(true)
	const customToast = useCustomToast()
	// const { connect: connectKeplr } = keplrConnect()
	const chainContext = useChain('axelar')

	const {
		status,
		address,
		connect: connectKeplr,
		getSigningStargateClient,
	} = chainContext

	const chainassets: AssetList = assets.find(
		(chain) => chain.chain_name === 'axelar'
	  ) as AssetList


	const coin: Asset = chainassets.assets.find(
		(asset) => asset.base === 'uaxl'
	  ) as Asset


	const toast = useToast()
	const payoutsInProcessToastRef = useRef<any>()

	const Safe = {
		logo: safeObj?.safeLogo,
		value: safeAddress ?? ''
	}
	useEffect(() => {
		if(!safeObj?.safeAddress) {
			return
		}

		if(safeObj.chainName !== 'TON Mainnet') {
			setSafeAddress(safeObj.safeAddress)
			return
		}

		const Address = TonWeb.utils.Address
		const address = new Address(safeObj?.safeAddress!)
		const userFriendlyAddress = address.toString(true, true, true)
		setSafeAddress(userFriendlyAddress)
	}, [safeObj])

	const Wallets = new SupportedPayouts().getAllWallets().map((wallet) => {
		return {
			logo: wallet.logo,
			value: wallet.name
		}
	})
	logger.info('Wallets', Wallets)
	const Wallet = [{
		logo: 'https://assets-global.website-files.com/63eb7ddf41cf5b1c8fdfbc74/63eb7ddf41cf5bddb7dfbcc9_Keplr_256.png',
		value: 'Keplr Wallet'
	}]
	const selectedMode = (payWithSafe === true && safeObj !== undefined) ? Safe : Wallet[0]

	const proposal = useMemo(() => {
		return proposals.find(p => selectedProposals.has(p.id))
	}, [proposals, selectedProposals])

	const milestones = useMemo(() => {
		return proposal?.milestones || []
	}, [proposal])

	// const tonWalletInstance = new SupportedPayouts().getAllWallets()[0]
	useEffect(() => {
		if(!payWithSafe && selectedTokenInfo?.tokenName !== 'TON') {
			getToken().then((value) => {
				logger.info('Token details', value)
				setSelectedTokenInfo(value)
			}), (() => logger.info('Error while fetching ton details'))
		}
	}
	, [payWithSafe])
	useEffect(() => {
		if(!proposal) {
			return
		}

		if(batchTx) {
			setAmounts([proposal?.milestones?.reduce((acc, milestone) => acc + (parseFloat(milestone?.amountPaid) === 0 ? parseFloat(milestone?.amount) : 0), 0)])
		} else {
			setAmounts([proposal?.milestones?.findIndex((milestone) => parseFloat(milestone?.amountPaid) === 0) > -1 ? parseFloat(proposal?.milestones?.find((milestone) => parseFloat(milestone?.amountPaid) === 0)?.amount ?? '0') : 0])
		}

		setTos([getFieldString(proposal, 'applicantAddress') ?? tos?.[0]])
		setMilestoneIndices([proposal?.milestones?.findIndex((milestone) => parseFloat(milestone?.amountPaid) === 0) > -1 ? proposal?.milestones?.findIndex((milestone) => parseFloat(milestone?.amountPaid) === 0) : 0])
	}, [proposal, batchTx])

	const isDisabled = useMemo(() => {
		return !proposal || amounts?.[0] === undefined || !tos?.[0] || milestoneIndices?.[0] === undefined || amounts?.[0] <= 0
	}, [amounts, tos, milestoneIndices])

	useEffect(() => {
		if(payoutInProcess) {
			payoutsInProcessToastRef.current = customToast({ title: 'Payout is in process', duration: null, status: 'info' })
		} else if(!payoutInProcess && payoutsInProcessToastRef.current) {
			toast.close(payoutsInProcessToastRef.current)
		}
	}, [payoutInProcess])

	const onContinue = async() => {
		if(selectedMode?.value === 'Keplr Wallet') {
			if(!address && status !== 'Connected') {
				setIsModalOpen(false)
				await toast({
					title: 'Please connect your Keplr Wallet and try again',
					status: 'error',
				})
				await connectKeplr()
			} else if(address && status === 'Connected') {
				try {

					setPayoutInProcess(true)

					const stargateClient = await getSigningStargateClient()
					if(!stargateClient || !address) {
					  await toast({
							title: 'Error',
							description: 'Keplr not connected',
							status: 'error',
					  })
					  return
					}

					const { send } = cosmos.bank.v1beta1.MessageComposer.withTypeUrl
					const msg = send({
					  amount: [
							{
						  denom: coin.base,
						  amount: String(Number(amounts?.[0]) * Math.pow(10, parseInt(coin.base) || 6)),

							},
					  ],
					  toAddress: tos?.[0],
					  fromAddress: address,
					})

					const fee: StdFee = {
					  amount: [
							{
						  denom: coin.base,
						  amount: '1',
							},
					  ],
					  gas: '86364',
					}


					const res = await stargateClient.signAndBroadcast(
						address,
						[msg],
						fee,
						`${grant?.title} - ${batchTx ? `Payout for ${
							milestones?.filter((milestone) => parseFloat(milestone?.amountPaid) === 0).length
						} Milestones` : `Payout for Milestone #${milestoneIndices[0] + 1}`}`,
					)

			  if(res) {
						setPayoutInProcess(false)
						setIsModalOpen(false)

						if(batchTx) {
							const args = {
								applicationIds: milestones?.filter((milestone) => parseFloat(milestone?.amountPaid) === 0).map(() => proposal?.id),
								milestoneIds: milestones?.filter((milestone) => parseFloat(milestone?.amountPaid) === 0).map((milestone) => (milestone.id?.split('.')[1])),
								asset: '0x0000000000000000000000000000000000000001',
								tokenName: selectedTokenInfo?.tokenName!,
								nonEvmAssetAddress: 'nonEvmAssetAddress-toBeChanged',
								amounts:  milestones?.filter((milestone) => parseFloat(milestone?.amountPaid) === 0).map((milestone) => milestone?.amount),
								transactionHash: res?.transactionHash,
								sender: address,
								grant: grant?.id!,
								to: tos?.[0]
							}


							// await call({ method: 'disburseRewardFromSafe', args: methodArgs, shouldWaitForBlock: false })
							await executeMutation(DisburseRewardsFromWalletMutation, args)
							await toast({
								title: 'Transaction Successful',
								status: 'success',
								description: `Transaction hash: ${res?.transactionHash}`,
								duration: 5000,
								position: 'top-right',
							})
							refreshWorkspace(true)
						} else {


							const args = {
								applicationIds: [String(proposal?.id)],
								milestoneIds: [String(parseInt(milestones[milestoneIndices[0]].id?.split('.')[1]))],
								asset: '0x0000000000000000000000000000000000000001',
								tokenName: selectedTokenInfo?.tokenName!,
								nonEvmAssetAddress: 'nonEvmAssetAddress-toBeChanged',
								amounts: [amounts?.[0]],
								transactionHash: res?.transactionHash,
								sender: address,
								grant: grant?.id!,
								to: tos?.[0]
							}

							await trackAmplitudeEvent('funds_disbursed', {
								amount: amounts?.[0],
								grant: grant?.title,
								proposal: proposal?.id,
							})

							// // await call({ method: 'disburseRewardFromSafe', args: methodArgs, shouldWaitForBlock: false })
							await executeMutation(DisburseRewardSafeMutation, args)
							await toast({
								title: 'Transaction Successful',
								status: 'success',
								description: `Transaction hash: ${res?.transactionHash}`,
								duration: 5000,
								position: 'top-right',
							})
							logger.info('Transaction done', res)
						}
			  }
				} catch(e) {
					logger.error('Error while sending transaction', e)
					setPayoutInProcess(false)
					customToast({
						title: 'An error occurred while creating transaction on Keplr Wallet',
						status: 'error',
						duration: 5000,
					})
					return
				}
			} else {
				setPayoutInProcess(false)
				customToast({
					title: 'An error occurred while creating transaction on Keplr Wallet',
					status: 'error',
					duration: 5000,
				})
				return
			}


		}
	}


	const onInitiateTransaction = async() => {

		if(signerVerifiedState === 'verified' && proposal) {
			setPayoutInProcess(true)

			if(proposal.state === 'submitted') {
				// Approve proposal if it is not approved
				logger.info('Approving proposal', { proposal })

				const methodArgs = {
					id: proposal.id,
					grant: proposal.grant.id,
					workspaceId: proposal.grant.workspace.id,
					applicantId: scwAddress,
					state: 'approved',
					feedback: {}
				}

				logger.info({ methodArgs }, 'Method Args (Comment)')
				await executeMutation(reSubmitProposalMutation, methodArgs)
			}


			const temp = [{
				from: safeObj?.safeAddress?.toString(),
				to: tos?.[0],
				applicationId: proposal?.id?.startsWith('0x') ? parseInt(proposal?.id, 16) : parseInt(proposal?.id?.slice(-2) ?? '0', 16),
				selectedMilestone: milestoneIndices?.[0],
				selectedToken: { tokenName: selectedTokenInfo?.tokenName, info: selectedTokenInfo?.info },
				amount: amounts?.[0],
			}]

			let proposaladdress: any = ''
			if(safeObj?.getIsEvm()) {
				proposaladdress = await safeObj?.proposeTransactions(JSON.stringify({ workspaceId:  grant?.workspace?.id?.startsWith('0x') ? grant?.workspace?.id : `0x${grant?.workspace?.id?.slice(-2)}`, grantAddress:  grant?.id?.startsWith('0x') ? grant?.id : `0x${grant?.id?.slice(-2)}` }), temp, '')
				if(proposaladdress?.error) {
					logger.error('Error while creating transaction on Gnosis Safe', { proposaladdress })
					customToast({
						title: 'An error occurred while creating transaction on Gnosis Safe',
						status: 'error',
						duration: 3000,
					})
					setPayoutInProcess(false)
					return
				}


				// setSafeProposalAddress(proposaladdress as string)
				setSafeProposalLink(getGnosisTansactionLink(safeObj?.safeAddress ?? '', safeObj?.chainId?.toString(), proposaladdress as string))
			} else if(safeObj?.getIsTon() === false) {
				proposaladdress = await safeObj?.proposeTransactions(JSON.stringify({ workspaceId: grant?.workspace?.id, grantAddress: grant?.id }), temp, phantomWallet)
				if(proposaladdress?.error) {
					customToast({
						title: 'An error occurred while creating transaction on Multi-sig',
						status: 'error',
						duration: 3000,
					})
					setPayoutInProcess(false)
					return
				}

				// setSafeProposalAddress(proposaladdress as string)
				setSafeProposalLink(getProposalUrl(safeObj?.safeAddress ?? '', proposaladdress as string))
			} else {
				try {
					if(!tonWallet && typeof window !== 'undefined' && !('ton' in window)) {
						logger.error('TON Wallet not found', { tonWallet })
						throw new Error('TON Wallet not found')
					}

					proposaladdress = await safeObj?.proposeTransactions(`${grant?.title ?? 'grant'} / ${getFieldString(proposal, 'projectName') ?? proposal.id}: Milestone #${milestoneIndices[0] + 1} Payout`, temp, !tonWallet ? typeof window !== 'undefined' && ('ton' in window) ? window.ton : tonWallet : tonWallet)
					setSafeProposalLink('https://tonkey.app/transactions/queue?safe=' + (safeObj?.safeAddress ?? ''))
				} catch(e) {
					customToast({
						title: (e as { message: string }).message,
						status: 'error',
						duration: 3000,
					})
					setPayoutInProcess(false)
					return
				}
			}


			const args = {
				applicationIds: [String(proposal?.id)],
				milestoneIds: [String(parseInt(milestones[milestoneIndices[0]].id?.split('.')[1]))],
				asset: '0x0000000000000000000000000000000000000001',
				tokenName: selectedTokenInfo?.tokenName?.toLowerCase() ?? '',
				nonEvmAssetAddress: 'nonEvmAssetAddress-toBeChanged',
				amounts: [amounts?.[0]],
				// if the tx returns an error, the transaction hash will be empty
				transactionHash: typeof proposaladdress === 'string' ? proposaladdress : '',
				sender: safeAddress,
				grant: grant?.id!,
				to: tos?.[0]
			}

			await executeMutation(DisburseRewardSafeMutation, args)
			setSignerVerifiedState('transaction_initiated')
			setPayoutInProcess(false)
		}
	}

	const workspacechainId = getSupportedChainIdFromWorkspace(grant?.workspace) || defaultChainId
	// const { call } = useFunctionCall({ chainId: workspacechainId, contractName: 'workspace' })
	const { } = useFunctionCall({ chainId: workspacechainId, contractName: 'applications' })
	const { scwAddress } = useContext(WebwalletContext)!
	const { refreshWorkspace } = useContext(SettingsFormContext)!
	const { trackAmplitudeEvent } = useContext(AmplitudeContext)!
	return buildComponent()
}

export default FundingBuilderModal