import { Button, Image } from '@chakra-ui/react'

interface Props {
  index: number;
  selected: number;
  id: string;
  name: string;
  onClick: () => void;
}

function SidebarItem({ id, selected, index, name, onClick }: Props) {
	const isSelected = index === selected

	return (
		<Button
			variant="ghost"
			borderRadius="2px"
			leftIcon={
				<Image
					src={
						`/left_sidebar/${id}_${
							index === selected ? 'selected' : 'unselected'
						}.svg`
					}
					boxSize="20px"
				/>
			}
			justifyContent="start"
			bg={isSelected ? '#F0F0F7' : 'white'}
			color={isSelected ? '#1F1F33' : '#7D7DA0'}
			_hover={{ bg: '#F0F0F7' }}
			pl={4}
			py={2}
			onClick={onClick}
			cursor="pointer"
			fontSize="14px"
			lineHeight={isSelected ? '16px' : '20px'}
			fontWeight="500"
		>
			{name}
		</Button>
	)
}

export default SidebarItem
