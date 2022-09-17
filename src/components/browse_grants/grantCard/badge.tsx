import React from 'react'
import { Image, Text } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

function Badge({
	numOfApplicants,
}: {
  numOfApplicants: number
}) {
	const { t } = useTranslation()
	return (
		<Text
			display='flex'
			alignItems='center'
			mb='10px'
			fontWeight='700'
			lineHeight='26px'>
			<Image
				mr='6px'
				boxSize={3}
				src='/ui_icons/applicant.svg'
				display='inline-block' />
			<Text
				as='span'
				fontSize='xs'
				display='inline-block'>
				{numOfApplicants}
				{' '}
				{t('/profile.cards.proposal')}
				{numOfApplicants > 1 || numOfApplicants === 0 ? 's' : ''}
			</Text>
		</Text>
	)
}

export default Badge
