import { gql } from '@apollo/client'
export const submitReviewsMutation = gql`mutation submitReviews($workspaceId: String!,$applicationId: String!,$grantAddress: String!, $metadata: JSON!, $reviewerAddress: String!,$status: String){
    submitReviews(workspaceId: $workspaceId, applicationId: $applicationId, grantAddress: $grantAddress,  metadata: $metadata,  reviewerAddress: $reviewerAddress, status: $status){
      recordId
      record{
        _id
      }
    }
}`