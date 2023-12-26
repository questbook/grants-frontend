import { gql } from '@apollo/client'
export const updateWorkspaceMemberMutation = gql`
    mutation updateWorkspaceMember($id: String!, $members: [String!]!, $roles: [Int!]!, $enabled: [Boolean!]!, $metadataHashes: [JSON!]!){
        updateWorkspaceMember(id: $id, members: $members, roles: $roles, enabled: $enabled, metadataHashes: $metadataHashes){
            recordId
            record{
                _id
            }
        }
    }
`