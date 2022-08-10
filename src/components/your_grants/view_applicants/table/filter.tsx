import React from 'react'
import {
	Button,
	Flex,
	Image,
	Menu, MenuButton, MenuItem, MenuList, Text, } from '@chakra-ui/react'
import FilterStates from '../filterStates'
import { TableFilterNames } from './TableFilters'

function Filter({
	filter,
	setFilter,
}: {
  filter: number;
  setFilter: (i: number) => void;
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
          Filter By
				</MenuButton>
				<MenuList
					minW="164px"
					p={0}>
					{
						Object.keys(TableFilterNames).map((option, i) => (
							<MenuItem
								key={option}
								onClick={() => setFilter(i - 1)}>
								<Text
									fontSize="14px"
									fontWeight="400"
									lineHeight="20px"
									color="#122224"
								>
									{TableFilterNames[option as keyof typeof TableFilterNames]}
								</Text>
							</MenuItem>
						))
					}
				</MenuList>
			</Menu>
			{
				filter >= 0 && (
					<FilterStates
						filter={
							TableFilterNames[Object
								.keys(TableFilterNames)[filter + 1] as keyof typeof TableFilterNames]
						}
						setFilter={setFilter}
					/>
				)
			}
		</Flex>

	)
}

export default Filter
