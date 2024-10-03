/* eslint-disable indent */
import { useMediaQuery } from 'react-responsive'
import { Flex, Text } from '@chakra-ui/react'

// import { useRouter } from 'next/router'

function SubSectionBanner({
    totalProposals,
    totalProposalsAccepted,
    fundsAllocated,
    fundsPaidOut,
    safeBalances,
}: {
    totalProposals: number
    totalProposalsAccepted: number
    fundsAllocated: number
    fundsPaidOut: number
    safeBalances: number
}) {


    const formatNumber = (num: number) => {
        return '$' + Math.round(num / 1000) + 'k'
    }

    const TitleCards = ({ data, title }: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: any
        title: string
    }) => (
	<Flex
            flexDirection='column'
            bgColor='transparent'
            zIndex={99}
            gap='8px'
        >
		<Text
                fontWeight='700'
                fontSize='24px'
                lineHeight='31.2px'
                color='black'>
			{data}
		</Text>
		<Text
                fontWeight='500'
                fontSize='16px'
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
                            data={totalProposals || 0}
                            title='Proposals' />
					<TitleCards
                            data={totalProposalsAccepted || 0}
                            title='Accepted' />
					<TitleCards
                            data={
                                formatNumber(fundsAllocated)
                                || 0
                            }
                            title='Funds Allocated' />
					<TitleCards
                            data={
                                formatNumber(fundsPaidOut)
                                || 0
                            }
                            title='Funds Paid Out' />
					<TitleCards
                            data={formatNumber(safeBalances) || 0}
                            title='left in mutlisig' />

				</Flex>
			</Flex>
		</Flex>
	</Flex>

    )
    const isMobile = useMediaQuery({ query: '(max-width:600px)' })

    return buildComponent()
}

export default SubSectionBanner