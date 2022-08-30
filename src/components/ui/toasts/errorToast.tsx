import React from 'react'
import {
	Flex, IconButton, Image, Text,
} from '@chakra-ui/react'

interface Props {
  content: React.ReactNode
  close: () => void
}

function ErrorToast({ content, close }: Props) {
	// basically we check, if an HTML string is provided to us
	// then we set it dangerously inside -- so the HTML gets displayed correctly
	// otherwise just display it as a regular react child
	const contentProps = typeof content === 'string' && content.includes('<')
		? { dangerouslySetInnerHTML: { __html: content } }
		: { children: content }

	return (
		<Flex
			alignItems='flex-start'
			bgColor='#FFC0C0'
			border='2px solid #EE7979'
			px='26px'
			py='22px'
			borderRadius='6px'
			minW='578px'
			mt={4}
			mx={10}
			alignSelf='stretch'
		>
			<Flex
				alignItems='center'
				justifyContent='center'
				bgColor='#F7B7B7'
				border='2px solid #EE7979'
				borderRadius='40px'
				p={2}
				h='40px'
				w='40px'
				mt='5px'
			>
				<Image
					onClick={close}
					h='40px'
					w='40px'
					src='/ui_icons/result_rejected_application.svg'
					alt='Rejected'
				/>
			</Flex>
			<Flex
				flex={1}
				ml='23px'
				direction='column'>
				<Text
					fontSize='16px'
					lineHeight='24px'
					fontWeight='700'
					color='#7B4646'
				>
					Error Message
				</Text>
				<Text
					fontSize='16px'
					lineHeight='24px'
					fontWeight='400'
					color='#7B4646'
					{...contentProps}
				/>

			</Flex>
			<Flex
				h='full'
				align='center'
				justify='center'>
				<IconButton
					_hover={{}}
					variant='ghost'
					_active={{}}
					icon={<Image src='/ui_icons/close.svg' />}
					aria-label='Close'
					onClick={close}
				/>
			</Flex>
		</Flex>
	)
}

export default ErrorToast
