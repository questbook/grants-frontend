import { gql } from '@apollo/client'
import { client } from 'src/graphql/apollo'
import { FundTransfer } from 'src/screens/discover/_utils/types'

export const QUERY_FUNDSTRANSFERS = gql`
query getAllFundsTransfer($first: Int, $skip: Int) {
    fundTransfers(limit:$first,skip:$skip) {
      grant{
        id:_id
      }
      amount
      type
      tokenUSDValue
      asset
      tokenName
    }
  }
`


export async function getAllFundsTransfers(): Promise<FundTransfer[]> {
	let records: FundTransfer[] = []
	let skip = 0
	let allData = false

	try {
		while(!allData) {
			const { data, error } = await client.query({
				query: QUERY_FUNDSTRANSFERS,
				variables: {
					skip,
					first: 500,
				},
			})

			if(data?.fundTransfers && !error) {
				records = records.concat(data.fundTransfers)
				skip += 500

				if(data?.fundTransfers.length === 0) {
					allData = true
				}
			}
		}
	} catch(error) {
	}

	return records
}
