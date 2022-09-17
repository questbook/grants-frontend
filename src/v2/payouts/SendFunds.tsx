import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { Box } from '@chakra-ui/react'
import { ethers, logger } from 'ethers'
import { useRouter } from 'next/router'
import { WebwalletContext } from 'pages/_app'
import { defaultChainId } from 'src/constants/chains'
import useQBContract from 'src/hooks/contracts/useQBContract'
import { useBiconomy } from 'src/hooks/gasless/useBiconomy'
import { useQuestbookAccount } from 'src/hooks/gasless/useQuestbookAccount'
import { getFieldString, parseAmount } from 'src/utils/formattingUtils'
import { bicoDapps, chargeGas, getTransactionDetails, sendGaslessTransaction } from 'src/utils/gaslessUtils'
import { isPlausibleSolanaAddress } from 'src/utils/generics'
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils'
import { GnosisSafe } from 'src/v2/constants/safe/gnosis_safe'
import { getTokenAndbalance, RealmsSolana, usdToSolana } from 'src/v2/constants/safe/realms_solana'
import safeServicesInfo from 'src/v2/constants/safeServicesInfo'
import usePhantomWallet from 'src/v2/hooks/usePhantomWallet'
import SendFundsDrawer from 'src/v2/payouts/SendFundsDrawer/SendFundsDrawer'
import SendFundsModal from 'src/v2/payouts/SendFundsModal/SendFundsModal'
import TransactionInitiatedModal from 'src/v2/payouts/TransactionInitiatedModal'
import getGnosisTansactionLink from 'src/v2/utils/gnosisUtils'
import getProposalUrl from 'src/v2/utils/phantomUtils'
import { erc20ABI, useAccount, useConnect, useDisconnect } from 'wagmi'

const ERC20Interface = new ethers.utils.Interface(erc20ABI)

