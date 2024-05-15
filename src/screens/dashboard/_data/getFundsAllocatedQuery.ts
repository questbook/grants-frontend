import { gql } from '@apollo/client'
export const getFundsAllocatedQuery = gql`query getFundsAllocated($id: String!) {
    grantApplications(filter: {
      state: "approved",
      grant: $id
    }, sort: UPDATEDATS_DESC) {
      grant {
        totalGrantFundingDisbursedUSD
      }
      milestones {
        id: _id
        amount
        amountPaid
      }
}
}`