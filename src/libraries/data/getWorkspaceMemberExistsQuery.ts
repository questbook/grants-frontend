import { gql } from '@apollo/client'
export const getWorkspaceMemberExistsQuery = gql`query getWorkspaceMemberExists($id: String!) {
	workspaceMember(_id: $id) {
		id:_id
	}
}`