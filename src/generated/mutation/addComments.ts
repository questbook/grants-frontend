import { gql } from '@apollo/client'
export const addBatchCommentsMutation = gql`mutation addComments($workspace: String!, $grant: String!, $application: [String!]!, $isPrivate: Boolean!, $comments: [JSON!]!) {
    addComments(workspace: $workspace,grant:$grant ,application: $application,isPrivate:$isPrivate,comments:$comments){
      record{
        _id
      }
      recordId
    }
  }`