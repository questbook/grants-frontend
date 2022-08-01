import React from 'react'
import {
	Flex,
	Box,
	Button, Container, Text, } from '@chakra-ui/react'
import Loader from 'src/components/ui/loader'
import MultiLineInput from '../../../ui/forms/multiLineInput'

function Resubmit({
	onSubmit,
	hasClicked,
	comment,
	setComment,
	commentError,
	setCommentError,
}: {
  onSubmit: (data: any) => void;
  hasClicked: boolean;
  comment: string;
  setComment: (comment: string) => void;
  commentError: boolean;
  setCommentError: (commentError: boolean) => void;
}) {
	return (
		<Flex
			flexDirection="column"
			w="25vw"
			maxW="1260px"
			alignItems="stretch"
			pb={8}
			px={0}
			alignSelf="flex-start"
			ml={0}
		>
			<Text
				fontSize="18px"
				lineHeight="26px"
				fontWeight="700">
        Reason for Resubmission
			</Text>

			<Box mt="24px" />
			<MultiLineInput
				label="Comments"
				placeholder="Write an explanation as detailed as possible about every
        reason asking for resubmission."
				value={comment}
				onChange={
					(e) => {
						if(commentError) {
							setCommentError(false)
						}

						setComment(e.target.value)
					}
				}
				isError={commentError}
				errorText="Required"
			/>

			<Button
				onClick={() => (hasClicked ? {} : onSubmit({ comment }))}
				w="100%"
				mt={10}
				py={hasClicked ? 2 : 0}
				variant="primary">
				{hasClicked ? <Loader /> : 'Ask to Resubmit'}
			</Button>
		</Flex>
	)
}

export default Resubmit
