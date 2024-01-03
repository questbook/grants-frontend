import { gql } from '@apollo/client'
export const getSpecificApplicationActionQuery = gql`query getApplicationActions($grantId: String!, $proposalId: String!) {
    grantApplications(filter: { grant: $grantId, _id:$proposalId }) {
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