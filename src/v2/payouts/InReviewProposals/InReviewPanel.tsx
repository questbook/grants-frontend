import { useContext, useEffect, useState } from 'react'
import { Badge, Box, Button, ButtonProps, Checkbox, Flex, forwardRef, Grid, GridItem, HStack, Menu, MenuButton, MenuItem, MenuList, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalOverlay, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { defaultChainId } from 'src/constants/chains'
import { GetGrantDetailsQuery } from 'src/generated/graphql'
import useBatchUpdateApplicationState from 'src/hooks/useBatchUpdateApplicationState'
import { ApiClientsContext } from 'src/pages/_app'
import { IApplicantData } from 'src/types'
import { getExplorerUrlForTxHash } from 'src/utils/formattingUtils'
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils'
import { AcceptApplication } from 'src/v2/assets/custom chakra icons/AcceptApplication'
import { RejectApplication } from 'src/v2/assets/custom chakra icons/RejectApplication'
import { ResubmitApplication } from 'src/v2/assets/custom chakra icons/ResubmitApplication'
import NetworkTransactionModal from 'src/v2/components/NetworkTransactionModal'
import InReviewRow from 'src/v2/payouts/InReviewProposals/InReviewRow'
import ZeroState from 'src/v2/payouts/InReviewProposals/ZeroState'

const InReviewPanel = ({
	applicantsData,
	grantData,
}: {
  applicantsData: IApplicantData[]
  grantData?: GetGrantDetailsQuery
}) => {
	const [checkedItems, setCheckedItems] = useState<boolean[]>(applicantsData.filter((item) => (0 === item.status)).map(() => false))
	const [checkedApplicationsIds, setCheckedApplicationsIds] = useState<number[]>([])
	const [isAcceptClicked, setIsAcceptClicked] = useState<boolean>(false)
	const [isRejectClicked, setIsRejectClicked] = useState<boolean>(false)
	const [isResubmitClicked, setIsResubmitClicked] = useState<boolean>(false)
	const [isConfirmClicked, setIsConfirmClicked] = useState<boolean>(false)

	const { workspace } = useContext(ApiClientsContext)!

	const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
	const [state, setState] = useState<number>(5)
	const [inReviewApplications, setInReviewApplications] = useState<IApplicantData[]>([])

	const someChecked = checkedItems.some((element) => {
		return element
	})
	const allChecked = checkedItems.length > 0 && checkedItems.every((element) => element === true)
	const router = useRouter()

	const isPrivate = !!grantData?.grants?.[0]?.rubric?.isPrivate

	useEffect(() => {
		setCheckedItems(applicantsData.filter((item) => (0 === item.status)).map(() => false))
	}, [applicantsData])

	const [subtitle, setSubtitle] = useState<string>('')

	useEffect(() => {
		if(isAcceptClicked) {
			setSubtitle('Accepting proposals')
		}

		if(isRejectClicked) {
			setSubtitle('Rejecting proposals')
		}

		if(isResubmitClicked) {
			setSubtitle('Resubmitting proposals')
		}

	}, [isAcceptClicked, isRejectClicked, isResubmitClicked])

	useEffect(() => {
		const inReviewApplications = applicantsData?.filter((item) => (0 === item.status))

		if(checkedItems.length === 0) {
			return
		}

		const tempArr: number[] = []
		// console.log('checkedItems', checkedItems)
		// console.log(inReviewApplications)
		for(let i = 0; i < checkedItems.length; i++) {
			if(checkedItems[i] && inReviewApplications[i]) {
				tempArr.push(Number(inReviewApplications[i].applicationId))
			}
		}

		setCheckedApplicationsIds(tempArr)
	}, [
		checkedItems
	])

	useEffect(() => {
		setInReviewApplications(applicantsData.filter((item) => (0 === item.status)))
	}, [applicantsData])

	useEffect(() => {
		if(isConfirmClicked) {
			setIsModalOpen(false)
		} else if(isAcceptClicked || isRejectClicked || isResubmitClicked) {
			setIsModalOpen(true)
		 }
	}, [isAcceptClicked, isRejectClicked, isResubmitClicked, isConfirmClicked])

	const [networkTransactionModalStep, setNetworkTransactionModalStep] = useState<number>()

	const [txn,, loading, isBiconomyInitialised, error] = useBatchUpdateApplicationState(
		'',
		checkedApplicationsIds,
		state,
		isConfirmClicked,
		setIsConfirmClicked, setNetworkTransactionModalStep
	)

	useEffect(() => {
		// if(loading) {
		// 	setCurrentStep(1)
		// }

		if(error) {
			setIsConfirmClicked(false)
		} else if(txn) {
			// setCurrentStep(2)
			router.reload()
		}
	}, [
		txn, error, loading
	])

	const handleSubmit = (st: number) => {
		setState(st)
		setIsConfirmClicked(true)
		setIsAcceptClicked(false)
		setIsRejectClicked(false)
		setIsModalOpen(false)
		// setCurrentStep(0)
	}


	if(applicantsData?.filter((item) => (0 === item.status)).length === 0) {
		return (
			<ZeroState />
		)
	}

	return (
		<>
			<Flex
				py='14px'
				px='16px'
				alignItems='center'
			>
				<HStack justify='space-between'>
					<Text
						mr='auto'
						fontSize='14px'
						lineHeight='20px'
						fontWeight='500'
					>
						In Review
					</Text>

					{
						isPrivate && (
							<Badge fontSize='x-small'>
								Private
							</Badge>
						)
					}
				</HStack>

				<Box mx='auto' />
				{/* <Text
									fontSize='14px'
									lineHeight='20px'
									fontWeight='500'
								>
									Filter By
								</Text> */}

				{
					someChecked && (
						<Menu>
							<MenuButton
								as={
									forwardRef<ButtonProps, 'div'>((props, ref) => (
										<Button
											colorScheme='brandv2'
											py='6px'
											px={3}
											minH={0}
											h='32px'
											fontSize='14px'
											m={0}
											{...props}
											ref={ref}
											// onClick={() => setSendFundsDrawerIsOpen(true)}
										>
											Actions
										</Button>
									))
								}
							/>
							<MenuList
								minW='240px'
								py={0}>
								<Flex
									bg='#F0F0F7'
									px={4}
									py={2}
								>
									<Text
										fontSize='14px'
										lineHeight='20px'
										fontWeight='500'
										textAlign='center'
										color='#555570'
									>
										Grant options
									</Text>
								</Flex>

								<MenuItem
									px='19px'
									py='10px'
									onClick={() => setIsAcceptClicked(true)}
								>
									<AcceptApplication />
									<Text
										fontSize='14px'
										lineHeight='20px'
										fontWeight='400'
										textAlign='center'
										color='#555570'
										ml={2}
									>
										Accept proposals
									</Text>
								</MenuItem>
								<MenuItem
									px='19px'
									py='10px'
									onClick={() => setIsResubmitClicked(true)}
								>
									<ResubmitApplication />
									<Text
										fontSize='14px'
										lineHeight='20px'
										fontWeight='400'
										textAlign='center'
										color='#555570'
										ml={2}
									>
										Resubmit proposals
									</Text>
								</MenuItem>
								<MenuItem
									px='19px'
									py='10px'
									onClick={() => setIsRejectClicked(true)}
								>
									<RejectApplication />
									<Text
										fontSize='14px'
										lineHeight='20px'
										fontWeight='400'
										textAlign='center'
										color='#555570'
										ml={2}
									>
										Reject proposals
									</Text>
								</MenuItem>
							</MenuList>
						</Menu>
					)
				}
			</Flex>

			<Flex
				bg='#F0F0F7'
				h='1px'
			/>


			<Grid
				templateColumns='56px 3fr 1fr 1fr 1fr'
				alignItems='center'
			>
				<GridItem
					display='flex'
					alignItems='center'
					justifyContent='center'
				>
					<Checkbox
						// defaultChecked={false}
						isChecked={checkedItems.length > 0 && allChecked}
						onChange={
							(e) => {
								const tempArr = Array(inReviewApplications.length).fill(e.target.checked)
								setCheckedItems(tempArr)
							}
						} />
				</GridItem>
				<GridItem>
					<Text
						px={4}
						py={2}
						color='#555570'
						fontSize='14px'
						lineHeight='20px'
						fontWeight='500'
					>
						Proposals
					</Text>
				</GridItem>
				<GridItem>
					<Text
						px={4}
						py={2}
						color='#555570'
						fontSize='14px'
						lineHeight='20px'
						fontWeight='500'
					>
						Review
					</Text>
				</GridItem>
				<GridItem>
					<Text
						px={4}
						py={2}
						color='#555570'
						fontSize='14px'
						lineHeight='20px'
						fontWeight='500'
					>
						Score
					</Text>
				</GridItem>

				<GridItem colSpan={5}>
					<Flex
						bg='#F0F0F7'
						h='1px'
					/>
				</GridItem>

				{/* <GridItem colSpan={4}>
					<Flex
						bg='#F0F0F7'
						h='1px'
					/>
				</GridItem> */}

				{/* new ro */}

				{
					applicantsData?.filter((item) => (0 === item.status)).map((applicantData, i) => (
						<InReviewRow
							key={`inreview-${i}`}
							applicantData={applicantData}
							isChecked={checkedItems[i]}
							onChange={
								(e) => {
									const tempArr: boolean[] = []
									tempArr.push(...checkedItems)
									tempArr[i] = e.target.checked
									setCheckedItems(tempArr)
								}
							}
							onAcceptClicked={
								() => {
									// const tempArr: boolean[] = []
									// tempArr.push(...checkedItems)
									// for(let i = 0; i < tempArr.length; i++) {
									// 	tempArr[i] = false
									// }

									const tempArr = Array(checkedItems.length).fill(false)
									tempArr[i] = true
									setCheckedItems(tempArr)
									setIsAcceptClicked(true)
								}
							}

							onResubmitClicked={
								() => {
									const tempArr = Array(checkedItems.length).fill(false)
									tempArr[i] = true
									setCheckedItems(tempArr)
									setIsResubmitClicked(true)
								}
							}

							onRejectClicked={
								() => {
									const tempArr = Array(checkedItems.length).fill(false)
									tempArr[i] = true
									setCheckedItems(tempArr)
									setIsRejectClicked(true)
								}
							}

							someChecked={someChecked}
						/>
					))
				}
			</Grid>

			<Modal
				isCentered
				isOpen={isModalOpen && networkTransactionModalStep === undefined}
				onClose={
					() => {
						setIsAcceptClicked(false)
						setIsRejectClicked(false)
						setIsResubmitClicked(false)
						setCheckedItems(Array(checkedItems.length).fill(false))
						setIsModalOpen(false)
					}
				}
				closeOnOverlayClick={false}
			>
				<ModalOverlay maxH='100vh' />
				<ModalContent>
					<ModalCloseButton />
					<ModalBody>

						<Text
							fontWeight='500'
							fontSize='20px'
							lineHeight='24px'
							color='#1F1F33'
						>
							{isAcceptClicked ? 'Accept selected applicants' : isResubmitClicked ? 'Resubmit selected applicants' : 'Reject selected applicants'}
						</Text>
						<Text
							fontWeight='400'
							fontSize='14px'
							lineHeight='20px'
							color='#7D7DA0'>
							This will notify selected applicants that their applications have been
							{' '}
							{isAcceptClicked ? 'accepted' : isResubmitClicked ? 'asked to resubmit' : 'rejected'}
							. This action cannot be undone.
						</Text>

						<Text
							fontWeight='400'
							fontSize='16px'
							lineHeight='24px'
							color='#1F1F33'>
							Are you sure you want to do this?
						</Text>
					</ModalBody>

					<ModalFooter>
						<Button
							variant='ghost'
							mr={3}
							onClick={
								() => {
									setIsAcceptClicked(false)
									setIsRejectClicked(false)
									setIsResubmitClicked(false)
									setCheckedItems(Array(checkedItems.length).fill(false))
									setIsModalOpen(false)
								}
							}>
							Cancel
						</Button>
						<Button
							// colorScheme={isAcceptClicked ? 'blue' : 'pink'}
							disabled={!isBiconomyInitialised}
							mr={3}
							onClick={
								() => {
									if(isAcceptClicked) {
										handleSubmit(2)
									} else if(isResubmitClicked) {
										handleSubmit(1)
									} else {
										handleSubmit(3)
									}
								}
							}>
							Confirm
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>

			<NetworkTransactionModal
				isOpen={networkTransactionModalStep !== undefined}
				subtitle={subtitle}
				description={
					<Flex
						direction='column'
						w='100%'
						align='start'>
						<Text
							fontWeight='500'
							fontSize='17px'
						>
							{(grantData?.grants?.length || 0) > 0 && grantData?.grants[0]?.title}
						</Text>

						{/* <Button
							rightIcon={<ExternalLinkIcon />}
							variant='linkV2'
							bg='#D5F1EB'>
							{(grantData?.grants?.length || 0) > 0 && formatAddress(grantData?.grants[0]?.id!)}
						</Button> */}
					</Flex>
				}
				currentStepIndex={networkTransactionModalStep || 0}
				steps={
					[
						`Updating proposal${checkedApplicationsIds.length === 1 ? '' : 's'} state`,
						'Waiting for transaction to complete on chain',
						'Indexing transaction on graph protocol',
						`Proposal${checkedApplicationsIds.length === 1 ? '' : 's'} state updated`,
					]
				}
				viewLink={getExplorerUrlForTxHash(getSupportedChainIdFromWorkspace(workspace) || defaultChainId, txn?.transactionHash)}
				onClose={
					() => {
						setNetworkTransactionModalStep(undefined)
						router.reload()
					}
				} />
		</>
	)
}

export default InReviewPanel
