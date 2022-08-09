import {
	Flex,
	Spacer,
	Text,
} from '@chakra-ui/react'

type DrawerFooterProps = {
setupStep: boolean
onClick: () => void
}

const DrawerFooter = ({ setupStep, onClick } : DrawerFooterProps) => {


	return (
		<Flex
			backgroundColor="#FFFFFF"
			alignItems="flex-start"
			padding="16px"
			boxShadow="0px 1px 1px rgba(31, 31, 51, 0.2), 0px 0px 1px rgba(31, 31, 51, 0.25);"
		>
			<Spacer />
			<Flex
				alignItems="center"
				padding="6px 20px"
				w="153px"
				h="40px"
				background={!!setupStep ? '#1F1F33' : '#E0E0EC'}
				borderRadius="3px"
				cursor="pointer"
				onClick={onClick}
			>
				<Text
					width="113px"
					height="24px"
					fontWeight="500"
					fontSize="16px"
					lineHeight="24px"
					textAlign="center"
					color="#FFFFFF"
				>
					{setupStep ? 'Confirm' : 'Next'}
				</Text>
			</Flex>
		</Flex>
	)
}

export default DrawerFooter