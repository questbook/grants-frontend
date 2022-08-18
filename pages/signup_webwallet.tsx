
import React, { useContext, useEffect, useState } from 'react'
import {
	Button,
	Flex } from '@chakra-ui/react'
import useQBContract from 'src/hooks/contracts/useQBContract'
import NavbarLayout from '../src/layout/navbarLayout'
import { BiconomyContext, WebwalletContext } from './_app'

function SignupWebwallet() {

	const { webwallet, switchNetwork, setWebwallet, setScwAddress, setNonce } = useContext(WebwalletContext)!
	const { setBiconomyDaoObj } = useContext(BiconomyContext)!
	const [number] = useState<string>('one')
	const workspaceRegistryContract = useQBContract('workspace', 5)
	const grantFactoryContract = useQBContract('grantFactory', 5)

	useEffect(() => {

	}, [])


	const handleSendGaslessTransaction = async(e: any) => {
		e.preventDefault()
		// const receipt = await getTransactionReceipt('0x6df907b588e171366a4b3369741b7da7e018e8cbe4aef20602145bf33f3e2dfc', '5')
		// if(!receipt) {
		// 	return
		// }

		// console.log('gas', receipt.gasUsed.toBigInt())
		// console.log('gas', Number(receipt.cumulativeGasUsed.toBigInt()))
		// const ethValue = ethers.utils.formatEther(Number(receipt.gasUsed.toBigInt()));
		// console.log("gas", ethValue);


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
