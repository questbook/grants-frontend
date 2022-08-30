import { Heading, HStack } from '@chakra-ui/react'
import { onboardingData } from 'src/v2/components/Onboarding/OnboardingData'
import { OnboardingPathSelectionCard } from 'src/v2/components/Onboarding/UI/Cards/OnboardingPathSelectionCard'


const OnboardingPathSelectionStep = ({
	selectedPath,
	setSelectedPath
}: {
	selectedPath?: keyof typeof onboardingData
	setSelectedPath: (path: keyof typeof onboardingData) => void
}) => {
	return (
		<>
			<Heading variant='small'>
				What are you looking for?
			</Heading>

			<HStack
				alignItems='stretch'
				justifyContent='center'
				spacing={6}
				mt={8}>
				{
					Object.keys(onboardingData).map((onboardingDataKeyString, index) => {
						const onboardingDataKey = onboardingDataKeyString as keyof typeof onboardingData
						return (
							<OnboardingPathSelectionCard
								key={`onboardingcard-0-${index}`}
								cardType={onboardingDataKey}
								isSelected={selectedPath === onboardingDataKey}
								onClick={() => setSelectedPath(onboardingDataKey)}
							/>
						)
					})
				}
			</HStack>
		</>
	)
}

export default OnboardingPathSelectionStep