import { gql } from '@apollo/client'
export const getMemberPublicKeysQuery = gql`query getMemberPublicKeys($workspaceId: String!, $applicationIds: [String!]!) {
    workspace(_id: $workspaceId) {
      members: membersFilter(filter: { 
      _operators:{
        accessLevel: {
          ne:"reviewer"
        }
      }
        enabled: false
      }) {
        actorId
        publicKey
      }
    }
    grantApplications(filter: { 
    _operators:{
      _id: {
        in: $applicationIds
      }
    }
    }) {
      id:_id
      applicantId
      applicantPublicKey
      applicationReviewers {
        member(filter: {
          enabled: true
        }) {
          actorId
          publicKey
        }
      }
    }
  }
  `