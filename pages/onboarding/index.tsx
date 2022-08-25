import { useState } from 'react'
import { useRouter } from 'next/router'
import { onboardingData } from 'src/v2/components/Onboarding/OnboardingData'
import OnboardingPathDataStep from 'src/v2/components/Onboarding/PathSelect/OnboardingPathDataStep'
import OnboardingPathSelectionStep from 'src/v2/components/Onboarding/PathSelect/OnboardingPathSelectionStep'
import BackgroundImageLayout from 'src/v2/components/Onboarding/UI/Layout/BackgroundImageLayout'
import OnboardingCard from 'src/v2/components/Onboarding/UI/Layout/OnboardingCard'
import { BottomRightCorner } from 'src/v2/components/Onboarding/UI/Misc/BottomRightCorner'
import ContinueButton from 'src/v2/components/Onboarding/UI/Misc/ContinueButton'
import { TopLeftCorner } from 'src/v2/components/Onboarding/UI/Misc/TopLeftCorner'

const Onboarding = () => {
	const [selectedPath, setSelectedPath] = useState<keyof typeof onboardingData>()
	const [step, setStep] = useState(0)
	const router = useRouter()

	const steps = [
		<OnboardingPathSelectionStep
			key={'onboardingstep-0'}
			selectedPath={selectedPath}
			setSelectedPath={setSelectedPath} />,
		<OnboardingPathDataStep
			key={'onboardingstep-1'}
		 selectedPath={selectedPath!} />,
	]

	const nextClick = () => {
		if(step === 0) {
			setStep(1)
			return
		}

		if(selectedPath === 'developer') {
			router.push({
				pathname: '/'
			})
		} else {
			router.push({
				pathname: '/onboarding/create-domain',
			})
		}
	}

	const backClick = () => {
		if(step === 1) {
			setStep(0)
			return
		}

		setSelectedPath(undefined)
	}

	return (
		<BackgroundImageLayout
			imageSrc={'/onboarding.png'}
			imageBackgroundColor={'brandv2.500'}
			imageProps={
				{
					mixBlendMode: 'color-dodge'
				}
			}
			isDarkQuestbookLogo
		>
			<TopLeftCorner />
			<BottomRightCorner />

			<ContinueButton
				props={
					{
						pos: 'absolute',
						bottom: 5,
						right: 5,
					}
				}
				onClick={nextClick}
				disabled={!selectedPath}
			/>

			<OnboardingCard onBackClick={selectedPath ? backClick : undefined}>
				{steps[step]}
			</OnboardingCard>
		</BackgroundImageLayout>
	)
}

export default Onboarding