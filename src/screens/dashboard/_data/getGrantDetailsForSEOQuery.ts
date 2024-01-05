import { gql } from '@apollo/client'
export const getGrantDetailsForSEOQuery = gql`query getGrantDetailsForSEO($grantId: String!) {
  grant(_id: $grantId) {
    id:_id
    title
    workspace {
      id:_id
      logoIpfsHash
    }
  }
}
`