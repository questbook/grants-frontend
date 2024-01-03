import { gql } from '@apollo/client'
export const joinViaInviteLinkMutation = gql`mutation joinViaInviteLink($id: String!, $members: [String!]!, $roles: [Int!]!, $enabled: [Boolean!]!, $metadataHashes: [JSON!]!, $w: String!, $r: String!, $k: String!){
    joinViaInviteLink(id: $id, members: $members, roles: $roles, enabled: $enabled, metadataHashes: $metadataHashes, w: $w, r: $r, k: $k){
      recordId
      record{
        _id
      }
    }
}
`