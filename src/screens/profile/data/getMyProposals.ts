import { gql } from '@apollo/client'
export const getMyProposals = gql`query getMyProposals($wallet: String!) {
    grantApplications(filter: { applicantId: $wallet }) {
      id: _id
      name: fieldFilterBySection(filter: { field: "projectName" }) {
        values {
          value
        }
      }
      grant {
        id: _id
        title
        workspace {
          logoIpfsHash
          tokens {
                    _id
                    chainId
                    decimal
                    label
                }
        }
      }
      state
      milestones {
        id: _id
        amount
        amountPaid
      }
    }
  }
  `