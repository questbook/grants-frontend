import { useContext, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Button, Container, Drawer, DrawerContent, DrawerOverlay, Flex, Text, ToastId, useToast } from '@chakra-ui/react'
import ErrorToast from 'src/components/ui/toasts/errorToast'
import { SupportedChainId } from 'src/constants/chains'
import { GetReviewersForAWorkspaceQuery, RubricItem } from 'src/generated/graphql'
import useQBContract from 'src/hooks/contracts/useQBContract'
import { useBiconomy } from 'src/hooks/gasless/useBiconomy'
import { useQuestbookAccount } from 'src/hooks/gasless/useQuestbookAccount'
import { ApiClientsContext, WebwalletContext } from 'src/pages/_app'
import { SidebarReviewer, SidebarRubrics } from 'src/types'
import getErrorMessage from 'src/utils/errorUtils'
import { bicoDapps, chargeGas, getTransactionDetails, sendGaslessTransaction } from 'src/utils/gaslessUtils'
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils'
import { CancelCircleFilled } from 'src/v2/assets/custom chakra icons/CancelCircleFilled'
import { FishEye } from 'src/v2/assets/custom chakra icons/FishEye'
import AssignReviewers from 'src/v2/payouts/SetupEvaluationDrawer/AssignReviewers'
import RubricsForm from 'src/v2/payouts/SetupEvaluationDrawer/RubricsForm'

const MAX_REVIEWER_COUNT = 5

