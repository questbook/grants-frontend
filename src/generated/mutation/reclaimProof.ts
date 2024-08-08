import { gql } from '@apollo/client'
export const reclaimProof = gql`mutation reclaimProof($type: String!, $address: String!, $proposalId: String, $pubKey: String){ 
    generateProof(type: $type, address: $address, proposalId: $proposalId, pubKey: $pubKey) {
      requestUrl
      statusUrl
      migrationId
    }
  }`