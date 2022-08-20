import { Button, Checkbox, Flex, Grid, GridItem, Text } from '@chakra-ui/react'
import AcceptedRow from './AcceptedRow'
import ZeroState from './ZeroState'

const AcceptedProposalsPanel = ({
	applicantsData,
	onSendFundsClicked,
	grantData,
}: {
  applicantsData: any[];
  onSendFundsClicked: (state: boolean) => void;
  grantData: any;

}) => {
	if(applicantsData?.filter((item: any) => (2 === item.status)).length === 0) {
		return (
			<ZeroState grantData={grantData} />
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
        Accepted
				</Text>

				<Button
					colorScheme={'brandv2'}
					py={'6px'}
					px={3}
					minH={0}
					h='32px'
					fontSize="14px"
					m={0}
					onClick={() => onSendFundsClicked(true)}
				>
          Send Funds
				</Button>

				{/* <Text
        fontSize='14px'
        lineHeight='20px'
        fontWeight='500'
      >
        Filter By
      </Text> */}
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
          Funds sent (in USD)
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
          Milestone status
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
					applicantsData?.filter((item: any) => (2 === item.status)).map((applicantData: any, i) => (
						<AcceptedRow
							key={`accepted-${i}`}
							applicantData={applicantData}
							isChecked={false} // update here for checkbox
							onChange={
								(e: any) => {
									// add code to handle selected row
								}
							}
							onSendFundsClicked={() => onSendFundsClicked(true)} />
					))
				}
			</Grid>
		</>
	)
}

export default AcceptedProposalsPanel