import React from 'react'
import { Flex, Image, Text } from '@chakra-ui/react'
import moment from 'moment'

function Badge({
	numOfApplicants,
	endTimestamp,
}: {
  numOfApplicants: number;
  endTimestamp: number;
}) {
	return (
		<Flex
			direction="row"
			alignItems="center"
			mb="10px"
			fontWeight="700">
			<Image
				mr="6px"
				boxSize={3}
				src="/ui_icons/applicant.svg" />
			<Text fontSize="xs">
				{numOfApplicants}
				{' '}
        Applicant
				{numOfApplicants > 1 || numOfApplicants === 0 ? 's' : ''}
			</Text>
			<Image
				mx={2}
				src="/ui_icons/green_dot.svg" />
			<Image
				mr="6px"
				boxSize={3}
				src="/ui_icons/deadline.svg" />
			<Text fontSize="xs">
        Ends on
				{' '}
				{moment(endTimestamp).format('MMMM D')}
			</Text>
		</Flex>
	)
}

export default Badge
