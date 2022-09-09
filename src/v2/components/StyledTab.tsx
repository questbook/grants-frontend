import { Tab } from '@chakra-ui/react'

const StyledTab = ({ label }: { label: string }) => {
	return (
		<Tab
			fontSize='14px'
			lineHeight='20px'
			fontWeight='500'
			py='4'
			h={8}
			minW={0}
			px={2}
			color='#555570'
			_selected={
				{
					fontWeight: 500,
					color: '#1F1F33',
					borderColor: 'currentColor'
				}
			}
			_hover={
				{
					fontWeight: 500,
					color: '#1F1F33',
					borderColor: 'currentColor'
				}
			}
		>
			{label}
		</Tab>
	)
}

export default StyledTab
