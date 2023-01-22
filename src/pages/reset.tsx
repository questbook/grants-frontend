
import React, { ReactElement, useContext, useEffect } from 'react'
import {
	Button,
	Flex
} from '@chakra-ui/react'
import { Wallet } from 'ethers'
import { BiconomyContext } from 'src/contexts/BiconomyContext'
import { WebwalletContext } from 'src/contexts/WebwalletContext'
import NavbarLayout from 'src/libraries/ui/navbarLayout'

function SignupWebwallet() {
	const { setWebwallet, setScwAddress, setNonce } = useContext(WebwalletContext)!
	const { setBiconomyDaoObjs } = useContext(BiconomyContext)!

	useEffect(() => {
		// localStorage.setItem('isBiconomyLoading', 'false');
	}, [])

	const handleReset = async() => {
		setNonce(undefined)
		setWebwallet(Wallet.createRandom())
		setScwAddress(undefined)
		setBiconomyDaoObjs(undefined)
	}

	return (
		<>
			<Flex
				width='100%'
				flexDir='column'
				justifyContent='center'>
				<Flex
					width='100%'
					flexDir='row'
					justifyContent='center'>
					This will delete your webwallet and all your data!

				</Flex>
				<Flex
					width='100%'
					flexDir='row'
					justifyContent='center'>

					<Button
						mt={4}
						onClick={handleReset}
						colorScheme='teal'>
						Reset
					</Button>
				</Flex>
			</Flex>
		</>
	)
}

SignupWebwallet.getLayout = function(page: ReactElement) {
	return (
		<NavbarLayout>
			{page}
		</NavbarLayout>
	)
}

export default SignupWebwallet
