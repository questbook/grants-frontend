import { useState } from 'react'
import { useRouter } from 'next/router'
import CreateDaoFinal from 'src/v2/components/Onboarding/CreateDao/CreateDaoFinal'
import CreateDaoNameInput from 'src/v2/components/Onboarding/CreateDao/CreateDaoNameInput'
import CreateDaoNetworkSelect from 'src/v2/components/Onboarding/CreateDao/CreateDaoNetworkSelect'
import { NetworkSelectOption } from 'src/v2/components/Onboarding/SupportedNetworksData'
import BackgroundImageLayout from 'src/v2/components/Onboarding/UI/Layout/BackgroundImageLayout'
import OnboardingCard from 'src/v2/components/Onboarding/UI/Layout/OnboardingCard'

const OnboardingCreateDao = () => {
	const router = useRouter()
	const [step, setStep] = useState(0)
	const [daoName, setDaoName] = useState<string>()
	const [daoNetwork, setDaoNetwork] = useState<NetworkSelectOption>()

	const steps = [
		<CreateDaoNameInput
			key={'createdao-onboardingstep-0'}
			onSubmit={
				(name) => {
					setDaoName(name)
					nextClick()
				}
			} />,
		<CreateDaoNetworkSelect
			key={'createdao-onboardingstep-1'}
			onSubmit={
				(network) => {
					setDaoNetwork(network)
					nextClick()
				}
			}
		/>,
		<CreateDaoFinal
			key={'createdao-onboardingstep-2'}
			daoNetwork={daoNetwork!}
			daoName={daoName!}
		/>,
	]

	const nextClick = () => {
		if(step === 0) {
			setStep(1)
			return
		}

		if(step === 1) {
			setStep(2)
			return
		}

		router.push({
			pathname: '/'
		})
	}

	const backClick = () => {
		if(step === 2) {
			setStep(1)
			return
		}

		if(step === 1) {
			setStep(0)
			return
		}

		router.back()
	}

	return (
		<BackgroundImageLayout
			imageSrc={'/onboarding-create-dao.png'}
			imageBackgroundColor={'#C2E7DA'}
			imageProps={
				{
					mixBlendMode: 'hard-light'
				}
			}
		>
			<OnboardingCard onBackClick={backClick}>
				{steps[step]}
			</OnboardingCard>
		</BackgroundImageLayout>
	)
}

export default OnboardingCreateDao