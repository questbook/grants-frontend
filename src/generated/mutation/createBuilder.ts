import { gql } from '@apollo/client'
export const createBuilder = gql`mutation createBuilder($telegram: String!, $github: JSON!, $application: String, $email: String!, $twitter: String) {
    createBuilder(telegram: $telegram, github: $github, application: $application, email: $email, twitter: $twitter) {
        recordId
        record {
            _id
        }
    }
    }
    `