import React, { useEffect, useState } from 'react'
import { Box, Button, Flex, Image, Link, Stack, Text } from '@chakra-ui/react'
import moment from 'moment'
import { useRouter } from 'next/router'
import Badge from 'src/components/browse_grants/grantCard/badge'
import ShareMenu from 'src/components/browse_grants/grantCard/menu'
import VerifiedBadge from 'src/components/ui/verified_badge'
import { SupportedChainId } from 'src/constants/chains'
import {
	calculateUSDValue,
	useTimeDifference,
} from 'src/utils/calculatingUtils'
import { nFormatter } from 'src/utils/formattingUtils'

interface GrantCardProps {
  daoID: string
  grantID: string
  daoIcon: string
  daoName: string
  chainId: SupportedChainId | undefined

  grantTitle: string
  grantDesc: string
  isGrantVerified?: boolean
  funding: string

  numOfApplicants: number
  endTimestamp: number
  createdAt: number

  grantAmount: string
  grantCurrency: string
  grantCurrencyPair?: string
  grantCurrencyIcon: string
  disbursedAmount: string

  onClick?: React.MouseEventHandler<HTMLButtonElement>
  onTitleClick?: React.MouseEventHandler<HTMLAnchorElement>
}

function GrantCard({
	daoID,
	grantID,
	daoIcon,
	daoName,
	chainId,
	grantTitle,
	grantDesc,
	isGrantVerified,
	funding,

	numOfApplicants,
	endTimestamp,
	createdAt,
	disbursedAmount,

	grantAmount,
	grantCurrency,
	grantCurrencyPair,
	grantCurrencyIcon,

	onClick,
	onTitleClick,
}: GrantCardProps) {
	// const router = useRouter()

	const router = useRouter()
	const [grantReward, setGrantReward] = useState<number>(0)

	const currentDate = new Date().getTime()

	useEffect(() => {
		if(grantReward === 0) {
			calculateUSDValue(grantAmount, grantCurrencyPair!).then(
				(promise: any) => {
					setGrantReward(promise as number)
				}
			)
		}
	}, [grantReward, grantAmount, grantCurrency])

	return (
		<Flex
			w='full'
			border='1px solid #E8E9E9'>
			<Flex
				px='2rem'
				pt='1rem'
				pb='1.5rem'
				w='100%'>
				<Flex
					flex={1}
					gap='1.5rem'
					direction='column'>
					<Flex
						direction='row'
						alignItems='center'
						gap='0.75rem'>
						<Image
							objectFit='cover'
							h='2rem'
							w='2rem'
							borderRadius='4px'
							src={daoIcon}
						/>
						<Link
							onClick={
								() => {
									router.push({
										pathname: '/profile',
										query: {
											daoId: daoID,
											chainId,
										},
									})
								}
							}
							fontFamily='DM Sans'
							fontStyle='normal'
							fontSize='1rem'
							lineHeight='24px'
							fontWeight='400'
							color='#373737'
						>
							{daoName}
						</Link>

						<Image
							src='/ui_icons/green_dot.svg'
							display='inline-block' />

						<Text
							fontSize='0.75rem'
							lineHeight='1rem'
							fontWeight='700'
							color='#8C8C8C'
						>
							{useTimeDifference(currentDate, createdAt * 1000)}
							{' '}
							ago
						</Text>

						<Box mr='auto' />
						<Badge numOfApplicants={numOfApplicants} />
					</Flex>

					<Text
						mt='-0.5rem'
						maxW='50%'>
						<Link
							onClick={onTitleClick}
							whiteSpace='normal'
							textAlign='left'
							lineHeight='26px'
							fontSize='18px'
							fontWeight='700'
							color='#12224'
						>
							{grantTitle}
						</Link>
					</Text>

					<Text
						mt='-1rem'
						lineHeight='24px'
						color='#373737'
						fontSize='1rem'
						fontWeight='400'
					>
						{grantDesc}
					</Text>

					<Flex
						direction='row'
						alignItems='center'>
						<Stack
							bgColor='#F5F5F5'
							borderRadius='1.25rem'
							h='1.5rem'
							px='0.5rem'
							justify='center'
						>
							<Text
								fontFamily='DM Sans'
								fontSize='0.85rem'
								lineHeight='1rem'
								fontWeight='400'
								color='#373737'
							>
								<b>
									{
										grantReward !== 0 ? (
											`$${nFormatter(grantReward.toFixed(0))}`
										) : (
											<>
												{grantAmount}
												{' '}
												{grantCurrency}
											</>
										)
									}
								</b>
								/grantee
								{
									isGrantVerified && (
										<VerifiedBadge
											grantAmount={funding}
											grantCurrency={grantCurrency}
											lineHeight='26px'
											disbursedAmount={disbursedAmount}
											marginBottom={-1}
										/>
									)
								}
							</Text>
						</Stack>

						<Image
							mx={4}
							src='/ui_icons/green_dot.svg'
							display='inline-block'
						/>
						<Image
							boxSize={4}
							src={grantCurrencyIcon} />
						<Text
							ml={2}
							fontSize='0.85rem'
							lineHeight='1rem'
							fontWeight='400'
							color='#373737'
						>
							Paid in
							{' '}
							<b>
								{grantCurrency}
							</b>
						</Text>
						<Image
							mx={4}
							src='/ui_icons/green_dot.svg'
							display='inline-block'
						/>

						<Image
							mr='6px'
							boxSize={3}
							src='/ui_icons/deadline.svg'
							display='inline-block'
						/>
						<Text
							fontSize='0.85rem'
							lineHeight='1rem'
							display='inline-block'>
							Ends on
							{' '}
							<b>
								{moment(endTimestamp).format('MMMM D')}
							</b>
						</Text>

						<Box mr='auto' />
						<ShareMenu
							chainId={chainId}
							grantID={grantID} />
						<Button
							ml={7}
							onClick={onClick}
							variant='primaryCta'
							h='36px'>
							Apply Now
						</Button>
					</Flex>
				</Flex>
			</Flex>
		</Flex>
	)
}

GrantCard.defaultProps = {
	isGrantVerified: false,
	isDaoVerified: false,
	onClick: () => {},
	onTitleClick: () => {},
}
export default GrantCard
