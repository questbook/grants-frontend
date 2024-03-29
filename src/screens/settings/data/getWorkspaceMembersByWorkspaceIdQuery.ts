import { gql } from '@apollo/client'


export const getWorkspaceMembersByWorkspaceIdQuery = gql`
query getWorkspaceMembersByWorkspaceId(
    $workspaceId: String!
    $first: Int
    $skip: Int
  ) {
    workspaceMembers(
      filter: { workspace: $workspaceId, enabled: true }
      limit: $first
      skip: $skip
    ) {
      id:_id
      actorId
      fullName
      profilePictureIpfsHash
      accessLevel
      addedAt
      publicKey
      email
      enabled
      pii {
          id:_id
          data
      }
    }
  }
`