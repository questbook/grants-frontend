
import { useEffect } from 'react'
import { Flex, Image, Text, VStack } from '@chakra-ui/react'
import { MetamaskFox } from 'src/v2/assets/custom chakra icons/SupportedWallets/MetamaskFox'
import { PhantomLogo } from 'src/v2/assets/custom chakra icons/SupportedWallets/PhantomLogo'
import { WalletConnectLogo } from 'src/v2/assets/custom chakra icons/SupportedWallets/WalletConnectLogo'
import ConnectWalletButton from 'src/v2/components/ConnectWalletModal/ConnectWalletButton'
import { PhantomProvider } from 'src/v2/types/phantom'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
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
	isEvmChain: boolean
	phantomWallet?: PhantomProvider
	signerVerified: boolean
	gnosisSafeAddress: string
}


const SafeOwner = ({ isEvmChain, phantomWallet, signerVerified, gnosisSafeAddress }: Props) => {
	const { connectAsync, connectors } = useConnect()
	const { isConnected } = useAccount()
	const { disconnect } = useDisconnect()

	useEffect(() => {
		if(isConnected) {
			disconnect()
		}
	}, [isConnected])

	if(!signerVerified) {
		return (
			<>
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
										async() => {
											if(!isConnected) {
												const connector = connectors.find((x) => x.id === wallet.id)
												// setConnectClicked(true)
												if(connector) {
													await connectAsync({ connector })
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

			</>
		)
	}

	return (
		<>
			<Flex
				justifyContent='center'
				py='24px'>
				<Image
					boxSize='48px'
					src='/ThumbsUpSafe.svg' />
			</Flex>

			<Text
				fontSize='14px'
				lineHeight='20px'
				fontWeight='500'
				textAlign='center'
			>
				Verified Owner
			</Text>

			<Text
				mt={2}
				mb={4}
				fontSize='14px'
				lineHeight='20px'
				fontWeight='400'
				textAlign='center'
			>
				{isEvmChain ? gnosisSafeAddress : phantomWallet?.publicKey?.toString()}
			</Text>
		</>
	)
}

export default SafeOwner
