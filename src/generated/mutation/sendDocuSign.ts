import { gql } from '@apollo/client'
export const sendDocuSign = gql`mutation sendDocuSign($id: String!, $proposalId: String!, $email: [JSON]!, $templateId: String!, $templateName: String!){
    sendDocuSign(id: $id, proposalId: $proposalId, email: $email, templateId: $templateId, templateName: $templateName){
      recordId
      record{
        _id
      }
    }
  }`