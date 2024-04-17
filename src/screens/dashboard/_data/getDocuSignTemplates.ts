import { gql } from '@apollo/client'
export const getDocuSignTemplates = gql`mutation getDocuSignTemplates($id: String!){
    getDocuSignTemplates(id: $id){
     templates
    }
  }`