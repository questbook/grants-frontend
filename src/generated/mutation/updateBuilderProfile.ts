import { gql } from '@apollo/client'
export const updateBuilderProfile = gql`
mutation updateBuilderProfile($telegram: String, $github: String,$twitter: String, $username: String!, $imageURL: String, $address: String!) {
    updateProfile(telegram: $telegram, github: $github, twitter: $twitter, username: $username, imageURL: $imageURL, address: $address) {
        recordId
        record {
            _id
        }
    }
    }
`