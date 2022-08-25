import { useContext, useEffect, useRef, useState } from 'react'
import { Box, Button, Container, Drawer, DrawerContent, DrawerOverlay, Flex, Text, ToastId, useToast } from '@chakra-ui/react'
import router from 'next/router'
import { ApiClientsContext, WebwalletContext } from 'pages/_app'
import ErrorToast from 'src/components/ui/toasts/errorToast'
import { defaultChainId, SupportedChainId } from 'src/constants/chains'
import { useGetReviewersForAWorkspaceQuery } from 'src/generated/graphql'
import useQBContract from 'src/hooks/contracts/useQBContract'
import { useBiconomy } from 'src/hooks/gasless/useBiconomy'
import { useQuestbookAccount } from 'src/hooks/gasless/useQuestbookAccount'
import { SidebarReviewer, SidebarRubrics } from 'src/types'
import getErrorMessage from 'src/utils/errorUtils'
import { bicoDapps, chargeGas, getTransactionDetails, sendGaslessTransaction } from 'src/utils/gaslessUtils'
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils'
import { CancelCircleFilled } from 'src/v2/assets/custom chakra icons/CancelCircleFilled'
import { FishEye } from 'src/v2/assets/custom chakra icons/FishEye'
import { SetupEvaluation } from 'src/v2/assets/custom chakra icons/SetupEvaluation'
import AssignReviewers from './AssignReviewers'
import RubricsForm from './RubricsForm'

