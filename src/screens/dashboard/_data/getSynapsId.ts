import { gql } from '@apollo/client'
export const getSynapsId = gql`mutation getSynapseId($id:String!, $type:String!, $proposalId: String!){
  getSynapsId(id: $id, type: $type, proposalId: $proposalId){
    link
  }
}`