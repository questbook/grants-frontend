import React, { useEffect } from 'react'
import {
	Box,
	Button,
	Container,
	Flex,
	Image,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Text,
} from '@chakra-ui/react'

interface DropdownProps {
  listItems: { icon?: string; label: string, id: number }[];
  listItemsMinWidth?: string;
  dropdownWidth?: string;
  defaultItem?: { icon?: string; label: string, id: number };
  label?: string;
  // eslint-disable-next-line react/no-unused-prop-types
  value?: string;
  onChange?: Function;
}

const defaultProps = {
	listItemsMinWidth: '0',
	dropdownWidth: 'auto',
	defaultItem: null,
	label: '',
	value: '',
	onChange: null,
}

function SecondaryDropdown({
	listItems,
	listItemsMinWidth,
	defaultItem,
	dropdownWidth,
	label,
	onChange,
}: DropdownProps) {
	const [isOpen, setIsOpen] = React.useState(false)
	const defaultSelected = defaultItem || listItems[0]
	const [selected, setSelected] = React.useState(defaultSelected)
	useEffect(() => {
		if(defaultSelected) {
			setSelected(defaultSelected)
		}
	}, [defaultItem])
	return (
		<Flex
			flexDirection="column"
			alignItems="stretch"
			width={dropdownWidth}
			position="relative">
			{
				label && label.length && (
					<>
						<Text
							lineHeight="20px"
							fontWeight="bold">
							{label}
						</Text>
						<Box mt={1} />
					</>
				)
			}
			<Menu
				onClose={() => setIsOpen(false)}
				isOpen={isOpen}
				variant="form">
				<MenuButton
					maxW="100%"
					h="32px"
					mt={1}
					as={Button}
					rightIcon={onChange ? <Image src="/ui_icons/form_dropdown.svg" /> : null}
					textAlign="left"
					flex={1}
					p={0}
					bg="#CAD7FD"
					border="2px solid #87A0EB"
					_active={{ background: '#87A0EB' }}
					_hover={{ background: '#87A0EB' }}
					pr={5}
					onClick={
						() => {
							if(!onChange) {
								return
							}

							setIsOpen(!isOpen)
						}
					}
					minW={280}
				>
					<Container
						alignItems="center"
						display="flex"
						w="full"
						px={4}
						py={3}
						h="32px"
						justifyContent="flex-start"
					>
						{
							selected.icon && selected.icon.length ? (
								<Image
									mr={3}
									h="14px"
									w="14px"
									src={selected.icon} />
							) : null
						}
						<Text
							fontWeight="500"
							fontSize="16px"
							color="#414E50">
							{selected.label}
						</Text>
					</Container>
				</MenuButton>
				<MenuList
					minW={0}
					py={0}>
					{
						listItems.map(({ icon, label: text, id }) => (
							<MenuItem
								key={id}
								onClick={
									() => {
										if(!onChange) {
											return
										}

										setSelected({ icon, label: text, id })
										onChange(id)
									}
								}
								minW={listItemsMinWidth}
								p={0}
							>
								<Flex
									alignItems="center"
									w="full"
									px={3}
									py={2}
									h="32px"
									justifyContent="flex-start"
								>
									{
										icon && icon.length ? (
											<Image
												mr={3}
												h="14px"
												w="14px"
												src={icon} />
										) : null
									}
									<Text
										fontWeight="400"
										fontSize="14px"
										color="#414E50">
										{text}
									</Text>
								</Flex>
							</MenuItem>
						))
					}
				</MenuList>
			</Menu>
		</Flex>
	)
}

SecondaryDropdown.defaultProps = defaultProps
export default SecondaryDropdown
