import { gql } from '@apollo/client'
export const getGrantsQuery = gql`query getGrant($grantId: String!, $actorId: String!) {
    grant(_id: $grantId) {
      id: _id
      title
      subgrant
      acceptingApplications
      numberOfApplications
      numberOfApplicationsSelected
      numberOfApplicationsPending
      link
      fields {
        id: _id
        title
        inputType
        possibleValues
        isPii
        __typename
      }
      applications(limit: 1){
        id: _id
        __typename
      }
      reward {
        committed
        id: _id
        asset
        token {
          address
          label
          decimal
          iconHash
          __typename
        }
        __typename
      }
      rubric {
        id: _id
        isPrivate
        items {
          id: _id
          title
          details
          maximumPoints
          __typename
        }
        __typename
      }
      reviewType
      payoutType
      myApplications: applications(filter: {applicantId: $actorId}) {
        id: _id
        __typename
      }
      workspace {
        id: _id
        ownerId
        logoIpfsHash
        title
        supportedNetworks
        safe {
          id: _id
          chainId
          address
          __typename
        }
        tokens {
          address
          label
          decimal
          iconHash
          __typename
        }
        safe {
          address
          chainId
          __typename
        }
        members: membersFilter(filter: {enabled: true}) {
          id: _id
          actorId
          publicKey
          fullName
          email
          accessLevel
          outstandingReviewIds
          lastReviewSubmittedAt
          profilePictureIpfsHash
          pii {
            id: _id
            data
            __typename
          }
          enabled
          addedAt
          updatedAt
          __typename
        }
        __typename
      }
      __typename
    }
  }`