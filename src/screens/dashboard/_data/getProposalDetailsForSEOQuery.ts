import { gql } from '@apollo/client'
export const getProposalDetailsForSEOQuery = gql`# This query is used in getServerSideProps for SEO
query getProposalDetailsForSEO($proposalId: String!) {
  grantApplication(_id: $proposalId) {
    id:_id
    title: fieldFilterByRegex(filter: { field: "projectName" }) {
      values {
        value
      }
    }
    grant {
      id:_id
      title
      workspace {
        id:_id
        logoIpfsHash
      }
    }
  }
}
`