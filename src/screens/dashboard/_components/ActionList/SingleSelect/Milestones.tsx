import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { Flex, Text } from '@chakra-ui/react'
import { ethers } from 'ethers'
import { defaultChainId, USD_ASSET } from 'src/constants/chains'
import { Accept, Dropdown } from 'src/generated/icons'
import { useQuery } from 'src/libraries/hooks/useQuery'
import logger from 'src/libraries/logger'
import { getChainInfo } from 'src/libraries/utils/token'
import { getSupportedChainIdFromWorkspace } from 'src/libraries/utils/validations'
import { getPayoutQuery } from 'src/screens/dashboard/_data/getPayoutQuery'
import { PayoutsType, ProposalType } from 'src/screens/dashboard/_utils/types'
import { DashboardContext } from 'src/screens/dashboard/Context'

function Milestones() {
	const buildComponent = () => {
		return (
			<Flex
				px={5}
				py={4}
				direction='column'
				align='stretch'
				overflowY='auto'
				overflowX='clip'
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
						Milestones
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

				<Flex
					display={expanded ? 'block' : 'none'}
					direction='column'>
					{milestones.map(milestoneItem)}
				</Flex>
			</Flex>
		)
	}

	const milestoneItem = (milestone: ProposalType['milestones'][number], index: number) => {
		return (
			<Flex
				align='end'
				mt={index === 0 ? 4 : 2}>
				<Flex direction='column'>
					<Text
						color='gray.400'
						variant='heading3'
						fontWeight='500'>
						{index < 9 ? `0${index + 1}` : (index + 1)}
					</Text>
					<Text
						mt={1}
						variant='body'>
						{milestone?.title}
					</Text>
					{
						payouts?.find(p => p.milestone?.id === milestone.id)?.status === 'executed' ? (
							<Flex
								align='center'
								justify='center'
								transition='all .5s ease'
								w='fit-content'
								mt={1}
								py={1}
								px={3}
								borderRadius='18px'
								maxH='36px'
								border='1px solid'
								bg='#0A84FF66'
								borderColor='#0A84FF66'
							>
								<Accept />
								<Text
									variant='metadata'
									fontWeight='500'
									ml={1}>
									Paid
								</Text>
							</Flex>
						) : ''
					}

				</Flex>

				{
					chainInfo && (
						<Text ml='auto'>
							{chainInfo?.address === USD_ASSET ? milestone.amount : ethers.utils.formatUnits(milestone.amount, chainInfo.decimals)}
							{' '}
							{/* {chainInfo?.label} */}
							Matic
						</Text>
					)
				}
			</Flex>
		)
	}

	const { proposals, selectedProposals } = useContext(DashboardContext)!
	const [expanded, setExpanded] = useState(true)
	const [payouts, setPayouts] = useState<PayoutsType>([])

	const proposal = useMemo(() => {
		return proposals.find(p => selectedProposals.has(p.id))
	}, [proposals, selectedProposals])

	const milestones = useMemo(() => {
		return proposal?.milestones || []
	}, [proposal])


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
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const results: any = await fetchMore({ first, skip, proposalID: proposal.id })
			if(!results?.fundTransfers || results?.fundTransfers?.length === 0) {
				shouldContinue = false
				break
			}

			data.push(...results?.fundTransfers)
			skip += first
		} while(shouldContinue)

		setPayouts(data)
		return 'payouts-fetched'
	}, [proposal])

	useEffect(() => {
		getPayouts().then((ret) => {
			logger.info({ ret }, 'Payouts')
		})
	}, [proposal])


	const chainInfo = useMemo(() => {
		if(!proposal?.grant?.id || !proposal?.grant?.reward?.token) {
			return
		}

		return getChainInfo(proposal?.grant, getSupportedChainIdFromWorkspace(proposal?.grant?.workspace) ?? defaultChainId)
	}, [proposal?.grant])

	return buildComponent()
}

export default Milestones