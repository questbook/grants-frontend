import { gql } from '@apollo/client'

export const getAllGrantsForMembers = gql`
query GetAllGrantsForMember(
    $first: Int
    $skip: Int
    $workspaces: [String!]!
    $actorId: RegExpAsString!
  ) {
    grants(
      filter: {
        _operators:{
        workspace: 
        { in: $workspaces }
        }
      }
      limit: $first
      skip: $skip
      sort: CREATEDATS_DESC
    ) {
      id: _id
      title
      applications(filter: { 
        _operators: {
        applicantId: {
          regex:  $actorId
        }
        }}) {
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
        id: _id
        title
        isVisible
        logoIpfsHash
        supportedNetworks
        members: membersFilter(filter: { 
        _operators: {
        actorId: {
          regex:  $actorId
        }
        }}) {
          id: _id
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
        id: _id
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