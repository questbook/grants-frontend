import { gql } from '@apollo/client'
export const updateDocuSign = gql`mutation updateDocuSign($id: String!, $docuSign: String!){
    updateDocuSign(id: $id, docuSign: $docuSign){
      recordId
      record{
        _id
      }
    }
  }`