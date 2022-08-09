import {
	Box,
	Flex,
	Image,
	Spacer,
	Text,
} from '@chakra-ui/react'

type DrawerHeaderProps = {
    onClose: () => void
}
const DrawerHeader = ({ onClose } : DrawerHeaderProps) => {

	return (
		<Flex
			backgroundColor="#FFFFFF"
			alignItems="flex-start"
			padding="16px"
			boxShadow="0px 1px 1px rgba(31, 31, 51, 0.2), 0px 0px 1px rgba(31, 31, 51, 0.25);"
		>
			<Flex position="relative">
				<Image
					src="/ui_icons/drawer_top_logo.svg"
					mr="8" />
				<Image
					src="/ui_icons/drawer_top_logo_inside.svg"
					mr="8"
					position="absolute"
					top="30%"
					left="4%"
				/>
				<Box>
					<Text
						fontWeight="500"
						fontSize="20px"
						lineHeight="24px"
						color="#1F1F33"
					>
                    Setup applicant evaluation
					</Text>
					<Text
						fontWeight="400"
						fontSize="14px"
						lineHeight="20px"
						color="#7D7DA0"
					>
                    Define a scoring rubric and assign reviewers.
					</Text>
				</Box>
			</Flex>
			<Spacer />
			<Image
				src="/ui_icons/close_drawer.svg"
				cursor="pointer"
				h="20px"
				w="20px"
				onClick={onClose}
			/>
		</Flex>
	)
}

export default DrawerHeader