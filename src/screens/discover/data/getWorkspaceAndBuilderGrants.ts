import { gql } from '@apollo/client'
import client from 'src/graphql/apollo'
import logger from 'src/libraries/logger'


export const GetWorkspacesAndBuilderGrants = gql`
query getWorkspacesAndBuilderGrants($first: Int, $skip: Int, $actorId: RegExpAsString!) {
  workspaceMembers(
    sort: ADDEDAT_DESC,
    limit: $first
    skip: $skip
    filter: {
      _operators: {
        actorId:{
          regex: $actorId
        }
      }
    }
  )  {
    id:_id
    accessLevel
    enabled
    workspace {
      id:_id
      title
      supportedNetworks
      grants {
        id:_id
      }
    }
  }
  grants(filter: {
    applications_: {
     _operators: {
       applicantId: {
         regex: $actorId
       }
     }
   }}
   limit: $first
   skip: $skip
   sort: CREATEDATS_DESC
   ){
     id:_id
     title
     applications(filter: { _operators: {
       applicantId: {
         regex: $actorId
       }
     } }) {
       id:_id
       applicantId
       state
     }
     acceptingApplications
     fundTransfers {
       amount
       type
       tokenUSDValue
       asset
       tokenName
     }
     workspace {
       id:_id
       title
       isVisible
       logoIpfsHash
       supportedNetworks
       members(limit: 1) {
         id:_id
         actorId
         accessLevel
       }
       safe {
         chainId
         address
       }
     }
     reward {
       committed
       id:_id
       asset
       token {
         address
         label
         decimal
         iconHash
       }
     }
     deadlineS
     deadline
     numberOfApplications
     numberOfApplicationsSelected
     numberOfApplicationsPending
     createdAtS
     updatedAtS
     totalGrantFundingDisbursedUSD
   }
}
`

type WorkspaceMember = {
  id: string
  accessLevel: string
  enabled: boolean
  workspace: {
    id: string
    title: string
    supportedNetworks: string[]
  }
}

type Grant = {
  id: string
  title: string
  applications: {
    id: string
    applicantId: string
    state: string
  }[]
  acceptingApplications: boolean
  fundTransfers: {
    amount: string
    type: string
    tokenUSDValue: string
    asset: string
    tokenName: string
  }[]
  workspace: {
    id: string
    title: string
    isVisible: boolean
    logoIpfsHash: string
    supportedNetworks: string[]
    members: {
      id: string
      actorId: string
      accessLevel: string
    }[]
    safe: {
      chainId: string
      address: string
    }
  }
  reward: {
    committed: string
    id: string
    asset: string
    token: {
      address: string
      label: string
      decimal: string
      iconHash: string
    }
  }
  deadlineS: string
  deadline: string
  numberOfApplications: string
  numberOfApplicationsSelected: string
  numberOfApplicationsPending: string
  createdAtS: string
  updatedAtS: string
  totalGrantFundingDisbursedUSD: string
}


type WorkspaceAndBuilderGrants = {
  workspaceMembers: WorkspaceMember[]
  grants: Grant[]
}

export async function getWorkspacesAndBuilderGrantsQuery({
	actorId,
}: {
  actorId: string
}): Promise<WorkspaceAndBuilderGrants[]> {
	let grants: Grant[] = []
	let workspaceMembers: WorkspaceMember[] = []
	let skip = 0
	let allData = false

	try {
		while(!allData) {
			const { data, error } = await client.query({
				query: GetWorkspacesAndBuilderGrants,
				variables: {
					skip,
					first: 100,
					actorId,
				},
			})

			if(data?.workspaceMembers && !error) {
				workspaceMembers = workspaceMembers.concat(data.workspaceMembers)
				skip += 100
			}

			if(data?.grants && !error) {
			  grants = grants.concat(data.grants)
				skip += 100
			}

			if(data?.workspaceMembers.length === 0 && data?.grants?.length === 0) {
				allData = true
			}

		}
	} catch(error) {
	}

	logger.info('workspaceMembers', workspaceMembers)

	return [{ workspaceMembers, grants }]
}