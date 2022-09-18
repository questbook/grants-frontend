import React, { useState } from 'react'
import {
	Box, Button, Flex, Text,
} from '@chakra-ui/react'
import MultiLineInput from 'src/components/ui/forms/multiLineInput'
import SingleLineInput from 'src/components/ui/forms/singleLineInput'
import { useTranslation } from 'react-i18next'

interface Props {
  onSubmit: (data: any) => void
  constructCache: (data: any) => void
  cacheKey: string
}

function Title({ onSubmit, constructCache, cacheKey }: Props) {
	const maxDescriptionLength = 300
	const [title, setTitle] = useState('')
	const [summary, setSummary] = useState('')

	const [titleError, setTitleError] = useState(false)
	const [summaryError, setSummaryError] = useState(false)

	const { t } = useTranslation()

	React.useEffect(() => {
		if(cacheKey.includes('undefined') || typeof window === 'undefined') {
			return
		}

		const data = localStorage.getItem(cacheKey)
		if(data === 'undefined') {
			return
		}

		const formData = JSON.parse(data || '{}')
		// console.log('Data from cache: ', formData)

		setTitle(formData?.title)
		setSummary(formData?.summary)
	}, [cacheKey])

	React.useEffect(() => {
		if(cacheKey.includes('undefined') || typeof window === 'undefined') {
			return
		}

		const formData = {
			title,
			summary,
		}
		constructCache(formData)

	}, [title, summary])

	const handleOnSubmit = () => {
		let error = false
		if(title.length <= 0) {
			setTitleError(true)
			error = true
		}

		if(summary.length <= 0) {
			setSummaryError(true)
			error = true
		}

		if(!error) {
			onSubmit({ title, summary })
		}
	}

	return (
		<>
			<Flex
				py={12}
				direction='column'
				w='100%'>

				<Text
					variant='heading'
					fontSize='36px'
					lineHeight='48px'>
					{t('/create-grant.title')}
				</Text>

				<Box mt={12} />

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

				<Box mt={12} />

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
			<Button
				mt='auto'
				variant='primary'
				onClick={handleOnSubmit}
			>
				Continue
			</Button>
		</>
	)
}

export default Title