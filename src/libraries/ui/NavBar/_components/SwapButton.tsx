import { useContext, useMemo } from 'react'
import { Button, Text } from '@chakra-ui/react'
import { Swap } from 'src/generated/icons'
import { ApiClientsContext } from 'src/pages/_app'

function SwapButton() {
	const buildComponent = () => {
		return (
			<Button
				variant='ghost'
				ml={6}
				display={getSwitchRole === '' ? 'none' : 'flex'}
				leftIcon={<Swap boxSize='20px' />}
				onClick={
					() => {
						if(getSwitchRole !== '') {
							setRole(getSwitchRole)
						}
					}
				}>
				<Text
					variant='v2_body'
					fontWeight='500'>
					Switch to
					{' '}
					{getSwitchRole}
				</Text>

			</Button>
		)
	}

	const { possibleRoles, role, setRole } = useContext(ApiClientsContext)!

	const getSwitchRole = useMemo(() => {
		if((role === 'admin' || role === 'reviewer') && possibleRoles.indexOf('builder') !== -1) {
			return 'builder'
		} else if(role === 'builder' && possibleRoles.indexOf('admin') !== -1) {
			return 'admin'
		} else if(role === 'builder' && possibleRoles.indexOf('reviewer') !== -1) {
			return 'reviewer'
		}

		return ''
	}, [possibleRoles, role])

	return buildComponent()
}

export default SwapButton