import { gql } from '@apollo/client'
export const getGrantQuery = gql`
query getGrant($grantId: String!, $actorId: String!) {
  grant(
    _id: $grantId
  ) {
    id:_id
    title
    acceptingApplications
    numberOfApplications
    numberOfApplicationsSelected
    numberOfApplicationsPending
    link
    fields {
      id:_id
      title
      inputType
      possibleValues
      isPii
    }
    applications:applicationsFilter(limit:1) {
      id:_id
    }
    reward {
      committed
      id:_id
      asset
      token {
        address
        label
        decimal
        iconHash
      }
    }
    rubric {
      id:_id
      isPrivate
      items {
        id:_id
        title
        details
        maximumPoints
      }
    }
    reviewType
    payoutType
    myApplications(filter: {applicantId: $actorId}) {
      id:_id
    }
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
      members:membersFilter(filter: { enabled: true }) {
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
        enabled
        addedAt
        updatedAt
      }
    }
  }
}
`