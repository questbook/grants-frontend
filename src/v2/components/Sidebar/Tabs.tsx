import React from 'react'
import { useToast } from '@chakra-ui/react'
import { ApiClientsContext } from 'pages/_app'
import {
	useGetNumberOfApplicationsLazyQuery,
	useGetNumberOfGrantsLazyQuery,
} from 'src/generated/graphql'
import { useQuestbookAccount } from 'src/hooks/gasless/useQuestbookAccount'
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils'
import { useConnect } from 'wagmi'

enum TabIndex {
	DISCOVER, MY_APPLICATIONS, DASHBOARD, GRANTS_AND_BOUNTIES, TRANSACTIONS, INTEGRATIONS, SETTINGS, PAYOUTS
}

const TABS = [
	{ id: 'discover', index: TabIndex.DISCOVER, name: 'Discover', path: '/browse_dao' },
	{ id: 'my_applications', index: TabIndex.MY_APPLICATIONS, name: 'My Applications', path: '/your_applications' },
	{ id: 'dashboard', index: TabIndex.DASHBOARD, name: 'Dashboard', path: '/dashboard' },
	{ id: 'grants_and_bounties', index: TabIndex.GRANTS_AND_BOUNTIES, name: 'Grants And Bounties', path: '/your_grants' },
	{ id: 'transactions', index: TabIndex.TRANSACTIONS, name: 'Transactions', path: '/funds' },
	{ id: 'integrations', index: TabIndex.INTEGRATIONS, name: 'Integrations', path: '/integrations' },
	{ id: 'settings', index: TabIndex.SETTINGS, name: 'Settings', path: '/manage_dao' },
	{ id: 'payouts', index: TabIndex.PAYOUTS, name: 'Payouts', path: '/payouts' }
]

function useGetTabs() {
	const { data: accountData } = useQuestbookAccount()
	const { isConnected } = useConnect()
	const { workspace, subgraphClients } = React.useContext(ApiClientsContext)!

	const getNumberOfApplicationsClients = Object.keys(subgraphClients)!.map(
		(key) => useGetNumberOfApplicationsLazyQuery({ client: subgraphClients[key].client }),
	)

	const getNumberOfGrantsClients = Object.fromEntries(
		Object.keys(subgraphClients)!.map((key) => [
			key,
			useGetNumberOfGrantsLazyQuery({ client: subgraphClients[key].client }),
		]),
	)

	const [applicationCount, setApplicationCount] = React.useState(0)
	const [grantsCount, setGrantsCount] = React.useState(0)
	const toast = useToast()

	React.useEffect(() => {
		if(!accountData?.address) {
			return
		}

		if(!workspace) {
			return
		}

		const getNumberOfApplications = async() => {
			try {
				const promises = getNumberOfApplicationsClients.map(
					// eslint-disable-next-line no-async-promise-executor
					(query) => new Promise(async(resolve) => {
						const { data } = await query[0]({
							variables: { applicantId: accountData?.address },
						})
						if(data && data.grantApplications.length > 0) {
							resolve(data.grantApplications.length)
						} else {
							resolve(0)
						}
					}),
				)
				Promise.all(promises).then((value: any[]) => {
					setApplicationCount(value.reduce((a, b) => a + b, 0))
				})
			} catch(e) {
				toast({
					title: 'Error getting application count',
					status: 'error',
				})
			}
		}

		const getNumberOfGrants = async() => {
			try {
				const query = getNumberOfGrantsClients[getSupportedChainIdFromWorkspace(workspace)!][0]
				const { data } = await query({
					variables: { workspaceId: workspace?.id },
				})
				if(data && data.grants.length > 0) {
					setGrantsCount(data.grants.length)
				} else {
					setGrantsCount(0)
				}
			} catch(e) {
				toast({
					title: 'Error getting grants count',
					status: 'error',
				})
			}
		}

		getNumberOfApplications()
		getNumberOfGrants()

	}, [accountData?.address, workspace?.id, isConnected])

	console.log('WORKSPACE: ', workspace)
	if(!workspace || !workspace.id) {
		// Pure applicant
		return [ [TABS[0], TABS[1]], [] ]
	} else {
		const member = workspace.members.find((m) => m.actorId.toLowerCase() === accountData?.address?.toLowerCase())
		if(!member) {
			return [[], []]
		}

		if(member.accessLevel === 'admin' || member.accessLevel === 'owner') {
			if(applicationCount > 0) {
				// Owner or admin with applicants
				return [ TABS.slice(0, 2), TABS.slice(2, 7) ]
			} else {
				// Owner or admin without applicants
				return [ TABS.slice(0, 1), TABS.slice(2, 7) ]
			}
		} else {
			if(applicationCount > 0) {
				// Reviewer with applicants
				return [ TABS.slice(0, 2), [TABS[2], TABS[7]] ]
			} else {
				// Reviewer without applicants
				return [ TABS.slice(0, 1), [TABS[2], TABS[7]] ]
			}
		}
	}
}

export { useGetTabs, TabIndex, TABS }