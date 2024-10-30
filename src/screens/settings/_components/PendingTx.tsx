import { useContext } from 'react'
import { TimeIcon } from '@chakra-ui/icons'
import {
	Badge,
	Box,
	Button,
	Flex,
	HStack,
	Table,
	Tag,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tr } from '@chakra-ui/react'
import { GrantsProgramContext } from 'src/pages/_app'
import { FundTransfer } from 'src/screens/settings/_utils/types'
import { SettingsFormContext } from 'src/screens/settings/Context'

function PendingTx() {
	const { pendingTx } = useContext(SettingsFormContext)!
	const { grant } = useContext(GrantsProgramContext)!

	return (
		<Box
			borderRadius='xl'
			bg='white'
			boxShadow='sm'
			overflow='hidden'
		>
			<Flex
				px={6}
				py={4}
				borderBottom='1px'
				borderColor='gray.100'
				justify='space-between'
				align='center'
			>
				<HStack spacing={3}>
					<TimeIcon color='blue.500' />
					<Text
						fontSize='lg'
						fontWeight='semibold'>
						Pending Transactions
					</Text>
					<Badge
						colorScheme='blue'
						rounded='full'
						px={2}>
						{pendingTx.length}
					</Badge>
				</HStack>
			</Flex>

			<Box overflowX='auto'>
				<Table
					variant='simple'
					width='100%'>
					<Thead>
						<Tr>
							<Th
								py={4}
								bg='gray.50'
								borderBottom='2px'
								borderColor='gray.200'
							>
								Proposal
							</Th>
							<Th
								py={4}
								bg='gray.50'
								borderBottom='2px'
								borderColor='gray.200'
							>
								Amount
							</Th>
							<Th
								py={4}
								bg='gray.50'
								borderBottom='2px'
								borderColor='gray.200'
							>
								Transaction
							</Th>
						</Tr>
					</Thead>
					<Tbody>
						{
							pendingTx.map((tx: FundTransfer) => (
								<Tr
									key={tx.application.id}
									_hover={{ bg: 'gray.50' }}
									transition='all 0.2s'
								>
									<Td>
										<Flex
											direction='column'
											gap={1}>
											<Text
												cursor='pointer'
												fontWeight='medium'
												color='gray.700'
												_hover={{ color: 'blue.500' }}
												onClick={
													() => {
														window.open(
															`${window.location.origin}/dashboard/?grantId=${grant?.id}&proposalId=${tx.application.id}&chainId=10`,
															'_blank'
														)
													}
												}
											>
												{tx.application.name[0].values[0].value}
											</Text>
											<Tag
												size='sm'
												variant='subtle'
												colorScheme='orange'
												width='fit-content'>
												Pending Signature
											</Tag>
										</Flex>
									</Td>
									<Td>
										<HStack spacing={2}>
											<Text
												fontWeight='semibold'
												fontSize='md'>
												{tx.amount}
											</Text>
											<Text
												color='gray.500'
												fontSize='sm'>
												{grant?.reward?.token?.label || 'USDC'}
											</Text>
										</HStack>
									</Td>
									<Td>
										{
											tx.transactionHash ? (
												<HStack spacing={2}>
													<Button
														size='sm'
														colorScheme='blue'
														variant='outline'
														leftIcon={<TimeIcon />}
														onClick={
															() => window.open(
																`https://app.safe.global/arb1:${grant?.workspace?.safe?.address}/transactions/tx?id=multisig_${grant?.workspace?.safe?.address}_${tx.transactionHash}`,
																'_blank'
															)
														}
													>
														View on Safe
													</Button>
												</HStack>
											) : (
												<Text
													color='gray.500'
													fontSize='sm'>
													No transaction hash
												</Text>
											)
										}
									</Td>
								</Tr>
							))
						}
					</Tbody>
				</Table>
			</Box>
		</Box>
	)
}

export default PendingTx