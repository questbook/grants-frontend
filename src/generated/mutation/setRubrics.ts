import { gql } from '@apollo/client'
export const setRubricsMutation = gql`mutation setRubric($workspaceId: String!, $grantId:String!, $metadataHash:JSON!){
    setRubric(workspaceId: $workspaceId, grantId: $grantId, metadataHash: $metadataHash){
      record{
        _id
      }
      recordId
    }
  }`