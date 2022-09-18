/* eslint-disable react/no-unstable-nested-components */
import React, { useEffect, useMemo, useState } from 'react'
import {
	Flex, Image, Link,
	Text, Tooltip, } from '@chakra-ui/react'
import moment from 'moment'
import Empty from 'src/components/ui/empty'
import { defaultChainId, SupportedChainId } from 'src/constants/chains'
import { FundTransfer } from 'src/types'
import {
	formatAmount,
	getExplorerUrlForTxHash,
	getMilestoneTitle,
	getTextWithEllipses,
} from 'src/utils/formattingUtils'
import { getAssetInfo } from 'src/utils/tokenUtils'
import { getDateInDDMMYYYY, solanaToUsdOnDate } from 'src/v2/constants/safe/realms_solana'
import { getProposalUrl } from 'src/v2/utils/phantomUtils'
import dollarIcon from 'src/v2/assets/currency_icon/dollar_icon.svg'
import {getGnosisTansactionLink} from 'src/v2/utils/gnosisUtils'

type TableContent = {
  title: string
  flex?: number
  content: (
    item: FundTransfer,
    assetId: string,
    assetDecimals: number,
    grantId: string,
    chainId?: SupportedChainId,
    rewardToken?: Token,
	transactionStatus?: any | undefined,
	isEvmChain?: boolean | undefined
  ) => React.ReactChild
};

type Token = {
  label: string
  address: string
  icon: string
  decimals: number
};

const TABLE_HEADERS: { [id: string]: TableContent } = {
	milestoneTitle: {
		title: 'Funding Received',
		flex: 0.5,
		content: (item, assetId, assetDecimals, __, chainId, rewardToken, transactionStatus, isEvmChain) => {
			let icon
			let label
			if(rewardToken) {
				console.log('reward token', rewardToken)
				icon = dollarIcon
				label = rewardToken.label
			} else {
				icon = dollarIcon
				label = getAssetInfo(assetId, chainId)?.label
			}
		
			return (
				<>
					<Image
						display='inline-block'
						src='/dollar_icon.svg'
						mr={2}
						h='27px'
						w='27px'
					/>
					<Text
						textAlign='start'
						variant='applicationText'>
						{getMilestoneTitle(item.milestone)}
						{' '}
						-
						{' '}
						<Text
							display='inline-block'
							variant='applicationText'
							fontWeight='700'
						>
							{parseInt(transactionStatus[0]?.amount)}
							{' '}
							{'USD'}
						</Text>
					</Text>
				</>
			)
		},
	},
	amount: {
		title: 'Amount',
		flex: 0.35,
		content: (item, assetId, assetDecimals: number) => (
			<Text
				display='inline-block'
				variant='applicationText'
				fontWeight='700'>
				{/* {ethers.utils.formatUnits(item.amount, assetDecimals)} */}
				{formatAmount(item.amount, assetDecimals)}
				{' '}
				{getAssetInfo(assetId)?.label}
			</Text>
		),
	},
	date: {
		title: 'On',
		flex: 0.2,
		content: (item) => (
			<Tooltip label={`Transaction ID: ${item.id}`}>
				<Text variant='applicationText'>
					{moment(new Date(item.createdAtS * 1000)).format('MMM DD, YYYY')}
				</Text>
			</Tooltip>
		),
	},
	to: {
		title: 'To',
		flex: 0.15,
		content: (item) => (
			<Tooltip label={item.to}>
				<Text
					variant='applicationText'
					color='#122224'>
					{getTextWithEllipses(item.to)}
				</Text>
			</Tooltip>
		),
	},
	action: {
		title: 'Action',
		flex: 0.1,
		content: (item, _, __, ___, chainId, ____, transactionStatus, isEvmChain) => (
			<Link
				href={
					isEvmChain ? getGnosisTansactionLink(transactionStatus[0]?.safeAddress, chainId?.toString()!)
						: getProposalUrl(transactionStatus[0]?.safeAddress, transactionStatus[0]?.txnHash)
				}
				isExternal
			>
				<Text
					color='brand.500'
					variant='applicationText'
					fontWeight='500'
					fontSize='14px'
					lineHeight='14px'
				>
					View
					{' '}
					<Image
						display='inline-block'
						src='/ui_icons/link.svg' />
				</Text>
			</Link>
		),
	},
	from: {
		title: 'From',
		flex: 0.2,
		content: (item, _, __, grantId, ___, ____, transactionStatus, isEvmChain) => (
			<Tooltip label={item.sender}>
				<Text
					variant='applicationText'
					color='#122224'>
					{isEvmChain ? getTextWithEllipses(item.sender) : getTextWithEllipses(transactionStatus[0]?.safeAddress)}
					{' '}
					{item.sender === grantId ? ' (Grant)' : ''}
				</Text>
			</Tooltip>
		),
	},
	initiator: {
		title: 'Initiated By',
		flex: 0.3,
		content: (item) => (
			<Tooltip label={item.sender}>
				<Text
					variant='applicationText'
					color='#122224'>
					{getTextWithEllipses(item.sender)}
				</Text>
			</Tooltip>
		),
	},
}

