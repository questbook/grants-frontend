import { useContext, useEffect, useMemo, useRef } from 'react'
import { Flex, FlexProps, Image, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, Text } from '@chakra-ui/react'
import { SupportedSafes } from '@questbook/supported-safes'
import { CHAIN_INFO, defaultChainId } from 'src/constants/chains'
import config from 'src/constants/config.json'
import { SafeContext } from 'src/contexts/safeContext'
import { useGetWorkspaceMembersQuery } from 'src/generated/graphql'
import { useQuestbookAccount } from 'src/hooks/gasless/useQuestbookAccount'
import { useMultiChainQuery } from 'src/hooks/useMultiChainQuery'
import logger from 'src/libraries/logger'
import { DOMAIN_CACHE_KEY } from 'src/libraries/ui/NavBar/_utils/constants'
import { ApiClientsContext, WebwalletContext } from 'src/pages/_app'
import { MinimalWorkspace } from 'src/types'
import getAvatar from 'src/utils/avatarUtils'
import { formatAddress } from 'src/utils/formattingUtils'
import { getUrlForIPFSHash } from 'src/utils/ipfsUtils'
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils'

function Domains() {
	const buildComponent = () => {
		return (
			workspaces?.length > 1 ? (
				<Popover
					isLazy
					initialFocusRef={popoverRef}>
					{
						({ onClose }) => (
							<>
								<PopoverTrigger>
									{popoverButton()}
								</PopoverTrigger>
								<PopoverContent>
									<PopoverHeader>
										<Text
											variant='v2_body'
											fontWeight='500'>
											Choose a different domain
										</Text>
									</PopoverHeader>
									<PopoverArrow />
									<PopoverCloseButton />
									<PopoverBody
										maxH='40vh'
										overflowY='auto'>
										{
											workspaces.map((_) => {
												return domainItem(_, { my: 2 }, () => {
													setWorkspace(_)
													onClose()
												})
											})
										}
									</PopoverBody>
								</PopoverContent>
							</>
						)
					}
				</Popover>
			) : popoverButton()
		)
	}

	const domainItem = (workspace: MinimalWorkspace, props?: FlexProps, onClick?: () => void) => {
		return (
			<Flex
				onClick={onClick}
				cursor={onClick ? 'pointer' : 'default'}
				{...props}>
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
					<Text
						variant='v2_metadata'
						color='gray.5'>
						{workspace?.safe?.address && formatAddress(workspace.safe.address)}
					</Text>
					{
						onClick && process.env.NODE_ENV === 'development' && (
							<Text
								variant='v2_body'
								color='black.3'
							>
								{CHAIN_INFO[getSupportedChainIdFromWorkspace(workspace) ?? defaultChainId].name}
								{' '}
								-
								{' '}
								{workspace.id}
								{' ('}
								{workspace?.members?.[workspace?.members?.map((_) => _.actorId).findIndex((_) => _ === scwAddress?.toLowerCase())]?.accessLevel}
								)
							</Text>
						)
					}
				</Flex>
			</Flex>
		)
	}

	const popoverButton = () => {
		return (
			<Flex
				bg='white'
				px={3}
				py={1}
				align='center'>
				{workspace && domainItem(workspace)}
			</Flex>
		)
	}

	const popoverRef = useRef<HTMLButtonElement>(null)
	const { scwAddress } = useContext(WebwalletContext)!
	const { workspace, setWorkspace } = useContext(ApiClientsContext)!
	const { safeObj, setSafeObj } = useContext(SafeContext)!
	useEffect(() => {
		logger.info({ safeObj, class: safeObj?.class }, '(Domains) Safe object')
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
			const savedWorkspaceData = localStorage.getItem(DOMAIN_CACHE_KEY)
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

	return workspace?.id ? buildComponent() : <Flex />
}

export default Domains