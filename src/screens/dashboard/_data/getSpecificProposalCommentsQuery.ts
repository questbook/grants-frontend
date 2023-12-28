import { gql } from '@apollo/client'
export const getSpecificProposalCommentsQuery = gql`query getComments($grantId: String!, $proposalId: String!) {
    comments(
      filter: { grant: $grantId, application: $proposalId }
      sort:CREATEDAT_ASC
    ) {
      id:_id
      isPrivate
      commentsPublicHash
      createdAt
      commentsEncryptedData {
        id:_id
        data
      }
      workspace {
        members {
          actorId
          fullName
          profilePictureIpfsHash
          publicKey
          accessLevel
        }
        supportedNetworks
      }
      application {
        id:_id
        applicantPublicKey
        applicantId
      }
    }
  }
  `