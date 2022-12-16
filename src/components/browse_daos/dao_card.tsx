import { useTranslation } from 'react-i18next'
import { Box, Divider, Flex, Image, Switch, Tag, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import SupportedChainId from 'src/generated/SupportedChainId'
import { formatAddress } from 'src/utils/formattingUtils'
import { getSafeURL } from 'src/v2/utils/gnosisUtils'

type DomainCardProps = {
	logo: string
	name: string
	safeAddress: string
	isVisible: boolean
	onVisibilityUpdate?: (visibleState: boolean) => void
	isAdmin: boolean
	daoId: string
	chainId: SupportedChainId | undefined
	noOfApplicants: number
	totalAmount: number
	safeChainId: string | undefined
}

function DomainCard({ logo, isAdmin, name, safeAddress, daoId, chainId, noOfApplicants, totalAmount, onVisibilityUpdate, isVisible, safeChainId }: DomainCardProps) {
	const router = useRouter()
	const { t } = useTranslation()
	const safeUrl = getSafeURL(safeAddress, safeChainId!)
	return (
		<Box
			w='100%'
			background='white'
			p='24px'
			position='relative'
			boxShadow='0px 10px 18px rgba(31, 31, 51, 0.05), 0px 0px 1px rgba(31, 31, 51, 0.31);'
			borderRadius='4px'
			cursor='pointer'
			className='dao-card'
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
						pathname: '/profile/',
						query: {
							daoId,
							chainId,
						},
					})
				}
			}>
			<Flex
				flexDirection='column'
				gap={4}>
				<Flex>
					<Image
						src={logo}
						my='8px'
						w='56px'
						h='56px'
						objectFit='cover'
						borderRadius='4px' />
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

				<Text
					fontSize='20px'
					fontWeight='500'
					noOfLines={1}>
					{name}
				</Text>
				<Tag
					mt='-14px'
					color='#767471'
					bgColor='#F1EEE8'
					fontSize='12px'
					fontWeight='500'
					lineHeight='16px'
					maxWidth='max-content'
					minHeight='0'
					paddingStart={1}
					paddingEnd={1}
					onClick={
						() => {
							window.open(safeUrl, '_blank')
						}
					}>
					{safeAddress ? formatAddress(safeAddress) : ''}
				</Tag>
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
							color='#555570'>
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
							color='#555570'>
							Proposals
						</Text>
					</Flex>
				</Flex>
			</Flex>
		</Box>
	)
}

export default DomainCard
