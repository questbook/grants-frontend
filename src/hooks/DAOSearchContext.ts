import { useState } from 'react'
import { ContextGenerator } from 'src/utils/contextGenerator'

const useDaoSearch = () => {
	const [searchString, setSearchString] = useState<string>()

	return {
		searchString,
		setSearchString,
	}
}

export const {
	context: DAOSearchContext,
	contextMaker: DAOSearchContextMaker,
} = ContextGenerator(useDaoSearch)
