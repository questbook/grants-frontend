import React from 'react'
import {
	Box, Flex, Image, Spacer, Text
} from '@chakra-ui/react'

type SetupRubricAlertProps = {
onClick: () => void
onClose: () => void
}

const SetupRubricAlert = ({ onClick, onClose } : SetupRubricAlertProps) => {
	return (
		<Flex
			flexDirection="row"
			backgroundColor="#E3DDF2"
			alignItems="flex-start"
			padding="16px"
			gap="16px">
			<Flex flexDirection="row">
				<Flex flexDirection="column" >
					<Image
						src="/ui_icons/reverse_exclamation.svg"
						mr="8.33" />
				</Flex>
				<Box>
					<Text
						fontWeight="500"
						fontSize="16px"
						lineHeight="20px"
						color="#1F1F33">
												Setup application evaluation
					</Text>
					<Text
						fontWeight="400"
						fontSize="14px"
						lineHeight="20px"
						color="#1F1F33">
												On receiving applicants, define a scoring rubric and assign reviewers to evaluate the applicants.
						<Text
							as="span"
							color="#1F1F33"
							fontWeight="500"
							fontSize="14px"
							lineHeight="20px">
							{' '}
													Learn more
							{' '}
						</Text>
					</Text>
					<Text
						fontWeight="500"
						fontSize="14px"
						lineHeight="20px"
						color="#7356BF"
						as="button"
						onClick={onClick}>
												Setup now
					</Text>
				</Box>
			</Flex>
			<Spacer />
			<Flex flexDirection="column" >
				<Box as="button">
					<Image
						src="/ui_icons/close_drawer.svg"
						onClick={onClose} />
				</Box>
			</Flex>
		</Flex>
	)
}

export default SetupRubricAlert