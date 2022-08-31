import { useEffect, useState } from 'react'
import { Button, Checkbox, Flex, Grid, GridItem, Text } from '@chakra-ui/react'
import AcceptedRow from 'src/v2/payouts/AcceptedProposals/AcceptedRow'
import ZeroState from 'src/v2/payouts/AcceptedProposals/ZeroState'

const AcceptedProposalsPanel = ({
	applicationStatuses,
	applicantsData,
	onSendFundsClicked,
	onBulkSendFundsClicked,
	grantData,
}: {
	applicationStatuses: {[applicationId: string]: {transactionHash: string, status: number, amount: number}}
  applicantsData: any[]
  onSendFundsClicked: (state: boolean, checkedItems: any[]) => void
  onBulkSendFundsClicked: (state: boolean, checkedItems: any[]) => void
  grantData: any
}) => {
	const [checkedItems, setCheckedItems] = useState<boolean[]>(applicantsData.filter((item) => (2 === item.status)).map(() => false))
	const [acceptedApplications, setAcceptedApplications] = useState<any[]>([])

	const someChecked = checkedItems.some((element) => {
		return element
	})
	const allChecked = checkedItems.length > 0 && checkedItems.every((element) => element === true)

	useEffect(() => {
		setCheckedItems(applicantsData.filter((item) => (2 === item.status)).map(() => false))
	}, [applicantsData])

	useEffect(() => {
		setAcceptedApplications(applicantsData.filter((item) => (2 === item.status)))
	}, [applicantsData])

	// useEffect(() => {
	// 	if(isConfirmClicked) {
	// 		setIsModalOpen(false)
	// 	} else if(isBulkSendFundsClicked) {
	// 		setIsModalOpen(true)
	// 	 }
	// }, [isBulkSendFundsClicked, isConfirmClicked])

	useEffect(() => {
		const inReviewApplications = applicantsData?.filter((item: any) => (0 === item.status))

		if(checkedItems.length === 0) {
			return
		}

		const tempArr: number[] = []
		// console.log(checkedItems)
		// console.log(inReviewApplications)
		for(let i = 0; i < checkedItems.length; i++) {
			if(checkedItems[i] && inReviewApplications[i]) {
				tempArr.push(Number(inReviewApplications[i].applicationId))
			}
		}

		// setCheckedApplicationsIds(tempArr)
	}, [
		checkedItems
	])

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
				alignItems='center'
			>
				<Text
					mr='auto'
					fontSize='14px'
					lineHeight='20px'
					fontWeight='500'
				>
					Accepted
				</Text>

				{
					someChecked && (
						<Button
							colorScheme='brandv2'
							py='6px'
							px={3}
							minH={0}
							h='32px'
							fontSize='14px'
							m={0}
							onClick={() => onBulkSendFundsClicked(true, acceptedApplications.filter((app, i) => checkedItems[i]))}
						>
							Send Funds
						</Button>
					)
				}


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
				h='1px'
			/>

			<Grid
				templateColumns='56px 1fr 1fr 1fr'
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
							(e: any) => {
								const tempArr = Array(acceptedApplications.length).fill(e.target.checked)
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
						h='1px'
					/>
				</GridItem>

				{/* new ro */}

				{
					applicantsData?.filter((item: any) => (2 === item.status)).map((applicantData: any, i) => (
						<AcceptedRow
							key={`accepted-${i}`}
							applicationStatus={applicationStatuses[applicantData.applicationId]?.status}
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
							onSendFundsClicked={
								() => {
									onSendFundsClicked(true, [acceptedApplications[i]])
								}
							} />
					))
				}
			</Grid>
		</>
	)
}

export default AcceptedProposalsPanel