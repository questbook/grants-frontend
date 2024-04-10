import { gql } from '@apollo/client'
import SubDomainConfig from 'src/constants/subdomain.json'

export const getFundsAllocated = gql`query getSectionGrants {
    sections(filter: { _id:  "${SubDomainConfig.id}" }) {
      grants(sort: NUMBEROFAPPLICATIONS_DESC) {
        _id
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