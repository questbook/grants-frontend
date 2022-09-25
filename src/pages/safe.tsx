import { useContext } from 'react'
import NavbarLayout from 'src/libraries/ui/navbarLayout'
import { ApiClientsContext } from 'src/pages/_app'
import AddToSafe from 'src/v2/components/Safe/AddToSafe'
import Dashboard from 'src/v2/components/Safe/Dashboard'


function Safe() {
	const { workspace } = useContext(ApiClientsContext)!

	return (
		workspace?.safe ? <Dashboard /> : <AddToSafe />
	)
}

Safe.getLayout = function(page: React.ReactElement) {
	return (
		<NavbarLayout>
			{page}
		</NavbarLayout>
	)
}

export default Safe