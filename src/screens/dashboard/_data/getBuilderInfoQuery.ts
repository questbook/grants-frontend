import { gql } from '@apollo/client'
export const getBuilderInfoQuery = gql`query getBuilderInfo($id: String!) {
    builder(applicationId: $id) {
      telegram
    }
  }`