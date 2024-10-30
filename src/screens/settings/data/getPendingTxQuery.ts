import { gql } from '@apollo/client'

export const getPendingTxQuery = gql`query getPendingTx($id: String!) {
    fundTransfers(filter: { grant: $id, status: "queued" }, limit: 1000) {
      application {
        id: _id
        name: fieldFilterBySection(filter: { field: "projectName" }) {
          values {
            value
          }
        }
      }
      status
      transactionHash
      amount
      milestone {
        id: _id
        title
      }
    }
  }
`
