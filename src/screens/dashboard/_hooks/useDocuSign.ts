import { useContext } from 'react'
import { executeMutation } from 'src/graphql/apollo'
import { GrantsProgramContext } from 'src/pages/_app'
import { getDocuSignTemplates } from 'src/screens/dashboard/_data/getDocuSignTemplates'

function GetDocuSignTemplates() {

	const { grant } = useContext(GrantsProgramContext)!


	const getHelloSignTemplates = async() => {
		const templates = await executeMutation(getDocuSignTemplates, { id: grant?.workspace?.id })
		return templates?.getDocuSignTemplates?.templates
	}

	return { getHelloSignTemplates }
}

export default GetDocuSignTemplates