import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { ethers, logger } from 'ethers'
import { useRouter } from 'next/router'
import { defaultChainId } from 'src/constants/chains'
import { useSafeContext } from 'src/contexts/safeContext'
import useQBContract from 'src/hooks/contracts/useQBContract'
import { useBiconomy } from 'src/hooks/gasless/useBiconomy'
import { useQuestbookAccount } from 'src/hooks/gasless/useQuestbookAccount'
import { WebwalletContext } from 'src/pages/_app'
import { IApplicantData, MinimalWorkspace } from 'src/types'
import { getFieldString } from 'src/utils/formattingUtils'
import { bicoDapps, chargeGas, getTransactionDetails, sendGaslessTransaction } from 'src/utils/gaslessUtils'
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils'
import usePhantomWallet from 'src/v2/hooks/usePhantomWallet'
import SendFundsDrawer from 'src/v2/payouts/SendFundsDrawer/SendFundsDrawer'
import SendFundsModal from 'src/v2/payouts/SendFundsModal/SendFundsModal'
import TransactionInitiatedModal from 'src/v2/payouts/TransactionInitiatedModal'
import { Safe } from 'src/v2/types/safe'
import { getGnosisTansactionLink } from 'src/v2/utils/gnosisUtils'
import { getProposalUrl } from 'src/v2/utils/phantomUtils'
import { useAccount, useDisconnect } from 'wagmi'

