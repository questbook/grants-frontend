import React, {
	ReactElement, useContext,
	useEffect, useState
} from 'react'
import {
	Button, Flex, Text,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import Loader from 'src/components/ui/loader'
import { useQuestbookAccount } from 'src/hooks/gasless/useQuestbookAccount'
import NavbarLayout from 'src/libraries/ui/navbarLayout'
import { ApiClientsContext } from 'src/pages/_app'
import WorkspaceMembers from 'src/screens/manage_dao/members'
import Settings from 'src/screens/manage_dao/settings'

function ManageDAO() {
	const buildComponent = () => (
		<Flex
			w='100%'
			px={10}
			bg='#F5F5FA'
			// overflowY='auto'
			mb={4}>
			{
				isAdmin ? (
					<Flex
						direction='row'
						w='100%'
						justify='space-evenly'>
						<Flex
							w='100%'
							// maxW='1036px'
							direction='column'
						>
							<Flex
								direction='row'
								w='full'
								justify='start'
								h={14}
								align='stretch'
								mb={1}
								mt={6}
							>
								{
									tabs.map((tab, index) => (
										<Flex
											align='center'
											key={index}>
											<Button
												variant='link'
												onClick={() => switchTab(index)}
												ml={index === 0 ? 0 : 2}
												mr={index === 0 ? 2 : 0}
											>
												<Text
													variant='v2_body'
													color={index === selected ? '#122224' : 'black.3'}>
													{tab}
												</Text>
											</Button>
											<Text>
												{index === tabs.length - 1 ? '' : '/'}
											</Text>
										</Flex>

									))
								}
							</Flex>
							{
								selected === 0
									? <Settings />
									: <WorkspaceMembers />
							}
						</Flex>
						<Flex w='auto' />
					</Flex>
				)
					: (
						<>
							{' '}
							{
								isLoading
									? (
										<Flex
											m='auto'
											mt='25vh'>
											<Loader />
										</Flex>
									)
									: (
										<Text
											textAlign='center'
											p='2rem'>
											You do not have access to this DAO settings
										</Text>
									)
							}
						</>
					)
			}
		</Flex>
	)

	const { workspace } = useContext(ApiClientsContext)!
	const router = useRouter()
	const tabs = ['Settings', 'Members']
	const [selected, setSelected] = useState(
		router.query.tab === 'members' ? 1 : 0,
	)
	const [isAdmin, setIsAdmin] = React.useState<boolean>(false)
	const [isLoading, setIsLoading] = React.useState<boolean>(true)

	const { data: accountData } = useQuestbookAccount()

	const switchTab = (to: number) => {
		setSelected(to)
	}

	useEffect(() => {
		if(
			workspace?.members
            && workspace.members.length > 0
            && accountData
            && accountData.address
		) {
			const tempMember = workspace.members.find(
				(m) => m.actorId.toLowerCase() === accountData?.address?.toLowerCase(),
			)
			setIsAdmin(tempMember?.accessLevel === 'admin' || tempMember?.accessLevel === 'owner')
			setIsLoading(false)
		}
	}, [accountData, workspace])

	return buildComponent()
}

ManageDAO.getLayout = function(page: ReactElement) {
	return (
		<NavbarLayout>
			{page}
		</NavbarLayout>
	)
}

export default ManageDAO
