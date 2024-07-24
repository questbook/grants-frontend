import { gql } from '@apollo/client'


export const getBuilderInfo = gql`query getBuilderInfo($wallet: String!){
    getProfile(filter:{
      address:$wallet
    }) {
      _id
      address
      telegram
      github
      bio
      twitter
      username
      imageURL
      compound 
      ens
      axelar
      polygon
      arbitrum
      createdAt
      updatedAt
    }
}`