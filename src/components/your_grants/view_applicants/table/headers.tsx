import React from 'react'
import { Box, Flex, Text } from '@chakra-ui/react'
const tableHeadersPendingForReview = [
	'Proposals',
	'Review Stage',
	'Review',
	'Score',
]

const tableHeadersInReview = [
	'Proposals',
	'Review Stage',
	'Review',
	'Score'
]

const tableHeadersAccepted = [
	'Proposals',
	'Funds Sent (in USD)',
	'Milestone Status',
	'Last update on'
]

const tableHeadersRejected = [
	'Proposals',
	'Rejected On',
	'Review'
]

const tableHeadersReviewer = [
	'Applicant Address',
	'Sent On',
	'Project Name',
	'Funding Ask',
	'Status',
	'Actions',
]
const tableHeadersFlex = [0.231, 0.20, 0.15, 0.13, 0.16, 0.25, 0.116]
const tableHeadersFlexReviewer = [0.231, 0.15, 0.184, 0.116, 0.22, 0.116]
const tableHeadersFlexPendingForReview = [0.5, 0.3, 0.15, 0.13]
const tableHeadersFlexAccepted = [0.5, 0.20, 0.15, 0.13]
const tableHeadersFlexInReview = [0.5, 0.20, 0.15, 0.13]
const tableHeadersFlexRejected = [0.5, 0.20, 0.15]
const tableHeadersAlign = [
	'left',
	'left',
	'left',
	'center',
	'center',
	'center',
	'center',
]

const tableHeadersAlignReviewer = [
	'left',
	'left',
	'left',
	'left',
	'center',
	'center',
]

function Headers({ is_reviewer, isEvaluationSet, applicationsStatus, adminDidAcceptOrReject, checkbox }:{ is_reviewer : boolean; isEvaluationSet:boolean; applicationsStatus:string, adminDidAcceptOrReject:boolean; checkbox: React.ReactNode }) {
	const Tableduel = is_reviewer ? (tableHeadersReviewer) :
		!isEvaluationSet && !adminDidAcceptOrReject ? (tableHeadersPendingForReview) :
					 applicationsStatus === 'Accepted' ? tableHeadersAccepted :
					 applicationsStatus === 'Rejected' ? tableHeadersRejected :
					 tableHeadersInReview
	return (


		<Flex
			direction="row"
			w="100%"
			h="60px"

			align="center"
			py={0}
			bg="#FFFFFF"
			boxShadow="inset 0px -1px 0px #E0E0EC;"

		>
			{checkbox}
			{
				Tableduel.map((header, index) => (
					<Box
						key={header}
						h="60px"
						flex={
							is_reviewer ? (tableHeadersFlexReviewer[index]) :
								!isEvaluationSet && !adminDidAcceptOrReject ? (tableHeadersFlexPendingForReview[index]) :
									applicationsStatus === 'Accepted' ? tableHeadersFlexAccepted[index] :
										applicationsStatus === 'Rejected' ? tableHeadersFlexRejected[index] :
											tableHeadersFlexInReview[index]
						}
						mr={index === Tableduel.length - 1 ? 3 : 0}
						alignItems="center"
						border="1px"
						borderColor="#E0E0EC"
					>
						<Text
							ml={index === 0 ? '10' : '0'}
							mt="5"
							key={header}
							whiteSpace="nowrap"
							textAlign={index === 0 ? 'left' : 'center'}

							// variant="tableHeader"
							color="#1F1F33"
							fontWeight="500"
							fontSize="14px"
							lineHeight="20px"
						// boxShadow="inset 0px -1px 0px #E0E0EC;"
						>
							{header}
						</Text>

					</Box>
				))
			}
		</Flex>

	)
}

export default Headers
