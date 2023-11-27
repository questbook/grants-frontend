import { gql } from '@apollo/client'
import { client } from 'src/graphql/apollo'
import { FundTransfer } from 'src/screens/dashboard/_utils/types'

export const QUERY_FUNDSTRANSFERS = gql`
  query getPayouts($first: Int, $skip: Int, $proposalID: String!) {
    fundTransfers(
      limit: $first
      skip: $skip
      filter: {
        application: $proposalID
        _operators: {
          type: {
            in: ["funds_disbursed", "funds_disbursed_from_safe"]
          }
        }
      }
    ) {
      amount
      asset
      type
      createdAtS
      to
      transactionHash
      status
      executionTimestamp
      milestone {
        id: _id
      }
      grant {
        reward {
          id: _id
          asset
          committed
          token {
            id: _id
            label
            address
            chainId
            iconHash
            decimals
          }
        }
      }
    }
  }
`


export async function usePayouts(proposalID: string): Promise<FundTransfer[]> {
	let records: FundTransfer[] = []
	let skip = 0
	let allData = false

	try {
		while(!allData) {
			const { data, error } = await client.query({
				query: QUERY_FUNDSTRANSFERS,
				variables: {
					skip,
					first: 100,
					proposalID,
				},
			})

			if(data?.fundTransfers && !error) {
				records = records.concat(data.fundTransfers)
				skip += 100

				if(data?.fundTransfers.length === 0) {
					allData = true
				}
			}
		}
	} catch(error) {
	}

	return records
}
