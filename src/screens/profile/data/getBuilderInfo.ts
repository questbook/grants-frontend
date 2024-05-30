import { gql } from '@apollo/client'


export const getBuilderInfo = gql`query getBuilderInfo($wallet: String!){
    getProfile(filter:{
      address:$wallet
    }) {
      _id
      telegram
      github
      twitter
      username
      imageURL
      proofs
    }
}`