import { gql } from '@apollo/client'
export const createBuilderProfile = gql`
mutation createBuilderProfile($telegram: String, $github: String,$twitter: String, $username: String!, $imageURL: String, $address: String!) {
    createProfile(telegram: $telegram, github: $github, twitter: $twitter, username: $username, imageURL: $imageURL, address: $address) {
        recordId
        record {
            _id
        }
    }
    }
`