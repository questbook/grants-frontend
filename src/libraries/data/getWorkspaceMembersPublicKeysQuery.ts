import { gql } from '@apollo/client'
export const getWorkspaceMembersPublicKeysQuery = gql`query getWorkspaceMembersPublicKeys($workspaceId: String!) {
    workspaceMembers(filter: { workspace: $workspaceId, enabled: true }) {
        actorId
         publicKey
    }
}`