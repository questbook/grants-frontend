import React from 'react'
import { useTranslation } from 'react-i18next'
import { CheckIcon } from '@chakra-ui/icons'
import { Button, Divider, Flex, HStack, Image, Text, VStack } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { ApiClientsContext } from 'pages/_app'
import { useQuestbookAccount } from 'src/hooks/gasless/useQuestbookAccount'
import { MinimalWorkspace } from 'src/types'
import { getUrlForIPFSHash } from 'src/utils/ipfsUtils'
import getRole from 'src/utils/memberUtils'

interface Props {
  workspaces: MinimalWorkspace[]
  onWorkspaceClick: (index: number, onComplete: () => void) => void
}

function Domains({ workspaces, onWorkspaceClick }: Props) {
	const { workspace } = React.useContext(ApiClientsContext)!
	const { data: accountData } = useQuestbookAccount()
	const [expanded, setExpanded] = React.useState(false)

	const router = useRouter()
	const { t } = useTranslation()

	// only expand if there are more workspaces to show
	const expandable = workspaces.length > 1

	const areWorkspaceEqual = (workspace1: MinimalWorkspace, workspace2: MinimalWorkspace) => workspace1?.id === workspace2?.id && workspace1?.supportedNetworks[0] === workspace2?.supportedNetworks[0]

	const workspaceItem = (workspaceLocal: MinimalWorkspace, index: number) => {
		return (
			<Flex
				key={`${workspaceLocal.id}-${workspaceLocal.supportedNetworks[0]}-${index}`}
				p={2}
				align='flex-start'
				cursor='pointer'
				_hover={{ bg: 'gray.2' }}
				borderRadius='2px'
				onClick={
					() => {
						onWorkspaceClick(index, () => {
							setExpanded(false)
						})
					}
				}
			>
				<Image
					src={getUrlForIPFSHash(workspaceLocal.logoIpfsHash)}
					boxSize='20px'
					borderRadius='4px'
				/>
				<Flex
					direction='column'
					ml={2}
					mr='auto'>
					<Text
						variant='v2_body'
						m={0}
						p={0}
						maxW={areWorkspaceEqual(workspace!, workspaceLocal) ? '90%' : '100%'}
						noOfLines={2}
					>
						{workspaceLocal.title}
					</Text>
					<Text
						variant='v2_body'
						color='black.3'
					>
						{getRole(workspaceLocal, accountData?.address!)}
					</Text>
				</Flex>
				{
					areWorkspaceEqual(workspace!, workspaceLocal) && (
						<CheckIcon
							alignSelf='center'
							color='green.2' />
					)
				}
			</Flex>
		)
	}

	return (
		<Flex
			direction='column'
			mt={4}>
			<Flex
				direction='column'
				ml={6}
				mr={3}>
				<Image
					mt={2}
					src={getUrlForIPFSHash(workspace!.logoIpfsHash)}
					boxSize='40px'
				/>
				<Button
					mt={2}
					p={0}
					variant='subtle'
					pointerEvents={expandable ? undefined : 'none'}
					onClick={() => setExpanded(!expanded)}>
					<HStack
						w='100%'
						justify='space-between'>
						<VStack
							spacing={0}
							align='start'>
							<Text
								fontWeight='500'
								variant='v2_title'>
								{workspace!.title}
							</Text>
							<Text
								variant='v2_body'
								fontWeight='500'
								color='black.3'
							>
								{getRole(workspace!, accountData?.address!)}
							</Text>
						</VStack>

						<Image
							mr={2}
							src={expanded ? '/ui_icons/arrow-drop-down-line-gray-expanded.svg' : '/ui_icons/arrow-drop-down-line-gray.svg'}
							alt='options'
							cursor='pointer'
						/>
					</HStack>
				</Button>
			</Flex>
			<Divider
				variant='sidebar'
				mt={2} />
			<Flex
				display={expanded ? 'block' : 'none'}
				maxH='170px'
				w='100%'
			>
				<Flex
					direction='column'
					overflowY='auto'
					maxH='80%'
					w='100%'
					px={6}
					pt={3}>
					{workspaces.map(workspaceItem)}
				</Flex>
				<Button
					bg='white'
					leftIcon={
						<Image
							boxSize='20px'
							src='/ui_icons/new_dao.svg' />
					}
					_hover={{}}
					_active={{}}
					mx={6}
					mt={2}
					px={2}
					onClick={
						() => {
							router.push({ pathname: '/onboarding/create-domain' })
						}
					}
				>
					<Text
						variant='v2_metadata'
						_hover={{ fontWeight: 700 }}
						fontWeight='500' >
						{t('/.create-program')}
					</Text>
				</Button>
			</Flex>
			{
				expanded && (
					<Divider
						variant='sidebar'
						mt={4} />
				)
			}
		</Flex>
	)
}

export default Domains
