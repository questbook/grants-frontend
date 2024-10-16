/* eslint-disable indent */
import { Flex, Image, Text } from '@chakra-ui/react'
import logger from 'src/libraries/logger'
import { getUrlForIPFSHash } from 'src/libraries/utils/ipfs'
// import { useRouter } from 'next/router'
import { useTokenPrice } from 'src/screens/dashboard/_hooks/useTokenPrice'
import { SectionGrants } from 'src/screens/discover/_utils/types'

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
	const tokenPriceInUSD = useTokenPrice()
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
		return formatNumber(total * tokenPriceInUSD)
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
						alignItems='center'
						mb={6}
					>
						<Image
							h={['50px', '80px']}
							w={['50px', '80px']}
							mr={4}
							src={getUrlForIPFSHash('Qmd23bt7TM68CYB3qiTQMhgDBAu8nFYsHyReYy5f3an3Gm')}
						/>
						<Text
							fontWeight='500'
							fontSize={['28px', '64px']}
							lineHeight={['34px', '56px']}
							color='black'
						>
							Axelar Grants
						</Text>
					</Flex>

					<Flex
						flexWrap='wrap'
						justifyContent='flex-start'
						gap={6}
					>
						<TitleCards
							data={totalProposals() || 0}
							title='Proposals'
						/>
						<TitleCards
							data={totalProposalsAccepted() || 0}
							title='Accepted'
						/>
						<TitleCards
							data={formatNumber(grantsAllocated * tokenPriceInUSD)}
							title='Funds Allocated'
						/>
						<TitleCards
							data={totalProposalsPaidOut() || 0}
							title='Funds Paid Out'
						/>
						<TitleCards
							data={formatNumber(safeBalances) || formatNumber(0)}
							title='Left in Multisig'
						/>
					</Flex>
				</Flex>
			</Flex>
		</Flex>

	)

	return buildComponent()
}

export default HeroBanner