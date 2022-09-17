import { Box, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next';

function GetStartedCard() {
	const router = useRouter()
	const { t } = useTranslation();
	return (
		<Box
			w='100%'
			minHeight='172px'
			background='white'
			p='24px'
			position='relative'
			boxShadow='0px 10px 18px rgba(31, 31, 51, 0.05), 0px 0px 1px rgba(31, 31, 51, 0.31);'
			borderRadius='4px'
			cursor='pointer'
			onClick={
				() => {
					router.push({
						pathname: '/onboarding/create-domain',
					})
				}
			}>
			<Text
				ml='auto'
				fontWeight='700'
				fontSize='20px'
				mb='8px'>
				{t('/.get_started_card.title')}
			</Text>
			<Text
				ml='3px'
				color='#7D7DA0'
				fontSize='14px'
				mb='12px'>
				{t('/.get_started_card.description')}
			</Text>
			<Box
				bg='#1F1F33'
				color='white'
				py='8px'
				alignItems='center'
				borderRadius='4px'>
				<Text
					textAlign='center'
					fontSize='14px'
					fontWeight='500'>
					{t('/.get_started_card.cta')}
				</Text>
			</Box>

		</Box>
	)
}

export default GetStartedCard