import { gql } from '@apollo/client'
export const createBuilderProfile = gql`
mutation createBuilderProfile($telegram: String, $username: String!, $imageURL: String, $address: String!, $bio: String) {
    createProfile(telegram: $telegram, username: $username, imageURL: $imageURL, address: $address, bio: $bio) {
        recordId
        record {
            _id
        }
    }
    }
`