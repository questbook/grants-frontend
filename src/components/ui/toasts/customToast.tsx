import React from 'react'
import {
	Box, Flex, IconButton, Image,
	Text, } from '@chakra-ui/react'

interface Props {
  content: string;
  close: () => void;
}

function CustomToast({ content, close }: Props) {
	return (
		<Flex
			p={7}
			bg="#BBDEFF"
			border="2px solid #88BDEE"
			borderRadius="6px"
			minW="578px"
			// maxH="94px"
			direction="row"
			justify="center"
			align="center"
		>
			<Image
				src="/toast/info.svg"
				mr={6} />
			<Flex
				direction="column"
				align="start"
				justify="start">
				<Text
					variant="tableHeader"
					color="#3E4969">
					{content}
				</Text>
			</Flex>
			<Box m="auto" />
			<Flex
				h="full"
				align="center"
				justify="center">
				<IconButton
					_hover={{}}
					variant="ghost"
					_active={{}}
					icon={<Image src="/toast/info_close.svg" />}
					aria-label="Close"
					onClick={close}
				/>
			</Flex>
		</Flex>
	)
}

export default CustomToast
