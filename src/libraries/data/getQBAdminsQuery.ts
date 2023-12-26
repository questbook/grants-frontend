import { gql } from '@apollo/client'
export const getQBAdminsQuery = gql`query getQBAdmins {
    qbAdmins {
        walletAddress
    }
}
`