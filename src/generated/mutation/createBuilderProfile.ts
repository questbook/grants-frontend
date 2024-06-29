import { gql } from '@apollo/client'
export const createBuilderProfile = gql`
mutation createBuilderProfile($telegram: String, $username: String!, $imageURL: String, $address: String!) {
    createProfile(telegram: $telegram, username: $username, imageURL: $imageURL, address: $address) {
        recordId
        record {
            _id
        }
    }
    }
`