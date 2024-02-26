import { gql } from '@apollo/client'
export const createBuilder = gql`mutation createBuilder($telegram: String!, $github: JSON!, $application: String, $email: String!) {
    createBuilder(telegram: $telegram, github: $github, application: $application, email: $email) {
        recordId
        record {
            _id
        }
    }
    }
    `