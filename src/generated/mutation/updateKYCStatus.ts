import { gql } from '@apollo/client'
export const updateKYCStatusMutation = gql`mutation updateKYCStatus($id: String!,$type: String!, $status: String!, $workspace: String!){
    updateKYCStatus(id: $id, type: $type, status: $status, workspace: $workspace){
      recordId,
      record{
        _id
      }
    }
}`