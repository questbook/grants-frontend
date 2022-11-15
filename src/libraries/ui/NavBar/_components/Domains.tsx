import { useContext, useEffect, useMemo } from 'react'
import { Flex, Image, Text } from '@chakra-ui/react'
import { SupportedSafes } from '@questbook/supported-safes'
import config from 'src/constants/config.json'
import { SafeContext } from 'src/contexts/safeContext'
import { useGetWorkspaceMembersQuery } from 'src/generated/graphql'
import { useQuestbookAccount } from 'src/hooks/gasless/useQuestbookAccount'
import { useMultiChainQuery } from 'src/hooks/useMultiChainQuery'
import logger from 'src/libraries/logger'
import { ApiClientsContext } from 'src/pages/_app'
import { MinimalWorkspace } from 'src/types'
import getAvatar from 'src/utils/avatarUtils'
import { getUrlForIPFSHash } from 'src/utils/ipfsUtils'

function Domains() {
	const buildComponent = () => {
		return (
			<Flex
				px={3}
				py={1}
				align='center'>
				<Image
					boxSize='32px'
					src={workspace?.logoIpfsHash === config.defaultDAOImageHash ? getAvatar(true, workspace?.title) : getUrlForIPFSHash(workspace?.logoIpfsHash!)} />
				<Flex
					direction='column'
					ml={2}>
					<Text
						variant='v2_body'
						fontWeight='500'>
						{workspace?.title}
					</Text>
					{/* <Flex align='center'>
						<Image src={safeObj} />
					</Flex> */}
				</Flex>
			</Flex>
		)
	}

	const { workspace, setWorkspace } = useContext(ApiClientsContext)!
	const { safeObj, setSafeObj } = useContext(SafeContext)!
	useEffect(() => {
		logger.info({ safeObj }, '(Domains) Safe object')
	}, [safeObj])
	const { data: accountData } = useQuestbookAccount()

	const { results, fetchMore } = useMultiChainQuery({
		useQuery: useGetWorkspaceMembersQuery,
		options: {
			variables: {
				actorId: accountData?.address ?? '',
			}
		}
	})

	const workspaces = useMemo(() => {
		const workspaces: MinimalWorkspace[] = []
		for(const result of results) {
			if(result?.workspaceMembers?.length) {
				for(const mem of result.workspaceMembers) {
					if(mem?.workspace) {
						workspaces.push(mem.workspace)
					}
				}
			}
		}

		return workspaces
	}, [results])

	useEffect(() => {
		if(workspaces.length && !workspace) {
			const savedWorkspaceData = localStorage.getItem('currentWorkspace')
			if(!savedWorkspaceData || savedWorkspaceData === 'undefined') {
				setWorkspace(workspaces[0])
			} else {
				const savedWorkspaceDataChain = savedWorkspaceData.split('-')[0]
				const savedWorkspaceDataId = savedWorkspaceData.split('-')[1]
				const i = workspaces.findIndex(
					(w) => w.id === savedWorkspaceDataId &&
	           		 w.supportedNetworks[0] === savedWorkspaceDataChain
				)
				setWorkspace(workspaces[i])
			}
		}
	}, [workspaces, workspace])

	useEffect(() => {
		if(workspace?.id!) {
			const currentSafe = new SupportedSafes().getSafe(parseInt(workspace?.safe?.chainId!), workspace.safe?.address!)
			setSafeObj(currentSafe)
		}
	}, [workspace?.id!])

	useEffect(() => {
		if(accountData?.address) {
			fetchMore({
				actorId: accountData?.address,
			}, true)
		}
	}, [accountData?.address])

	return buildComponent()
}

export default Domains