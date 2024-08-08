import { gql } from '@apollo/client'
export const getMigrationStatusQuery = gql`query migrationStatus($id: MongoID!){
    migration(_id: $id){
            status
    }
}`