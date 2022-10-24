import { useState } from 'react'
import { Box, Button, Flex, FlexProps, Image, Text } from '@chakra-ui/react'
import { GetApplicationDetailsQuery } from 'src/generated/graphql'
import { IReviewFeedback } from 'src/types'
import getAvatar from 'src/utils/avatarUtils'

interface Props extends FlexProps {
    reviewer: Exclude<GetApplicationDetailsQuery['grantApplication'], null | undefined>['reviewers'][number]
    review: IReviewFeedback | undefined
}

function ScoresItem({ reviewer, review, ...props }: Props) {
	const buildComponent = () => (
		<Flex
			direction='column'
			{...props}>
			<Button
				w='100%'
				m={0}
				p={0}
				variant='subtle'
				onClick={() => setExpanded(!expanded)}>
				<Flex
					w='100%'
					align='center'>
					<Flex
						maxW='90%'
						align='center'
					>
						<Image
							borderRadius='3xl'
							boxSize='28px'
							src={getAvatar(false, reviewer?.actorId)}
						/>
						<Text
							variant='v2_body'
							fontWeight='600'
							lineHeight='20px'
							ml={3}
							noOfLines={3}>
							{reviewer?.fullName}
						</Text>
					</Flex>

					<Box ml='auto' />

					{
						review && (
							<Flex
								align='center'
							>
								<Image
									mr={2}
									src={expanded ? '/ui_icons/arrow-drop-down-line-gray-expanded.svg' : '/ui_icons/arrow-drop-down-line-gray.svg'}
									alt='options'
									cursor='pointer'
								/>
								<Text
									variant='v2_body'
									fontWeight='600'>
									{review?.total}
								</Text>
							</Flex>
						)
					}

					{
						!review && (
							<Image
								src='/ui_icons/time-line.svg'
								boxSize='16px' />
						)
					}

				</Flex>
			</Button>

			<Flex
				mt={2}
				pl={1}
				display={expanded ? 'block' : 'none'}
				direction='column'>
				{
					review?.items?.map((item, index) => {
						return (
							<Flex
								key={index}
								mt={index === 0 ? 0 : 1}>
								<Text
									variant='v2_metadata'
									lineHeight='20px'>
									{item?.rubric?.title}
								</Text>
								<Text
									ml='auto'
									variant='v2_metadata'
									lineHeight='20px'>
									{item?.rating}
								</Text>
							</Flex>
						)
					})
				}
			</Flex>
		</Flex>
	)

	const [expanded, setExpanded] = useState<boolean>(false)

	return buildComponent()
}

export default ScoresItem