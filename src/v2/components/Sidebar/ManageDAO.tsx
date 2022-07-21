import React from 'react'
import { Box, Button, Flex, Image, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { ApiClientsContext } from 'pages/_app'
import { useQuestbookAccount } from 'src/hooks/gasless/useQuestbookAccount'
import { MinimalWorkspace } from 'src/types'
import { getUrlForIPFSHash } from 'src/utils/ipfsUtils'
import getRole from 'src/utils/memberUtils'

interface Props {
  workspaces: MinimalWorkspace[];
  onWorkspaceClick: (index: number) => void;
}

function ManageDAO({ workspaces, onWorkspaceClick }: Props) {
	const { workspace } = React.useContext(ApiClientsContext)!
	const { data: accountData } = useQuestbookAccount()
	const [expanded, setExpanded] = React.useState(false)

	const router = useRouter()

	return workspace && workspace.id && accountData?.address ? (
		<Flex
			direction="column"
			mx={6}
			my={4}>
			<Text
				fontSize="12px"
				lineHeight="16px"
				fontWeight="500"
				color="#AFAFCC">
        MANAGE DAO
			</Text>
			<Image
				mt={2}
				src={getUrlForIPFSHash(workspace.logoIpfsHash)}
				boxSize="40px"
			/>
			<Flex mt={2}>
				<Flex direction="column">
					<Text fontWeight="500">
						{workspace.title}
					</Text>
					<Text
						fontSize="12px"
						lineHeight="16px"
						fontWeight="500"
						color="#7D7DA0"
					>
						{getRole(workspace, accountData?.address)}
					</Text>
				</Flex>
				<Box mx="auto" />
				{
					workspaces.length > 0 && (
						<Image
							mr={2}
							src="/ui_icons/arrow-drop-down-line-gray.svg"
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
			{
				expanded && (
					<Flex
						bg="#E0E0EC"
						height="2px"
						w="100%"
						my={4} />
				)
			}
			<Flex
				display={expanded ? 'block' : 'none'}
				maxH="170px"
				w="100%">
				<Flex
					direction="column"
					overflowY="scroll"
					maxH="80%"
					w="100%">
					{
						workspaces.map((workspace: MinimalWorkspace, index: number) => {
							return (
								<Flex
									key={`${workspace.id}-${workspace.supportedNetworks[0]}`}
									w="100%"
									mt={index > 0 ? 4 : 0}
									align="center"
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
									/>
									<Flex
										direction="column"
										ml={2}>
										<Text
											fontWeight="500"
											fontSize="12px"
											lineHeight="16px"
											_hover={{ fontWeight: 700 }}
										>
											{workspace.title}
										</Text>
										<Text
											fontSize="10px"
											lineHeight="14px"
											fontWeight="500"
											color="#7D7DA0"
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
					height="20%"
					fontWeight="500"
					fontSize="12px"
					lineHeight="16px"
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
			<Flex
				bg="#E0E0EC"
				height="2px"
				w="100%"
				mt={4} />
		</Flex>
	) : (
		<Flex />
	)
}

export default ManageDAO
