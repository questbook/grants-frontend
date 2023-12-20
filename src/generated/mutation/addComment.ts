import { gql } from '@apollo/client'
export const addCommentMutation = gql`mutation addComment($workspace: String!, $grant: String!, $application: String!, $isPrivate: Boolean!, $comment: JSON!, $sender: String!) {
    addComment(workspace: $workspace,grant:$grant ,application: $application,isPrivate:$isPrivate,comment:$comment,sender:$sender){
      record{
        _id
      }
      recordId
    }
  }`