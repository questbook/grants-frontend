import { gql } from '@apollo/client'
export const getAdminTableQuery = gql`query adminTable($id: String!){
    grant(_id: $id){
      applications(sort: UPDATEDATS_DESC){
        id: _id
        applicantId
        state
        synapsStatus
        helloSignStatus
        synapsType
        notes
        milestones{
          id: _id
          title
          state
          amount
          amountPaid
        }
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
    }
    fundTransfers(filter: {
      grant: $id
    }){
      application{
        id: _id
      }
      status
      amount
      milestone{
        id: _id
      }
    }
  }`