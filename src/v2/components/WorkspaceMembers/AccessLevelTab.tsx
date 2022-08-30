import { Tab } from '@chakra-ui/react'

type Props = {
  accessLevel: string
}

function AccessLevelTab({ accessLevel }: Props) {
	return (
		<Tab
			_selected={{ color: '#E0E0EC', bg: '#1F1F32' }}
			bg='#E0E0EC'
			marginRight={2}
			paddingTop={1}
			fontSize={15}
			paddingBottom={1}
			borderRadius={2}
		>
			{accessLevel}
		</Tab>
	)
}

export default AccessLevelTab
