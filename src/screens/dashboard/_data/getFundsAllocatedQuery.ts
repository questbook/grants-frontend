import { gql } from '@apollo/client'
export const getFundsAllocatedQuery = gql`query getFundsAllocated($id: String!) {
  grantApplications(
    filter: {state: "approved", grant: $id}
    sort: UPDATEDATS_DESC
  ) {
    grant {
      totalGrantFundingDisbursedUSD
      fundTransfers {
        _id
        amount
      }
      __typename
    }
    milestones {
      id: _id
      amount
      amountPaid
      __typename
    }
    __typename
  }
}`