import { gql } from '@apollo/client'
export const sendDocuSign = gql`mutation sendDocuSign($id: String!, $proposalId: String!, $name: String!, $email: String!, $templateId: String!){
    sendDocuSign(id: $id, proposalId: $proposalId, name: $name, email: $email, templateId: $templateId){
      recordId
      record{
        _id
      }
    }
  }`