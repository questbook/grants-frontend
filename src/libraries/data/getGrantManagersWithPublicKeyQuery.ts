import { gql } from '@apollo/client'
export const getGrantManagersWithPublicKeyQuery = gql`query getGrantManagersWithPublicKey($grantID: String!) {
    grantManagers(filter: {grant: $grantID}) {
        member {
            actorId,
            publicKey,
           enabled
        }
    }
}`