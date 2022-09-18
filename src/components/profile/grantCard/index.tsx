import React, { useEffect, useState } from 'react'
import { Box, Button, Flex, Image, Link, Spacer, Stack, Text } from '@chakra-ui/react'
import moment from 'moment'
import Badge from 'src/components/browse_grants/grantCard/badge'
import VerifiedBadge from 'src/components/ui/verified_badge'
import { calculateUSDValue, useTimeDifference } from 'src/utils/calculatingUtils'
import { nFormatter } from 'src/utils/formattingUtils'
import { useTranslation } from 'react-i18next'

interface BrowseGrantCardProps {
  grantTitle: string
  grantDesc: string
  isGrantVerified?: boolean
  funding: string

  numOfApplicants: number
  endTimestamp: number
  createdAt: number

  grantAmount: string
  grantCurrency: string
  grantCurrencyPair: string | null
  grantCurrencyIcon: string
  disbursedAmount: string

  onClick?: React.MouseEventHandler<HTMLButtonElement>
  onTitleClick?: React.MouseEventHandler<HTMLAnchorElement>
}

function BrowseGrantCard({
	createdAt,

	grantTitle,
	grantDesc,
	isGrantVerified,
	funding,

	numOfApplicants,
	endTimestamp,

	grantAmount,
	grantCurrency,
	grantCurrencyPair,
	grantCurrencyIcon,
	disbursedAmount,

	onClick,
	onTitleClick,
}: BrowseGrantCardProps) {
	const [grantReward, setGrantReward] = useState<number>(0)

	const currentDate = new Date().getTime()
	
	const { t } = useTranslation()

	useEffect(() => {
		if(grantReward === 0) {
			calculateUSDValue(grantAmount, grantCurrencyPair).then((promise: any) => {
				setGrantReward(promise as number)
			})
		}
	}, [grantReward, grantAmount, grantCurrency])

	return (
		<Flex
			w='full'
			border='1px solid #E8E9E9'
		>
			{' '}
			<Flex
				py={{ base: '16px', md: 6 }}
				px={{ base: '16px', md: '1.5rem' }}
				w='100%'>
				<Flex
					flex={1}
					direction='column'>
					<Flex
						justifyContent='space-around'
						direction='row'
						alignItems='center'>
						<Text maxW='50%'>
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

						<Image
							mx={2}
							src='/ui_icons/green_dot.svg'
							display='inline-block'
						/>

						<Text
							fontSize='0.75rem'
							lineHeight='1rem'
							fontWeight='700'
							color='#8C8C8C'
						>
							{t('/profile.cards.created_ago').replace('TIME_DIFF',useTimeDifference(currentDate, createdAt * 1000))}
						</Text>

						<Box mr='auto' />

						<Badge numOfApplicants={numOfApplicants} />
					</Flex>

					<Text
						mt={5}
						lineHeight='24px'
						color='#373737'
						fontSize='1rem'
						fontWeight='400'
					>
						{grantDesc}
					</Text>

					<Flex
						direction='row'
						mt='1.5rem'
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
								fontSize={{ base: '12px', md: '0.85rem' }}
								lineHeight='1rem'
								fontWeight='400'
								color='#373737'
							>
								<b>
									{'$'}
									{grantReward !== 0 ? `$${nFormatter(grantReward.toFixed(0))}` : grantAmount}
								</b>
								{' '}
								{t('/profile.cards.per_proposal')}
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
							mx={{ base: '8px', md: 4 }}
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
							fontSize={{ base: '12px', md: '0.85rem' }}
							lineHeight='1rem'
							display='inline-block'>
							{t('/profile.cards.accepting_proposals_until')}
							{' '}
							<b>
								{moment(endTimestamp).format('MMM D')}
							</b>
						</Text>
						<Spacer />
						<Button
							onClick={onClick}
							variant='primaryCta'
							h='105px'>
							{t('/profile.cards.submit_proposal')}
						</Button>
					</Flex>
				</Flex>
			</Flex>
		</Flex>
	)
}

BrowseGrantCard.defaultProps = {
	isGrantVerified: false,
	isDaoVerified: false,
	onClick: () => {},
	onTitleClick: () => {},
}
export default BrowseGrantCard
