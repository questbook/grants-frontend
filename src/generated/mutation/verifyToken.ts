import { gql } from '@apollo/client'
export const verifyTokenMutation = gql`
mutation verifyToken($id: String!, $sign: String!){
    verifyToken(id: $id,  sign: $sign){
      accessToken
    }
}
`