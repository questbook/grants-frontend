import { useContext, useState } from 'react'
import NavbarLayout from 'src/libraries/ui/navbarLayout'
import { ApiClientsContext } from 'src/contexts/ApiClientsContext'
import AddToSafe from 'src/v2/components/Safe/AddToSafe'
import Dashboard from 'src/v2/components/Safe/Dashboard'


function Safe() {
	const { workspace } = useContext(ApiClientsContext)!

	const [edit, setEdit] = useState<boolean>(false)

	return (
		workspace?.safe && !edit ? <Dashboard setEdit={setEdit} /> : <AddToSafe />
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