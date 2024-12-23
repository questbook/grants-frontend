import { gql } from '@apollo/client'
export const getProposalsQuery = gql`query getProposals($first: Int, $skip: Int, $grantID: String!) {
    grantApplications(
      filter: { grant: $grantID }
      limit: $first
      skip: $skip
      sort: UPDATEDATS_DESC
    ) {
      id:_id
      applicantId
      applicantPublicKey
      state
      synapsId
      fields {
        id:_id
        values {
          id:_id
          value
        }
      }
      migratedFrom {
        id: _id
        title
        workspace {
          safe {
            address
          }
        }
      }
      helloSignId
      pii {
        id:_id
        manager {
          id:_id
          member {
            id:_id
            actorId
            fullName
            profilePictureIpfsHash
            accessLevel
            publicKey
            addedAt
            updatedAt
            enabled
          }
        }
        data
      }
      createdAtS
      updatedAtS
      milestones {
        id:_id
        title
        state
        amount
        amountPaid
        updatedAtS
        feedbackDao
        feedbackDaoUpdatedAtS
        feedbackDev
        feedbackDevUpdatedAtS
        details
        deadline
      }
      feedbackDao
      feedbackDev
      reviews {
        id:_id
        reviewer {
          id:_id
          actorId
          fullName
          profilePictureIpfsHash
          accessLevel
          publicKey
          addedAt
          updatedAt
          enabled
        }
        createdAtS
        publicReviewDataHash
        data {
          id:_id
          manager {
            id:_id
            member {
              id:_id
              actorId
              fullName
              profilePictureIpfsHash
              accessLevel
              publicKey
              addedAt
              updatedAt
              enabled
            }
          }
          data
        }
      }
      pendingReviewerAddresses
      doneReviewerAddresses
      applicationReviewers {
        id:_id
        member {
          id:_id
          actorId
          fullName
          profilePictureIpfsHash
          accessLevel
          publicKey
          addedAt
          updatedAt
          enabled
        }
        assignedAtS
      }
      version
      grant {
        id:_id
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
        workspace {
          id:_id
          title
          logoIpfsHash
          supportedNetworks
        }
      }
    }
  }`