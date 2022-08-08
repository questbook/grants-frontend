
import React, { useContext, useEffect, useState } from 'react'
import {
	Button,
	Flex } from '@chakra-ui/react'
import { Contract } from 'ethers'
import { BiconomyWalletClient } from 'src/types/gasless'
import NavbarLayout from '../src/layout/navbarLayout'
import { BiconomyContext, WebwalletContext } from './_app'
import { addDapp, apiKey, jsonRpcProviders, registerWebHook } from 'src/utils/gaslessUtils'

function SignupWebwallet() {

	const { webwallet } = useContext(WebwalletContext)!
	const [number] = useState<string>('one')

	useEffect(() => {
		
	}, [])


	const handleSendGaslessTransaction = async(e: any) => {
		e.preventDefault()
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
