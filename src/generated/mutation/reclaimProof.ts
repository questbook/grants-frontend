import { gql } from '@apollo/client'
export const reclaimProof = gql`mutation reclaimProof($type: String!, $address: String!) {
    generateProof(type: $type, address: $address){
      requestUrl
      requestUrl
      statusUrl
    }
  }`