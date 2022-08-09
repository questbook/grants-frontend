import React from 'react'
import {
	Button, Image, Menu,
	MenuButton,
	MenuGroup,
	MenuItem, MenuList
} from '@chakra-ui/react'

type DropdownMenuProps = {
title: string
actions: (() => void) []
images:string[]
texts:string[]
}

const DropdownMenu = ({ title, actions, images, texts }: DropdownMenuProps) => {
	return (
		<Menu >
			<MenuButton
				mr={5}
				as={Button}
				backgroundColor="#E0E0EC" >
				<Image src="/ui_icons/grant_options_dropdown.svg" />
			</MenuButton>
			<MenuList>
				<MenuGroup
					title={title}
					color="#7D7DA0">
					{
						images.map((image, index) => {
							return (
								<MenuItem
									key={texts[index]}
									onClick={actions[index]} >
									<Image
										src={image}
										mr="12px" />
									{texts[index]}
								</MenuItem>
							)
						})
					}
				</MenuGroup>
			</MenuList>
		</Menu>
	)
}

export default DropdownMenu