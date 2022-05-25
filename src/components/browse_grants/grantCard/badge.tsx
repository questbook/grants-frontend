import React from 'react'
import { Image, Text } from '@chakra-ui/react'
import moment from 'moment'

function Badge({
	numOfApplicants,
	endTimestamp,
}: {
  numOfApplicants: number;
  endTimestamp: number;
}) {
	return (
		<Text
			display="flex"
			alignItems="center"
			mb="10px"
			fontWeight="700"
			lineHeight="26px">
			<Image
				mr="6px"
				boxSize={3}
				src="/ui_icons/applicant.svg"
				display="inline-block" />
			<Text
				as="span"
				fontSize="xs"
				display="inline-block">
				{numOfApplicants}
				{' '}
        Applicant
				{numOfApplicants > 1 || numOfApplicants === 0 ? 's' : ''}
			</Text>
			<Image
				mx={2}
				src="/ui_icons/green_dot.svg"
				display="inline-block" />
			<Image
				mr="6px"
				boxSize={3}
				src="/ui_icons/deadline.svg"
				display="inline-block" />
			<Text
				as="span"
				fontSize="xs"
				display="inline-block">
        Ends on
				{' '}
				{moment(endTimestamp).format('MMMM D')}
			</Text>
		</Text>
	)
}

export default Badge
