import { gql } from '@apollo/client'
export const updateBuilderProfile = gql`
mutation updateBuilderProfile($telegram: String, $imageURL: String, $address: String!, $bio: String) {
    updateProfile(telegram: $telegram, imageURL: $imageURL, address: $address, bio: $bio) {
        recordId
        record {
            _id
        }
    }
    }
`