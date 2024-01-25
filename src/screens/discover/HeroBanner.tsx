/* eslint-disable indent */
import { useMediaQuery } from 'react-responsive'
import { Flex, Image, Text } from '@chakra-ui/react'
import { logger } from 'ethers'
import { SectionGrants } from 'src/screens/discover/_utils/types'
// import { useRouter } from 'next/router'

function HeroBanner({
	grants,
	safeBalances,
	grantsAllocated
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

	  const formatNumberInMillions = (num: number) => {
		return '$' + (num / 1000000).toFixed(2) + 'M'
	  }

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
	  	>
			<Text
	  			fontWeight='500'
	  			fontSize={['25px', '40px']}
	  			lineHeight='48px'
	  			color='white'>
				{data}
			</Text>
			<Text
	  			fontWeight='500'
	  			fontSize='15px'
	  			lineHeight='22px'
	  			textTransform='uppercase'
	  			color='white'
	  		>
				{title}
			</Text>
		</Flex>
	  )

	  const buildComponent = () => (
		<Flex
	  		direction='row'
	  		w='100%'
	  		alignItems='stretch'
	  		alignContent='stretch'
	  		justifyContent='flex-start'
	  		>
			{
	  			!isMobile && (
	  				<Flex
	  					bgColor='black.100'
	  					flexGrow={1}
	  					pl={10}
	  					justifyContent='center'>
		<Image
							borderWidth='1px'
							borderColor='black.100'
							borderRadius='3xl'
							boxSize='16px'
	  						mt={10}
	  						justifyContent='center'
	  						h='max'
	  						w='52'
	  						src='https://ipfs.questbook.app:8080/ipfs/QmTkdKP8gFTmrM5UJYAtEahqtU7GQyDVaN9UHnNoEY6M3M' />
	  				</Flex>
	  			)
	  		}

			<Flex
	  			bgColor='black.100'
	  			padding={[10, 14]}
	  			flexDirection='column'
	  			textColor='white'
	  			position='relative'
	  			width='full'>
				{
	  				isMobile && (

	  					<Image
						  borderWidth='1px'
						  borderColor='black.100'
						  borderRadius='3xl'
						  boxSize='16px'
	  						justifyContent='center'
	  						h='max'
	  						w='24'
	  						src='https://ipfs.questbook.app:8080/ipfs/QmTkdKP8gFTmrM5UJYAtEahqtU7GQyDVaN9UHnNoEY6M3M' />

	  				)
	  			}
				<Text
					mt={isMobile ? 2 : 0}
	  				fontWeight='500'
	  				fontSize={isMobile ? '38px' : '40px'}
	  				lineHeight='48px'
	  				color='white'>
					Compound Grants
				</Text>

				<Flex
	  				mt={isMobile ? 5 : 10}
	  				gap={8}
	  				flexWrap='wrap'
	  				justifyContent='flex-start'>
					<TitleCards
	  					data={formatNumberInMillions(safeBalances) || formatNumber(800000)}
	  					title='in MultiSig' />
					<TitleCards
	  					data={totalProposals() || 0}
	  					title='Proposals Submitted' />
					<TitleCards
	  					data={totalProposalsAccepted() || 0}
	  					title='Accepted' />
					<TitleCards
	  					data={totalProposalsPaidOut() || 0}
	  					title='Paid Out' />
					<TitleCards
	  					data={formatNumber(grantsAllocated)}
	  					title='Funds Allocated' />

				</Flex>
			</Flex>
			{/* {
				!isMobile && (
					<Flex
						bgColor='#B6F72B'
						flexGrow={1}
						justifyContent='center'>
						<Image
							mt={10}
							src='/Browser Mock.svg' />
					</Flex>
				)
			} */}

		</Flex>
	  )
	  const isMobile = useMediaQuery({ query:'(max-width:600px)' })

	  return buildComponent()
}

export default HeroBanner