
import React, { useContext, useEffect } from 'react'
import {
	Button,
	Flex
} from '@chakra-ui/react'
import { Wallet } from 'ethers'
import { BiconomyContext, WebwalletContext } from 'pages/_app'
import NavbarLayout from 'src/layout/navbarLayout'
import { registerWebHook } from 'src/utils/gaslessUtils'

function SignupWebwallet() {

	const { setWebwallet, setScwAddress, setNonce, switchNetwork } = useContext(WebwalletContext)!
	const { setBiconomyDaoObj } = useContext(BiconomyContext)!

	useEffect(() => {
		// localStorage.setItem('isBiconomyLoading', 'false');
	}, [])

	const handleReset = async(e: any) => {
		e.preventDefault()

		setNonce(undefined)
		setWebwallet(Wallet.createRandom())
		setScwAddress(undefined)
		setBiconomyDaoObj(undefined)
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

					<form onSubmit={handleReset}>
						<Button
							mt={4}
							colorScheme='teal'
							type='submit'>
							Reset
						</Button>
					</form>
				</Flex>
			</Flex>
		</>
	)
}

SignupWebwallet.getLayout = function(page: any) {
	return (
		<NavbarLayout>
			{page}
		</NavbarLayout>
	)
}

export default SignupWebwallet
