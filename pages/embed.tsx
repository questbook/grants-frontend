import { useContext, useEffect, useState } from 'react'
import {
	Box,
	Grid,
	Text
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { SupportedChainId } from 'src/constants/chains'
import { useGetDaoDetailsQuery } from 'src/generated/graphql'
import { DAOWorkspace } from 'src/types'
import { ApiClientsContext } from './_app'

export default function Embed() {
	const width = '1080px'
	const height = '480px'

	const router = useRouter()
	const { subgraphClients } = useContext(ApiClientsContext)!

	const [chainID, setChainId] = useState<SupportedChainId>()
	const [daoID, setDaoId] = useState<string>()
	const [workspaceData, setWorkspaceData] = useState<DAOWorkspace>()

	useEffect(() => {
		if(router && router.query) {
			const { chainId: cId, daoId: dId } = router.query
			setChainId((cId as unknown) as SupportedChainId)
			setDaoId(dId?.toString())
		}
	}, [router])

	const [queryParams, setQueryParams] = useState<any>({
		client: subgraphClients[chainID ?? SupportedChainId.RINKEBY].client,
	})

	useEffect(() => {
		if(!daoID) {
			return
		}

		if(!chainID) {
			return
		}

		setQueryParams({
			client: subgraphClients[chainID].client,
			variables: {
				workspaceID: daoID,
				daoID,
			},
		})

	}, [chainID, daoID])

	const { data, error, loading } = useGetDaoDetailsQuery(queryParams)

	useEffect(() => {
		if(data) {
			setWorkspaceData(data?.workspace!)
		}
	}, [data, error, loading])

	return (
		<Box
			w={width}
			h={height}
		>
			<Box

			>
				<Grid>
					<Text />
				</Grid>
			</Box>
		</Box>
	)
}