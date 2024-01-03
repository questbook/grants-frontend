import { gql } from '@apollo/client'

export const getAdminPublicKeysQuery = gql`query getAdminPublicKeys($workspaceId: String!) {
    workspace(_id: $workspaceId) {
        members:membersFilter(filter: {_operators: {accessLevel: {
          ne:"reviewer"
        }}, enabled: true}) {
            id:_id
            actorId
            fullName
            publicKey
        }
    }
}`