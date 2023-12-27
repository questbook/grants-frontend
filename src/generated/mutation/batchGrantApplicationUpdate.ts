import { gql } from '@apollo/client'
export const batchGrantApplicationUpdate = gql`
    mutation batchGrantApplicationUpdate($id: [String!]!, $grant: String!, $workspaceId: String!, $applicantId: [String!], $state: [String!]!, $feedback: [JSON!]!){
    batchGrantApplicationUpdate(id: $id, grant: $grant, workspaceId: $workspaceId, applicantId: $applicantId, state: $state, feedback: $feedback){
      recordId
      record{
        _id
      }
    }
}
`