import { Text } from '@chakra-ui/react'
import { Roles } from 'src/types'

interface Props {
    role: Roles
    isBuilder?: boolean
}

function RoleTag({ role, isBuilder = false }: Props) {
	const buildComponent = () => {
		return (
			<Text
				ml={3}
				variant='body'
				fontWeight='500'
				borderRadius='3px'
				bg={role === 'admin' || role === 'reviewer' ? config[role].bg : role === 'builder' && isBuilder ? config.builder.bg : config.community.bg}
				color='white'
				px={1}>
				{role === 'admin' || role === 'reviewer' ? config[role].text : role === 'builder' && isBuilder ? config.builder.text : config.community.text}
			</Text>
		)
	}

	const config = {
		admin: {
			bg: 'accent.azure',
			text: 'Admin'
		},
		reviewer: {
			bg: 'accent.carrot',
			text: 'Reviewer'
		},
		builder: {
			bg: 'accent.royal',
			text: 'Builder'
		},
		community: {
			bg: 'accent.orchid',
			text: 'Community'
		}
	}

	return buildComponent()
}

export default RoleTag