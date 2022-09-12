import React, { useEffect, useState } from 'react'
import {
	Flex,
	Image, Text, } from '@chakra-ui/react'
import { SupportedChainId } from 'src/constants/chains'
import { ApplicationMilestone } from 'src/types'
import { formatAmount } from 'src/utils/formattingUtils'
import { getAssetInfo } from 'src/utils/tokenUtils'
import { solanaToUsdOnDate } from 'src/v2/constants/safe/realms_solana'

const TABLE_HEADERS = [
	{
		title: 'Milestone',
		flex: 0.504,
		justifyContent: 'flex-start',
	},
	{
		title: 'Reward / Expected Reward',
		flex: 0.358,
		justifyContent: 'flex-start',
	},
	{
		title: 'Status',
		flex: 0.138,

		justifyContent: 'center',
	},
]

type Token = {
  label: string
  address: string
  icon: string
  decimals: number
};

export type AbstractMilestonesTableProps = {
	transactionStatus: any | undefined
	isEvmChain: boolean | undefined
  milestones: ApplicationMilestone[]
  rewardAssetId: string
  refetch: () => void
  sendFundOpen?: () => void
  renderStatus: (milestone: ApplicationMilestone) => React.ReactNode
  chainId?: SupportedChainId | undefined
  decimals?: number
  // eslint-disable-next-line react/require-default-props
  rewardToken?: Token
};

function AbstractMilestonesTable(
	{
		transactionStatus,
		isEvmChain,
		milestones,
		rewardAssetId,
		renderStatus,
		chainId,
		decimals,
		rewardToken,

	}: AbstractMilestonesTableProps,
) {
	let rewardIcon: string
	let rewardSymbol: string
	if(rewardToken && rewardToken.icon !== '') {
		rewardIcon = rewardToken.icon
		rewardSymbol = rewardToken.label
	} else {
		const asset = getAssetInfo(rewardAssetId, chainId)
		rewardSymbol = asset.label
		rewardIcon = asset.icon
	}

	const getTotalReward = (milestone: any) => {
		const milestoneTrxns = transactionStatus?.filter((obj: any) => obj.milestoneId === milestone.id)
		var total = 0
		for(var i in milestoneTrxns) {
			total += milestoneTrxns[i].amount
		}

		return Math.floor(total)
	}

	return (
		<Flex
			w='100%'
			my={4}
			align='center'
			direction='column'
			flex={1}
		>
			<Flex
				direction='row'
				w='100%'
				justify='strech'
				align='center'
				mt='32px'
				mb='9px'
			>
				{
					TABLE_HEADERS.map((header) => (
						<Text
							key={header.title}
							justifyContent={header.justifyContent}
							flex={header.flex ? header.flex : 1}
							variant='tableHeader'
							display='flex'
							minW='180px'
						>
							{header.title}
						</Text>
					))
				}
			</Flex>
			<Flex
				direction='column'
				w='100%'
				border='1px solid #D0D3D3'
				borderRadius={4}
				align='stretch'
			>
				{
					milestones.map((item, index) => (
						<Flex
							key={item.id}
							direction='row'
							w='100%'
							justify='stretch'
							align='center'
							bg={index % 2 === 0 ? '#F7F9F9' : 'white'}
							px={0}
							py={4}
						>
							<Flex
								flex={TABLE_HEADERS[0].flex}
								direction='column'
								w='100%'
								pl='19px'
							>
								<Text
									variant='applicationText'
									fontWeight='700'
									color='#122224'>
									{item.title}
								</Text>
								<Text
									fontSize='14px'
									lineHeight='24px'
									letterSpacing={0.5}
									fontStyle='normal'
									fontWeight='400'
									color='#717A7C'
									noOfLines={1}
									textOverflow='ellipsis'
								>
									Milestone
									{' '}
									{index + 1}
								</Text>
							</Flex>
							<Flex
								ml={8}
								direction='row'
								justify='start'
								align='center'
								flex={TABLE_HEADERS[1].flex}
							>
								<Image
									display='inline-block'
									src={rewardIcon}
									fallbackSrc='/images/dummy/Ethereum Icon.svg'
									mr={2}
									boxSize='27px' />
								<Text
									textAlign='center'
									fontSize='14px'
									letterSpacing={0.5}
									fontWeight='700'
									color='#122224'
								>
									{
										isEvmChain ? formatAmount(item.amountPaid.toString(), decimals) :
											getTotalReward(item)
									}
									{' '}
									/
									{' '}
									{formatAmount(item.amount.toString(), decimals)}
									{' '}
									{isEvmChain ? rewardSymbol : 'USD'}
								</Text>
							</Flex>
							<Flex
								flex={TABLE_HEADERS[2].flex}
								justify='end'
								mr={5}
								minW='180px'
							>
								{renderStatus(item)}
							</Flex>
						</Flex>
					))
				}
			</Flex>
		</Flex>
	)
}

AbstractMilestonesTable.defaultProps = {
	sendFundOpen: () => { },
	chainId: undefined,
	decimals: 18,
}
export default AbstractMilestonesTable
