import { Box, Flex, Spacer, Text } from '@chakra-ui/react'
import { OnboardingFrameHexagon } from 'src/v2/assets/custom chakra icons/OnboardingFrameHexagon'
import { OnboardingFrameStar } from 'src/v2/assets/custom chakra icons/OnboardingFrameStar'

const OnboardingPathDataCard = ({
	index,
	title,
	image,
}: {
  index: number,
  title: string,
  image: JSX.Element,
}) => (
	<Flex
		direction={'column'}
		py={8}
		px={3}
		alignItems={'center'}
		border={'2px solid #B6F72B'}
		flex={1}
		borderRadius={'base'}
		pos={'relative'}
		boxSizing={'border-box'}
		justifyItems={'flex-start'}
		minH={'252px'}
	>
		<Box
			h={'35px'}
			w={'51.34px'}
			mt={'-12.5'}
			display={'flex'}
			justifyContent={'center'}
			alignItems={'center'}
			pos={'relative'}
		>
			<Text
				zIndex={1}
				fontSize={'sm'}
				fontWeight={'bold'}>
				{index + 1}
			</Text>
			<OnboardingFrameHexagon
				color={'#B6F72B'}
				h={'100%'}
				w={'100%'}
				pos={'absolute'}
				zIndex={0}
			/>
		</Box>

		{image}
		<Spacer />
		<Text
			mt={'26px'}
			mb={'15px'}
			fontWeight={'500'}
			textAlign={'center'}
		>
			{title}
		</Text>
		<Spacer />

		<Box
			pos={'absolute'}
			top={-3}
			left={-3}
			h={10}
			w={10}
			display={'flex'}
			justifyContent={'center'}
			alignItems={'center'}
		>
			<OnboardingFrameStar
				color={'#B6F72B'}
				boxSize={'100%'}
			/>
		</Box>

		<Box
			pos={'absolute'}
			bottom={-3}
			right={-3}
			h={10}
			w={10}
			display={'flex'}
			justifyContent={'center'}
			alignItems={'center'}
		>
			<OnboardingFrameStar
				color={'#B6F72B'}
				boxSize={'100%'}
			/>
		</Box>


	</Flex>
)

export default OnboardingPathDataCard