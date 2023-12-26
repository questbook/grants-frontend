import { gql } from '@apollo/client'
export const workspaceUpdateSafeMutation = gql`
 mutation workspaceSafeUpdate($id: String!, $longSafeAddress: String!, $safeChainId: String!){
    workspaceSafeUpdate(id: $id, longSafeAddress: $longSafeAddress, safeChainId: $safeChainId){
      recordId
      record{
        _id
      }
    }
}
`