import { gql } from '@apollo/client'
export const getFundsAllocated = gql`query getSectionGrants {
    sections {
      grants(sort: NUMBEROFAPPLICATIONS_DESC) {
        _id
        applications(filter: {
          state: "approved"
        }, sort: UPDATEDATS_DESC, limit: 10) {
          milestones {
            id: _id
            amount
          }
      }
    }
  }
  }`