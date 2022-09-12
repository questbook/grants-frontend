import { Box, Flex, Image, Text } from '@chakra-ui/react'
import getAvatar from 'src/utils/avatarUtils'

const RubricsView = ({ rubrics, reviewer }: {
	rubrics?: {
		items?: {rating?: number, comment?: string, rubric: {title: string}}[]
		createdAtS: number
	}
	reviewer?: { id: string, name: string }
}) => {
	const totalScore = (items?: {rating?: number}[]) => {
		// console.log(items)
		let s = 0
		items?.forEach((item) => {
			s += item.rating ?? 0
		})

		return s
	}

	const formatCreatedAt = (s: number) => {
		const d = new Date(s * 1000)
		return `Reviewed on ${d.getDate()}/${d.getMonth()}, ${d.getFullYear()}`
	}

	return (
		<>
			<Text
				fontSize='14px'
				lineHeight='20px'
				fontWeight='500'
			>
				Reviewer
			</Text>

			<Flex
				py={4}
				borderRadius='2px'
				flexDirection='row'
				alignItems='center'
			>


				<Flex
					bg='#F0F0F7'
					borderRadius='20px'
					h='40px'
					w='40px'
				>
					<Image
						borderRadius='3xl'
						src={getAvatar(reviewer?.id)}
					/>
				</Flex>

				<Flex
					direction='column'
					ml='12px'
					justifyContent='flex-start'
					textAlign='left'
				>
					<Text
						fontSize='14px'
						lineHeight='20px'
						fontWeight='500'
						noOfLines={1}
						textOverflow='ellipsis'
					>
						{reviewer?.name}
					</Text>
					<Text
						fontSize='12px'
						lineHeight='16px'
						fontWeight='400'
						mt='2px'
						color='#7D7DA0'
						display='flex'
						alignItems='center'
					>
						{rubrics && formatCreatedAt(rubrics.createdAtS)}
					</Text>
				</Flex>

				<Box
					fontSize='14px'
					lineHeight='20px'
					fontWeight='400'
					h='20px'
					w='20px'
					bg='#F0F0F7'
					display='flex'
					justifyContent='center'
					alignItems='center'
					ml='auto'
				>
					{totalScore(rubrics?.items ?? [])}
				</Box>
			</Flex>

			<Text
				fontSize='14px'
				lineHeight='20px'
				fontWeight='500'
				mb={2}
			>
				Scores & comments
			</Text>


			<Flex
				p={4}
				borderRadius='2px'
				boxShadow='inset 1px 1px 0px #F0F0F7, inset -1px -1px 0px #F0F0F7'
				flexDirection='column'
			>
				{
					rubrics?.items?.map((rubric, i) => {
						return (
							<Flex key={`rubric-${i}`}>
								<Box
									fontSize='14px'
									lineHeight='20px'
									fontWeight='400'
									h='20px'
									w='20px'
									bg='#F0F0F7'
									display='flex'
									justifyContent='center'
									alignItems='center'
									mr={4}
									mb={2}
								>
									{rubric.rating}
								</Box>

								<Flex flexDirection='column'>
									<Text
										fontSize='14px'
										lineHeight='20px'
										fontWeight='500'
									>
										{rubric.rubric.title}
									</Text>

									<Text
										fontSize='12px'
										lineHeight='16px'
										fontWeight='400'
										color='#7D7DA0'
										mt='2px'
									>
										{rubric.comment}
									</Text>
								</Flex>

								<Box mb={6} />
							</Flex>
						)
					})
				}

			</Flex>

		</>
	)
}

export default RubricsView
