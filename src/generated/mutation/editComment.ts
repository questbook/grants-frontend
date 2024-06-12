import { gql } from '@apollo/client'
export const editCommentMutation = gql`mutation editComment($id: String! $isPrivate: Boolean!, $comment: JSON!) {
    editComment(id: $id,isPrivate:$isPrivate,comment:$comment){
      record{
        _id
      }
      recordId
    }
  }`