import { Flex, Text } from '@chakra-ui/react'
import { logger } from 'ethers'
import { formatFundsAmount, formatNumber } from 'src/libraries/utils/formatting'
import { StatsType } from 'src/screens/discover/_utils/types'

function StatsBanner(stats: StatsType) {
	logger.info({ stats }, 'StatsBanner')
	const Fields = (value: string, label: string) => (
		<Flex
			flexDirection='column'
			alignItems='center'>
			<Text
				fontWeight='800'
				fontSize={['25px', '25px', '48px']}
				lineHeight='62.4px'
				color='#07070C'
			>
				{value}
				+
			</Text>
			<Text
				fontWeight='500'
				color='#557B05'
				fontSize={['14px', '16px', '18px']}
				lineHeight='normal'
				textTransform='uppercase'>
				{label}
			</Text>
		</Flex>
	)

	const buildComponent = () => {
		return (
			<Flex
				bgColor='#C3F953'
				// padding='32px 48px'
				padding={['16px 24px', '32px 48px']}
				gap='20px'
				borderRadius='0px 0px 48px 48px'
				justifyContent='space-evenly'>
				{Fields(stats?.builders > 0 ? formatNumber(stats?.builders) : formatNumber(47000), 'Builders')}
				{Fields(stats?.proposals > 0 ? formatNumber(stats?.proposals) : formatNumber(4000), 'Proposals')}
				{Fields(stats?.funds > 0 ? formatFundsAmount(stats?.funds) : formatFundsAmount(5100000), 'Paid out')}
			</Flex>
		)
	}

	return buildComponent()
}

export default StatsBanner