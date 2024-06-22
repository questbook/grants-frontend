
import { useEffect, useMemo, useState } from 'react'
import { Flex, Text, VStack } from '@chakra-ui/react'
import { useSafeContext } from 'src/contexts/safeContext'
import useCustomToast from 'src/libraries/hooks/useCustomToast'
import logger from 'src/libraries/logger'
import { availableWallets, solanaWallets, tonWallets } from 'src/libraries/utils/constants'
import getErrorMessage from 'src/libraries/utils/error'
import ConnectWalletButton from 'src/screens/dashboard/_components/FundBuilder/ConnectWalletButton'
import usePhantomWallet from 'src/screens/dashboard/_hooks/usePhantomWallet'
import usetonWallet from 'src/screens/dashboard/_hooks/useTonWallet'
import { SignerVerifiedState } from 'src/screens/dashboard/_utils/types'
import { Connector, useAccount, useConnect, useSwitchChain } from 'wagmi'

interface Props {
	signerVerifiedState: SignerVerifiedState
	setSignerVerifiedState: (signerVerified: SignerVerifiedState) => void
	shouldVerify?: boolean
}


const Verify = ({ setSignerVerifiedState, shouldVerify = true }: Props) => {
	const buildComponent = () => (
		<Flex direction='column'>
			<Text
				mt='24px'
				fontSize='14px'
				lineHeight='20px'
				fontWeight='500'
			>
				Connect your wallet which is a safe owner.
			</Text>

			<VStack
				my={6}
				direction='column'
				w='full'
				spacing={4}
				alignItems='stretch'
			>
				{
					isEvmChain ?
						availableWallets.map(wallet => (
							<ConnectWalletButton
								id={wallet.id}
								maxW='100%'
								key={wallet.id}
								icon={wallet.icon}
								name={wallet.name}
								verifying={verifying}
								isDisabled={verifying !== undefined && verifying !== wallet.id}
								onClick={
									async() => {
										setVerifying(wallet.id)
										logger.info('Connect wallet initiated')
										try {
											logger.info('Inside try block')
											const connector = connectors.find((x) => x.id === wallet.id)
											logger.info({ connector }, 'connector')
											setSelectedConnector(connector)
											// setConnectClicked(true)
											if(connector) {
												logger.info('Connector found', connector)
												// swallow error here so we don't fail the remaining logic
												const isConnected = await connector.isAuthorized().catch(() => false)
												logger.info({ isConnected }, 'isConnected')
												if(!isConnected) {
													connect({ connector })
													toast({
														title: 'Connecting to wallet',
														status: 'info',
														duration: 3000
													})
												} else {
													connect({ connector })
												}
											} else {
												toast({
													title: 'Connector not found!',
													status: 'error',
													duration: 3000
												})
												setVerifying(undefined)
											}
											// eslint-disable-next-line @typescript-eslint/no-explicit-any
										} catch(e: any) {
											setVerifying(undefined)
											const message = getErrorMessage(e)
											toast({
												title: message,
												status: 'error',
												duration: 5000
											})
										}

										logger.info(10)
									}
								} />
						)) : (
							isTonChain ? (tonWallets.map(wallet => (
								<ConnectWalletButton
									id={wallet.id}
									maxW='100%'
									key={wallet.id}
									icon={wallet.icon}
									name={wallet.name}
									verifying={verifying}
									isDisabled={verifying !== undefined && verifying !== wallet.id}
									onClick={
										async() => {
											setVerifying(wallet.id)
											await connectTonWallet()
										}
									} />
							)
							))
								:
								solanaWallets.map(wallet => (
									<ConnectWalletButton
										id={wallet.id}
										maxW='100%'
										key={wallet.id}
										icon={wallet.icon}
										name={wallet.name}
										verifying={verifying}
										isDisabled={verifying !== undefined && verifying !== wallet.id}
										onClick={
											() => {
												setVerifying(wallet.id)
												phantomWallet?.connect()
											}
										} />
								)
								)

						)
				}
			</VStack>
		</Flex>
	)

	const { connect, connectors } = useConnect()
	const { safeObj } = useSafeContext()!
	const { switchChain, chains } = useSwitchChain()
	const { phantomWallet, phantomWalletConnected } = usePhantomWallet()
	const { connectTonWallet, tonWalletAddress, tonWalletConnected } = usetonWallet()
	const { address, chainId: chain, isConnected, connector } = useAccount()
	const toast = useCustomToast()
	logger.info({ address, chain, isConnected }, 'Account info')
	const [verifying, setVerifying] = useState<string>()
	const [selectedConnector, setSelectedConnector] = useState<Connector>()
	const isEvmChain = useMemo(() => {
		return safeObj?.getIsEvm()
	}, [safeObj])

	const isTonChain = useMemo(() => {
		return safeObj?.getIsTon()
	}, [safeObj])

	const verifyOwner = async(address: string) => {
		logger.info({ address: safeObj?.safeAddress }, '1')
		logger.info('lllllll', safeObj)
		const provider = await connector?.getProvider()
		logger.info({ provider }, 'Provider')
		const isVerified = await safeObj?.isOwner(address, provider)
		if(isVerified) {
			setSignerVerifiedState('verified')
			toast({
				title: `Verified owner of multisig ${safeObj?.safeAddress}.`,
				status: 'success',
				duration: 3000,
			})
		} else {
			setSignerVerifiedState('failed')
			toast({
				title: 'This wallet is not a multisig owner. Try with another address.',
				status: 'error',
				duration: 3000,
			})
		}

		setVerifying(undefined)
	}

	const initiateOwnerVerification = async() => {
		logger.info('Initiating owner verification')
		const didSwitch = await switchNetworkIfNeeded()
		if(didSwitch) {
			logger.info('Network switched successfully')
			return
		}

		const isConnected = selectedConnector ? await selectedConnector.isAuthorized().catch(() => false) : false
		if(isConnected || phantomWalletConnected) {
			setSignerVerifiedState('verifying')
		}

		if(shouldVerify) {
			if(safeObj?.getIsEvm() && isConnected && chain === safeObj?.chainId) {
				verifyOwner(address!)
			} else if(isTonChain && tonWalletConnected) {
				verifyOwner(tonWalletAddress)
			} else if(phantomWalletConnected) {
				verifyOwner(phantomWallet?.publicKey?.toString()!)
			}
		}
	}

	const switchNetworkIfNeeded = async() => {
		const isConnected = selectedConnector ? await selectedConnector.isAuthorized().catch(() => false) : false
		if(isConnected && chain !== safeObj?.chainId) {
			try {
				const toChainId = safeObj?.chainId
				logger.info({ toChainId }, 'Switching network to')
				logger.info(chains, 'Chains')
				if(!toChainId || !chains.find((x) => x.id === toChainId)) {
					toast({
						title: 'Invalid chain id Please switch to correct chain',
						status: 'error',
						duration: 3000
					})
					return ''
				}

				await switchChain({ chainId: toChainId })
				return true
			} catch(e) {
				logger.error(e)
				toast({
					title: 'Error switching network',
					status: 'error',
					duration: 3000
				})
				return false
			}
		} else {
			return false
		}
	}

	useEffect(() => {
		if((isTonChain && tonWalletConnected) || (address && verifying !== undefined)) {
			initiateOwnerVerification()
		}
	}, [address, chain, selectedConnector, phantomWalletConnected, verifying, tonWalletConnected])

	useEffect(() => {
		logger.info(availableWallets, 'Available wallets')
		logger.info({ chain }, 'Current chain')
	}, [chain])

	useEffect(() => {
		logger.info({ selectedConnector }, 'Selected connector')
	}, [selectedConnector])


	return buildComponent()
}

export default Verify
