import { gql } from '@apollo/client'
export const addCommentsMutation = gql`mutation addComments($workspace: String!, $grant: String!, $application: [String!]!, $isPrivate: Boolean!, $comment: [JSON!]!) {
    addComments(workspace: $workspace,grant:$grant ,application: $application,isPrivate:$isPrivate,comment:$comment){
      record{
        _id
      }
      recordId
    }
  }`