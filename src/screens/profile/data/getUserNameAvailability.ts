import { gql } from '@apollo/client'
export const getUserNameAvailability = gql`query getUsernameAvailablity($username: String!){
    usernameCheck(username: $username) {
       isAvailable
    }
}`