import { ContentState, convertFromRaw, EditorState } from 'draft-js'
import { Form, Grant } from 'src/screens/proposal_form/_utils/types'
import { getFromIPFS, isIpfsHash } from 'src/utils/ipfsUtils'

function containsField(grant: Grant, field: string) {
	return grant?.fields?.some((f) => f.id.endsWith(field))
}

function findField(form: Form, id: string) {
	return form.fields.find((f) => f.id === id) ?? { id, value: '' }
}

const getProjectDetails = async(projectDetails: string) => {
	try {
		if(isIpfsHash(projectDetails)) {
			const o = await getFromIPFS(projectDetails)
			// console.log('From IPFS: ', o)
			return EditorState.createWithContent(convertFromRaw(JSON.parse(o)))
		} else {
			// console.log('Previous text value: ', projectDetails)
			const o = JSON.parse(projectDetails)
			return EditorState.createWithContent(convertFromRaw(o))
		}
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch(e: any) {
		if(projectDetails) {
			return EditorState.createWithContent(ContentState.createFromText(projectDetails))
		} else {
			return EditorState.createEmpty()
		}
	}
}

export { containsField, findField, getProjectDetails }