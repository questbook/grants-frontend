
import { useEffect, useMemo, useState } from 'react'
import { Flex, Text, VStack } from '@chakra-ui/react'
import { useSafeContext } from 'src/contexts/safeContext'
import { Metamask, Phantom, WalletConnect } from 'src/generated/icons'
import useCustomToast from 'src/libraries/hooks/useCustomToast'
import logger from 'src/libraries/logger'
import ConnectWalletButton from 'src/screens/dashboard/_components/FundBuilder/ConnectWalletButton'
import usePhantomWallet from 'src/screens/dashboard/_hooks/usePhantomWallet'
import { SignerVerifiedState } from 'src/screens/dashboard/_utils/types'
import getErrorMessage from 'src/utils/errorUtils'
import { useAccount, useConnect, useDisconnect, useNetwork, useSwitchNetwork } from 'wagmi'

const availableWallets = [{
	name: 'Metamask',
	icon: <Metamask
		h={8}
		w='33px' />,
	isPopular: true,
	id: 'injected',
}, {
	name: 'WalletConnect',
	icon: <WalletConnect
		h={8}
		w='33px' />,
	isPopular: false,
	id: 'walletConnect'
}]

const solanaWallets = [{
	name: 'Phantom',
	icon: <Phantom
		h={8}
		w='33px' />,
	isPopular: false,
	id: 'phantom',
}]

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
									() => {
										setVerifying(wallet.id)
										logger.info('Connect wallet initiated')
										try {
											logger.info('Inside try block')
											const connector = connectors.find((x) => x.id === wallet.id)
											logger.info({ connector }, 'connector')
											// setConnectClicked(true)
											if(connector) {
												connect({ connector })
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
						)) : solanaWallets.map(wallet => (
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
						))
				}
			</VStack>
		</Flex>
	)

	const { connect, connectors } = useConnect()
	const { disconnect } = useDisconnect()
	const { switchNetworkAsync } = useSwitchNetwork()
	const { chain } = useNetwork()
	const { safeObj } = useSafeContext()
	const { phantomWallet, phantomWalletConnected } = usePhantomWallet()

	const { isConnected, address, connector } = useAccount()
	const toast = useCustomToast()

	const [verifying, setVerifying] = useState<string>()

	useEffect(() => {
		if(isConnected) {
			disconnect()
		}
	}, [])

	const isEvmChain = useMemo(() => {
		return safeObj.getIsEvm()
	}, [safeObj])

	const verifyOwner = async(address: string) => {
		logger.info({ address: safeObj.safeAddress }, '1')
		const isVerified = await safeObj?.isOwner(address)
		if(isVerified) {
			setSignerVerifiedState('verified')
			toast({
				title: `Verified owner of multisig ${safeObj.safeAddress}.`,
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

	const switchNetworkIfNeed = async() => {
		if(isConnected && chain?.id !== safeObj?.chainId) {
			try {
				await switchNetworkAsync?.(safeObj?.chainId!)
			} catch(e) {
				logger.error(e)
			}
		}
	}

	useEffect(() => {
		switchNetworkIfNeed()
	}, [ connector ])

	useEffect(() => {
		if(isConnected || phantomWalletConnected) {
			setSignerVerifiedState('verifying')
		}

		if(shouldVerify) {
			if(safeObj.getIsEvm() && isConnected && chain?.id === safeObj?.chainId) {
				verifyOwner(address!)
			} else if(phantomWalletConnected) {
				verifyOwner(phantomWallet?.publicKey?.toString()!)
			}
		}
	}, [chain, isConnected, phantomWalletConnected])


	return buildComponent()
}

export default Verify
