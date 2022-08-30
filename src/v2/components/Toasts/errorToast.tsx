
import React from 'react'
import {
	Box,
	Flex, Image, Text,
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
		<Flex>
			<Box
				zIndex={10}
				w={2}
				h='100'
				color='#FF7545'
				bg='#FF7545' />

			<Flex
				alignItems='flex-start'
				bgColor='#FFFFFF'
				px='26px'
				py='22px'
				alignSelf='stretch'
			>

				<Flex
					alignItems='center'
					justifyContent='center'
					p={2}
					h='40px'
					w='40px'
					mt='5px'
				>
					<Image
						onClick={close}
						h='40px'
						w='40px'
						src='/ui_icons/error_toast_icon.svg'
						alt='Rejected'
					/>
				</Flex>
				<Flex
					flex={1}
					ml='23px'
					direction='column'>
					<Text
						width='100%'
						fontSize='16px'
						lineHeight='24px'
						fontWeight='400'
						color='#7B4646'
						{...contentProps}
					/>

				</Flex>
			</Flex>
		</Flex>

	)


}

export default ErrorToast
