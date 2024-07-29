import { gql } from '@apollo/client'
export const getBuilderProfileQuery = gql`query getBuilderInfo($wallet: String!){
    getProfile(filter:{
      address:$wallet
    }) {
      _id
      telegram
      username
      imageURL
    }
}`