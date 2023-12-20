import { gql } from '@apollo/client'
export const getApplicationDetailsQuery = gql`
query getApplicationDetails($applicationID: String!) {
    grantApplication(
      _id: $applicationID,
    ) {
      id:_id
      fields {
        id:_id
        values {
          value
        }
      }
      pii {
        id:_id
        data
      }
      milestones {
        id:_id
        title
        amount
        amountPaid
        updatedAtS
        feedbackDao
        feedbackDaoUpdatedAtS
        feedbackDev
        feedbackDevUpdatedAtS
        state
      }
      grant {
        id:_id
        title
        funding
        workspace {
          id:_id
          title
          logoIpfsHash
          supportedNetworks
          members:membersFilter {
            id:_id
            actorId
            publicKey
          }
        }
        reward {
          id:_id
          asset
          committed
          token {
            address,
            label,
            decimal,
            iconHash
          }
        }
        fields {
          id:_id
          title
          isPii
        }
        rubric {
          isPrivate
          items {
            id:_id,
            title,
            details,
            maximumPoints,
          },
        },
        fundTransfers: fundsTransferFilter (filter: {type: "funds_disbursed_from_safe"}) {
          milestone {
            id:_id
            title
            amount
            amountPaid
            updatedAtS
            feedbackDao
            feedbackDaoUpdatedAtS
            feedbackDev
            feedbackDevUpdatedAtS
            state
          }
          amount
          type
          asset
          nonEvmAsset
          transactionHash
          status
          application{
            applicantId
            id:_id
            state
          }
          createdAtS
        },
      }
      pendingReviewerAddresses
      doneReviewerAddresses
      reviews {
        reviewer {
          actorId
          id:_id
          email
          fullName
        }
        data {
          id:_id
          manager {
            id:_id
          }
          data
        }
        publicReviewDataHash
        id:_id
        createdAtS
      }
      reviewers {
        actorId
        email
        id:_id
        fullName
      }
      applicantId
      applicantPublicKey
      state
      feedbackDao,
      feedbackDev,
      createdAtS
      updatedAtS
    }
  }  
`