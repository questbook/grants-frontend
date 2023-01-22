import { ReactElement, useContext, useEffect, useRef, useState } from 'react'
import * as Apollo from '@apollo/client'
import {
	Divider,
	Flex,
	Image,
	Text,
	ToastId,
	useToast,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import Accept from 'src/components/your_grants/applicant_form/accept/accept'
import AcceptSidebar from 'src/components/your_grants/applicant_form/accept/sidebar'
import Application from 'src/components/your_grants/applicant_form/application'
import Reject from 'src/components/your_grants/applicant_form/reject/reject'
import RejectSidebar from 'src/components/your_grants/applicant_form/reject/sidebar'
import Resubmit from 'src/components/your_grants/applicant_form/resubmit/resubmit'
import ResubmitSidebar from 'src/components/your_grants/applicant_form/resubmit/sidebar'
import ReviewerSidebar from 'src/components/your_grants/applicant_form/reviewerSiderbar'
import Sidebar from 'src/components/your_grants/applicant_form/sidebar'
import { defaultChainId } from 'src/constants/chains'
import {
	GetApplicationDetailsQuery, GetApplicationDetailsQueryVariables,
	useGetApplicationDetailsQuery,
} from 'src/generated/graphql'
import { useQuestbookAccount } from 'src/hooks/gasless/useQuestbookAccount'
import useUpdateApplicationState from 'src/hooks/useUpdateApplicationState'
import useCustomToast from 'src/hooks/utils/useCustomToast'
import NavbarLayout from 'src/libraries/ui/navbarLayout'
import { ApiClientsContext } from 'src/contexts/ApiClientsContext'
import { useEncryptPiiForApplication } from 'src/utils/pii'
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils'

function ApplicantForm() {
	const { subgraphClients, workspace } = useContext(ApiClientsContext)!

	const toastRef = useRef<ToastId>()

	const toast = useToast()
	const router = useRouter()
	const [step, setStep] = useState(0)

	const [isAdmin, setIsAdmin] = useState(false)
	const { data: accountData } = useQuestbookAccount()

	const [applicationId, setApplicationId] = useState<string>('')
	const [applicationData, setApplicationData] =
		useState<GetApplicationDetailsQuery['grantApplication']>(null)
	const [submitClicked, setSubmitClicked] = useState(false)

	const [resubmitComment, setResubmitComment] = useState('')
	const [resubmitCommentError, setResubmitCommentError] = useState(false)

	const [rejectionComment, setRejectionComment] = useState('')
	const [rejectionCommentError, setRejectionCommentError] = useState(false)

	const chainId = getSupportedChainIdFromWorkspace(workspace) || defaultChainId

	const client = subgraphClients[chainId].client

	const [queryParams, setQueryParams] = useState<Apollo.QueryHookOptions<GetApplicationDetailsQuery, GetApplicationDetailsQueryVariables>>({ client })
	const { data, } = useGetApplicationDetailsQuery(queryParams)

	const [state, setState] = useState<number>()
	const [networkTransactionModalStep, setNetworkTransactionModalStep] = useState<number>()


	const [txn, txnLink, loading, isBiconomyInitialised, error] = useUpdateApplicationState(
		state === 1 ? resubmitComment : rejectionComment,
		applicationData?.id,
		state,
		submitClicked,
		setSubmitClicked,
		setNetworkTransactionModalStep,
	)

	const { setRefresh } = useCustomToast(txnLink)

	const { decrypt } = useEncryptPiiForApplication(
		data?.grantApplication?.grant?.id,
		data?.grantApplication?.applicantPublicKey,
		chainId
	)

	useEffect(() => {
		if(workspace?.members && workspace.members.length > 0) {
			const tempMember = workspace.members.find(
				(m) => m.actorId.toLowerCase() === accountData?.address?.toLowerCase(),
			)
			setIsAdmin(
				tempMember?.accessLevel === 'admin' ||
				tempMember?.accessLevel === 'owner',
			)
		}
	}, [accountData?.address, workspace])

	useEffect(() => {
		if(router?.query) {
			const { applicationId: aId } = router.query
			setApplicationId(aId as string)
		}
	}, [router])

	useEffect(() => {
		if(!workspace) {
			return
		}

		if(!applicationId) {
			return
		}

		setQueryParams({
			client:
				subgraphClients[getSupportedChainIdFromWorkspace(workspace)!].client,
			variables: {
				applicationID: applicationId,
			},
		})
	}, [workspace, applicationId])

	useEffect(() => {
		decrypt(data?.grantApplication).then(setApplicationData)
	}, [data?.grantApplication, setApplicationData, decrypt])

	useEffect(() => {
		if(router.query.flow === 'approved') {
			setStep(1)
		} else if(router.query.flow === 'rejected') {
			setStep(2)
		}
	}, [router])

	useEffect(() => {
		if(txn) {
			setState(undefined)
			router.replace({
				pathname: '/your_grants/view_proposals',
				query: {
					grantId: applicationData?.grant?.id,
				},
			})
			setRefresh(true)
		} else if(error) {
			setState(undefined)
		}
	}, [toastRef, toast, router, applicationData, txn, error])

	const handleApplicationStateUpdate = async(st: number) => {
		// // console.log('unsetting state');
		setState(undefined)
		if(st === 1 && resubmitComment === '') {
			setResubmitCommentError(true)
			return
		}

		if(st === 3 && rejectionComment === '') {
			setRejectionCommentError(true)
			return
		}

		// // console.log('setting state');
		setSubmitClicked(true)
		setState(st)
	}

	function renderContent(currentStep: number) {
		if(currentStep === 1) {
			return (
				<>
					<Accept
						// onSubmit={handleAcceptApplication}
						onSubmit={() => handleApplicationStateUpdate(2)}
						applicationData={applicationData}
						hasClicked={loading}
					/>
					<AcceptSidebar
						applicationData={applicationData}
					/>
				</>
			)
		}

		if(currentStep === 2) {
			return (
				<>
					<Reject
						onSubmit={() => handleApplicationStateUpdate(3)}
						hasClicked={loading}
						comment={rejectionComment}
						setComment={setRejectionComment}
						commentError={rejectionCommentError}
						setCommentError={setRejectionCommentError}
					/>
					<RejectSidebar
						applicationData={applicationData}
					/>
				</>
			)
		}

		return (
			<>
				<Resubmit
					onSubmit={() => handleApplicationStateUpdate(1)}
					hasClicked={loading}
					comment={resubmitComment}
					setComment={setResubmitComment}
					commentError={resubmitCommentError}
					setCommentError={setResubmitCommentError}
				/>
				<ResubmitSidebar
					applicationData={applicationData}
				/>
			</>
		)
	}

	if(step === 0) {
		return (
			<>
				<Flex
					direction='row'
					w='100%'
					mx='auto'>
					<Flex
						direction='column'
						w='100%'
						mx='44px'
						p={0}
						h='100%'>
						<Text
							mt='18px'
							mb={6}
							variant='heading'>
							{applicationData?.grant?.title || ''}
						</Text>
						<Flex
							direction='row'
							w='100%'
							justify='space-between'>
							<Flex
								direction='column'
								w='65%'
								align='start'>
								<Flex
									direction='column'
									alignItems='stretch'
									pb={8}
									w='100%'>
									{
										applicationData && applicationData?.state === 'rejected' && (
											<Flex
												alignItems='flex-start'
												bgColor='#FFC0C0'
												border='2px solid #EE7979'
												px='26px'
												py='22px'
												borderRadius='6px'
												my={4}
												mx={10}
												alignSelf='stretch'
											>
												<Flex
													alignItems='center'
													justifyContent='center'
													bgColor='#F7B7B7'
													border='2px solid #EE7979'
													borderRadius='40px'
													p={2}
													h='40px'
													w='40px'
													mt='5px'
												>
													<Image
														h='40px'
														w='40px'
														src='/ui_icons/result_rejected_application.svg'
														alt='Rejected'
													/>
												</Flex>
												<Flex
													ml='23px'
													direction='column'>
													<Text
														fontSize='16px'
														lineHeight='24px'
														fontWeight='700'
														color='#7B4646'
													>
														Application Rejected
													</Text>
													<Text
														fontSize='16px'
														lineHeight='24px'
														fontWeight='400'
														color='#7B4646'
													>
														{applicationData?.feedbackDao}
													</Text>
												</Flex>
											</Flex>
										)
									}

									{
										applicationData && applicationData?.state === 'resubmit' && (
											<Flex
												alignItems='flex-start'
												bgColor='#FEF6D9'
												border='2px solid #EFC094'
												px='26px'
												py='22px'
												borderRadius='6px'
												my={4}
												mx={10}
												alignSelf='stretch'
											>
												<Flex
													alignItems='center'
													justifyContent='center'
													h='36px'
													w='42px'
												>
													<Image
														h='40px'
														w='40px'
														src='/ui_icons/alert_triangle.svg'
														alt='Resubmit'
													/>
												</Flex>
												<Flex
													ml='23px'
													direction='column'>
													<Text
														fontSize='16px'
														lineHeight='24px'
														fontWeight='700'
														color='#7B4646'
													>
														Request for Resubmission
													</Text>
													<Text
														fontSize='16px'
														lineHeight='24px'
														fontWeight='400'
														color='#7B4646'
													>
														{applicationData?.feedbackDao}
													</Text>
												</Flex>
											</Flex>
										)
									}

									<Flex direction='column'>
										<Application
											applicationData={applicationData}
										/>
									</Flex>
								</Flex>
							</Flex>
							<Flex
								direction='column'
								mt={2}
								ml={4}
								w={400}
								alignItems='stretch'
								pos='sticky'
								top='36px'
							>
								{
									[
										...applicationData?.pendingReviewerAddresses ?? [],
										...applicationData?.doneReviewerAddresses ?? [],
									].find(
										(pendingReviewer) => pendingReviewer.toLowerCase() ===
											accountData?.address?.toLowerCase(),
									) !== undefined && (
										<ReviewerSidebar applicationData={applicationData} />
									)
								}
								{
									isAdmin && (
										<Sidebar
											isBiconomyInitialised={isBiconomyInitialised}
											applicationData={applicationData}
											onAcceptApplicationClick={() => setStep(1)}
											onRejectApplicationClick={() => setStep(2)}
											onResubmitApplicationClick={() => setStep(3)}
										/>
									)
								}
							</Flex>
						</Flex>
					</Flex>
				</Flex>
			</>
		)
	}

	return (
		<Flex
			direction='column'
			w='70%'
			mx='auto'>
			<Flex
				direction='column'
				mx={10}
				w='100%'>
				<Text
					mt={4}
					mb={4}
					variant='heading'>
					{applicationData?.grant?.title}
				</Text>
				<Divider mb={5} />
				<Flex
					maxW='100%'
					direction='row'
					justify='space-between'>
					{renderContent(step)}
				</Flex>
			</Flex>
		</Flex>
	)
}

ApplicantForm.getLayout = function(page: ReactElement) {
	return (
		<NavbarLayout>
			{page}
		</NavbarLayout>
	)
}

export default ApplicantForm
