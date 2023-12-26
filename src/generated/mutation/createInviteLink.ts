import { gql } from '@apollo/client'
export const createInviteLinkMutation = gql`
mutation createInviteLink($w: String!, $r: String!, $k: String!, $createdBy: String!){
    createInviteLink(w: $w, r: $r, k: $k, createdBy: $createdBy){
      recordId
      record{
        _id
      }
    }
}`