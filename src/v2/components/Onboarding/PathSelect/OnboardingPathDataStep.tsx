import { Heading, HStack } from '@chakra-ui/react'
import { onboardingData } from 'src/v2/components/Onboarding/OnboardingData'
import OnboardingPathDataCard from 'src/v2/components/Onboarding/UI/Cards/OnboardingPathDataCard'

const OnboardingPathDataStep = ({
	selectedPath,
}: {
  selectedPath: keyof typeof onboardingData
}) => {
	return (
		<>
			<Heading variant='small'>
				Here’s what you can do on Questbook!
			</Heading>

			<HStack
				alignItems='stretch'
				justifyContent='center'
				spacing={6}
				mt={8}>
				{
					onboardingData[selectedPath].data.map((card, index) => (
						<OnboardingPathDataCard
							key={index}
							title={card.title}
							image={card.image}
							index={index}
						/>
					))
				}
			</HStack>
		</>
	)
}

export default OnboardingPathDataStep