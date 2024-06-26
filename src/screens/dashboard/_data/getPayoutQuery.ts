import { gql } from '@apollo/client'
export const getPayoutQuery = gql`query getPayouts($first: Int, $skip: Int, $proposalID: String!) {
  fundTransfers(
    limit: $first
    skip: $skip
    filter: {
      application: $proposalID
      _operators: {
        type: {
          in: ["funds_disbursed", "funds_disbursed_from_safe"]
        }
      }
    }
  ) {
    amount
    asset
    type
    createdAtS
    to
    transactionHash
    status
    executionTimestamp
    milestone {
      id: _id
    }
    grant {
      reward {
        id: _id
        asset
        committed
        token {
          id: _id
          label
          address
          chainId
          iconHash
          decimal
        }
      }
    }
  }
}
`