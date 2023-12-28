import { gql } from '@apollo/client'
export const getProposalNameAndAuthorsQuery = gql`
query fetchNamesAndAuthors($ids: [String]!){
  grantApplications(filter: {
		_operators: {
      _id: {
        in: $ids
      }
    }
  },limit: 100, sort: UPDATEDATS_DESC){
     _id
     name: fieldFilterBySection(
          filter:{
            field: "projectName"
          }
        ) {
          values{
            value
          }
        }
        author:fieldFilterBySection(filter: {
          field: "applicantName"
        } ){
          values {
            value
          }
        }
  }
}`