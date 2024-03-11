import { useState } from 'react'
import { Button, Flex, Grid, GridItem } from '@chakra-ui/react'
import RFPCard from 'src/screens/discover/_components/granteeList/RFPCard'
import { RecentProposals } from 'src/screens/discover/_utils/types'

type RFPGridProps = {
	proposals: RecentProposals
}

function RFPGrid({
	proposals
}: RFPGridProps) {
	const [more, setMore] = useState<number>(6)

	const buildComponent = () => (
		<>
			<Flex
				w='100%'
				flexDirection='column'
			>
				<Grid
					w='100%'
					templateColumns={{ md: 'repeat(1, 1fr)', lg: 'repeat(2, 1fr)' }}
					gap={8}
				>
					{
						proposals
							.slice(0, more)
							.map((proposal, index: number) => {
								return (
									<GridItem
						 key={index}>
										<RFPCard
											key={index}
											proposal={proposal}
										/>

									</GridItem>
								)
							})
					}
				</Grid>
				{

					more < proposals.length && proposals.length > 6 && (
						<Button
							onClick={() => setMore(more + 6)}
							mt={4}
							ml='auto'
							variant='secondary'
							justifyContent='flex-end'
							w='100%'
						>
							Load More
						</Button>
					)
				}
			</Flex>
		</>
	)

	return buildComponent()
}

export default RFPGrid