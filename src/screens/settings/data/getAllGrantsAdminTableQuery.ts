import { gql } from '@apollo/client'
export const getAllGrantsAdminTableQuery = gql`query getAllGrants {
    section(_id: "Axelar"){
        grants {
            id: _id
            title
    }
    }
}`