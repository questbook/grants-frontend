import React from 'react'
import {
	Button,
	Flex,
	Image,
	Menu,
	MenuButton,
	MenuGroup,
	MenuItem,
	MenuList,
	Text,
} from '@chakra-ui/react'

function Actions({
	onAcceptApplicationsClick,
	onRejectApplicationsClick,
}: {
    onAcceptApplicationsClick: () => void;
    onRejectApplicationsClick: () => void;
}) {
	return (
		<Flex
			direction="row"
			justify="start"
			align="flex-start"
			padding="6px 13px"
			gap="4px"
			bg="#F0F0F7"
			borderRadius="2px"
			mr="5"
		>
			<Menu placement="bottom">
				<MenuButton
					as={Button}
					aria-label="View More Options"
					// mt="-28px"
					// pl="16px"
					variant="link"
					_focus={{}}
					color="#1F1F33"
					rightIcon={<Image src="/ui_icons/dropdown_arrow.svg" />}
					fontSize="14px"
					lineHeight="20px"
					fontWeight="500"
					w="fit-content"
					mx="auto"
				>
          Actions
				</MenuButton>
				<MenuList
					minW="164px"
					p={0}>
					<MenuGroup
						title="Applicant actions"
						color="#7D7DA0">
						<MenuItem onClick={onAcceptApplicationsClick}>
							<Image src="/ui_icons/change_stage.svg" />
							<Text
								color="#1F1F33"
								fontWeight="400"
								fontSize="14px"
								lineHeight="20px"
								ml={2}>
							Accept
							</Text>
						</MenuItem>

						<MenuItem onClick={onRejectApplicationsClick}>
							<Image src="/ui_icons/reject_icon.svg" />
							<Text
								color="#1F1F33"
								fontWeight="400"
								fontSize="14px"
								lineHeight="20px"
								ml={2}>
							Reject
							</Text>
						</MenuItem>
					</MenuGroup>
				</MenuList>
			</Menu>

		</Flex>
	)

}

Actions.defaultProps = {
	onViewApplicationFormClick: () => {},
	// onAcceptApplicationClick: () => {},
	// onRejectApplicationClick: () => {},
}
export default Actions
