import { gql } from '@apollo/client'
export const getGranteeList = gql`query getSectionGrants {
    sections(filter: { _id: "Reclaim Protocol" }) {
       grants(sort: NUMBEROFAPPLICATIONS_DESC) {
         id: _id
         title
         workspace {
           _id
           logoIpfsHash
         }
         applications(filter: {
           state: "approved"
         }, sort: UPDATEDATS_DESC, limit: 1000) {
             id: _id
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
           milestones {
             id: _id
             amount
             amountPaid
           }
       }
     }
       sectionName
       sectionLogoIpfsHash
   }
 }`