export default function SendFunds({
	workspace,
	workspaceSafe,
	workspaceSafeChainId,
	sendFundsTo,
	rewardAssetAddress,
	rewardAssetDecimals,
	grantData, }: any) {

	const router = useRouter()

	const [applicationID, setApplicationId] = useState<any>('')

	useEffect(() => {
		if(router && router.query) {
			const { applicationId: aId } = router.query
			setApplicationId(aId)
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
	const [gnosisBatchData, setGnosisBatchData] = useState<any>([])
	const [, setGnosisReadyToExecuteTxns] = useState<any>([])
	const [step, setStep] = useState('RECEIPT_DETAILS')

	const isEvmChain = workspaceSafeChainId !== 900001

	const workspaceRegistryContract = useQBContract('workspace', workspacechainId)
	const { webwallet } = useContext(WebwalletContext)!

	const currentSafe = useMemo(() => {
		if(isEvmChain && workspaceSafe) {
			const txnServiceURL = safeServicesInfo[workspaceSafeChainId]
			return new GnosisSafe(workspaceSafeChainId, txnServiceURL, workspaceSafe)
		} else {
			if(isPlausibleSolanaAddress(workspaceSafe)) {

				return new RealmsSolana(workspaceSafe)
			}
		}
	}, [workspaceSafe])

	useEffect(() => {
		const getToken = async() => {
			console.log('get token called')
			setSafeTokenList(await getTokenAndbalance(workspaceSafe))
		}

		if(isPlausibleSolanaAddress(workspaceSafe) && currentSafe) {
			getToken()
		}
	}, [currentSafe])

	useEffect(() => {
		if(sendFundsTo?.length > 0) {
			if(sendFundsTo?.length === 1) {
				setSendFundsModalIsOpen(true)
			} else {
				setSendFundsDrawerIsOpen(true)
			}
		}
	}, [sendFundsTo])


	useEffect(() => {
		const formattedTrxnData = sendFundsTo?.map((recepient: any,) => (
			{
				from: currentSafe?.id?.toString(),
				to:  recepient?.applicantAddress || getFieldString(recepient, 'applicantAddress') || recepient?.applicantId,
				applicationId: recepient?.applicationId || applicationID,
				selectedMilestone: recepient?.milestones[0]?.id,
				selectedToken: { name: safeTokenList[0]?.tokenName, info: safeTokenList[0]?.tokenInfo },
				amount: 0
			})
		)
		setInitiateTransactionData(formattedTrxnData)
		setGnosisBatchData(formattedTrxnData)
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


	function createEVMMetaTransactions() {
		const readyTxs = gnosisBatchData.map((data: any) => {
			const txData = encodeTransactionData(data.to, (data.amount.toString()))
			const tx = {
				to: ethers.utils.getAddress(rewardAssetAddress),
				data: txData,
				value: '0'
			}
			return tx
		})
		setGnosisReadyToExecuteTxns(readyTxs)
		return readyTxs
	}

	function encodeTransactionData(recipientAddress: string, fundAmount: string) {
		const txData = ERC20Interface.encodeFunctionData('transfer', [
			recipientAddress,
			ethers.utils.parseUnits(fundAmount, rewardAssetDecimals)
		])

		return txData
	}

	const getRealmsVerification = async() => {
		if(phantomWallet?.publicKey?.toString()) {
			const isVerified = await currentSafe?.isOwner(phantomWallet.publicKey?.toString())
			if(isVerified) {
				setSignerVerififed(true)
			}
		}
	}

	const verifyGnosisOwner = async() => {
		if(isConnected) {
			const isVerified = await currentSafe?.isOwner(workspaceSafe)
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
		if(isEvmChain) {
			const readyToExecuteTxs = createEVMMetaTransactions()
			const safeTxHash = await currentSafe?.createMultiTransaction(readyToExecuteTxs, workspaceSafe)
			if(safeTxHash) {
				proposaladdress = safeTxHash
				setProposalAddr(safeTxHash)
			} else {
				throw new Error('Proposal address not found')
			}
		} else {
			proposaladdress = await currentSafe?.proposeTransactions(grantData?.grants ? grantData?.grants[0].title! : grantData.title, initiateTransactionData, phantomWallet)
			if(!proposaladdress) {
				throw new Error('No proposal address found!')
			}

			setProposalAddr(proposaladdress?.toString())
		}

		disburseRewardFromSafe(proposaladdress?.toString()!)
			.then(() => {
				// console.log('Sent transaction to contract - realms')
			})
			.catch(() => {
				// console.log('realms sending transction error:', err)
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

			logger.info({ initiateTransactionData }, 'initiateTransactionData')


			const methodArgs = [
				initiateTransactionData.map((element: any) => (parseInt(element.applicationId, 16))),
				initiateTransactionData.map((element: any) => (parseInt(element.selectedMilestone?.split('.')[1]))),
				rewardAssetAddress,
				'nonEvmAssetAddress-toBeChanged',
				initiateTransactionData.map((element: any) => isEvmChain ? (parseAmount(element.amount.toString(), '', rewardAssetDecimals)) : Math.floor(element.amount)),
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
			await chargeGas(Number(workspace.id), Number(txFee))

		} catch(e) {
			// console.log('disburse error', e)
		}
	}, [workspace, biconomyWalletClient, workspacechainId, biconomy, workspaceRegistryContract, scwAddress, webwallet, nonce, initiateTransactionData, proposalAddr])

	const onChangeRecepientDetails = async(applicationId: any, fieldName: string, fieldValue: any) => {

		if(fieldName === 'selectedToken') {
			const tempData = initiateTransactionData.map((transactionData: any) => {
				return { ...transactionData, [fieldName]: fieldValue }
			})
			setInitiateTransactionData(tempData)
			setGnosisBatchData(tempData)
		} else {
			const tempData = initiateTransactionData.map((transactionData: any) => {
				if(transactionData.applicationId === applicationId) {
					return { ...transactionData, [fieldName]: fieldValue }
				}

				return transactionData
			})
			setInitiateTransactionData(tempData)
			setGnosisBatchData(tempData)
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
				safeAddress={workspaceSafe}
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
				proposalUrl={isEvmChain ? getGnosisTansactionLink(currentSafe?.id?.toString()!, currentSafe?.chainId?.toString()!) : getProposalUrl(currentSafe?.id?.toString()!, proposalAddr)}
			/>

			<SendFundsDrawer
				isOpen={sendFundsDrawerIsOpen}
				onClose={onModalClose}
				safeAddress={workspaceSafe}
				proposals={sendFundsTo ?? []}

				safeTokenList={safeTokenList}
				onChangeRecepientDetails={onChangeRecepientDetails}
				phantomWallet={phantomWallet}
				setPhantomWalletConnected={setPhantomWalletConnected}
				isEvmChain={isEvmChain}
				current_safe={currentSafe}
				signerVerified={signerVerified}
				initiateTransaction={initiateTransaction}
				initiateTransactionData={initiateTransactionData}

				onModalStepChange={onModalStepChange}
				step={step}
			/>
		</>
	)
}
