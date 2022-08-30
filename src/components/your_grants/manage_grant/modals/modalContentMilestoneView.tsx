import React from 'react'
import {
	Box, Button, Flex, Heading,
	ModalBody, Text, } from '@chakra-ui/react'
import { ApplicationMilestone } from 'src/types'
import { getFormattedDateFromUnixTimestampWithYear } from 'src/utils/formattingUtils'

interface Props {
  milestone: ApplicationMilestone | undefined
  onClose: () => void
}

function ModalContent({
	milestone,
	onClose,
}: Props) {
	return (
		<ModalBody>
			<Flex
				direction='column'
				justify='start'
				align='start'>
				<Text variant='applicationText'>
					{milestone?.title || 'N/A'}
				</Text>
				<Heading
					mt={6}
					variant='applicationHeading'>
					You marked it as done on
					{' '}
					{getFormattedDateFromUnixTimestampWithYear(milestone!.updatedAtS || 0)}
					.
				</Heading>
				<Heading
					mt={8}
					variant='applicationHeading'>
					Milestone Summary
				</Heading>
				<Text
					mt={4}
					variant='applicationText'>
					{milestone?.feedbackDev || 'N/A'}
				</Text>
				<Button
					w='100%'
					variant='primary'
					mt={10}
					onClick={onClose}>
					OK
				</Button>
				<Box mb={4} />
			</Flex>
		</ModalBody>
	)
}

export default ModalContent
