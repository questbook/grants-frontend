import { TABS, TabType } from 'src/v2/components/Sidebar/Tabs'

export default function getTabFromPath(path: string): TabType {
	if(path === '/') {
		return 'DISCOVER'
	} else if(path === '/signup') {
		return 'GRANTS_AND_BOUNTIES'
	}

	const a = path.slice(1)
	for(const tab of TABS.slice(1)) {
		const b = tab.path.slice(1)
		if(a.includes(b)) {
			return tab.id.toUpperCase() as TabType
		}
	}

	return 'DISCOVER'
}
