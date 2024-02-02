import { gql } from '@apollo/client'
export const addTableNotesMutation = gql`mutation addTableNotes($id: String!, $notes: String!, $workspace: String!){
    addTableNotes(id: $id, notes: $notes, workspace: $workspace){
      recordId
      record{
        _id
      }
    }
  }`