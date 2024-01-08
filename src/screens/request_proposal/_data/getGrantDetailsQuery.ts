import { gql } from '@apollo/client'
export const getGrantDetailsQuery = gql`query grantDetails($grantId: String!) {
    grant(_id: $grantId) {
      id:_id
      creatorId
      title
      summary
      details
      reward {
        id:_id
        asset
        committed
        token {
          id:_id
          label
          address
          decimal
          iconHash
          chainId
        }
      }
      startDate
      deadline
      startDateS
      deadlineS
      payoutType
      reviewType
      link
      docIpfsHash
      acceptingApplications
      metadataHash
      funding
      workspace {
        id:_id
        title
        supportedNetworks
        logoIpfsHash
        safe {
          address
          chainId
        }
      }
      fields: fields {
        id:_id
        title
        inputType
        possibleValues
        isPii
      }
      milestones
    }
  }`