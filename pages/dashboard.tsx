import React, { ReactElement, useContext, useMemo } from 'react'
import { Center, Flex, Text } from '@chakra-ui/react'
import NavbarLayout from 'src/layout/navbarLayout'
import { useAccount } from 'wagmi'
import { WorkspaceMemberAccessLevel } from '../src/generated/graphql'
import ReviewerDashboard from '../src/v2/components/ReviewerDashboard'
import { ApiClientsContext } from './_app'

function Dashboard() {
	const { data: accountData } = useAccount()
	const { workspace } = useContext(ApiClientsContext)!

	const isReviewer = useMemo<boolean>(() => {
		if(
			workspace
      && workspace.members
      && workspace.members.length > 0
      && accountData
      && accountData.address
		) {
			const tempMember = workspace.members.find(
				(m) => m.actorId.toLowerCase() === accountData?.address?.toLowerCase(),
			)
			return tempMember?.accessLevel === WorkspaceMemberAccessLevel.Reviewer
		}

		return false
	}, [accountData, workspace])

	return (
		<Flex
			w='100%'
			h='100vh'
			bg={'#F5F5FA'}
			padding={'40px'}
			direction={'column'}
		>
			<Text
				fontWeight={'700'}
				fontSize={'30px'}
				lineHeight={'44px'}
				letterSpacing={-1}>
        Dashboard
			</Text>
			{
				isReviewer ? <ReviewerDashboard /> : (
					<Center>
            Coming soon...
					</Center>
				)
			}
		</Flex>
	)
}

Dashboard.getLayout = function(page: ReactElement) {
	return (
		<NavbarLayout>
			{page}
		</NavbarLayout>
	)
}

export default Dashboard
