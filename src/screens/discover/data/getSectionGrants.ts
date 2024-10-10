import { gql } from '@apollo/client'


export const getSectionGrantsQuery = gql`
query getSectionGrants {
  sections(filter: {
    _operators:{
      _id: {
        in: ["Axelar", "Arbitrum", "Compound", "TON Foundation", "ENS", "Alchemix", "iExec", "Reclaim Protocol", "Haberdashery", "Shido"]
      }
    }
  }) {
    grants(sort: NUMBEROFAPPLICATIONS_DESC) {
      id:_id
      title
      applications(filter: {
        state: "approved"
      }, limit: 2, sort: UPDATEDATS_DESC) {
        id: _id
        applicantId
        state
        createdAtS
        updatedAtS
        milestones {
          id: _id
          amount
        }
      }
      reward {
            id:_id
            asset
            committed
            token {
              id:_id
              label
              address
              decimal
              chainId
              iconHash
            }
          }
      acceptingApplications
      workspace {
        id:_id
        title
        isVisible
        logoIpfsHash
        supportedNetworks
        safe {
          chainId
          address
        }
      }
      link
      deadlineS
      deadline
      numberOfApplications
      numberOfApplicationsSelected
      numberOfApplicationsPending
      createdAtS
      updatedAtS
      totalGrantFundingDisbursedUSD
    }
    sectionName
    sectionLogoIpfsHash
    id:_id
  }
}
`