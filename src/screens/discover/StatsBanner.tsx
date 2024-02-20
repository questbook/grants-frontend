import { Flex, Text } from '@chakra-ui/react'
import { logger } from 'ethers'
import { formatFundsAmount } from 'src/libraries/utils/formatting'
import { StatsType } from 'src/screens/discover/_utils/types'

function StatsBanner(stats: StatsType) {
	logger.info({ stats }, 'StatsBanner')
	const buildComponent = () => {
		return (
			<Flex
				bgColor='gray.200'
				padding={[3, 8]}
				gap={4}
				justifyContent='space-evenly'>
				<Flex
					flexDirection='column'
					alignItems='center'>
					<Text
						fontWeight='500'
						fontSize={['25px', '40px']}
						lineHeight='48px'>
						{stats?.builders > 0 ? stats?.builders : 20000 }
						+
					</Text>
					<Text
						fontWeight='500'
						fontSize='15px'
						lineHeight='22px'
						textTransform='uppercase'>
						Builders
					</Text>
				</Flex>
				<Flex
					flexDirection='column'
					alignItems='center'>
					<Text
						fontWeight='500'
						fontSize={['25px', '40px']}
						lineHeight='48px'>
						{formatFundsAmount(stats?.funds > 0 ? stats?.funds : 3500000)}
						+
					</Text>
					<Text
						fontWeight='500'
						fontSize='15px'
						lineHeight='22px'
						textTransform='uppercase'>
						Paid Out
					</Text>
				</Flex>
				<Flex
					flexDirection='column'
					alignItems='center'>
					<Text
						fontWeight='500'
						fontSize={['25px', '40px']}
						lineHeight='48px'>
						{stats?.proposals > 0 ? stats?.proposals : 3000}
						+
					</Text>
					<Text
						fontWeight='500'
						fontSize='15px'
						lineHeight='22px'
						textTransform='uppercase'>
						Proposals
					</Text>
				</Flex>
			</Flex>
		)
	}

	return buildComponent()
}

export default StatsBanner