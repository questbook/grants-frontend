import React from 'react'
import {
	Box,
	Flex, Grid, GridItem, } from '@chakra-ui/react'
import { truncateStringFromMiddle } from 'src/utils/formattingUtils'
// import { useAccount } from 'wagmi'
import { useQuestbookAccount } from 'src/hooks/gasless/useQuestbookAccount';

import Badge from '../../../ui/badge'

function GrantManagers({
	admins,
	grantManagers,
	toggleGrantManager,
}: {
  admins: any[];
  grantManagers: any[];
  toggleGrantManager: (address: string) => void;
}) {
	const { data: accountData } = useQuestbookAccount()
	return (
		<Flex
			py={0}
			direction="column">
			<Grid
				templateColumns="repeat(2, 1fr)"
				gap="18px"
				fontWeight="bold"
			>
				{
					admins.map((adminAddress) => (
						<GridItem
							key={adminAddress}
							colSpan={1}>
							<Badge
								isActive={
									grantManagers.includes(adminAddress)
                || adminAddress === accountData?.address
								}
								onClick={
									() => {
										if(adminAddress !== accountData?.address) {
											toggleGrantManager(adminAddress)
										}
									}
								}
								// TODO: fetch ENS name and display
								label={truncateStringFromMiddle(adminAddress)}
								tooltip={adminAddress}
							/>
						</GridItem>
					))
				}
			</Grid>

			<Box mt={6} />

		</Flex>

	)
}

export default GrantManagers
