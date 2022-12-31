import { useContext } from 'react'
import { Button } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { ApiClientsContext } from 'src/pages/_app'

function OpenDashboard() {
	const buildComponent = () => (
		<Button
			variant='primaryMedium'
			mr={7}
			onClick={
				() => {
					if(possibleRoles.indexOf('admin') !== -1) {
						setRole('admin')
					} else if(possibleRoles.indexOf('reviewer') !== -1) {
						setRole('reviewer')
					} else if(possibleRoles.indexOf('builder') !== -1) {
						setRole('builder')
					}

					router.push({ pathname: '/dashboard' })
				}
			}>
			Open Dashboard
		</Button>
	)

	const { setRole, possibleRoles } = useContext(ApiClientsContext)!
	const router = useRouter()

	return buildComponent()
}

export default OpenDashboard