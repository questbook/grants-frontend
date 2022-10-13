import React, { useContext, useEffect, useMemo } from 'react'
import {
	Box,
	Flex
} from '@chakra-ui/react'
import { defaultChainId } from 'src/constants/chains'
import { useGetWorkspaceDetailsQuery } from 'src/generated/graphql'
import { useMultiChainQuery } from 'src/hooks/useMultiChainQuery'
import { ApiClientsContext } from 'src/pages/_app'
import EditForm from 'src/screens/manage_dao/_components/Settings/edit_form'
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils'

function Settings() {
	// const { t } = useTranslation()
	const buildComponent = () => (
		<Flex
			direction='column'
			align='start'
			w='70%'>
			{
				workspaceData && (
					<EditForm
						workspaceData={workspaceData}
					/>
				)
			}
			<Box my={10} />
		</Flex>
	)

	const { workspace } = useContext(ApiClientsContext)!

	const { results, fetchMore } = useMultiChainQuery({
		useQuery: useGetWorkspaceDetailsQuery,
		options: {
			variables: {
				workspaceID: workspace?.id ?? '',
			}
		},
		chains: [getSupportedChainIdFromWorkspace(workspace) ?? defaultChainId]
	})

	useEffect(() => {
		if(!workspace) {
			return
		}

		fetchMore({
			workspaceID: workspace.id
		}, true)
	}, [workspace])

	const workspaceData = useMemo(() => {
		if(!results) {
			return undefined
		}

		return results[0]?.workspace
	}, [results])

	return buildComponent()
}

export default Settings
