import { useContext, useMemo } from 'react'
import { Box, Divider, Flex, Grid, GridItem, Image, Switch, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import config from 'src/constants/config.json'
import { Alert } from 'src/generated/icons'
import SupportedChainId from 'src/generated/SupportedChainId'
import { QBAdminsContext } from 'src/libraries/hooks/QBAdminsContext'
import logger from 'src/libraries/logger'
import { getAvatar } from 'src/libraries/utils'
import { nFormatter, titleCase } from 'src/libraries/utils/formatting'
import { getUrlForIPFSHash } from 'src/libraries/utils/ipfs'
import { GrantType } from 'src/screens/discover/_utils/types'
import { DiscoverContext } from 'src/screens/discover/Context'


type RFPCardProps = {
	grant: GrantType
	isVisible: boolean
	onVisibilityUpdate?: (visibleState: boolean) => void
	onSectionGrantsUpdate?: () => void
	chainId: SupportedChainId | undefined
    role?: string
	changedVisibilityState?: string
}

function RFPCard({ grant, chainId, role, onVisibilityUpdate, onSectionGrantsUpdate, isVisible, changedVisibilityState }: RFPCardProps) {
	const buildComponent = () => (
		<Box
			w='100%'
			background='white'
			px={5}
			pt={5}
			h='16rem'
			position='relative'
			// boxShadow='0px 10px 18px rgba(31, 31, 51, 0.05), 0px 0px 1px rgba(31, 31, 51, 0.31);'
			borderRadius='2px'
			border='1px solid #E7E4DD'
			_hover={
				{
					border: 'none',
				}
			}
			cursor='pointer'
			// className='dao-card'
			onClick={
				(e) => {
					// returning as onClick fired from dao visibility toggle switch for admins
					if(isQbAdmin && [
						'[object HTMLSpanElement]',
						'[object HTMLLabelElement]',
						'[object HTMLInputElement]',
					].includes(e.target.toString())) {
						return
					}

					if(!chainId) {
						return
					}

					let params: {grantId: string, chainId: number, role: string, proposalId?: string} = {
						grantId: grant.id,
						chainId,
						role: role === 'owner' ? 'admin' : (role ?? 'community'),
					}
					if(role === 'builder') {
						params = { ...params, proposalId: grant.applications[0].id }
					}

					router.push({
						pathname: '/dashboard/',
						query: params,
					})
				}
			}>
			<Flex
				flexDirection='column'
				h='100%'
				gap={4}>
				<Flex
					justifyContent='space-between'
					alignItems='flex-start'
				>
					<Image
						src={grant.workspace?.logoIpfsHash === config.defaultDAOImageHash ? getAvatar(true, grant?.workspace?.title) : getUrlForIPFSHash(grant?.workspace?.logoIpfsHash!)}
						// my='8px'
						w='56px'
						h='56px'
						objectFit='cover'
						borderRadius='4px'
					/>
					<Flex gap={2}>
						<Text
							variant={isOpen ? 'openTag' : 'closedTag'}
						>
							{isOpen ? 'Open' : 'Closed'}
						</Text>
						{
							role && (
								<Text
									fontWeight='500'
									fontSize='12px'
									color='black.300'
									bg='gray.200'
									borderRadius='6px'
									py={1.5}
									px={3}
								>
									{titleCase(role)}
								</Text>
							)
						}
					</Flex>

					{
						isQbAdmin && (
							<>
								<Switch
									size='md'
									// mx='10px'
									height='20px'
									borderRadius={0}
									colorScheme='green'
									isChecked={isVisible}
									disabled={changedVisibilityState === 'checkbox'}
									onChange={
										() => {
											onVisibilityUpdate?.(!isVisible)
										}
									}
								/>
								<Switch
									disabled={changedVisibilityState === 'toggle' || !isVisible}
									onChange={
										() => {
											logger.info('clicked')
											onSectionGrantsUpdate?.()
										}
									}
								>
									Add to Section
								</Switch>
							</>
						)
					}
				</Flex>
				<Flex
					direction='column'
					gap={2}
				>
					<Flex
						gap={2}
						alignItems='center'
					>
						<Text
							variant='title'
							fontSize='18px'
							fontWeight='500'
							noOfLines={2}
						>
							{grant.title}
						</Text>
					</Flex>

					{/* <Flex gap={1}>
						<Text variant='subtitle'>
							{isOpen ? 'Deadline on' : 'Ended on'}
							{' '}
						</Text>
						<Text
							variant='subtitle'
							fontWeight='500'
							color='black.100'
						>
							{formattedDeadline}
						</Text>
					</Flex> */}

				</Flex>

				<Flex
					direction='column'
					mt='auto'>
					<Divider />
					<Grid
						mt={1}
						templateColumns='repeat(4, 1fr)'
						pt={3}
						pb={5}
						justifyContent='space-between'
					 >
						<GridItem>
							<Flex direction='column'>
								{
									grant?.workspace?.safe === null ? (
										<Alert
											mt={1}
											color='accent.royal' />
									) : (
										<Flex
											gap={2}
											align='center'>
											{usdAmount === 0 && <Alert color='accent.royal' />}
											{
												usdAmount !== undefined && (
													<Text fontWeight='500'>
														$
														{nFormatter(usdAmount?.toFixed(0), 0)}
													</Text>
												)
											}
										</Flex>
									)
								}
								<Text
									mt={1}
									variant='body'
									color='gray.600'>
									{grant?.workspace?.safe === null ? 'No multisig' : usdAmount === undefined ? '' : usdAmount === 0 ? 'in multisig' : 'available'}
								</Text>
							</Flex>
						</GridItem>
						<GridItem>
							<Flex direction='column'>
								<Text fontWeight='500'>
									{grant?.totalGrantFundingDisbursedUSD === '0' ? '-' : `$${nFormatter(grant?.totalGrantFundingDisbursedUSD, 0)}`}
								</Text>
								<Text
									mt={1}
									variant='body'
									color='gray.600'>
									paid out
								</Text>
							</Flex>
						</GridItem>
						<GridItem>
							<Flex direction='column'>
								<Text fontWeight='500'>
									{grant?.numberOfApplicationsSelected}
								</Text>
								<Text
									mt={1}
									variant='body'
									color='gray.600'>
									accepted
								</Text>
							</Flex>
						</GridItem>
						<GridItem>
							<Flex direction='column'>
								<Text fontWeight='500'>
									{grant?.numberOfApplications}
								</Text>
								<Text
									mt={1}
									variant='body'
									color='gray.600'>
									proposals
								</Text>
							</Flex>
						</GridItem>
					</Grid>
				</Flex>

			</Flex>
		</Box>
	)

	const { safeBalances } = useContext(DiscoverContext)!

	const router = useRouter()

	const { isQbAdmin } = useContext(QBAdminsContext)!

	const usdAmount = useMemo(() => {
		return safeBalances[`${grant.workspace.safe?.chainId}-${grant.workspace.safe?.address}`]
	}, [grant, safeBalances])

	const isOpen = useMemo(() => {
		return grant.acceptingApplications === true && grant.deadline ? grant.deadline > new Date().toISOString() : false
	}, [grant])
	return buildComponent()
}

export default RFPCard
