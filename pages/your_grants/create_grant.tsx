import React, {
	ReactElement, useContext, useEffect, useRef, useState,
} from 'react'
import {
	Box,
	Button,
	Container,
	Flex,
	Text,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { ApiClientsContext } from 'pages/_app'
import Breadcrumbs from 'src/components/ui/breadcrumbs'
import Form from 'src/components/your_grants/create_grant/form'
import SupportedChainId from 'src/generated/SupportedChainId'
import { useNetwork } from 'src/hooks/gasless/useNetwork'
import useCreateGrant from 'src/hooks/useCreateGrant'
import useIntersection from 'src/hooks/utils/useIntersection'
import NavbarLayout from 'src/layout/navbarLayout'
import { delay } from 'src/utils/generics'
import logger from 'src/utils/logger'
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils'
import NetworkTransactionModal from 'src/v2/components/NetworkTransactionModal'

function CreateGrant() {
	const apiClients = useContext(ApiClientsContext)!
	const { workspace } = apiClients
	const { switchNetwork } = useNetwork()

	const router = useRouter()
	const [currentStep, setCurrentStep] = useState<number>()

	const [formData, setFormData] = useState<any>()
	const [, blockExplorerLink, loading] = useCreateGrant(formData, setCurrentStep)

	useEffect(() => {
		if(workspace) {
			const chainId = getSupportedChainIdFromWorkspace(workspace)
			// console.log(' (CREATE_GRANT) Switch Network: ', workspace, chainId)
			logger.info('SWITCH NETWORK (create-grant.tsx 1): ', chainId!.toString() as unknown as SupportedChainId)
			switchNetwork(chainId!.toString() as unknown as SupportedChainId)
		}
	}, [workspace])

	return (
		<Container
			maxW='100%'
			display='flex'
			px='70px'>
			<Container
				flex={1}
				display='flex'
				flexDirection='column'
				maxW='682px'
				alignItems='stretch'
				pb={8}
				px={10}
			>
				<Form
					onSubmit={(data: any) => {
						console.log('create grant form data', data)
						setFormData(data)}}
					hasClicked={loading}
				/>
			</Container>


			<NetworkTransactionModal
				isOpen={currentStep !== undefined}
				subtitle='Creating a grant'
				description={
					<Flex direction='column'>
						<Text
							variant='v2_title'
							fontWeight='500'
						>
							{formData?.title}
						</Text>
						<Text
							variant='v2_body'
						>
							{workspace?.title}
						</Text>
					</Flex>
				}
				currentStepIndex={currentStep || 0}
				steps={
					[
						'Uploading data to IPFS',
						'Signing transaction with in-app wallet',
						'Waiting for transaction to complete on chain',
						'Indexing transaction on graph protocol',
						'Grant created on-chain',
					]
				}
				viewLink={blockExplorerLink}
				onClose={
					async() => {
						router.push({ pathname: '/your_grants' })
					}
				} />
		</Container>
	)
}

CreateGrant.getLayout = function(page: ReactElement) {
	return (
		<NavbarLayout>
			{page}
		</NavbarLayout>
	)
}

export default CreateGrant
