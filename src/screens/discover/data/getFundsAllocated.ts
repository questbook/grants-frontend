import { gql } from '@apollo/client'
export const getFundsAllocated = gql`query getSectionGrants {
    sections(filter: { _id: "Shido" }) {
      grants(sort: NUMBEROFAPPLICATIONS_DESC) {
        id: _id
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