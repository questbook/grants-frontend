import { gql } from '@apollo/client'
export const getWorkspaceMembersQuery = gql`query getWorkspaceMembers($actorId: String!) {
    workspaceMembers(
      filter: { actorId: $actorId, enabled: true }
      sort: ADDEDAT_DESC
    ) {
      id:_id
      actorId
      enabled
      workspace {
        id:_id
        ownerId
        logoIpfsHash
        title
        supportedNetworks
        safe {
          id:_id
          chainId
          address
        }
        tokens {
          address
          label
          decimal
          iconHash
        }
        safe {
          address
          chainId
        }
        members: membersFilter(filter: { enabled: true }) {
          id:_id
          actorId
          publicKey
          fullName
          email
          accessLevel
          outstandingReviewIds
          lastReviewSubmittedAt
          profilePictureIpfsHash
          pii {
            id:_id
            data
          }
        }
      }
    }
  }
  `