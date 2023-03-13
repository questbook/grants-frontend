import { useContext, useMemo, useState } from 'react'
import { Flex, Text } from '@chakra-ui/react'
import { ethers } from 'ethers'
import { motion } from 'framer-motion'
import { defaultChainId, USD_ASSET } from 'src/constants/chains'
import { Dropdown } from 'src/generated/icons'
import { getChainInfo } from 'src/libraries/utils/token'
import { getSupportedChainIdFromWorkspace } from 'src/libraries/utils/validations'
import { ProposalType } from 'src/screens/dashboard/_utils/types'
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
				<motion.div
					initial={{ opacity: 0, x: 50 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 1, delay: 2 }}>
					<Flex
						justify='space-between'
						onClick={
							() => {
								setExpanded(!expanded)
							}
						}>
						<Text
							fontWeight='500'
							color={proposals?.length ? 'black.1' : 'gray.6'}>
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
				</motion.div>
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
						color='gray.4'
						variant='heading3'
						fontWeight='500'>
						{index < 9 ? `0${index + 1}` : (index + 1)}
					</Text>
					<Text
						mt={1}
						variant='body'>
						{milestone?.title}
					</Text>
				</Flex>

				{
					chainInfo && (
						<Text ml='auto'>
							{chainInfo?.address === USD_ASSET ? milestone.amount : ethers.utils.formatUnits(milestone.amount, chainInfo.decimals)}
							{' '}
							{chainInfo?.label}
						</Text>
					)
				}
			</Flex>
		)
	}

	const { proposals, selectedProposals } = useContext(DashboardContext)!
	const [expanded, setExpanded] = useState(true)

	const proposal = useMemo(() => {
		return proposals.find(p => selectedProposals.has(p.id))
	}, [proposals, selectedProposals])

	const milestones = useMemo(() => {
		return proposal?.milestones || []
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