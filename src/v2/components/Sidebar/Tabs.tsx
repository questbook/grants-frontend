import React, { useEffect } from 'react'
import { ApiClientsContext } from 'pages/_app'
import { useGetNumberOfApplicationsQuery } from 'src/generated/graphql'
import { useQuestbookAccount } from 'src/hooks/gasless/useQuestbookAccount'
import { useMultiChainQuery } from 'src/hooks/useMultiChainQuery'

enum TabIndex {
	DISCOVER, MY_APPLICATIONS, DASHBOARD, GRANTS_AND_BOUNTIES, SAFE, APPS, SETTINGS, PAYOUTS
}

const TABS = [
	{ id: 'discover', index: TabIndex.DISCOVER, name: 'Discover', path: '/browse_dao' },
	{ id: 'my_applications', index: TabIndex.MY_APPLICATIONS, name: 'My Applications', path: '/your_applications' },
	{ id: 'dashboard', index: TabIndex.DASHBOARD, name: 'Dashboard', path: '/dashboard' },
	{ id: 'grants_and_bounties', index: TabIndex.GRANTS_AND_BOUNTIES, name: 'Grants And Bounties', path: '/your_grants' },
	{ id: 'safe', index: TabIndex.SAFE, name: 'Safe', path: '/safe' },
	{ id: 'apps', index: TabIndex.APPS, name: 'Apps', path: '/apps' },
	{ id: 'settings', index: TabIndex.SETTINGS, name: 'Settings', path: '/manage_dao' },
	{ id: 'payouts', index: TabIndex.PAYOUTS, name: 'Payouts', path: '/payouts' }
]

function useGetTabs() {
	const { data: accountData } = useQuestbookAccount()
	const { workspace } = React.useContext(ApiClientsContext)!

	const [applicationCount, setApplicationCount] = React.useState(0)

	const { results, fetchMore } = useMultiChainQuery({
		useQuery: useGetNumberOfApplicationsQuery,
		options: {
			variables: {
				applicantId: accountData?.address ?? '',
			}
		}
	})

	useEffect(() => {
		if(accountData?.address) {
			fetchMore({ applicantId: accountData?.address }, true)
		}
	}, [accountData?.address])

	useEffect(() => {
		setApplicationCount(results.length)
	}, [results])

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

export { useGetTabs, TabIndex, TABS }