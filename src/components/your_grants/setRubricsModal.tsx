import React, { useContext, useEffect, useState } from 'react'
import { AlertDialogOverlay, Box, Button, Flex, Heading, Image, Modal, ModalBody, ModalContent, Text } from '@chakra-ui/react'
import { ApiClientsContext } from 'pages/_app'
import { SupportedChainId } from 'src/constants/chains'
import { useGetRubricsForWorkspaceMemberQueryQuery } from 'src/generated/graphql'
import useSetRubrics from 'src/hooks/useSetRubrics'
import {
	getSupportedChainIdFromWorkspace,
} from 'src/utils/validationUtils'
import { Organization } from 'src/v2/assets/custom chakra icons/Organization'
import { NetworkSelectOption } from 'src/v2/components/Onboarding/SupportedNetworksData'
import ModalStep from 'src/v2/components/Onboarding/UI/CreateDaoModal/ModalStep'
import { useAccount } from 'wagmi'

const SetRubricsModal = ({
	isOpen,
	setIsOpen,
	onClose,
	rubrics,
	chainId,
	workspaceId,
	grantAddress,
	daoName,
	daoNetwork,
	daoImageFile,
	steps,
	// currentStep,
}: {
	isOpen: boolean,
	setIsOpen : (val: any) => void,
	onClose: () => void,
	rubrics:any,
	redirect?: () => void,
	grantAddress: string;
	chainId: SupportedChainId;
	workspaceId: string;
  daoName: string | undefined,
  daoNetwork: NetworkSelectOption | undefined,
	daoImageFile: File | null,
	steps: string[],
	// currentStep: number | undefined,
}) => {
	const [isDone, setIsDone] = useState(false)
	const [currentStep, setCurrentStep] = useState<number | undefined>(1)
	const { subgraphClients, workspace } = useContext(ApiClientsContext)!
	const [queryParams, setQueryParams] = useState<any>({
		client:
			subgraphClients[
				getSupportedChainIdFromWorkspace(workspace) || 4
			].client,
	})

	const { data: accountData } = useAccount()
	useEffect(() => {
		const addr = accountData?.address?.toLowerCase()

		setQueryParams({
			client:
				subgraphClients[chainId].client,
			variables: {
				id:addr
			},
		})
	}, [workspace, accountData])

	const { data: queryData, loading, error: queryError } = useGetRubricsForWorkspaceMemberQueryQuery(queryParams)
	const [rubricsData, rubricsTransaction, rubricsTxnConfirmed, rubricsLoading, rubricsError] = useSetRubrics(rubrics, chainId, workspaceId, grantAddress)

	useEffect (() => {
		if(rubricsTxnConfirmed && currentStep === 1) {
			setCurrentStep(2)
		} else if(rubricsData && currentStep === 2) {
			setCurrentStep(3)
		} else if(queryData && currentStep === 3) {
			setCurrentStep(4)
		} else if(currentStep === 4) {
			setTimeout(() => {
				setCurrentStep(undefined)
				setIsDone(true)
					 		}, 2000)

		}

	}, [rubricsData, rubricsLoading, rubricsTxnConfirmed, queryData, loading, queryError, currentStep])

	useEffect (() => {
		if(isDone) {
			setIsOpen(false)
		}
	}, [setIsOpen, isDone])
	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			isCentered
			scrollBehavior={'outside'}
			size={'md'}
		>
			<AlertDialogOverlay
				background={'rgba(240, 240, 247, 0.7)'}
				backdropFilter={'blur(10px)'}
			/>

			<ModalContent
				boxShadow={'none'}
				filter={'drop-shadow(2px 4px 40px rgba(31, 31, 51, 0.05))'}
				borderRadius={'base'}
				fontFamily={'Neue-Haas-Grotesk-Display, sans-serif'}
				fontSize={'1rem'}
			>
				<ModalBody
					p={0}
				>
					<Heading
						fontSize={'2xl'}
						m={8}
						mb={5}>
            Setting up applicant evaluation on-chain..
					</Heading>

					<Flex
						py={3}
						px={8}
						bg={'brandGrey.500'}
					>

						<Box pos={'relative'}>
							<Button
								bg={'#C2E7DA'}
								boxSize={'48px'}
								overflow={'hidden'}
								boxShadow={'0px 2px 0px #1f1f331a !important'}
							>
								{
									daoImageFile ? (
										<Image
											objectFit="cover"
											src={URL.createObjectURL(daoImageFile)}
											w="100%"
											h="100%"
											minH={'48px'}
											minW={'48px'}
										/>
									) : (

										<Organization
											color={'#389373'}
											boxSize={8} />
									)
								}
							</Button>
						</Box>

						<Flex
							ml={4}
							direction={'column'}>
							<Text
								fontWeight={'500'}
								fontSize={'17px'}
							>
								{daoName}
							</Text>
							<Box
								display={'inline-flex'}
								alignItems={'center'}
								p={0}
								m={0}
								mt={'3.32px'}
							>
								<Box boxSize={5}>
									{daoNetwork?.icon}
								</Box>
								<Text
									ml={1}
									mt={'1.5px'}
									fontSize={'sm'}
									color={'brandSubtext'}
								>
									{daoNetwork?.label}
								</Text>
							</Box>
						</Flex>
					</Flex>

					<Box mt={4} />

					{
						steps.map((step, index) => (
							<ModalStep
								key={`create-dao-step${index}`}
								loadingFinished={index < (currentStep || -1)}
								loadingStarted={index === currentStep}
								step={step}
								index={index}
							/>
						))
					}

					<Box mt={4} />

				</ModalBody>
			</ModalContent>

		</Modal>
	)
}

export default SetRubricsModal