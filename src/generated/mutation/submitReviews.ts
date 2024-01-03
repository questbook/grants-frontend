import { gql } from '@apollo/client'
export const submitReviewsMutation = gql`mutation submitReviews($workspaceId: String!,$applicationId: String!,$grantAddress: String!, $metadata: JSON!, $reviewerAddress: String!){
    submitReviews(workspaceId: $workspaceId, applicationId: $applicationId, grantAddress: $grantAddress,  metadata: $metadata,  reviewerAddress: $reviewerAddress){
      recordId
      record{
        _id
      }
    }
}`