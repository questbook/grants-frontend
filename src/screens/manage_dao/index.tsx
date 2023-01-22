import React, {
	ReactElement, useContext,
	useEffect, useState
} from 'react'
import {
	Flex, Text,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import Loader from 'src/components/ui/loader'
import { useQuestbookAccount } from 'src/hooks/gasless/useQuestbookAccount'
import FilterTable from 'src/libraries/ui/FilterTable'
import NavbarLayout from 'src/libraries/ui/navbarLayout'
import { ApiClientsContext } from 'src/contexts/ApiClientsContext'
import WorkspaceMembers from 'src/screens/manage_dao/members'
import Settings from 'src/screens/manage_dao/settings'

function ManageDAO() {
	const buildComponent = () => (
		<Flex
			w='100%'
			px={10}
			// bg='#F5F5FA'
			mt={8}
			mb={4}>
			{
				isAdmin ? (
					<FilterTable
						tabs={[{ title: 'Profile', element: <Settings /> }, { title: 'Members', element: <WorkspaceMembers /> }]}
						tabIndex={selected}
						onChange={setSelected} />
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
	const [selected, setSelected] = useState(
		router.query.tab === 'members' ? 1 : 0,
	)
	const [isAdmin, setIsAdmin] = React.useState<boolean>(false)
	const [isLoading, setIsLoading] = React.useState<boolean>(true)

	const { data: accountData } = useQuestbookAccount()

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
