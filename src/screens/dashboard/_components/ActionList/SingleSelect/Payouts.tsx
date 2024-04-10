import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { Button, Flex, Text } from '@chakra-ui/react'
import { ethers } from 'ethers'
import { defaultChainId, USD_ASSET } from 'src/constants/chains'
import { Dropdown, NewTab } from 'src/generated/icons'
import useCustomToast from 'src/libraries/hooks/useCustomToast'
import { useQuery } from 'src/libraries/hooks/useQuery'
import logger from 'src/libraries/logger'
import { getProposalUrl, getTonkeyProposalUrl } from 'src/libraries/utils/multisig'
import { getChainInfo } from 'src/libraries/utils/token'
import { getSupportedChainIdFromWorkspace } from 'src/libraries/utils/validations'
import { GrantsProgramContext } from 'src/pages/_app'
import { getPayoutQuery } from 'src/screens/dashboard/_data/getPayoutQuery'
import { formatTime } from 'src/screens/dashboard/_utils/formatters'
import { Payout, PayoutsType } from 'src/screens/dashboard/_utils/types'
import { DashboardContext } from 'src/screens/dashboard/Context'

function Payouts() {
	const buildComponent = () => {
		return (
			<Flex
				// display={payouts?.length > 0 ? 'block' : 'none'}
				px={5}
				py={4}
				direction='column'
				overflowY='auto'
				overflowX='clip'
				align='stretch'
				w='100%'>
				<Flex
					justify='space-between'
					onClick={
						() => {
							setExpanded(!expanded)
						}
					}>
					<Text
						fontWeight='500'
						color={proposals?.length ? 'black.100' : 'gray.600'}>
						Payouts
					</Text>
					{
						proposals?.length > 0 && (
							<Dropdown
								mr={2}
								transform={expanded ? 'rotate(180deg)' : 'rotate(0deg)'}
								cursor='pointer'
							/>
						)
					}
				</Flex>

				{
					payouts.length > 0 && (
						<Flex
							display={expanded ? 'block' : 'none'}
							direction='column'>
							{payouts.map(payoutItem)}
						</Flex>
					)
				}

				{
					payouts.length === 0 && (
						<Text
							display={expanded ? 'block' : 'none'}
							mt={2}
							color='gray.600'>
							No payouts yet
						</Text>
					)
				}
			</Flex>
		)
	}

	const payoutItem = (payout: Payout, index: number) => {
		return (
			<Flex
				mt={index === 0 ? 0 : 2}
				key={index}
				direction='column'>
				<Flex mt={2}>
					<Text
						w='50%'
						variant='body'
						color='gray.600'>
						Payout
					</Text>
					<Text
						w='50%'
						fontWeight='500'
						variant='body'>
						{/* {formatMilestoneId(payout?.milestone?.id)} */}
						{index + 1}
					</Text>
				</Flex>

				{
					chainInfo && (
						<Flex mt={2}>
							<Text
								w='50%'
								variant='body'
								color='gray.600'>
								Amount
							</Text>
							<Text
								w='50%'
								variant='body'>
								{chainInfo?.address === USD_ASSET ? payout.amount : ethers.utils.formatUnits(payout.amount, chainInfo.decimals)}
								{' '}
								{chainInfo?.label}
							</Text>
						</Flex>
					)
				}

				<Flex mt={2}>
					<Text
						w='50%'
						variant='body'
						color='gray.600'>
						Paid On
					</Text>
					<Text
						w='50%'
						variant='body'>
						{formatTime(payout.executionTimestamp ?? payout.createdAtS, true)}
					</Text>
				</Flex>

				<Flex mt={2}>
					<Text
						w='50%'
						variant='body'
						color='gray.600'>
						Status
					</Text>
					<Button
						w='50%'
						variant='link'
						justifyContent='flex-start'
						rightIcon={<NewTab boxSize='16px' />}
						onClick={
							() => {
								if(payout?.transactionHash && grant?.workspace?.safe?.address) {
									if(grant?.workspace?.safe?.chainId === '512342' || grant?.workspace?.safe?.chainId === '512341') {
										window.open(getTonkeyProposalUrl(grant?.workspace?.safe?.address, payout.status === 'queued' ? 'queue' : 'history'))
									}

									if(grant?.workspace?.safe?.chainId === '900001') {
										window.open(getProposalUrl(grant?.workspace?.safe?.address, payout.transactionHash), '_blank')
									} else {
										window.open('https://starkscan.co/tx/' + payout?.transactionHash, '_blank')
									}
								} else {
									toast({
										status: 'warning',
										title: 'Could not fetch transaction hash! Contact support!',
										duration: 3000,
									})
								}
							}
						}>
						<Text
							fontWeight='400'
							variant='body'>
							{payout.status === 'queued' ? 'Queued' : payout.status === 'executed' ? 'Success' : 'Cancelled'}
						</Text>
					</Button>

				</Flex>
			</Flex>
		)
	}

	const { grant } = useContext(GrantsProgramContext)!

	const { proposals, selectedProposals } = useContext(DashboardContext)!
	const [expanded, setExpanded] = useState(false)
	const [payouts, setPayouts] = useState<PayoutsType>([])

	const chainId = useMemo(() => {
		return getSupportedChainIdFromWorkspace(grant?.workspace) ?? defaultChainId
	}, [grant])

	const proposal = useMemo(() => {
		return proposals.find(p => selectedProposals.has(p.id))
	}, [proposals, selectedProposals])

	const chainInfo = useMemo(() => {
		if(!grant?.id || !chainId) {
			return
		}

		return getChainInfo(grant, chainId)
	}, [proposal?.grant, chainId])

	const { fetchMore } = useQuery({
		query: getPayoutQuery
	})

	const getPayouts = useCallback(async() => {
		if(!proposal) {
			setPayouts([])
			return 'no-proposal'
		}

		const first = 100
		let skip = 0

		const data: PayoutsType = []
		let shouldContinue = true
		do {
			logger.info({ first, skip }, 'Variables')
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const results: any = await fetchMore({ first, skip, proposalID: proposal.id })
			logger.info({ results }, 'Payouts intermediate results')
			if(!results?.fundTransfers || results?.fundTransfers?.length === 0) {
				shouldContinue = false
				break
			}

			data.push(...results?.fundTransfers)
			skip += first
		} while(shouldContinue)


		logger.info({ data }, 'Payouts data')
		setPayouts(data)
		return 'payouts-fetched'
	}, [proposal])

	useEffect(() => {
		logger.info({}, 'Proposal changed')
		getPayouts().then((ret) => {
			logger.info({ ret }, 'Payouts')
		})
	}, [proposal])

	// const formatMilestoneId = (id: string | undefined) => {
	// 	if(!id) {
	// 		return ''
	// 	}

	// 	const index = Number.parseInt(id.split('.')[1])
	// 	return index < 9 ? `0${index + 1}` : (index + 1)
	// }

	const toast = useCustomToast()

	return buildComponent()
}

export default Payouts