import { useEffect, useState } from 'react'
import { Button, ButtonProps, Checkbox, Flex, forwardRef, Grid, GridItem, Menu, MenuButton, MenuItem, MenuList, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalOverlay, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import useBatchUpdateApplicationState from 'src/hooks/useBatchUpdateApplicationState'
import { AcceptApplication } from 'src/v2/assets/custom chakra icons/AcceptApplication'
import { RejectApplication } from 'src/v2/assets/custom chakra icons/RejectApplication'
import { ResubmitApplication } from 'src/v2/assets/custom chakra icons/ResubmitApplication'
import InReviewRow from './InReviewRow'
import ZeroState from './ZeroState'

const InReviewPanel = ({
	applicantsData,
	onSendFundsClicked,
}: {
  applicantsData: any[];
  onSendFundsClicked: (state: boolean) => void;

}) => {
	const [checkedItems, setCheckedItems] = useState<boolean[]>(Array(applicantsData.filter((item) => (0 === item.status)).length).fill(false))
	const [checkedApplicationsIds, setCheckedApplicationsIds] = useState<number[]>([])
	const [isAcceptClicked, setIsAcceptClicked] = useState<boolean>(false)
	const [isRejectClicked, setIsRejectClicked] = useState<boolean>(false)
	const [isResubmitClicked, setIsResubmitClicked] = useState<boolean>(false)
	const [isConfirmClicked, setIsConfirmClicked] = useState<boolean>(false)

	const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
	const [state, setState] = useState<number>(5)
	const [inReviewApplications, setInReviewApplications] = useState<any[]>([])
	const [acceptedApplications, setAcceptedApplications] = useState<any[]>([])
	const [rejectedApplications, setRejectedApplications] = useState<any[]>([])
	const [currentStep, setCurrentStep] = useState<number>()

	const someChecked = checkedItems.some((element) => {
		return element
	})
	const router = useRouter()

	useEffect(() => {
		const inReviewApplications = applicantsData?.filter((item: any) => (0 === item.status))

		if(checkedItems.length === 0) {
			return
		}

		const tempArr: number[] = []
		console.log(checkedItems)
		console.log(inReviewApplications)
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
		setAcceptedApplications(applicantsData.filter((item) => (2 === item.status)))
		setRejectedApplications(applicantsData.filter((item) => (1 === item.status)))
	}, [applicantsData])

	useEffect(() => {
		if(isConfirmClicked) {
			setIsModalOpen(false)
		} else if(isAcceptClicked || isRejectClicked || isResubmitClicked) {
			setIsModalOpen(true)
		 }
	}, [isAcceptClicked, isRejectClicked, isResubmitClicked, isConfirmClicked])


	const [txn, txnLink, loading, error] = useBatchUpdateApplicationState(
		'',
		checkedApplicationsIds,
		state,
		isConfirmClicked,
		setIsConfirmClicked
	)

	useEffect(() => {
		if(loading) {
			setCurrentStep(1)
		}

		if(error) {
			setIsConfirmClicked(false)
		} else if(txn) {
			setCurrentStep(2)
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
		setCurrentStep(0)
	}


	if(applicantsData?.filter((item: any) => (0 === item.status)).length === 0) {
		return (
			<ZeroState />
		)
	}

	return (
		<>
			<Flex
				py='14px'
				px='16px'
				alignItems={'center'}
			>
				<Text
					mr='auto'
					fontSize='14px'
					lineHeight='20px'
					fontWeight='500'
				>
					In Review
				</Text>


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
											colorScheme={'brandv2'}
											py={'6px'}
											px={3}
											minH={0}
											h='32px'
											fontSize="14px"
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
								minW={'240px'}
								py={0}>
								<Flex
									bg={'#F0F0F7'}
									px={4}
									py={2}
								>
									<Text
										fontSize='14px'
										lineHeight='20px'
										fontWeight='500'
										textAlign='center'
										color={'#555570'}
									>
											Grant options
									</Text>
								</Flex>

								<MenuItem
									px={'19px'}
									py={'10px'}
									onClick={() => setIsAcceptClicked(true)}
								>
									<AcceptApplication />
									<Text
										fontSize='14px'
										lineHeight='20px'
										fontWeight='400'
										textAlign='center'
										color={'#555570'}
										ml={2}
									>
										Accept proposals
									</Text>
								</MenuItem>
								<MenuItem
									px={'19px'}
									py={'10px'}
									onClick={() => setIsResubmitClicked(true)}
								>
									<ResubmitApplication />
									<Text
										fontSize='14px'
										lineHeight='20px'
										fontWeight='400'
										textAlign='center'
										color={'#555570'}
										ml={2}
									>
										Resubmit proposals
									</Text>
								</MenuItem>
								<MenuItem
									px={'19px'}
									py={'10px'}
									onClick={() => setIsRejectClicked(true)}
								>
									<RejectApplication />
									<Text
										fontSize='14px'
										lineHeight='20px'
										fontWeight='400'
										textAlign='center'
										color={'#555570'}
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
				h={'1px'}
			/>


			<Grid
				templateColumns={'56px 1fr 1fr 1fr'}
			>
				<GridItem
					display='flex'
					alignItems='center'
					justifyContent='center'
				>
					<Checkbox />
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

				<GridItem colSpan={4}>
					<Flex
						bg='#F0F0F7'
						h={'1px'}
					/>
				</GridItem>

				{/* new ro */}

				{
					applicantsData?.filter((item: any) => (0 === item.status)).map((applicantData: any, i) => (
						<InReviewRow
							key={`inreview-${i}`}
							applicantData={applicantData}
							isChecked={checkedItems[i]}
							onChange={
								(e: any) => {
									const tempArr: boolean[] = []
									tempArr.push(...checkedItems)
									tempArr[i] = e.target.checked
									setCheckedItems(tempArr)
								}
							}
							onSendFundsClicked={() => onSendFundsClicked(true)}
							onAcceptClicked={
								(e: any) => {
									const tempArr: boolean[] = []
									tempArr.push(...checkedItems)
									for(let i = 0; i < tempArr.length; i++) {
										tempArr[i] = false
									}

									tempArr[i] = e.target.checked
									setCheckedItems(tempArr)
									setIsAcceptClicked(true)
								}
							}

							onResubmitClicked={
								(e: any) => {
									const tempArr: boolean[] = []
									tempArr.push(...checkedItems)
									for(let i = 0; i < tempArr.length; i++) {
										tempArr[i] = false
									}

									tempArr[i] = e.target.checked
									setCheckedItems(tempArr)
									setIsResubmitClicked(true)
								}
							}

							onRejectClicked={
								(e: any) => {
									const tempArr: boolean[] = []
									tempArr.push(...checkedItems)
									for(let i = 0; i < tempArr.length; i++) {
										tempArr[i] = false
									}

									tempArr[i] = e.target.checked
									setCheckedItems(tempArr)
									setIsRejectClicked(true)
								}
							}

							someChecked={someChecked}
						/>
					))
				}
			</Grid>

			{
				isModalOpen
		&& (

			<Modal
				isCentered
				isOpen={isModalOpen}
				onClose={
					() => {
						setIsAcceptClicked(false)
						setIsRejectClicked(false)
						setIsResubmitClicked(false)
						setIsModalOpen(false)
					}
				}
				closeOnOverlayClick={false}
			>
				<ModalOverlay maxH="100vh" />
				<ModalContent>
					<ModalCloseButton />
					<ModalBody>

						<Text
							fontWeight="500"
							fontSize="20px"
							lineHeight="24px"
							color="#1F1F33"
						>
							{isAcceptClicked ? 'Accept selected applicants' : isResubmitClicked ? 'Resubmit selected applicants' : 'Reject selected applicants'}
						</Text>
						<Text
							fontWeight="400"
							fontSize="14px"
							lineHeight="20px"
							color="#7D7DA0">
					This will notify selected applicants that their applications have been
							{' '}
							{isAcceptClicked ? 'accepted' : isResubmitClicked ? 'asked to resubmit' : 'rejected'}
. This action cannot be undone.
						</Text>

						<Text
							fontWeight="400"
							fontSize="16px"
							lineHeight="24px"
							color="#1F1F33">
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
									setIsModalOpen(false)
								}
							}>
              Cancel
						</Button>
						<Button
							// colorScheme={isAcceptClicked ? 'blue' : 'pink'}
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

		)
			}
		</>
	)
}

export default InReviewPanel