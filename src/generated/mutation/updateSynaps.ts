import { gql } from '@apollo/client'
export const updateSynaps = gql`mutation updateSyanps($id: String!, $synapsId: String!, $type: String!) {
	updateSynapsId(id: $id, synapsId: $synapsId, type: $type) {
    recordId
    record {
      _id
    }
  }
}`