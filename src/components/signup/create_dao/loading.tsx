import React from 'react'
import {
	Container,
	Progress,
	Text,
} from '@chakra-ui/react'
import Lottie from 'lottie-react'
import animationData from '../../../../public/animations/Loading.json'

function Loading() {
	return (
		<Container
			minH="calc(100vh - 64px)"
			justifyContent="center"
			display="flex"
			flexDirection="column"
			alignItems="center"
			p={12}
		>
			<Lottie
				animationData={animationData}
				loop />
			<Text
				fontSize="24px"
				fontWeight="26px"
				variant="heading">
        Setting up your Grants DAO ...
			</Text>
			<Progress
				mt="45px"
				h={2}
				borderRadius={24}
				w="100%"
				isIndeterminate
				colorScheme="brand" />
		</Container>
	)
}

export default Loading
