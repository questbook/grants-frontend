import React, { useEffect } from 'react'
import { Box, Button, Divider, Flex, Image, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { ApiClientsContext } from 'pages/_app'
import { useNetwork } from 'src/hooks/gasless/useNetwork'
import { useQuestbookAccount } from 'src/hooks/gasless/useQuestbookAccount'
import { MinimalWorkspace } from 'src/types'
import { getUrlForIPFSHash } from 'src/utils/ipfsUtils'
import getRole from 'src/utils/memberUtils'
import { getSupportedChainIdFromSupportedNetwork } from 'src/utils/validationUtils'

interface Props {
  workspaces: MinimalWorkspace[];
  onWorkspaceClick: (index: number) => void;
}

function Domains({ workspaces, onWorkspaceClick }: Props) {
	const { workspace } = React.useContext(ApiClientsContext)!
	const { data: accountData } = useQuestbookAccount()
	const [expanded, setExpanded] = React.useState(false)
	const { network, switchNetwork } = useNetwork()

	const router = useRouter()

	useEffect(() => {
		if(!workspace) {
			return
		}

		const currentChainId = getSupportedChainIdFromSupportedNetwork(workspace.supportedNetworks[0])

		if(network !== currentChainId) {
			switchNetwork(currentChainId)
		}

	}, [network, workspace])

	return (
		<Flex
			direction="column"
			mt={4}>
			<Flex
				direction="column"
				mx={6}>
				<Text
					fontSize="12px"
					lineHeight="16px"
					fontWeight="500"
					color="#AFAFCC"
				>
          DOMAINS
				</Text>
				<Image
					mt={2}
					src={getUrlForIPFSHash(workspace!.logoIpfsHash)}
					boxSize="40px"
				/>
				<Flex mt={2}>
					<Flex direction="column">
						<Text
							fontWeight="500"
							fontSize="16px"
							lineHeight="24px">
							{workspace!.title}
						</Text>
						<Text
							fontSize="14px"
							lineHeight="16px"
							fontWeight="500"
							color="#7D7DA0"
						>
							{getRole(workspace!, accountData?.address!)}
						</Text>
					</Flex>
					<Box mx="auto" />
					{
						workspaces.length > 0 && (
							<Image
								mr={2}
								src={expanded ? '/ui_icons/arrow-drop-down-line-gray-expanded.svg' : '/ui_icons/arrow-drop-down-line-gray.svg'}
								alt="options"
								onClick={
									() => {
										setExpanded(!expanded)
									}
								}
								cursor="pointer"
							/>
						)
					}
				</Flex>
			</Flex>
			<Divider
				variant="sidebar"
				mt={2} />
			<Flex
				direction="column"
				ml={6}>
				<Flex
					display={expanded ? 'block' : 'none'}
					maxH="170px"
					w="100%">
					<Flex
						direction="column"
						overflowY="scroll"
						maxH="80%"
						w="100%"
						py={3}>
						{
							workspaces.map((workspace: MinimalWorkspace, index: number) => {
								return (
									<Flex
										key={`${workspace.id}-${workspace.supportedNetworks[0]}-${index}`}
										w="100%"
										mt={index > 0 ? 4 : 0}
										align="flex-start"
										cursor="pointer"
										onClick={
											() => {
												onWorkspaceClick(index)
											}
										}
									>
										<Image
											src={getUrlForIPFSHash(workspace.logoIpfsHash)}
											boxSize="20px"
											borderRadius="4px"
										/>
										<Flex
											direction="column"
											ml={2}>
											<Text
												fontWeight="400"
												fontSize="14px"
												lineHeight="16px"
												_hover={{ fontWeight: 700 }}
												m={0}
												p={0}
											>
												{workspace.title}
											</Text>
											<Text
												fontSize="14px"
												lineHeight="14px"
												fontWeight="400"
												color="#7D7DA0"
												mt={1}
											>
												{getRole(workspace, accountData?.address!)}
											</Text>
										</Flex>
									</Flex>
								)
							})
						}
					</Flex>
					<Button
						fontWeight="500"
						fontSize="12px"
						lineHeight="16px"
						bg="white"
						leftIcon={
							<Image
								boxSize="20px"
								src="/ui_icons/new_dao.svg" />
						}
						_hover={{ fontWeight: 700 }}
						_active={{}}
						mx={0}
						mt={2}
						px={0}
						onClick={
							() => {
								router.push({ pathname: '/onboarding/create-dao' })
							}
						}
					>
            Create New DAO
					</Button>
				</Flex>
			</Flex>
			{
				expanded && (
					<Divider
						variant="sidebar"
						mt={4} />
				)
			}
		</Flex>
	)
}

export default Domains
