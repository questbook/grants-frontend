import { useEffect, useState } from 'react'
import { Button, Flex, HStack, Image, Text } from '@chakra-ui/react'
import SupportedChainId from 'src/generated/SupportedChainId'
import logger from 'src/libraries/logger'
import ScoresItem from 'src/screens/proposal/_components/ScoresItem'
import { P } from 'src/screens/proposal/_types'
import { IReviewFeedback } from 'src/types'
import { useLoadReview } from 'src/utils/reviews'

interface Props {
    proposal: P
    chainId: SupportedChainId
}

function ScoresPanel({ proposal, chainId }: Props) {
	const buildComponent = () => {
		return (
			<Flex
				direction='column'
				bg='white'
				mt={4}
				px={6}
				py={2}
			>
				<Button
					m={0}
					p={0}
					variant='subtle'
					onClick={() => setExpanded(!expanded)}>
					<HStack
						w='100%'
						justify='space-between'>
						<Text fontWeight='500'>
							Scores
						</Text>

						<Image
							mr={2}
							src={expanded ? '/ui_icons/arrow-drop-down-line-gray-expanded.svg' : '/ui_icons/arrow-drop-down-line-gray.svg'}
							alt='options'
							cursor='pointer'
						/>
					</HStack>
				</Button>

				<Flex
					display={(expanded && reviews.length > 0) ? 'block' : 'none'}
					mb={2}>
					{
						proposal?.reviewers?.map((reviewer, index) => {
							return (
								<ScoresItem
									mt={index === 0 ? 0 : 3}
									reviewer={reviewer}
									review={reviews.find(r => r.reviewer === reviewer.actorId)}
									key={index} />
							)
						})
					}
				</Flex>
			</Flex>
		)
	}

	const { loadReview } = useLoadReview(proposal?.grant?.id, chainId)

	const [expanded, setExpanded] = useState<boolean>(false)
	const [reviews, setReviews] = useState<IReviewFeedback[]>([])

	useEffect(() => {
		const decryptedReviews: Promise<IReviewFeedback>[] = []
		for(const review of proposal?.reviews || []) {
			decryptedReviews.push(loadReview(review, proposal!.id))
		}

		Promise.all(decryptedReviews).then((reviews) => {
			logger.info({ reviews }, 'Decrypted reviews')
			setReviews(reviews)
		})
	}, [])

	return buildComponent()
}

export default ScoresPanel