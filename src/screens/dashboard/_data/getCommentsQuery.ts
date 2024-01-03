import { gql } from '@apollo/client'
export const getCommentsQuery = gql`query getComments($grantId: String!, $first: Int, $skip: Int) {
    comments(
      limit: $first
      skip: $skip
      filter: { grant: $grantId }
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