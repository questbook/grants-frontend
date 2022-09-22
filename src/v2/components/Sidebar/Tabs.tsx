import React, { useEffect } from 'react'
import { useGetNumberOfApplicationsQuery } from 'src/generated/graphql'
import { useQuestbookAccount } from 'src/hooks/gasless/useQuestbookAccount'
import { useMultiChainQuery } from 'src/hooks/useMultiChainQuery'
import { ApiClientsContext } from 'src/pages/_app'

export const TABS = {
	'discover': { name: 'Discover', path: '' },
	'my_applications': { name: 'My Proposals', path: 'your_applications' },
	'dashboard': { name: 'Stats', path: 'dashboard' },
	'grants_and_bounties': { name: 'Grants', path: 'your_grants' },
	'safe': { name: 'Multisig Wallet', path: 'safe' },
	'settings': { name: 'Profile', path: 'manage_dao' },
} as const

export type Tab = keyof typeof TABS

export function useGetTabs() {
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

	const member = workspace?.members.find((m) => (
		m.actorId.toLowerCase() === accountData?.address?.toLowerCase()
	))

	let tabs: Tab[][]
	if(!workspace?.id) {
		// Pure applicant
		tabs = [ ['discover', 'my_applications'], [] ]
	} else if(!member) {
		tabs = [[], []]
	} else if(member.accessLevel === 'admin' || member.accessLevel === 'owner') {
		tabs = [
			applicationCount ? ['discover', 'my_applications'] : ['discover'],
			['dashboard', 'grants_and_bounties', 'safe', 'settings']
		]
	} else {
		tabs = [
			applicationCount ? ['discover', 'my_applications'] : ['discover'],
			['grants_and_bounties']
		]
	}

	return tabs
}

const TAB_ID_LIST = Object.keys(TABS) as Tab[]

export function getTabFromPath(path: string): Tab {
	const firstComponent = path.split('/')[1]
	if(firstComponent === 'signup') {
		return 'grants_and_bounties'
	}

	for(const id of TAB_ID_LIST) {
		const { path: tabPath } = TABS[id]
		if(tabPath === firstComponent) {
			return id
		}
	}

	return TAB_ID_LIST[0]
}