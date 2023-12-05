import { gql } from '@apollo/client'

export const GetGrantProgramDetails = gql`
query getGrantProgramDetails($workspaceID: String!) {
    grantProgram: grants(filter: {workspace: $workspaceID},sort: CREATEDATS_DESC) {
        id: _id
        title
        workspace {
            id: _id
            title
        }
    }
}`