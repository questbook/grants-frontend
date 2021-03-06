import React, { useEffect } from 'react'
import { Flex, Text } from '@chakra-ui/react'
import Content from './content'
import Filter from './filter'
import Headers from './headers'

function Table({
	onViewApplicantFormClick,
	// onAcceptApplicationClick,
	// onRejectApplicationClick,
	onManageApplicationClick,
	data,
	title,
	actorId,
	isReviewer,
	reviewerData,
	archiveGrantComponent,
}: {
  onViewApplicantFormClick?: (data? : any) => void;
  // onAcceptApplicationClick?: () => void;
  // onRejectApplicationClick?: () => void;
  onManageApplicationClick?: (data? : any) => void;
  data: any[];
  title: string;
  actorId: string
  isReviewer : boolean;
  archiveGrantComponent: React.ReactNode;
  reviewerData: any[];
}) {
	const [filter, setFilter] = React.useState(-1)
	useEffect(() => {
		console.log(filter)
	}, [filter])
	return (
		<>
			<Flex
				direction="row"
				mt={3}
				align="center">
				<Text
					variant="heading"
					mr={4}>
					{title}
				</Text>
				<Filter
					filter={filter}
					setFilter={setFilter} />
			</Flex>
			{archiveGrantComponent}
			<Flex
				w="100%"
				mt={10}
				align="center"
				direction="column"
				flex={1}>
				<Headers is_reviewer={isReviewer} />
				<Content
					data={data}
					isReviewer={isReviewer}
					reviewerData={reviewerData}
					filter={filter}
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

Table.defaultProps = {
	onViewApplicantFormClick: () => {},
	// onAcceptApplicationClick: () => {},
	// onRejectApplicationClick: () => {},
	onManageApplicationClick: () => {},
}
export default Table
