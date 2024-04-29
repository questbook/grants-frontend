import { gql } from '@apollo/client'


export const getWorkspaceDetailsQuery = gql`query getWorkspaceDetails($workspaceID: String!) {
    workspace(_id: $workspaceID) {
      id:_id
      title
      bio
      about
      logoIpfsHash
      coverImageIpfsHash
      synapsId
      docuSign
      supportedNetworks
      safe {
        address
        chainId
      }
      partners {
        name
        industry
        website
        partnerImageHash
      }
      socials {
        name
        value
      }
      tokens {
        address
        label
        decimal
        iconHash
      }
      member:membersFilter(filter: {
        enabled: true
      }) {
        id:_id
        actorId
        publicKey
        email
        accessLevel
        updatedAt
        outstandingReviewIds
        lastReviewSubmittedAt
        enabled
        addedBy {
          id:_id
          actorId
        }
      }
    }
  }
  `