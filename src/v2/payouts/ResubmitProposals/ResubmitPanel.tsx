import { useEffect, useState } from 'react'
import { Flex, Grid, GridItem, Text } from '@chakra-ui/react'
import ResubmitRow from './ResubmitRow'
import ZeroState from './ZeroState'

const RejectedPanel = ({
	applicantsData,
}: {
  applicantsData: any[];

}) => {
	if(applicantsData?.filter((item: any) => (1 === item.status)).length === 0) {
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
					Resubmit
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
				h={'1px'}
			/>


			<Grid
				templateColumns={'1fr 1fr 1fr'}
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
						Asked for Resubmission On
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

				{/* new ro */}

				{
					applicantsData?.filter((item: any) => (1 === item.status)).map((applicantData: any, i) => (
						<ResubmitRow
							key={`inreview-${i}`}
							applicantData={applicantData}
						/>
					))
				}
			</Grid>
		</>
	)
}

export default RejectedPanel