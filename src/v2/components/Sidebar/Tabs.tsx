import React from 'react'
import { useToast } from '@chakra-ui/react'
import { ApiClientsContext } from 'pages/_app'
import {
	useGetNumberOfApplicationsLazyQuery,
} from 'src/generated/graphql'
import { useQuestbookAccount } from 'src/hooks/gasless/useQuestbookAccount'
import { useConnect } from 'wagmi'

type Tabs = 'DISCOVER' | 'MY_APPLICATIONS' | 'DASHBOARD' | 'GRANTS_AND_BOUNTIES' | 'SAFE' | 'APPS' | 'SETTINGS' | 'PAYOUTS'

const TAB_INDEXES: {[_ in Tabs]: number} = {
	DISCOVER: 0,
	MY_APPLICATIONS: 1,
	DASHBOARD: 2,
	GRANTS_AND_BOUNTIES: 3,
	SAFE: 4,
	APPS: 5,
	SETTINGS: 6,
	PAYOUTS: 7,
}

export type TabType = keyof typeof TAB_INDEXES

const TABS = [
	{ id: 'discover', index: TAB_INDEXES.DISCOVER, name: 'Discover', path: '/browse_dao' },
	{ id: 'my_applications', index: TAB_INDEXES.MY_APPLICATIONS, name: 'My Applications', path: '/your_applications' },
	{ id: 'dashboard', index: TAB_INDEXES.DASHBOARD, name: 'Dashboard', path: '/dashboard' },
	{ id: 'grants_and_bounties', index: TAB_INDEXES.GRANTS_AND_BOUNTIES, name: 'Grants And Bounties', path: '/your_grants' },
	{ id: 'safe', index: TAB_INDEXES.SAFE, name: 'Safe', path: '/safe' },
	{ id: 'apps', index: TAB_INDEXES.APPS, name: 'Apps', path: '/apps' },
	{ id: 'settings', index: TAB_INDEXES.SETTINGS, name: 'Settings', path: '/manage_dao' },
	{ id: 'payouts', index: TAB_INDEXES.PAYOUTS, name: 'Payouts', path: '/payouts' }
]

function useGetTabs() {
	const { data: accountData } = useQuestbookAccount()
	const { isConnected } = useConnect()
	const { workspace, subgraphClients } = React.useContext(ApiClientsContext)!

	const getNumberOfApplicationsClients = Object.keys(subgraphClients)!.map(
		(key) => useGetNumberOfApplicationsLazyQuery({ client: subgraphClients[key].client }),
	)

	const [applicationCount, setApplicationCount] = React.useState(0)
	const toast = useToast()

	const getNumberOfApplications = async() => {
		try {
			const promises: Array<Promise<number>> = getNumberOfApplicationsClients.map(
				// eslint-disable-next-line no-async-promise-executor
				(query) => new Promise(async(resolve) => {
					const { data } = await query[0]({
						variables: { applicantId: accountData?.address! },
					})
					if(data && data.grantApplications.length > 0) {
						resolve(data.grantApplications.length)
					} else {
						resolve(0)
					}
				}),
			)
			Promise.all(promises).then((value) => {
				const sum = value.reduce((a, b) => a + b, 0)
				setApplicationCount(sum)
			})
		} catch(_) {
			toast({
				title: 'Error getting application count',
				status: 'error',
			})
		}
	}

	React.useEffect(() => {
		if(!accountData?.address) {
			return
		}

		getNumberOfApplications()
	}, [accountData?.address, isConnected])

	if(!workspace || !workspace.id) {
		// Pure applicant
		if(applicationCount > 0) {
			return [ [TABS[0], TABS[1]], [] ]
		} else {
			return [ [TABS[0]], [] ]
		}
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
				return [ TABS.slice(0, 2), [TABS[3], TABS[7]] ]
			} else {
				// Reviewer without applicants
				return [ TABS.slice(0, 1), [TABS[3], TABS[7]] ]
			}
		}
	}
}

export { useGetTabs, TAB_INDEXES, TABS }
