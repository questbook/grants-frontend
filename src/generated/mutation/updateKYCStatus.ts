import { gql } from '@apollo/client'
export const updateKYCStatusMutation = gql`mutation updateKYCStatus($id: String!,$type: String!, $status: String!, $workspace: String!, $synapsId: String, $synapsType: String, $docuSignId: String){
    updateKYCStatus(id: $id, type: $type, status: $status, workspace: $workspace, synapsId: $synapsId, synapsType: $synapsType, docuSignId: $docuSignId){
      recordId,
      record{
        _id
      }
    }
}`