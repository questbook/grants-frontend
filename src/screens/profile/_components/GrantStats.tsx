/* eslint-disable indent */
import { useMediaQuery } from 'react-responsive'
import { Flex, Text } from '@chakra-ui/react'
import { logger } from 'ethers'
import { formatAmount } from 'src/screens/dashboard/_utils/formatters'
import { GrantStatsType } from 'src/screens/profile/_utils/types'

// import { useRouter } from 'next/router'

function GrantStats({
    totalProposals,
    totalProposalsAccepted,
    fundsAllocated,
    fundsPaidOut,
    milestones,
    milestonesCompleted,
}: GrantStatsType) {
    logger.info(fundsAllocated, 'GrantStats')


    const TitleCards = ({ title, value, limit }: {
        title: string
        value: number | string
        limit: number | string
    }) => (
	<Flex
            flexDirection='column'
            bgColor='transparent'
            zIndex={99}
            gap={isMobile ? '4px' : '8px'}
        >
		<Text
                fontWeight='700'
                fontSize={isMobile ? '14px' : '24px'}
                lineHeight='31.2px'
                color='black'>
			{value}
			{' '}
			/
			{' '}
			{limit}
		</Text>
		<Text
                fontWeight='500'
                fontSize={isMobile ? '8px' : '16px'}
                lineHeight='20px'
                textTransform='uppercase'
                color='#7E7E8F'
            >
			{title}
		</Text>
	</Flex>
    )

    const buildComponent = () => (
	<Flex
            direction='column'
            w='100%'
            alignItems='stretch'
            alignContent='stretch'
            justifyContent='flex-start'
            bgColor='#F7F5F2'
           borderRadius='8px'

        >
		<Flex
                width='100%'
            >
			<Flex
                    flexDirection='column'
                    width='100%'
                    flexGrow={1}
                >

				<Flex
                       mt={5}
                       gap={isMobile ? '24px' : 5}
                       mb={4}
                       flexWrap='wrap'
                       justifyContent='space-around'>
					<TitleCards
                            value={totalProposalsAccepted}
                            limit={totalProposals}
                            title='Proposals Accepted' />
					<TitleCards
                            value={formatAmount(fundsPaidOut)}
                            limit={formatAmount(fundsAllocated)}
                            title='Funds Paid Out' />
					<TitleCards
                            value={milestonesCompleted}
                            limit={milestones}
                            title='Milestones Completed' />

				</Flex>
			</Flex>
		</Flex>
	</Flex>

    )
    const isMobile = useMediaQuery({ query: '(max-width:600px)' })

    return buildComponent()
}

export default GrantStats