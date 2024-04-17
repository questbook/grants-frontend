import { gql } from '@apollo/client'
export const updateDocuSign = gql`mutation updateDocuSign($id: String!, $docuSign: String!){
    updateDocuSign(id: $id, docuSign: $id){
      recordId
      record{
        _id
      }
    }
  }`