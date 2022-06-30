import { Flex, Text } from '@chakra-ui/react'
import { CheckCircle } from 'src/v2/assets/custom chakra icons/CheckCircle'
import { onboardingData } from '../../OnboardingData'

export const OnboardingPathSelectionCard = ({
	cardType,
	isSelected,
	onClick,
}: {
  cardType: keyof typeof onboardingData,
  isSelected: boolean
  onClick: () => void
}) => {
	return (
		<Flex
			direction={'column'}
			p={8}
			alignItems={'center'}
			boxShadow={'0px 0px 16px rgba(85, 85, 112, 0.05)'}
			border={isSelected ? '2px solid #0065FF' : '2px solid #F0F0F7'}
			flex={1}
			borderRadius={'base'}
			cursor={'pointer'}
			pos={'relative'}
			_hover={
				{
					boxShadow: '0px 0px 16px rgba(85, 85, 112, 0.14)'
				}
			}
			onClick={onClick}
			boxSizing={'border-box'}
			maxW={'220px'}
		>
			{onboardingData[cardType].image}
			<Text
				mt={6}
				fontWeight={'500'}
			>
				{onboardingData[cardType].title}
			</Text>
			<Text
				mt={2}
				color={'brandText'}
				textAlign={'center'}
			>
				{onboardingData[cardType].description}
			</Text>
			{
				isSelected && (
					<CheckCircle
						boxSize={5}
						pos={'absolute'}
						right={4}
						top={4}
						color={'blue.500'} />
				)
			}
		</Flex>
	)
}