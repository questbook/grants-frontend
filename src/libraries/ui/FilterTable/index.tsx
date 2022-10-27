import { ReactNode } from 'react'
import { TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import StyledTab from 'src/libraries/ui/FilterTable/StyledTab'

type Tab = {
    title: string
    element: ReactNode
}

type Props = {
    tabs: Tab[]
    tabIndex: number
    onChange: (tab: number) => void
}

function FilterTable({ tabs, tabIndex, onChange }: Props) {
	return (
		<Tabs
			w='100%'
			index={tabIndex}
			onChange={onChange}
			h={8}
		>
			<TabList>
				{
					tabs.map((tab, index) => (
						<StyledTab
							key={index}
							label={tab.title} />
					))
				}
				{/* {helperElement} */}
			</TabList>

			<TabPanels>
				{
					tabs.map((tab, index) => (
						<TabPanel
							key={index}
							tabIndex={index}
							borderRadius='2px'
							p={0}
							mt={5}
							boxShadow='inset 1px 1px 0px #F0F0F7, inset -1px -1px 0px #F0F0F7'>
							{tab.element}
						</TabPanel>
					))
				}
			</TabPanels>
		</Tabs>
	)
}

export default FilterTable