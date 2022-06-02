import React from 'react'
import {
	Box, Button, Flex, Heading,
	Image, ModalBody, Text, } from '@chakra-ui/react'
import { ApplicationMilestone } from 'src/types'
import { getMilestoneTitle } from 'src/utils/formattingUtils'

interface Props {
  milestone: ApplicationMilestone | undefined
  onClose: () => void;
}

function ModalContent({
	milestone,
	onClose,
}: Props) {
	return (
		<ModalBody>
			<Flex
				direction="column"
				justify="start"
				align="center">
				<Image
					w="127px"
					h="147px"
					src="/illustrations/done.svg" />
				<Heading
					mt={8}
					textAlign="center"
					variant="applicationHeading">
          You have marked
					{' '}
					{getMilestoneTitle(milestone)}
					{' '}
          as done.
				</Heading>
				<Text
					mt={4}
					textAlign="center"
					variant="applicationText">
          You will shortly receive a confirmation and
          reward if any for completing the grant milestone .
				</Text>
				<Button
					w="100%"
					variant="primary"
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
