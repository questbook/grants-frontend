import React from 'react'
import { Box, Flex } from '@chakra-ui/react'
import MultiLineInput from '../../../ui/forms/multiLineInput'
import SingleLineInput from '../../../ui/forms/singleLineInput'

function Title({
	title,
	setTitle,
	summary,
	setSummary,
	titleError,
	setTitleError,
	summaryError,
	setSummaryError,
	maxDescriptionLength,
}: {
  title: string;
  setTitle: (title: string) => void;
  summary: string;
  setSummary: (summary: string) => void;
  titleError: boolean;
  setTitleError: (titleError: boolean) => void;
  summaryError: boolean;
  setSummaryError: (summaryError: boolean) => void;
  maxDescriptionLength: number;
}) {
	return (
		<Flex
			direction="column"
			w="100%">
			<SingleLineInput
				label="Grant Title"
				value={title}
				onChange={
					(e) => {
						setTitleError(false)
						setTitle(e.target.value)
					}
				}
				placeholder="Decentralized batching contract"
				subtext="Letters, spaces, and numbers are allowed."
				isError={titleError}
				errorText="Required"
			/>

			<Box mt={8} />

			<MultiLineInput
				label="Grant Summary"
				placeholder="A tool, script or tutorial to set up monitoring for miner GPU, CPU, & memory."
				value={summary}
				onChange={
					(e) => {
						setSummaryError(false)
						if(e.target.value.length <= maxDescriptionLength) {
							setSummary(e.target.value)
						}
					}
				}
				maxLength={maxDescriptionLength}
				isError={summaryError}
				errorText="Required"
			/>
		</Flex>
	)
}

export default Title