const SetupEvaluationDrawer = ({
	isOpen,
	onClose,
	onComplete,
	grantAddress,
	chainId,
	setNetworkTransactionModalStep,
}: {
	isOpen: boolean;
	onClose: () => void;
	onComplete: () => void;
	grantAddress: string;
	chainId?: SupportedChainId;
	setNetworkTransactionModalStep: (step: number | undefined) => void;
}) => {

	const { subgraphClients, workspace, validatorApi } = useContext(ApiClientsContext)!
	const [queryParams, setQueryParams] = useState<any>({
		client:
			subgraphClients[
				getSupportedChainIdFromWorkspace(workspace) || defaultChainId
			].client,
	})
	const { data, loading, error } = useGetReviewersForAWorkspaceQuery(queryParams)
	useEffect(() => {
		if(!workspace) {
			return
		}

		setQueryParams({
			client:
				subgraphClients[getSupportedChainIdFromWorkspace(workspace)!].client,
			variables: {
				workspaceId: workspace.id
			},
		})
	}, [workspace])

	const [step, setStep] = useState(0)

	if(!chainId) {
		// eslint-disable-next-line no-param-reassign
		chainId = getSupportedChainIdFromWorkspace(workspace)
	}

	// Setting up rubrics
	const [rubrics, setRubrics] = useState<SidebarRubrics[]>([{ index: 0, criteria: '', description: '' }])

	const onRubricChange = (rubric: SidebarRubrics) => {
		const temp = [...rubrics]
		temp[rubric.index] = rubric
		setRubrics(temp)
	}

	const onRubricCriteriaAdd = () => {
		const temp = [...rubrics]
		temp.push({ index: temp.length, criteria: '', description: '' })
		setRubrics(temp)
	}

	const onRubricCriteriaDelete = (index: number) => {
		if(rubrics.length > 1) {
			const temp = [...rubrics]
			temp.splice(index, 1)
			setRubrics(temp)
		}
	}

	const [canContinue, setCanContinue] = useState(false)

	useEffect(() => {
		for(const rubric of rubrics) {
			if(!rubric.criteria || rubric.criteria.length === 0 || !rubric.description || rubric.description.length === 0) {
				setCanContinue(false)
				return
			}
		}

		setCanContinue(true)
	}, [rubrics])

	// Assigning reviewers
	const defaultSliderValue = 2
	const [numOfReviewersPerApplication, setNumOfReviewersPerApplication] = useState(defaultSliderValue)
	const [reviewers, setReviewers] = useState<SidebarReviewer[]>([])

	useEffect(() => {
		const temp: SidebarReviewer[] = []
		let i = 0
		data?.workspaces[0].members.forEach((member: any) => {
			temp.push({ isSelected: false, data: member, index: i })
			++i
		}
		)
		setReviewers(temp)
	}, [data])

	const onReviewerChange = (reviewer: SidebarReviewer) => {
		const temp = [...reviewers]
		temp[reviewer.index].isSelected = !temp[reviewer.index].isSelected
		setReviewers(temp)
	}

	const toastRef = useRef<ToastId>()
	const toast = useToast()

	const applicationReviewContract = useQBContract('reviews', chainId)

	const { webwallet, setWebwallet } = useContext(WebwalletContext)!
	const { biconomyDaoObj: biconomy, biconomyWalletClient, scwAddress } = useBiconomy({
		chainId: chainId?.toString()!
		// targetContractABI: GrantFactoryAbi,
	})

	const { nonce } = useQuestbookAccount()


	const onInitiateTransaction = async() => {
		setNetworkTransactionModalStep(0)

		console.log('Workspace: ', workspace)
		if(!workspace || !workspace?.id || !grantAddress) {
			return
		}

		chainId = getSupportedChainIdFromWorkspace(workspace)
		try {
			if(!biconomyWalletClient || typeof biconomyWalletClient === 'string' || !scwAddress) {
				throw new Error('Zero wallet is not ready')
			}

			if(!chainId) {
				return
			}
			// Commenting this to accommodate gasless
			// console.log('Chain ID: ', activeChain?.id, chainId)
			// if(activeChain?.id !== chainId) {
			// 	console.log('switching')
			// 	await switchNetwork!(chainId!)
			// 	console.log('create workspace again on contract object update')
			// 	setCallOnContractChange(true)
			// 	setTimeout(() => {
			// 		if(callOnContractChange && activeChain?.id !== chainId) {
			// 			setCallOnContractChange(false)
			// 			throw new Error('Error switching network')
			// 		}
			// 	}, 60000)
			// 	return
			// }

			const rubric = {} as any

			if(rubrics.length > 0) {
				rubrics.forEach((r: SidebarRubrics, index) => {
					rubric[index.toString()] = {
						title: r.criteria,
						details: r.description,
						maximumPoints: 5,
					}
				})
			}

			let rubricHash = ''

			setNetworkTransactionModalStep(1)
			const {
				data: { ipfsHash: auxRubricHash },
			} = await validatorApi.validateRubricSet({
				rubric: {
					isPrivate: false,
					rubric: rubric,
				},
			})

			if(!auxRubricHash) {
				// throw new Error('Error validating rubric data')
				setNetworkTransactionModalStep(undefined)
				return
			}

			rubricHash = auxRubricHash
			const workspaceId = Number(workspace?.id).toString()
			console.log('Workspace ID: ', workspaceId)

			console.log('(Auto - assign) Workspace ID: ', workspaceId)
			console.log('(Auto - assign) Grant Address: ', grantAddress)
			console.log('(Auto - assign) Reviewers: ', reviewers.filter((reviewer: SidebarReviewer) => reviewer.isSelected).map((reviewer: SidebarReviewer) => reviewer.data.actorId))
			console.log('(Auto - assign) Active Status: ', reviewers.filter((reviewer: SidebarReviewer) => reviewer.isSelected).map(() => true))
			console.log('(Auto - assign) Reviewer Count: ', numOfReviewersPerApplication)

			const methodArgs = [
				workspaceId,
				grantAddress,
				reviewers.filter((reviewer: SidebarReviewer) => reviewer.isSelected).map((reviewer: SidebarReviewer) => reviewer.data.actorId),
				reviewers.filter((reviewer: SidebarReviewer) => reviewer.isSelected).map(() => true),
				numOfReviewersPerApplication,
				rubricHash,
			]

			setNetworkTransactionModalStep(2)
			// const transaction = await applicationReviewContract.setRubricsAndEnableAutoAssign(
			// 	workspaceId,
			// 	grantAddress,
			// 	reviewers.filter((reviewer: SidebarReviewer) => reviewer.isSelected).map((reviewer: SidebarReviewer) => reviewer.data.actorId),
			// 	reviewers.filter((reviewer: SidebarReviewer) => reviewer.isSelected).map(() => true),
			// 	numOfReviewersPerApplication,
			// 	rubricHash,
			// )

			// setNetworkTransactionModalStep(3)
			// const transactionData = await transaction.wait()
			// console.log('RUBRIC AND AUTO ASSIGN: ', transactionData)

			const response = await sendGaslessTransaction(
				biconomy,
				applicationReviewContract,
				'setRubricsAndEnableAutoAssign',
				methodArgs,
				applicationReviewContract.address,
				biconomyWalletClient,
				scwAddress,
				webwallet,
				`${chainId}`,
				bicoDapps[chainId].webHookId,
				nonce
			)

			if(!response) {
				return
			}

			setNetworkTransactionModalStep(3)
			const { txFee, receipt } = await getTransactionDetails(response, chainId.toString())

			await chargeGas(Number(workspaceId || Number(workspace?.id).toString()), Number(txFee))

			console.log('Transaction DONE: ', receipt)

			setNetworkTransactionModalStep(4)
			setTimeout(() => {
				setNetworkTransactionModalStep(undefined)
				// router.push({ pathname: '/v2/your_grants/view_applicants/', query: { grantId: grantAddress } })
				router.reload()
			}, 3000)
			// setTransactionData(transactionData)
		} catch(e) {
			setNetworkTransactionModalStep(undefined)
			const message = getErrorMessage(e)
			toastRef.current = toast({
				position: 'top',
				render: () => ErrorToast({
					content: message,
					close: () => {
						if(toastRef.current) {
							toast.close(toastRef.current)
						}
					},
				}),
			})
		}

		onComplete()
	}

	return (
		<Drawer
			placement='right'
			isOpen={isOpen}
			onClose={
				() => {
					onClose()
				}
			}
			closeOnOverlayClick={false}
		>
			<DrawerOverlay maxH="100vh" />
			<DrawerContent
				minW={528}
				// h="min(90vh, 560px)"
				overflowY="auto"
				borderRadius="4px">
				<Container
					px={6}
					py={4}
					display='flex'
					flexDirection={'column'}
					minH='100vh'
				>


					<Flex
						direction="row"
						align="center">
						<Flex
							bg='#D1D7F4'
							h='48px'
							w='48px'
							borderRadius='2px'
							alignItems='center'
							justifyContent='center'
						>
							<SetupEvaluation
								color='#036AFF'
								h='28px'
								w='28px' />
						</Flex>

						<Flex
							ml={2}
							mr='auto'
							flexDirection='column'>
							<Text
								fontSize='20px'
								lineHeight='24px'
								fontWeight='500'
							>
								Setup applicant evaluation
							</Text>
							<Text
								fontSize='14px'
								lineHeight='20px'
								fontWeight='400'
								mt={1}
								color='#7D7DA0'
							>
								Define a scoring rubric and assign reviewers.
							</Text>
						</Flex>

						<CancelCircleFilled
							mb='auto'
							color='#7D7DA0'
							h={6}
							w={6}
							onClick={
								() => {
									onClose()
								}
							}
							cursor='pointer'
						/>
					</Flex>

					<Flex
						my={4}
						mx={'-24px'}
						bg='#F0F0F7'
						h={'1px'}
					/>

					<Flex
						maxH={'calc(100vh - 32px)'}
						overflowY={'scroll'}
						direction={'column'}>
						<Flex>
							<Flex
								flex={1}
								direction={'column'}
							>
								<Box
									bg={step === 0 ? '#785EF0' : '#E0E0EC'}
									borderRadius='20px'
									height={1}
								/>

								<Flex
									mt={2}
									color={step === 0 ? '#785EF0' : '#E0E0EC'}>
									{
										step === 0 ? (
											<FishEye
												h={'14px'}
												w={'14px'} />
										) : (
											<Box
												border='1px solid #E0E0EC'
												borderRadius='20px'
												height={'14px'}
												width={'14px'}
											/>
										)
									}
									<Text
										fontSize='12px'
										lineHeight='16px'
										fontWeight='500'
										ml={1}
										color={step === 0 ? '#785EF0' : '#1F1F33'}
									>
										Scoring rubric
									</Text>
								</Flex>
							</Flex>
							<Box w={1} />
							<Flex
								flex={1}
								direction={'column'}
							>
								<Box
									bg={step === 1 || step === 2 ? '#785EF0' : '#E0E0EC'}
									borderRadius='20px'
									height={1}
								/>

								<Flex
									mt={2}
									color={step === 1 || step === 2 ? '#785EF0' : '#E0E0EC'}>
									{
										step === 1 || step === 2 ? (
											<FishEye
												h={'14px'}
												w={'14px'} />
										) : (
											<Box
												border='1px solid #E0E0EC'
												borderRadius='20px'
												height={'14px'}
												width={'14px'}
											/>
										)
									}
									<Text
										fontSize='12px'
										lineHeight='16px'
										fontWeight='500'
										ml={1}
										color={step === 1 || step === 2 ? '#785EF0' : '#1F1F33'}
									>
										Assign reviewers
									</Text>
								</Flex>
							</Flex>
						</Flex>

						<Box mt={6} />

						{
							step === 0 ? (
								<RubricsForm
									rubrics={rubrics}
									onRubricChange={onRubricChange}
									onRubricCriteriaAdd={onRubricCriteriaAdd}
									onRubricCriteriaDelete={onRubricCriteriaDelete} />
							) : (
								<AssignReviewers
									minCount={1}
									maxCount={5}
									defaultSliderValue={defaultSliderValue}
									sliderValue={numOfReviewersPerApplication}
									onSlide={
										(value: number) => {
											setNumOfReviewersPerApplication(value)
										}
									}
									reviewers={reviewers}
									onReviewerChange={onReviewerChange}
								/>
							)
						}
					</Flex>

					<Flex
						mt={'auto'}
						bg='#F0F0F7'
						h={'1px'}
						mx={'-24px'}
					/>

					<Flex
						mt={4}
						direction="row"
						align="center">

						<Button
							ml='auto'
							colorScheme={'brandv2'}
							disabled={(step === 0 && !canContinue) || step === 1 && reviewers.filter(r => r.isSelected).length === 0}
							onClick={
								async() => {
									if(step === 0) {
										setStep(1)
									}

									if(step === 1) {
										await onInitiateTransaction()
									}
								}
							}>
							{step === 0 ? 'Continue' : 'Initiate Transaction'}
						</Button>

					</Flex>


				</Container>
			</DrawerContent>
		</Drawer>
	)
}

export default SetupEvaluationDrawer