
import { useCallback, useEffect, useMemo } from 'react'
import { Flex, Text, VStack } from '@chakra-ui/react'
import { debounce } from 'lodash'
import { useSafeContext } from 'src/contexts/safeContext'
import useCustomToast from 'src/libraries/hooks/useCustomToast'
import logger from 'src/libraries/logger'
import usePhantomWallet from 'src/screens/dashboard/_hooks/usePhantomWallet'
import { SignerVerifiedState } from 'src/screens/dashboard/_utils/types'
import { MetamaskFox } from 'src/v2/assets/custom chakra icons/SupportedWallets/MetamaskFox'
import { PhantomLogo } from 'src/v2/assets/custom chakra icons/SupportedWallets/PhantomLogo'
import { WalletConnectLogo } from 'src/v2/assets/custom chakra icons/SupportedWallets/WalletConnectLogo'
import ConnectWalletButton from 'src/v2/components/ConnectWalletModal/ConnectWalletButton'
import { useAccount, useConnect, useDisconnect, useNetwork, useSigner, useSwitchNetwork } from 'wagmi'

const availableWallets = [{
	name: 'Metamask',
	icon: <MetamaskFox
		h={8}
		w='33px' />,
	isPopular: true,
	id: 'injected',
}, {
	name: 'WalletConnect',
	icon: <WalletConnectLogo
		h={8}
		w='33px' />,
	isPopular: false,
	id: 'walletConnect'
}]

const solanaWallets = [{
	name: 'Phantom',
	icon: <PhantomLogo
		h={8}
		w='33px' />,
	isPopular: false,
	id: 'phantom',
}]

interface Props {
    signerVerifiedState: SignerVerifiedState
	setSignerVerifiedState: (signerVerified: SignerVerifiedState) => void
}


const Verify = ({ setSignerVerifiedState }: Props) => {
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
						availableWallets.map((wallet, index) => (
							<ConnectWalletButton
								maxW='100%'
								key={index}
								icon={wallet.icon}
								name={wallet.name}
								isPopular={wallet.isPopular}
								onClick={
									() => {
										if(!isConnected) {
											const connector = connectors.find((x) => x.id === wallet.id)
											logger.info({ connector }, 'connector')
											// setConnectClicked(true)
											if(connector) {
												connect({ connector })
											}
										}
										// setVerified(true)
										// onVerified()
									}
								} />
						)) : solanaWallets.map((wallet, index) => (
							<ConnectWalletButton
								maxW='100%'
								key={index}
								icon={wallet.icon}
								name={wallet.name}
								isPopular={wallet.isPopular}
								onClick={
									() => {
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
	const { error, switchNetworkAsync } = useSwitchNetwork()
	const { data: signer } = useSigner()
	const { chain } = useNetwork()
	const { safeObj } = useSafeContext()
	const { phantomWallet, phantomWalletConnected } = usePhantomWallet()

	const { isConnected, address, connector } = useAccount()
	const toast = useCustomToast()

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

		if(safeObj.getIsEvm() && isConnected && chain?.id === safeObj?.chainId) {
			verifyOwner(address!)
		} else if(phantomWalletConnected) {
			verifyOwner(phantomWallet?.publicKey?.toString()!)
		}
	}, [chain, isConnected, phantomWalletConnected])


	return buildComponent()
}

export default Verify
