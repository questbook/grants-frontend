/* eslint-disable indent */
import { useMediaQuery } from 'react-responsive'
import { Flex, Text } from '@chakra-ui/react'
import { formatAmount } from 'src/screens/dashboard/_utils/formatters'
import { GrantStatsType } from 'src/screens/profile/_utils/types'

function GrantStats({
    totalProposals,
    totalProposalsAccepted,
    fundsAllocated,
    fundsPaidOut,
    milestones,
    milestonesCompleted,
}: GrantStatsType) {
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
                fontSize={isMobile ? '8px' : '18px'}
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
        >
		<Flex
                width='100%'
            >
			<Flex
                    flexDirection='row'
                    width='100%'
                    padding='20px'
                    flexGrow={1}
                    flexWrap={isMobile ? 'wrap' : 'nowrap'}
                >


				<Text
                        fontWeight='400'
                        alignSelf='center'
                        w='50%'
                        fontSize={isMobile ? '16px' : '34px'}
                        lineHeight='31.2px'
                        color='black'>
					Grants
				</Text>
				<Flex
                        w='100%'
                        justifyContent='space-around'
                        flexWrap='wrap'
                    >
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