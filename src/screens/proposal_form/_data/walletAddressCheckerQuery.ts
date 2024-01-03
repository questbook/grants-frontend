import { gql } from '@apollo/client'
export const walletAddressCheckerQuery = gql`query walletAddressChecker($grantId:String!, $walletAddress:String!){
    grantApplications(filter:{grant: $grantId, applicantId: $walletAddress} )  {
     id:_id
     walletAddress
     applicantId
       }
   }`