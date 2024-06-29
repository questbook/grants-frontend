import { gql } from '@apollo/client'


export const getBuilderInfo = gql`query getBuilderInfo($wallet: String!){
    getProfile(filter:{
      address:$wallet
    }) {
      _id
      address
      telegram
      github
      twitter
      username
      imageURL
      compound 
      ens
      axelar
      polygon
    }
}`