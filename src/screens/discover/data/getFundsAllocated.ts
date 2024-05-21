import { gql } from '@apollo/client'
export const getFundsAllocated = gql`query getSectionGrants {
    sections(filter: { _id: "Arbitrum" }) {
      grants(sort: NUMBEROFAPPLICATIONS_DESC) {
        _id
        title
        applications(filter: {
          state: "approved"
        }, sort: UPDATEDATS_DESC, limit: 1000) {
          milestones {
            id: _id
            amount
          }
      }
    }
  }
  }`