import { ChangeEvent, useEffect, useState } from 'react'
import { Button, Flex, Text } from '@chakra-ui/react'
import { logger } from 'ethers'
import NavbarLayout from 'src/layout/navbarLayout'
import { isValidEthereumAddress, isValidSolanaAddress } from 'src/utils/validationUtils'
import TextField from 'src/v2/components/InputFields/TextField'
import Address from 'src/v2/components/Safe/Address'


function Safe() {
	const [step, setStep] = useState<number>(0)

	const [safeAddress, setSafeAddress] = useState<string>('')
	const [isVerified, setIsVerified] = useState<boolean>(false)
	const [safeAddressError, setSafeAddressError] = useState<string>()

	useEffect(() => {
		setSafeAddressError('')
	}, [safeAddress])


	const [isLoading, setIsLoading] = useState<boolean>()

	const STEPS = [
		<Address
			key={0}
			safeAddress={safeAddress}
			onChange={
				(e) => {
					if(!isLoading) {
						setSafeAddress(e.target.value)
					}
				}
			}
			onPasteClick={
				async() => {
					let clipboardContent = await navigator.clipboard.readText()
					logger.info({ clipboardContent }, 'Clipboard content')
					clipboardContent = clipboardContent.substring(clipboardContent.indexOf(':') + 1)
					logger.info({ clipboardContent }, 'Clipboard content (formatted)')
					if(isValidEthereumAddress(clipboardContent) || isValidSolanaAddress(clipboardContent)) {
						setSafeAddress(clipboardContent)
					} else {
						setSafeAddressError('The address you are trying to paste is not a valid Ethereum or Solana address.')
					}
				}
			}
			isVerified={isVerified}
			isDisabled={step !== 0}
			safeAddressError={safeAddressError}
			onContinue={() => {}} />
	]

	return (
		<Flex
			bg='#F5F5F5'
			direction='column'
			w='100%'
			px={8}
			py={6}>
			<Text
				variant='v2_heading_3'
				fontWeight='700'>
				Safe
			</Text>
			<Flex
				mt={4}
				py={10}
				w='100%'
				borderRadius='4px'
				boxShadow='inset 1px 1px 0px #F0F0F7, inset -1px -1px 0px #F0F0F7'
				bg='white'
				direction='column'
			 >
				{STEPS[step]}
			</Flex>
		</Flex>
	)
}

Safe.getLayout = function(page: React.ReactElement) {
	return (
		<NavbarLayout renderGetStarted>
			{page}
		</NavbarLayout>
	)
}

export default Safe