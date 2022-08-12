
import React, { useContext, useEffect, useState } from 'react'
import {
	Button,
	Flex } from '@chakra-ui/react'
import NavbarLayout from '../src/layout/navbarLayout'
import { BiconomyContext, WebwalletContext } from './_app'


function SignupWebwallet() {

	const { webwallet, switchNetwork, setWebwallet, setScwAddress, setNonce } = useContext(WebwalletContext)!
	const { setBiconomyDaoObj } = useContext(BiconomyContext)!
	const [number] = useState<string>('one')

	useEffect(() => {
		switchNetwork(5)
	}, [])


	const handleSendGaslessTransaction = async(e: any) => {
		e.preventDefault()
		// const apiKK = await addDapp("goerli-testing-dapp", '5', process.env.BICO_AUTH_TOKEN);
		// registerWebHook(process.env.BICO_AUTH_TOKEN!, "qypYydNmh.85fb44d4-bc3a-4434-8e51-a929f54de521");
	}

	return (
		<Flex
			width='100%'
			flexDir='row'
			justifyContent='center'>
			{number}
			{
				webwallet && (
					<form onSubmit={() => {}}>
						<Button
							mt={4}
							colorScheme='teal'
							type='submit'>
                        Initiate Biconomy
						</Button>
					</form>
				)
			}
			<form onSubmit={handleSendGaslessTransaction}>
				<Button
					mt={4}
					colorScheme='teal'
					type='submit'>
                    Send Transaction
				</Button>
			</form>
		</Flex>
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