export type FundingProps = {
  fundTransfers: FundTransfer[]
  transactionStatus: any | undefined
isEvmChain: any | undefined
  assetId: string
  columns: (keyof typeof TABLE_HEADERS)[]
  assetDecimals: number
  grantId: string | null
  type: string
  chainId?: SupportedChainId
  // eslint-disable-next-line react/require-default-props
  rewardToken?: Token
};

function Funding({

	fundTransfers,
	transactionStatus,
	isEvmChain,
	assetId,
	columns,
	assetDecimals,
	grantId,
	type,
	chainId,
	rewardToken,
}: FundingProps) {
	const tableHeaders = useMemo(
		() => columns.map((column) => TABLE_HEADERS[column]),
		[columns],
	)
	const emptyStates = {
		funds_deposited: {
			src: '/illustrations/empty_states/no_deposits.svg',
			imgHeight: '160px',
			imgWidth: '135px',
			title: 'No deposits yet.',
			subtitle:
        'Once you deposit funds to your grant smart contract, they will appear here.',
		},
		funds_withdrawn: {
			src: '/illustrations/empty_states/no_withdrawals.svg',
			imgHeight: '136px',
			imgWidth: '135px',
			title: 'No withdrawals yet.',
			subtitle:
        'Once you withdraw funds from your grant smart contract, they will appear here.',
		},
		funding_sent: {
			src: '/illustrations/empty_states/funds_received.svg',
			imgHeight: '135px',
			imgWidth: '135px',
			title: 'No funds sent yet.',
			subtitle: 'Once you send funds to the grantee, they will appear here.',
		},
	}

	return (
		<Flex
			w='100%'
			my={4}
			align='center'
			direction='column'
			flex={1}>
			{
				fundTransfers.length === 0 && (
					<Flex
						mt={14}
						direction='column'
						align='center'>
						<Empty
							src={emptyStates[type as keyof typeof emptyStates].src}
							imgHeight={emptyStates[type as keyof typeof emptyStates].imgHeight}
							imgWidth={emptyStates[type as keyof typeof emptyStates].imgWidth}
							title={emptyStates[type as keyof typeof emptyStates].title}
							subtitle={emptyStates[type as keyof typeof emptyStates].subtitle}
						/>
					</Flex>
				)
			}
			{

				fundTransfers.length > 0 && (
					<>
						<Flex
							direction='row'
							w='100%'
							justify='strech'
							align='center'
							mt='32px'
							mb='9px'
						>
							{
								tableHeaders.map((header) => (
									<Text
										key={header.title}
										textAlign='left'
										flex={header.flex}
										variant='tableHeader'>
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
								fundTransfers.map((item, index) => {
									console.log('item.id', item)
									const txnStatus = transactionStatus?.filter((obj: any) => obj.txnHash === item.transactionHash)
									console.log('txn status', txnStatus)
									if(txnStatus?.[0]?.closedAtDate || txnStatus.length) {
										return (
											<Flex
												key={item.id}
												direction='row'
												w='100%'
												justify='stretch'
												align='center'
												bg={index % 2 === 0 ? '#F7F9F9' : 'white'}
												py={4}
												pl='15px'
												pr='15px'
											>
												{
													grantId && tableHeaders.map(({ title, flex, content }) => (
														<Flex
															key={title}
															direction='row'
															justify='start'
															align='center'
															flex={flex}
														>
															{
																content(
																	item,
																	assetId,
																	assetDecimals,
																	grantId,
																	chainId,
																	rewardToken,
																	txnStatus,
																	isEvmChain)
															}
														</Flex>
													))
												}
											</Flex>
										)
									}
								})
							}
						</Flex>
					</>
				)
			}
		</Flex>
	)
}

Funding.defaultProps = {
	chainId: defaultChainId
}

export default Funding
