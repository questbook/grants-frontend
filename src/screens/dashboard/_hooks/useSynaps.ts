import { useContext } from 'react'
import { executeMutation } from 'src/graphql/apollo'
import { GrantsProgramContext } from 'src/pages/_app'
import { getSynapsId } from 'src/screens/dashboard/_data/getSynapsId'

function GetSynapsLink() {

	const { grant } = useContext(GrantsProgramContext)!


	const getSynapsLink = async(type: 'KYC' | 'KYB', proposalId: String) => {
		const synapsId = await executeMutation(getSynapsId, { id: grant?.workspace?.id, type, proposalId })
		return synapsId?.getSynapsId?.link
	}

	return { getSynapsLink }
}

export default GetSynapsLink