

import React from 'react'
import {
	Box,
	Flex, Image, Text,
} from '@chakra-ui/react'

interface Props {
    content: React.ReactNode;
    close: () => void;
}


function SuccessToast({ content, close }: Props) {
	const contentProps = typeof content === 'string' && content.includes('<')
		? { dangerouslySetInnerHTML: { __html: content } }
		: { children: content }

	return (
		<Flex>
			<Box
				zIndex={10}
				w={2}
				h='100'
				color='#0DC98B'
				bg='#0DC98B' />

			<Flex
				alignItems="flex-start"
				bgColor="#FFFFFF"
				px="26px"
				py="22px"
				alignSelf="stretch"
			>

				<Flex
					alignItems="center"
					justifyContent="center"
					p={2}
					h="40px"
					w="40px"
					mt="5px"
				>
					<Image
						onClick={close}
						h="40px"
						w="40px"
						src="/ui_icons/success_toast_icon.svg"
						alt="Rejected"
					/>
				</Flex>
				<Flex
					flex={1}
					ml="23px"
					direction="column">
					<Text
						mt='auto'
						mb='auto'
						width='100%'
						fontSize="16px"
						lineHeight="24px"
						fontWeight="400"
						color="#7B4646"
						{...contentProps}
					/>

				</Flex>
			</Flex>
		</Flex>
	)
}

export default SuccessToast