const SetupEvaluationDrawer = ({
	isOpen,
	onClose,
	onComplete,
	grantAddress,
	chainId,
	setNetworkTransactionModalStep,
	setTransactionHash,
	data,
}: {
	isOpen: boolean
	onClose: () => void
	onComplete: () => void
	grantAddress: string
	chainId?: SupportedChainId
	setNetworkTransactionModalStep: (step: number | undefined) => void
	setTransactionHash: (hash: string) => void
	data: GetReviewersForAWorkspaceQuery | undefined
}) => {
	const [step, setStep] = useState(0)
	const { workspace, validatorApi, subgraphClients } = useContext(ApiClientsContext)!

	// Setting up rubrics
	const [isPrivateReviews, setIsPrivateReviews] = useState(false)
	const [rubrics, setRubrics] = useState<SidebarRubrics[]>([{ index: 0, criteria: '', description: '' }])
	const [canContinue, setCanContinue] = useState(false)
	// Assigning reviewers
	const defaultSliderValue = 1
	const [numOfReviewersPerApplication, setNumOfReviewersPerApplication] = useState(defaultSliderValue)
	const [reviewers, setReviewers] = useState<SidebarReviewer[]>([])

	const { t } = useTranslation()

	const toastRef = useRef<ToastId>()
	const toast = useToast()

	const applicationReviewContract = useQBContract('reviews', chainId)

	const { webwallet } = useContext(WebwalletContext)!
	const { biconomyDaoObj: biconomy, biconomyWalletClient, scwAddress } = useBiconomy({
		chainId: chainId?.toString()!
		// targetContractABI: GrantFactoryAbi,
	})

	const { nonce } = useQuestbookAccount()

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

	const onReviewerChange = (reviewer: SidebarReviewer) => {
		const temp = [...reviewers]
		temp[reviewer.index].isSelected = !temp[reviewer.index].isSelected
		setReviewers(temp)
	}

	useEffect(() => {
		for(const rubric of rubrics) {
			if(!rubric.criteria || rubric.criteria.length === 0 || !rubric.description || rubric.description.length === 0) {
				setCanContinue(false)
				return
			}
		}

		setCanContinue(true)
	}, [rubrics])

	useEffect(() => {
		const temp: SidebarReviewer[] = []
		let i = 0
		data?.workspaces[0].members.forEach((member) => {
			temp.push({ isSelected: false, data: member, index: i })
			++i
		}
		)
		setReviewers(temp)
	}, [data])

	const onInitiateTransaction = async() => {
		setNetworkTransactionModalStep(0)

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

			const rubric: {[_ in string]: {
				title: SidebarRubrics['criteria']
				details: SidebarRubrics['description']
				maximumPoints: RubricItem['maximumPoints']
			}} = {}

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
					isPrivate: isPrivateReviews,
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
			// console.log('Workspace ID: ', workspaceId)

			// console.log('(Auto - assign) Workspace ID: ', workspaceId)
			// console.log('(Auto - assign) Grant Address: ', grantAddress)
			// console.log('(Auto - assign) Reviewers: ', reviewers.filter((reviewer: SidebarReviewer) => reviewer.isSelected).map((reviewer: SidebarReviewer) => reviewer.data.actorId))
			// console.log('(Auto - assign) Active Status: ', reviewers.filter((reviewer: SidebarReviewer) => reviewer.isSelected).map(() => true))
			// console.log('(Auto - assign) Reviewer Count: ', numOfReviewersPerApplication)

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
			// // console.log('RUBRIC AND AUTO ASSIGN: ', transactionData)

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
			setTransactionHash(receipt?.transactionHash)
			await subgraphClients[chainId].waitForBlock(receipt?.blockNumber)
			setNetworkTransactionModalStep(4)

			await chargeGas(Number(workspaceId || Number(workspace?.id).toString()), Number(txFee))
			setNetworkTransactionModalStep(5)
		} catch(e) {
			setNetworkTransactionModalStep(undefined)
			const message = getErrorMessage(e as Error)
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

	const TABS = [{ text: t('/your_grants/view_applicants.review_questions') }, { text: t('/your_grants/view_applicants.select_reviewers') }]

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
			<DrawerOverlay maxH='100vh' />
			<DrawerContent
				minW={528}
				// h="min(90vh, 560px)"
				overflowY='auto'
				borderRadius='4px'>
				<Container
					px={6}
					py={4}
					display='flex'
					flexDirection='column'
					minH='100vh'
				>


					<Flex
						direction='row'
						align='center'>


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
						mx='-24px'
						bg='#F0F0F7'
						h='1px'
					/>

					<Flex
						maxH='calc(100vh - 32px)'
						overflowY='auto'
						direction='column'>
						<Flex justify='stretch'>
							{
								TABS.map((tab, index) => {
									return (
										<Flex
											ml={index === 0 ? 0 : 1}
											key={index}
											direction='column'
											w='100%'
											align='start'
										>
											<Box
												w='100%'
												bg={step === index ? '#785EF0' : '#E0E0EC'}
												borderRadius='20px'
												height={1}
											/>

											<Button
												onClick={
													() => {
														setStep(index)
													}
												}
												mt={2}
												variant='link'
												leftIcon={
													step === index ? (
														<FishEye
															h='14px'
															w='14px'
															color='#785EF0' />
													) : (
														<Box
															border='1px solid #E0E0EC'
															borderRadius='20px'
															height='14px'
															width='14px'
														/>
													)
												}>
												<Text
													fontSize='12px'
													lineHeight='16px'
													fontWeight='500'
													ml={1}
													color={step === index ? '#785EF0' : '#1F1F33'}
												>
													{tab.text}
												</Text>
											</Button>
										</Flex>
									)
								})
							}
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
									/** shouldn't be selecting more than 1 reviewer, if num of reviewers is 0 */
									minCount={Math.min(1, reviewers.length)}
									maxCount={Math.min(reviewers.length, MAX_REVIEWER_COUNT)}
									defaultSliderValue={defaultSliderValue}
									sliderValue={numOfReviewersPerApplication}
									isPrivateReviews={isPrivateReviews}
									setIsPrivateReviews={setIsPrivateReviews}
									onSlide={setNumOfReviewersPerApplication}
									reviewers={reviewers}
									onReviewerChange={onReviewerChange}
								/>
							)
						}
					</Flex>

					<Flex
						mt='auto'
						bg='#F0F0F7'
						h='1px'
						mx='-24px'
					/>

					<Flex
						mt={4}
						direction='row'
						align='center'>

						<Button
							colorScheme='brandv2'
							disabled={
								(step === 0 && !canContinue)
								|| (step === 1 && (reviewers.filter(r => r.isSelected).length < numOfReviewersPerApplication || !numOfReviewersPerApplication))
							}
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
							{step === 0 ? t('/your_grants/view_applicants.select_reviewers_next') : t('/your_grants/view_applicants.review_process_save')}
						</Button>

					</Flex>


				</Container>
			</DrawerContent>
		</Drawer>
	)
}

export default SetupEvaluationDrawer
