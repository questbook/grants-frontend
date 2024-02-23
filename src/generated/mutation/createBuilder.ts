import { gql } from '@apollo/client'
export const createBuilder = gql`mutation createBuilder($telegram: String!, $github: JSON!) {
    createBuilder(telegram: $telegram, github: $github) {
        recordId
        record {
            _id
        }
    }
    }
    `