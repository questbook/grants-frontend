import { gql } from '@apollo/client'
export const generateTokenMutation = gql`
mutation generateToken($address: String!){
    generateToken(address: $address){
      recordId
      record{
        id: _id
        nonce
      }
    }
}
`