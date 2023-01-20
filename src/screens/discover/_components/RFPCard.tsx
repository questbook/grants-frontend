import { useContext, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Divider, Flex, Image, Switch, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import config from 'src/constants/config.json'
import SupportedChainId from 'src/generated/SupportedChainId'
import { QBAdminsContext } from 'src/hooks/QBAdminsContext'
import logger from 'src/libraries/logger'
import { GrantType } from 'src/screens/discover/_utils/types'
import getAvatar from 'src/utils/avatarUtils'
import { extractDateFromDateTime, titleCase } from 'src/utils/formattingUtils'
import { getUrlForIPFSHash } from 'src/utils/ipfsUtils'


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
			p={5}
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

					router.push({
						pathname: '/dashboard/',
						query: {
							grantId: grant.id,
							chainId,
							role: role === 'owner' ? 'admin' : (role ?? 'community'),
							proposalId: role === 'builder' ? grant.applications[0].id : undefined
						},
					})
				}
			}>
			<Flex
				flexDirection='column'
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
					{
						role && (
							<Text
								fontWeight='500'
								fontSize='12px'
								color='black.3'
								bg='gray.2'
								borderRadius='6px'
								py={1.5}
								px={3}
							>
								{titleCase(role)}
							</Text>
						)
					}
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
									disabled={changedVisibilityState === 'toggle'}
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
							variant='v2_title'
							fontSize='18px'
							fontWeight='500'
							noOfLines={3}
						>
							{grant.title}

							<Text
								color={isOpen ? 'accent.carrot' : 'gray.5'}
								background={isOpen ? 'rgba(242, 148, 62, 0.2)' : 'gray.2'}
								borderRadius='2px'
								px={2}
								py={1}
								fontSize='12px'
								fontWeight='500'
								ml={2}
								display='inline-block'
							>
								{isOpen ? 'Open' : 'Closed'}
							</Text>
						</Text>
					</Flex>

					<Flex gap={1}>
						<Text variant='v2_subtitle'>
							{isOpen ? 'Deadline on' : 'Ended on'}
							{' '}
						</Text>
						<Text
							variant='v2_subtitle'
							fontWeight='500'
							color='black.1'
						>
							{formattedDeadline}
						</Text>
					</Flex>

				</Flex>


				<Divider />
				<Flex
					justifyContent='space-between'
					mt={2}>
					<Flex alignItems='center'>
						<Text
							fontSize='18px'
							fontWeight='500'>
							$
							{grant.workspace.totalGrantFundingDisbursedUSD ? grant.workspace.totalGrantFundingDisbursedUSD.toLocaleString() : 0}
						</Text>
						<Text
							ml='5px'
							fontSize='14px'
							color='black.3'>
							{t('/.cards.in_grants')}
						</Text>
					</Flex>
					<Flex alignItems='center'>
						<Text
							fontSize='18px'
							fontWeight='500'>
							{grant.numberOfApplications}
						</Text>
						<Text
							ml='5px'
							fontSize='14px'
							color='black.3'>
							Proposals
						</Text>
					</Flex>
				</Flex>
			</Flex>
		</Box>
	)

	const router = useRouter()
	const { t } = useTranslation()
	const formattedDeadline = extractDateFromDateTime(grant.deadline!)

	const { isQbAdmin } = useContext(QBAdminsContext)!

	const isOpen = useMemo(() => {
		return grant.acceptingApplications === true && grant.deadline ? grant.deadline > new Date().toISOString() : false
	}, [grant])
	return buildComponent()
}

export default RFPCard
