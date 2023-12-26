import { gql } from '@apollo/client'
export const updateMetadataWorkspaceMutation = gql`mutation updateWorkspaceMetadata($id: String!, $metadata: JSON!){
    updateWorkspaceMetadata(id: $id, metadata: $metadata){
      recordId
      record{
        _id
      }
    }
}`