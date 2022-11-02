import { Flex, Grid, GridItem, Text } from '@chakra-ui/react'
import SupportedChainId from 'src/generated/SupportedChainId'
import RejectedRow from 'src/screens/view_proposals/_components/RejectedProposals/RejectedRow'
import ZeroState from 'src/screens/view_proposals/_components/RejectedProposals/ZeroState'
import { IApplicantData } from 'src/types'

const RejectedPanel = ({
	applicantsData,
	chainId
}: {
  applicantsData: IApplicantData[]
  chainId: SupportedChainId
}) => {
	if(applicantsData?.filter((item) => (3 === item.status)).length === 0) {
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

				{/* <GridItem colSpan={4}>
					<Flex
						bg='#F0F0F7'
						h='1px'
					/>
				</GridItem> */}

				{/* new ro */}

				{
					applicantsData
						// filter only reject applications
						?.filter((item) => (3 === item.status))
						.map((applicantData) => (
							<RejectedRow
								key={applicantData.applicationId}
								applicantData={applicantData}
								chainId={chainId}
							/>
						))
				}
			</Grid>
		</>
	)
}

export default RejectedPanel
