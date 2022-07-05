import { TabIndex, TABS } from 'src/v2/components/Sidebar/Tabs'

export default function getTabFromPath(path: string): TabIndex {
	if(path === '/') {
		return TabIndex.DISCOVER
	}

	const a = path.slice(1)
	for(const tab of TABS.slice(1)) {
		const b = tab.path.slice(1)
		if(a.includes(b)) {
			return tab.index
		}
	}

	return TabIndex.DISCOVER
}