export default function SendFunds({
	workspace,
	sendFundsTo,
	rewardAssetAddress,
	grantTitle, }: {workspace: MinimalWorkspace, sendFundsTo: IApplicantData[], rewardAssetAddress: string, grantTitle: string}) {

	const router = useRouter()

	const [applicationID, setApplicationId] = useState<string>('')

	useEffect(() => {
		if(router?.query) {
			const { applicationId: aId } = router.query
			if(typeof aId === 'string') {
				setApplicationId(aId)
			}
		}
	}, [router])

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

	const {
		phantomWallet,
		phantomWalletConnected,
		setPhantomWalletConnected } = usePhantomWallet()

	const { isConnected } = useAccount()
	const { disconnect } = useDisconnect()

	const [sendFundsModalIsOpen, setSendFundsModalIsOpen] = useState(false)
	const [sendFundsDrawerIsOpen, setSendFundsDrawerIsOpen] = useState(false)
	const [txnInitModalIsOpen, setTxnInitModalIsOpen] = useState(false)

	const [signerVerified, setSignerVerififed] = useState(false)
	const [proposalAddr, setProposalAddr] = useState('')
	const [safeTokenList, setSafeTokenList] = useState<any>([])

	const [initiateTransactionData, setInitiateTransactionData] = useState<any>([])
	const [step, setStep] = useState('RECEIPT_DETAILS')

	// const [assetId, setAssetId] = useState<string>('')
	// const [celoTokensUSDRateMapping, setCeloTokensUSDRateMappings] = useState<any>({})

	const { safeObj } = useSafeContext()
	const isEvmChain = safeObj?.getIsEvm()

	const workspaceRegistryContract = useQBContract('workspace', workspacechainId)
	const { webwallet } = useContext(WebwalletContext)!

	useEffect(() => {

		const getToken = async() => {
			const response = await safeObj?.getTokenAndbalance()
			setSafeTokenList(response)
		}

		if(sendFundsTo?.length > 0) {
			if(sendFundsTo?.length === 1) {
				setSendFundsModalIsOpen(true)
				getToken()
			} else {
				setSendFundsDrawerIsOpen(true)
				getToken()
			}
		}

	}, [sendFundsTo])


	useEffect(() => {
		logger.info('safe token', safeTokenList)
		logger.info({ sendFundsTo }, 'Send Funds To')
		const formattedTrxnData = sendFundsTo?.map((recepient: any,) => (
			{
				from: safeObj.safeAddress.toString(),
				to: recepient?.applicantAddress || getFieldString(recepient, 'applicantAddress') || recepient?.applicantId,
				applicationId: recepient?.applicationId || applicationID,
				selectedMilestone: recepient?.milestones?.[0],
				selectedToken: { name: safeTokenList[0]?.tokenName, info: safeTokenList[0]?.info },
				amount: recepient?.milestones?.[0]?.amount,
			})
		)
		console.log('txn data', formattedTrxnData)
		setInitiateTransactionData(formattedTrxnData)
	}, [sendFundsTo])

	useEffect(() => {
		if(phantomWalletConnected) {
			getRealmsVerification()
		} else if(isConnected) {
			verifyGnosisOwner()
		} else {
			setSignerVerififed(false)
		}
	}, [phantomWalletConnected, isConnected])

	useEffect(() => {
		if(signerVerified) {
			setStep('VERIFIED_OWNER')
		}
	}, [signerVerified])

	const getRealmsVerification = async() => {
		if(phantomWallet?.publicKey?.toString()) {
			const isVerified = await safeObj?.isOwner(phantomWallet.publicKey?.toString())
			if(isVerified) {
				setSignerVerififed(true)
			}
		}
	}

	const verifyGnosisOwner = async() => {
		if(isConnected) {
			const isVerified = await safeObj?.isOwner(safeObj.safeAddress)
			if(isVerified) {
				setSignerVerififed(true)
			} else {
				// console.log('not a owner')
				setSignerVerififed(false)
			}
		}
	}

	const initiateTransaction = async() => {
		// console.log('initiate transaction called')
		let proposaladdress: string | undefined
		if(safeObj.getIsEvm()) {
			const proposaladdress = await safeObj?.proposeTransactions('', initiateTransactionData, '')
			if(!proposaladdress) {
				throw new Error('No proposal address found!')
			}

			setProposalAddr(proposaladdress?.toString())
		} else {
			proposaladdress = await safeObj?.proposeTransactions(grantTitle, initiateTransactionData, phantomWallet)
			if(!proposaladdress) {
				throw new Error('No proposal address found!')
			}

			setProposalAddr(proposaladdress?.toString())
		}

		disburseRewardFromSafe(proposaladdress?.toString()!)
			.then(() => {
				// console.log('Sent transaction to contract - EVM', proposaladdress)
			})
			.catch((err) => {
				console.log('sending transction error:', err)
			})

	}

	const disburseRewardFromSafe = useCallback(async(proposaladdress: string) => {
		// console.log(workspacechainId)
		if(!workspacechainId) {
			return
		}

		try {
			if(!workspacechainId) {
				throw new Error('No network specified')
			}

			if(!proposaladdress) {
				throw new Error('No proposal Address specified')
			}

			if(!initiateTransactionData) {
				throw new Error('No data provided!')
			}

			if(!workspace) {
				throw new Error('No workspace found!')
			}

			if(typeof biconomyWalletClient === 'string' || !biconomyWalletClient || !scwAddress) {
				return
			}

			logger.info({ initiateTransactionData }, 'initiateTransactionData', Math.floor(initiateTransactionData[0].amount))


			const methodArgs = [
				initiateTransactionData.map((element: any) => (parseInt(element.applicationId, 16))),
				initiateTransactionData.map((element: any) => (parseInt(element.selectedMilestone?.id?.split('.')[1]))),
				rewardAssetAddress,
				initiateTransactionData.map((element: any) => (element.selectedToken.name.toLowerCase()))[0],
				'nonEvmAssetAddress-toBeChanged',
				initiateTransactionData.map((element: any) => Math.floor(element.amount)),
				workspace.id,
				proposaladdress
			]

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

			if(!transactionHash) {
				throw new Error('No transaction hash found!')
			}

			const { txFee } = await getTransactionDetails(transactionHash, workspacechainId.toString())

			// console.log('txFee', txFee)
			// console.log('receipt: ', receipt)
			await chargeGas(Number(workspace.id), Number(txFee), workspacechainId)

		} catch(e) {
			console.log('disburse error', e)
		}
	}, [workspace, biconomyWalletClient, workspacechainId, biconomy, workspaceRegistryContract, scwAddress, webwallet, nonce, initiateTransactionData, proposalAddr])


	const onChangeRecepientDetails = async(applicationId: any, fieldName: string, fieldValue: any) => {

		if(fieldName === 'selectedToken') {
			const tempData = initiateTransactionData.map((transactionData: any) => {
				return { ...transactionData, [fieldName]: fieldValue }
			})
			logger.info({ tempData }, 'tempData 1')
			setInitiateTransactionData(tempData)
		} else {
			logger.info({ initiateTransactionData }, 'Initiate Transaction Data')
			const tempData = initiateTransactionData.map((transactionData: any) => {
				if(transactionData.applicationId === applicationId) {
					logger.info({ txData: { ...transactionData, [fieldName]: fieldValue } }, 'transactionData')
					const ret = { ...transactionData, [fieldName]: fieldValue }
					if(fieldName === 'selectedMilestone') {
						ret.amount = fieldValue?.amount
					}

					return ret
				}

				return transactionData
			})
			logger.info({ tempData }, 'tempData 2')
			setInitiateTransactionData(tempData)
		}
	}

	const onModalStepChange = async(currentState: string) => {
		switch (currentState) {
		case 'RECEIPT_DETAILS':
			setStep('CONNECT_WALLET')
			break
		case 'CONNECT_WALLET':
			if(signerVerified) {
				setStep('VERIFIED_OWNER')
			}

			break
		case 'VERIFIED_OWNER':
			setStep('TRANSATION_INITIATED')
			initiateTransaction()
			setSendFundsModalIsOpen(false)
			setSendFundsDrawerIsOpen(false)
			setTxnInitModalIsOpen(true)

			break
		}
	}

	const onModalClose = async() => {
		setStep('RECEIPT_DETAILS')
		setSendFundsModalIsOpen(false)
		setSendFundsDrawerIsOpen(false)
		setTxnInitModalIsOpen(false)
		if(phantomWallet?.isConnected) {
			await phantomWallet.disconnect()
			setPhantomWalletConnected(false)
		}

		if(isConnected) {
			disconnect()
		}
	}

	//end of implementation

	return (
		<>

			<SendFundsModal
				isOpen={sendFundsModalIsOpen}
				onClose={onModalClose}
				safeAddress={safeObj?.safeAddress}
				safeNetwork={safeObj?.chainId.toString()!}
				proposals={sendFundsTo ?? []}

				safeTokenList={safeTokenList}
				onChangeRecepientDetails={onChangeRecepientDetails}
				phantomWallet={phantomWallet}
				isEvmChain={isEvmChain}
				signerVerified={signerVerified}
				initiateTransactionData={initiateTransactionData}
				onModalStepChange={onModalStepChange}
				step={step}
			/>

			<TransactionInitiatedModal
				isOpen={!!(txnInitModalIsOpen && proposalAddr)}
				onClose={onModalClose}
				numOfTransactionsInitiated={sendFundsTo?.length || 0}
				proposalUrl={isEvmChain ? getGnosisTansactionLink(safeObj?.safeAddress?.toString()!, safeObj?.chainId?.toString()!) : getProposalUrl(safeObj?.safeAddress?.toString()!, proposalAddr)}
				safe={safeObj as Safe}
			/>

			<SendFundsDrawer
				isOpen={sendFundsDrawerIsOpen}
				onClose={onModalClose}
				safeAddress={safeObj?.safeAddress}
				proposals={sendFundsTo ?? []}

				safeTokenList={safeTokenList}
				onChangeRecepientDetails={onChangeRecepientDetails}
				phantomWallet={phantomWallet}
				setPhantomWalletConnected={setPhantomWalletConnected}
				isEvmChain={isEvmChain}
				signerVerified={signerVerified}
				initiateTransaction={initiateTransaction}
				initiateTransactionData={initiateTransactionData}

				onModalStepChange={onModalStepChange}
				step={step}
			/>
		</>
	)
}
