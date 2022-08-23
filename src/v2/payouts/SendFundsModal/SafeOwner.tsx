import { useState } from 'react'
import { Flex, Image, Text, VStack } from '@chakra-ui/react'
import { MetamaskFox } from 'src/v2/assets/custom chakra icons/SupportedWallets/MetamaskFox'
import { WalletConnectLogo } from 'src/v2/assets/custom chakra icons/SupportedWallets/WalletConnectLogo'
import ConnectWalletButton from 'src/v2/components/ConnectWalletModal/ConnectWalletButton'

const availableWallets = [{
	name: 'Metamask',
	icon: <MetamaskFox
		h={8}
		w={'33px'} />,
	isPopular: true,
	id: 'injected',
}, {
	name: 'WalletConnect',
	icon: <WalletConnectLogo
		h={8}
		w={'33px'} />,
	isPopular: false,
	id: 'walletConnect'
}]

const SafeOwner = ({ onVerified }: {onVerified: () => void}) => {
	const [verified, setVerified] = useState(false)
	if(!verified) {
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
					direction={'column'}
					w={'full'}
					spacing={4}
					alignItems='stretch'
				>
					{
						availableWallets.map((wallet, index) => (
							<ConnectWalletButton
								maxW='100%'
								key={index}
								icon={wallet.icon}
								name={wallet.name}
								isPopular={wallet.isPopular}
								onClick={
									() => {
									// const connector = connectors.find((x) => x.id === wallet.id)
									// // setConnectClicked(true)
									// if(connector) {
									// 	connect(connector)
									// }

										setVerified(true)
										onVerified()
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
				justifyContent={'center'}
				py={'24px'}>
				<Image
					boxSize='48px'
					src='/ThumbsUpSafe.svg' />
			</Flex>

			<Text
				fontSize='14px'
				lineHeight='20px'
				fontWeight='500'
				textAlign={'center'}
			>
				Verified Owner
			</Text>

			<Text
				mt={2}
				mb={4}
				fontSize='14px'
				lineHeight='20px'
				fontWeight='400'
				textAlign={'center'}
			>
				0xBcz0a1920CF4E20D2c422027Cf4BE5dA09B8Fc55
			</Text>
		</>
	)
}

export default SafeOwner