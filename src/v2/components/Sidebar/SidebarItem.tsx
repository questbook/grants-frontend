import { Flex, Image, Text } from '@chakra-ui/react'

interface Props {
  index: number;
  selected: number;
  id: string;
  name: string;
  onClick: () => void
}

function SidebarItem({ id, selected, index, name, onClick }: Props) {
	const isSelected = index === selected

	return (
		<Flex
			bg={isSelected ? '#1F1F33' : Flex.defaultProps}
	  my={1}
	  py={3}
			px={4}
	  w="100%"
			borderRadius="2px"
			h="40px"
			justify="start"
			align="center"
	  onClick={onClick}
	  cursor="pointer"
		>
			<Image
				src={
					`/left_sidebar/${id}_${
						index === selected ? 'selected' : 'unselected'
					}.svg`
				}
				boxSize="24px"
			/>
			<Text
				color={isSelected ? '#B6F72B' : '#7D7DA0'}
				ml={4}
				fontSize="14px"
				lineHeight="40px"
				fontWeight="500"
			>
				{name}
			</Text>
		</Flex>
	)
}

export default SidebarItem
