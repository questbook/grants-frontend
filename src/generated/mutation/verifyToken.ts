import { gql } from '@apollo/client'
export const verifyTokenMutation = gql`
mutation verifyToken($id: String!, $sign: String!, $isEOA: Boolean){
    verifyToken(id: $id,  sign: $sign, isEOA: $isEOA){
      accessToken
    }
}
`