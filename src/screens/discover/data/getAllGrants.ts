import { gql } from '@apollo/client'

export const getAllGrants = gql`query GetAllGrants($first: Int, $skip: Int, $searchString: RegExpAsString!) {
  grants(
    limit: $first
    skip: $skip
    sort: CREATEDATS_DESC
    filter: { 
      _operators: {
        title: {
         regex: $searchString
        }
      }
    }
  ) {
    id:_id
    title
    applications(limit: 1) {
      id: _id
      applicantId
      state
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
      members(limit: 1) {
        id:_id
        actorId
        accessLevel
      }
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