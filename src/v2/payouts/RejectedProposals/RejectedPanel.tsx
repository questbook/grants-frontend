import { useEffect, useState } from 'react'
import { Flex, Grid, GridItem, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import useBatchUpdateApplicationState from 'src/hooks/useBatchUpdateApplicationState'
import RejectedRow from 'src/v2/payouts/RejectedProposals/RejectedRow'
import ZeroState from 'src/v2/payouts/RejectedProposals/ZeroState'

const RejectedPanel = ({
	applicantsData,
	onSendFundsClicked,
}: {
  applicantsData: any[]
  onSendFundsClicked: (state: boolean) => void

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
		// console.log(checkedItems)
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


	if(applicantsData?.filter((item: any) => (3 === item.status)).length === 0) {
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
				<Text
					mr='auto'
					fontSize='14px'
					lineHeight='20px'
					fontWeight='500'
				>
					Rejected
				</Text>


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
				templateColumns='1fr 1fr 1fr'
			>

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
						Rejected On
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
						Review Status
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
					applicantsData?.filter((item: any) => (3 === item.status)).map((applicantData: any, i) => (
						<RejectedRow
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
						/>
					))
				}
			</Grid>
		</>
	)
}

export default RejectedPanel