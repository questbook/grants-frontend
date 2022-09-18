import React from 'react'
import { useTranslation } from 'react-i18next'
import {
	Flex,
} from '@chakra-ui/react'
import { EditorState } from 'draft-js'
import RichTextEditor from 'src/components/ui/forms/richTextEditor'

function Details({
	details,
	setDetails,
	detailsError,
	setDetailsError,
}: {
  details: EditorState
  setDetails: (details: EditorState) => void
  detailsError: boolean
  setDetailsError: (detailsError: boolean) => void
}) {
	const { t } = useTranslation('common')
	return (
		<Flex direction='column'>
			<RichTextEditor
				label={t('/create-grant.instructions_title')}
				placeholder='Details about your grant - requirements, deliverables, and milestones'
				value={details}
				isError={detailsError}
				onChange={
					(e: EditorState) => {
						if(detailsError) {
							setDetailsError(false)
						}

						setDetails(e)
					}
				}
				errorText='Required'
				maxLength={-1}
			/>

		</Flex>
	)
}

export default Details
