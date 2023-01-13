import { useTranslation } from 'react-i18next'
import { Box, Divider, Flex, Image, Switch, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import SupportedChainId from 'src/generated/SupportedChainId'
import { extractDateFromDateTime, titleCase } from 'src/utils/formattingUtils'

type RFPCardProps = {
	logo: string
	name: string
    deadline: string
	isVisible: boolean
	onVisibilityUpdate?: (visibleState: boolean) => void
	isAdmin: boolean
	chainId: SupportedChainId | undefined
	noOfApplicants: number
    grantId: string
	totalAmount: number
    role?: string
    isAcceptingApplications: boolean
}

function RFPCard({ logo, isAdmin, isAcceptingApplications, name, chainId, role, grantId, deadline, noOfApplicants, totalAmount, onVisibilityUpdate, isVisible }: RFPCardProps) {
	const router = useRouter()
	const { t } = useTranslation()
	const formattedDeadline = extractDateFromDateTime(deadline)

	const isOpen = isAcceptingApplications === true ? deadline > new Date().toISOString() : false

	return (
		<Box
			w='100%'
			background='white'
			p='24px'
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
					if(isAdmin && [
						'[object HTMLSpanElement]',
						'[object HTMLLabelElement]',
						'[object HTMLInputElement]',
					].includes(e.target.toString())) {
						return
					}

					router.push({
						pathname: '/dashboard/',
						query: {
							grantId,
							chainId,
							role: role === 'owner' ? 'admin' : role,
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
						src={logo}
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
						isAdmin && (
							<Switch
								size='md'
								mx='10px'
								height='20px'
								borderRadius={0}
								colorScheme='green'
								isChecked={isVisible}
								onChange={() => onVisibilityUpdate?.(!isVisible)}
							/>
						)
					}
				</Flex>
				<Flex
					direction='column'
					gap={2}>
					<Flex
						gap={2}
						alignItems='center'
					>
						<Text
							variant='v2_subheading'
							fontSize='18px'
							fontWeight='500'
							noOfLines={3}
						>
							{name}

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
							{totalAmount ? totalAmount.toLocaleString() : 0}
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
							{noOfApplicants}
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
}

export default RFPCard
