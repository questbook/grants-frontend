import { gql } from '@apollo/client'
export const walletAddressCheckerQuery = gql`query walletAddressChecker($grantId:String!, $walletAddress:String!){
    grantApplications(filter:{grant: $grantId, walletAddress: $walletAddress} )  {
     id:_id
     walletAddress
     applicantId
       }
   }`