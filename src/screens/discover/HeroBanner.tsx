/* eslint-disable indent */
import { useMediaQuery } from 'react-responsive'
import { Flex, Image, Text } from '@chakra-ui/react'
import { logger } from 'ethers'
import { getUrlForIPFSHash } from 'src/libraries/utils/ipfs'
import { SectionGrants } from 'src/screens/discover/_utils/types'
// import { useRouter } from 'next/router'

function HeroBanner({
	grants,
	safeBalances,
	grantsAllocated,
}: {
	grants: SectionGrants[]
	safeBalances: number
	grantsAllocated: number
}) {
	logger.info({ grants, safeBalances }, 'HeroBanner')


	const totalProposals = () => {
		let total = 0;
		(grants && grants?.length > 0) ? grants.map((section) => {
			const sectionName = Object.keys(section)[0]
			// @ts-ignore
			const grants = section[sectionName].grants.map((grant) => grant.numberOfApplications)
			total += grants.reduce((a: number, b: number) => a + b, 0)
		}) : 0

		return total
	}

	const totalProposalsAccepted = () => {
		let total = 0;
		(grants && grants?.length > 0) ? grants.map((section) => {
			const sectionName = Object.keys(section)[0]
			// @ts-ignore
			const grants = section[sectionName].grants.map((grant) => grant.numberOfApplicationsSelected)
			total += grants.reduce((a: number, b: number) => a + b, 0)
		}) : 0

		return total
	}

	const formatNumber = (num: number) => {
		return '$' + Math.round(num / 1000) + 'k'
	}

	//   const formatNumberInMillions = (num: number) => {
	// 	return '$' + (num / 1000000).toFixed(2) + 'M'
	//   }

	const totalProposalsPaidOut = () => {
		let total = 0;
		(grants && grants?.length > 0) ? grants.map((section) => {
			const sectionName = Object.keys(section)[0]
			// @ts-ignore
			const grants = section[sectionName].grants.map((grant) => grant.totalGrantFundingDisbursedUSD)
			total += grants.reduce((a: number, b: number) => a + b, 0)
		}) : 0

		return formatNumber(total)
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
			borderTop='1px solid #E8E6E1'
			borderBottomRadius='48px'
			padding={[10, 8]}
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
						flexDirection='row'
						textColor='white'
						position='relative'
						width='full'>
						<Image
							justifyContent='center'
							h={isMobile ? '40px' : '80px'}
							w={isMobile ? '40px' : '80px'}
							src={getUrlForIPFSHash('QmehZaEudaZeHnAs19yBKepSL9sydxHENsLvWgUbnc2xzo')} />
						<Text
							fontWeight='500'
							fontSize={isMobile ? '32px' : '64px'}
							lineHeight='48px'
							mt={isMobile ? -1 : 0}
							padding={
								isMobile ? [0, 0] :
									[10, 5]
							}
							color='black'>
							DeFi Mania
						</Text>
					</Flex>

					<Flex
						mt={5}
						gap={isMobile ? '24px' : 5}
						mb={4}
						flexWrap='wrap'
						justifyContent='flex-start'>
						<TitleCards
							data={totalProposals() || 0}
							title='Proposals' />
						<TitleCards
							data={totalProposalsAccepted()}
							title='Accepted' />
						<TitleCards
							data={formatNumber(grantsAllocated)}
							title='Funds Allocated' />
						<TitleCards
							data={totalProposalsPaidOut() || 0}
							title='Funds Paid Out' />
						<TitleCards
							data={formatNumber(safeBalances) || formatNumber(0)}
							title='left in mutlisig' />

					</Flex>
				</Flex>
			</Flex>
		</Flex>

	)
	const isMobile = useMediaQuery({ query: '(max-width:600px)' })

	return buildComponent()
}

export default HeroBanner