import { gql } from '@apollo/client'
export const createBuilder = gql`mutation createBuilder($telegram: String!, $github: JSON!, $application: String, $email: String!, $twitter: String, $referral: JSON, $newsletter: Boolean) {
    createBuilder(telegram: $telegram, github: $github, application: $application, email: $email, twitter: $twitter, referral: $referral, newsletter: $newsletter) {
        recordId
        record {
            _id
        }
    }
    }
    `