import { gql } from '@apollo/client'
export const updateSynaps = gql`mutation updateSyanps($id: String!, $synapsId: String!) {
	updateSynapsId(id: $id, synapsId: $synapsId) {
    recordId
    record {
      _id
    }
  }
}`