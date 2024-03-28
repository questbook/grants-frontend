import { gql } from '@apollo/client'


export const getSectionSubGrantsQuery = gql`
query getSectionSubGrants {
    grants(sort: NUMBEROFAPPLICATIONS_DESC, filter: { subgrant: true }) {
      id:_id
      title
      applications(filter: {
        state: "approved"
      },sort: UPDATEDATS_DESC) {
        id: _id
        applicantId
        state
        createdAtS
        updatedAtS
        name: fieldFilterBySection(
          filter:{
            field: "projectName"
          }
        ) {
          values{
            value
          }
        }
        author:fieldFilterBySection(filter: {
          field: "applicantName"
        } ){
          values {
            value
          }
        }
        milestones {
          id: _id
          amount
          amountPaid
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
      fundTransfers {
        amount
        type
        tokenUSDValue
        asset
        tokenName
      }
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
      reward {
        committed
        id:_id
        asset
        token {
          address
          label
          decimal
          iconHash
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