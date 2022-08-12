
import React, { useContext, useEffect, useState } from 'react'
import {
	Button,
	Flex } from '@chakra-ui/react'
import NavbarLayout from '../src/layout/navbarLayout'
import { BiconomyContext, WebwalletContext } from './_app'
import { addDapp, jsonRpcProviders, registerWebHook } from 'src/utils/gaslessUtils'
import {ethers} from 'ethers';
import WorkspaceRegistryAbi from 'src/contracts/abi/WorkspaceRegistryAbi.json'
import GrantFactoryAbi from 'src/contracts/abi/GrantFactoryAbi.json'


function SignupWebwallet() {

	const { webwallet, switchNetwork, setWebwallet, setScwAddress, setNonce } = useContext(WebwalletContext)!
	const { setBiconomyDaoObj } = useContext(BiconomyContext)!
	const [number] = useState<string>('one')
	
	useEffect(() => {
		switchNetwork(5);
	}, [])


	const handleSendGaslessTransaction = async(e: any) => {
		e.preventDefault();
		// const apiKK = await addDapp("goerli-testing-dapp", '5', process.env.BICO_AUTH_TOKEN);    
		// registerWebHook(process.env.BICO_AUTH_TOKEN!, "qypYydNmh.85fb44d4-bc3a-4434-8e51-a929f54de521");

		const wallet = new ethers.Wallet("e1463f0cce09d1c645ae6ea5afdb56b0302b42a62d2e8d4192743a9f7d5b8d01", jsonRpcProviders["5"])
		const contract = new ethers.Contract("0xf08bCcf3C9DE7Daf25BCe13C87D0dd69754E0a33", 
		GrantFactoryAbi, wallet);
		await contract.createGrant("1", "bafkreid4iqralm4cxstxkv5jgy763xit7gfyla3wqimobn675x72cr6ii4",
		"bafkreiewmydvuser5nribk7qcpfjhxb35wajqonbgaxq47o36ligo6ysvm", "0x2dB223158288B2299480aF577eDF30D5a533F137",
		"0xF4Db8BdDF1029764e4E09e7cE34149371a9A7027");
		console.log("zob contract", contract);
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
