import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function useActiveTabIndex(tabs: string[], defaultTabIndex: number = -1) {
	const [activeIndex, setActiveIndex] = useState(defaultTabIndex)
	const { asPath } = useRouter()
	useEffect(() => {
		const splitPaths = asPath.split('/')
		const basePath = splitPaths.length >= 1 ? splitPaths[1] : splitPaths[0]
		setActiveIndex(tabs.indexOf(basePath))
	}, [asPath, tabs])

	return activeIndex
}
