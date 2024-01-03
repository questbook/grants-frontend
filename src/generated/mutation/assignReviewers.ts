import { gql } from '@apollo/client'
export const assignReviewersMutation = gql`mutation assignReviewers($workspaceId: String!,$applicationId: String!,$grantAddress: String!, $reviewers: [String!]!, $active: [Boolean!]!){
    assignReviewers(workspaceId: $workspaceId, applicationId: $applicationId, grantAddress: $grantAddress,  reviewers: $reviewers,  active: $active){
      recordId
      record{
        _id
      }
    }
  }
`