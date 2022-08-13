import React, { useEffect } from 'react'
import { Button, Checkbox, CheckboxGroup,
	 Flex, Modal, ModalBody,
	ModalCloseButton, ModalContent, ModalFooter, ModalOverlay, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import useBatchUpdateApplicationState from 'src/hooks/useBatchUpdateApplicationState'
import Actions from '../actions'
import Content from './content'
import Filter from './filter'
import Headers from './headers'

function ApplicantsTable({
	grantID,
	onViewApplicantFormClick,
	// onAcceptApplicationClick,
	// onRejectApplicationClick,
	onManageApplicationClick,
	data,
	actorId,
	applicationsFilter,
	adminDidAcceptOrReject,
	isReviewer,
	isEvaluationSet,
	reviewerData,
	archiveGrantComponent,
}: {
	grantID: any;
  onViewApplicantFormClick?: (data?: any) => void;
  // onAcceptApplicationClick?: () => void;
  // onRejectApplicationClick?: () => void;
  onManageApplicationClick?: (data?: any) => void;
  data: any[];
  actorId: string;
  applicationsFilter: string;
  adminDidAcceptOrReject: boolean;
  isReviewer: boolean;
  isEvaluationSet: boolean;
  archiveGrantComponent: React.ReactNode;
  reviewerData: any[];
}) {
	const [filter, setFilter] = React.useState(-1)
	const [checkedItems, setCheckedItems] = React.useState<boolean[]>(Array(data.filter((item) => ('In Review' === item.status)).length).fill(false))

	const [checkedApplicationsIds, setCheckedApplicationsIds] = React.useState<number[]>([])
	const [isAcceptClicked, setIsAcceptClicked] = React.useState<boolean>(false)
	const [isRejectClicked, setIsRejectClicked] = React.useState<boolean>(false)
	const [isConfirmClicked, setIsConfirmClicked] = React.useState<boolean>(false)
	const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false)
	const [state, setState] = React.useState<number>(5)
	const [inReviewApplications, setInReviewApplications] = React.useState<any[]>([])
	const [acceptedApplications, setAcceptedApplications] = React.useState<any[]>([])
	const [rejectedApplications, setRejectedApplications] = React.useState<any[]>([])


	const allChecked = checkedItems.every(Boolean)
	const someChecked = checkedItems.some((element) => {
		return element
	})

	const router = useRouter()

	useEffect(() => {
		if(checkedItems.length === 0) {
			return
		}

		const tempArr: number[] = []
		for(let i = 0; i < checkedItems.length; i++) {
			if(checkedItems[i]) {
				tempArr.push(Number(inReviewApplications[i].applicationId))
			}
		}

		setCheckedApplicationsIds(tempArr)
	}, [
		checkedItems, inReviewApplications
	])

	useEffect(() => {
		setInReviewApplications(data.filter((item) => ('In Review' === item.status)))
		setAcceptedApplications(data.filter((item) => ('Accepted' === item.status)))
		setRejectedApplications(data.filter((item) => ('Rejected' === item.status)))
	}, [data])

	useEffect(() => {
		if(applicationsFilter === 'Accepted' || 'Rejected') {
			setCheckedItems(Array(data.filter((item) => (applicationsFilter === item.status)).length).fill(false))
		}
	}, [applicationsFilter])

	useEffect(() => {
		if(isConfirmClicked) {
			setIsModalOpen(false)
		} else if(isAcceptClicked || isRejectClicked) {
			setIsModalOpen(true)
		 }
	}, [isAcceptClicked, isRejectClicked, isConfirmClicked])

	const [txn, txnLink, loading, error] = useBatchUpdateApplicationState(
		'',
		checkedApplicationsIds,
		state,
		isConfirmClicked,
		setIsConfirmClicked
	)

	useEffect(() => {
		if(error) {
			setIsConfirmClicked(false)
		} else if(txn) {
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
	}

	return (
		<>
			<Flex
				direction="row"
				mt={3}
				align="center"
				bg="#FFFFFF"
				w="100%"
				justify="stretch"
				boxShadow="inset 0px -1px 0px #E0E0EC;"
				h="48px"
			>
				<Text
					color="#1F1F33"
					fontSize="14px"
					lineHeight="20px"
					fontWeight="700"
					flex="1"
					ml={24}
				>
					{' '}
					{applicationsFilter}
					{' '}
				</Text>

				{
					someChecked ? (
						<Actions
							onAcceptApplicationsClick={
								() => {
									setIsAcceptClicked(true)
								}
							}
							onRejectApplicationsClick={
								() => {
									setIsRejectClicked(true)
								}
							} />
					) : (
						<Filter
							filter={filter}
							setFilter={setFilter} />
					)
				}

			</Flex>
			{archiveGrantComponent}
			{
				isModalOpen
		&& (
			<Modal
				blockScrollOnMount={false}
				isOpen={isModalOpen}
				onClose={
					() => {
						setIsAcceptClicked(false)
						setIsRejectClicked(false)
						setIsModalOpen(false)
					}
				}>
				<ModalOverlay />
				<ModalContent>
					<ModalCloseButton />
					<ModalBody>

						<Text
							fontWeight="500"
							fontSize="20px"
							lineHeight="24px"
							color="#1F1F33"
						>
							{isAcceptClicked ? 'Accept selected applicants' : 'Reject selected applicants'}
						</Text>
						<Text
							fontWeight="400"
							fontSize="14px"
							lineHeight="20px"
							color="#7D7DA0">
					This will notify selected applicants that their applications have been rejected. This action cannot be undone.
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
									setIsModalOpen(false)
								}
							}>
              Cancel
						</Button>
						<Button
							colorScheme={isAcceptClicked ? 'blue' : 'pink'}
							mr={3}
							onClick={
								() => {
									isAcceptClicked ? handleSubmit(2) : handleSubmit(3)
								}
							}>
Confirm
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>

		)
			}
			<Flex
				w="100%"
				// mt={10}
				align="left"
				direction="column"
				flex={1}
			>

				<Headers
					is_reviewer={isReviewer}
					isEvaluationSet={isEvaluationSet}
					applicationsStatus={applicationsFilter}
					adminDidAcceptOrReject={adminDidAcceptOrReject}
					checkbox={
						<Flex
							direction="row"

							justify="stretch"
							align="center"
							bg="#FFFFFF"
							px={0}
							//   py={4}
							border="1px"
							borderColor="#E0E0EC"
						>
							<Checkbox
								h="58.5px"
								w="40px"
								bg="#FFFFFF"
								isChecked={applicationsFilter === 'Pending For Review' || applicationsFilter === 'In Review' ? allChecked : false}
								onChange={
									(e) => {
										applicationsFilter === 'Pending For Review' || applicationsFilter === 'In Review' ?
											setCheckedItems(Array(data.length).fill(e.target.checked)) :
											{}
									}
								}
								ml={15}
							/>
						</Flex>
					}
				/>
				<Flex
					alignItems="left"
					h='300px'
					overflowX="hidden"
					overflowY="auto">
					<Flex direction="column">

						<CheckboxGroup colorScheme="blue">
							{
								applicationsFilter === 'Rejected' ? rejectedApplications.map((application, index) => {
									return (
										<Flex
											key={application.applicantId}
											direction="row"
											h="58px"
											justify="stretch"
											align="center"
											bg="#FFFFFF"
											px={0}
											//   py={4}
											border="1px"
											borderColor="#E0E0EC"

										>
											<Checkbox
												h="58px"
												w="40px"
												isChecked={checkedItems[index]}
												onChange={
													(e) => {
														const tempArr: boolean[] = []
														tempArr.push(...checkedItems)
														tempArr[index] = e.target.checked
														setCheckedItems(tempArr)
													}
												}
												ml={15}
											/>
										</Flex>
									)
								}) : applicationsFilter === 'Accepted' ? acceptedApplications.map((application, index) => {
									return (
										<Flex
											key={application.applicantId}
											direction="row"
											h="58px"
											justify="stretch"
											align="center"
											bg="#FFFFFF"
											px={0}
											//   py={4}
											border="1px"
											borderColor="#E0E0EC"

										>
											<Checkbox
												h="58px"
												w="40px"
												isChecked={checkedItems[index]}
												onChange={
													(e) => {
														const tempArr: boolean[] = []
														tempArr.push(...checkedItems)
														tempArr[index] = e.target.checked
														setCheckedItems(tempArr)
													}
												}
												ml={15}
											/>
										</Flex>
									)
								}) :
									inReviewApplications.map((application, index) => {
										return (
											<Flex
												key={application.applicantId}
												direction="row"
												h="58px"
												justify="stretch"
												align="center"
												bg="#FFFFFF"
												px={0}
												//   py={4}
												border="1px"
												borderColor="#E0E0EC"

											>
												<Checkbox
													h="58px"
													w="40px"
													isChecked={checkedItems[index]}
													onChange={
														(e) => {
															const tempArr: boolean[] = []
															tempArr.push(...checkedItems)
															tempArr[index] = e.target.checked
															setCheckedItems(tempArr)
														}
													}
													ml={15}
												/>
											</Flex>
										)
									})
							}
						</CheckboxGroup>
					</Flex>
					<Content
						data={data}
						isReviewer={isReviewer}
						reviewerData={reviewerData}
						filter={filter}
						applicationsStatus={applicationsFilter}
						adminDidAcceptOrReject={adminDidAcceptOrReject}
						isEvaluationSet={isEvaluationSet}
						actorId={actorId}
						onViewApplicationFormClick={onViewApplicantFormClick}
						// onAcceptApplicationClick={onAcceptApplicationClick}
						// onRejectApplicationClick={onRejectApplicationClick}
						onManageApplicationClick={
							(manageData: any) => {
								if(onManageApplicationClick) {
									onManageApplicationClick(manageData)
								}
							}
						}
					/>
				</Flex>
			</Flex>

			{/* Can we move this to next release */}
			{/* <Flex
        direction="row"
        w="100%"
        justify="space-between"
        align="center"
        h="40px"
        border="1px solid #D0D3D3"
        borderRadius="4px 4px 0px 0px"
        mt={4}
      >
        <Flex direction="row" justify="center" align="center" my={3} mx={4}>
          <Text
            fontSize="12px"
            lineHeight="20px"
            fontWeight="500"
            color="#122224"
          >
            Items per page:{' '}
            <Text
              display="inline-block"
              mt={-4}
              fontSize="14px"
              lineHeight="20px"
              fontWeight="700"
              color="#000000"
            >
              10
            </Text>
          </Text>
          <Flex direction="row" justify="start" align="center" ml={4}>
            <Text
              fontSize="24px"
              lineHeight="20px"
              fontWeight="400"
              color="#000000"
            >
              |
            </Text>
            <Box mr={2} />
            <Text
              display="inline-block"
              fontSize="12px"
              lineHeight="20px"
              fontWeight="500"
              color="#000000"
            >
              1 - 10 of 40 items
            </Text>
          </Flex>
        </Flex>
        <Flex direction="row" justify="start" align="center">
          <Text
            fontSize="12px"
            lineHeight="20px"
            fontWeight="500"
            color="#000000"
          >
            1 of 4 pages
          </Text>
          <Flex direction="row" justify="start" ml={5}>
            <IconButton
              variant="outline"
              borderRadius={0}
              borderBottomWidth={0}
              borderTopWidth={0}
              borderRightWidth={0}
              aria-label="Button Left"
              icon={<ChevronLeftIcon />}
              isDisabled
            />
            <IconButton
              variant="outline"
              borderRadius={0}
              borderBottomWidth={0}
              borderTopWidth={0}
              borderRightWidth={0}
              aria-label="Button Right"
              icon={<ChevronRightIcon />}
            />
          </Flex>
        </Flex>
      </Flex> */}
		</>
	)
}

ApplicantsTable.defaultProps = {
	onViewApplicantFormClick: () => {},
	// onAcceptApplicationClick: () => {},
	// onRejectApplicationClick: () => {},
	onManageApplicationClick: () => {},
}
export default ApplicantsTable
