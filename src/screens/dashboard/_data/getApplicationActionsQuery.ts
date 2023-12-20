import { gql } from '@apollo/client'
export const getApplicationActionsQuery = gql`
query getApplicationActions($grantId: String!) {
    grantApplications(filter: { grant: $grantId }) {
      id:_id
      applicantId
      applicantPublicKey
      actions {
        id:_id
        updatedBy
        updatedAtS
        state
        feedback
      }
      grant {
        id:_id
        workspace {
          members:membersFilter {
            actorId
            fullName
            profilePictureIpfsHash
            publicKey
            accessLevel
          }
          supportedNetworks
        }
      }
    }
  }
  `