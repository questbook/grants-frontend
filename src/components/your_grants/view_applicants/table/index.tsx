import React, { useEffect } from 'react'
import { Checkbox, CheckboxGroup, Flex, Text } from '@chakra-ui/react'
import Content from './content'
import Filter from './filter'
import Headers from './headers'

function ApplicantsTable({
	onViewApplicantFormClick,
	// onAcceptApplicationClick,
	// onRejectApplicationClick,
	onManageApplicationClick,
	data,
	actorId,
	applicationsFilter,
	isReviewer,
	isEvaluationSet,
	reviewerData,
	archiveGrantComponent,
}: {
  onViewApplicantFormClick?: (data?: any) => void;
  // onAcceptApplicationClick?: () => void;
  // onRejectApplicationClick?: () => void;
  onManageApplicationClick?: (data?: any) => void;
  data: any[];
  actorId: string;
  applicationsFilter: string;
  isReviewer: boolean;
  isEvaluationSet: boolean;
  archiveGrantComponent: React.ReactNode;
  reviewerData: any[];
}) {
	const [filter, setFilter] = React.useState(-1)
	const [checkedItems, setCheckedItems] = React.useState<boolean[]>(
		Array(data.length).fill(false)
	)
	const allChecked = checkedItems.every(Boolean)
	useEffect(() => {
		console.log(filter)
	}, [filter])

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

				<Filter
					filter={filter}
					setFilter={setFilter} />
			</Flex>
			{archiveGrantComponent}

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
								isChecked={allChecked}
								onChange={(e) => setCheckedItems(Array(data.length).fill(e.target.checked))}
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
								data.map((application, index) => {
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
