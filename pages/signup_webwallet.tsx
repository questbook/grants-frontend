
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

	}, [])


	const handleSendGaslessTransaction = async(e: any) => {
		e.preventDefault()
		const zob = async() => {
			const x = new Promise(r => setTimeout(r, 2000))
			x.then((x) => console.log('awaited 2000??'))
			console.log('didn"t await')
		}

		zob().then((y) => console.log('REALLy'))

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
