import { gql } from '@apollo/client'
export const getAdminTableQuery = gql`query adminTable($id: String!){
    grant(_id: $id){
      applications(sort: UPDATEDATS_DESC, limit: 1000){
        id: _id
        applicantId
        state
        synapsStatus
        helloSignStatus
        updatedAtS
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
      status: "executed"
    }, limit: 1000){
      application{
        id: _id
      }
      status
      amount
      transactionHash
      milestone{
        id: _id
      }
    }
  }`