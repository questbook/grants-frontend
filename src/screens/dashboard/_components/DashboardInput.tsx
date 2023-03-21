import { Input, InputProps } from '@chakra-ui/react'

function DashboardInput(props: InputProps) {
	const buildComponent = () => {
		return (
			<Input
				mt={2}
				fontSize='14px'
				fontWeight='400'
				_placeholder={{ color: 'gray.500' }}
				_focus={{ borderColor: 'accent.azure' }}
				border='1px solid'
				{...props} />
		)
	}

	return buildComponent()
}

export default DashboardInput