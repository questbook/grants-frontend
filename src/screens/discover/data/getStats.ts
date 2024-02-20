import { gql } from '@apollo/client'

export const getStatsQuery = gql`query getStats {
    stats {
        builders
        proposals
    }
}`