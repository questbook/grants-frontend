import { gql } from '@apollo/client'


export const getSectionSubGrantsQuery = gql`
query getSectionSubGrants {
    grants(sort: NUMBEROFAPPLICATIONS_DESC, filter: { subgrant: true }) {
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
        grant {
          id: _id
          title
          workspace {
            logoIpfsHash
            supportedNetworks
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
}
`