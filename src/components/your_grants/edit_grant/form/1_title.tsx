import React from 'react'
import { Box, Flex } from '@chakra-ui/react'
import MultiLineInput from 'src/components/ui/forms/multiLineInput'
import SingleLineInput from 'src/components/ui/forms/singleLineInput'
import { useTranslation } from 'react-i18next'

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
  title: string
  setTitle: (title: string) => void
  summary: string
  setSummary: (summary: string) => void
  titleError: boolean
  setTitleError: (titleError: boolean) => void
  summaryError: boolean
  setSummaryError: (summaryError: boolean) => void
  maxDescriptionLength: number
}) {
	const { t } = useTranslation()
	return (
		<Flex
			direction='column'
			w='100%'>
			<SingleLineInput
				label={t('/create-grant.title_label')}
				value={title}
				onChange={
					(e) => {
						setTitleError(false)
						setTitle(e.target.value)
					}
				}
				placeholder={t('/create-grant.title_placeholder')}
				subtext='Letters, spaces, and numbers are allowed.'
				isError={titleError}
				errorText='Required'
			/>

			<Box mt={8} />

			<MultiLineInput
				label={t('/create-grant.summary_label')}
				placeholder={t('/create-grant.summary_placeholder')}
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
				errorText='Required'
			/>
		</Flex>
	)
}

export default Title
