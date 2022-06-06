<<<<<<< HEAD
import { Image, Text } from '@chakra-ui/react';
import React from 'react';
=======
import React from 'react'
import { Image, Text } from '@chakra-ui/react'
import Deadline from 'src/components/ui/deadline'
>>>>>>> master

function Badge({
  numOfApplicants,
}: {
  numOfApplicants: number;
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
<<<<<<< HEAD
        {numOfApplicants > 1 || numOfApplicants === 0 ? 's' : ''}
      </Text>
    </Text>
  );
=======
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
				<Deadline date={new Date(endTimestamp)} />
			</Text>
		</Text>
	)
>>>>>>> master
}

export default Badge
