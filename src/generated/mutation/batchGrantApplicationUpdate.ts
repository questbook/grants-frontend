import { gql } from '@apollo/client'
export const batchGrantApplicationUpdateMutation = gql`
    mutation batchUpdateGrantApplication($id: [String!]!, $grant: String!, $workspaceId: String!, $applicantId: [String!], $state: [String!]!, $feedback: [JSON!]!){
      batchUpdateGrantApplication(id: $id, grant: $grant, workspaceId: $workspaceId, applicantId: $applicantId, state: $state, feedback: $feedback){
      recordId
      record{
        _id
      }
    }
}
`