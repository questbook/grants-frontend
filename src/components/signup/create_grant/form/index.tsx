import React, { useContext } from 'react'
import {
	Button,
	Container,
	Flex,
	Image,
	Progress,
	Text,
} from '@chakra-ui/react'
import { ApiClientsContext } from 'pages/_app'
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils'
import strings from '../../../../constants/strings.json'
import Title from './1_title'
import Details from './2_details'
import ApplicantDetails from './3_applicantDetails'
import GrantRewardsInput from './4_rewards'

interface Props {
  currentStep: number;
  incrementCurrentStep: (data: any) => void;
  decrementCurrentStep: () => void;
  totalSteps: number;
  submitForm: (data: any) => void;
  hasClicked: boolean;
}

function Form({
	currentStep,
	incrementCurrentStep,
	decrementCurrentStep,
	totalSteps,
	submitForm,
	hasClicked,
}: Props) {
	const CACHE_KEY = strings.cache.create_grant
	const { workspace } = useContext(ApiClientsContext)!
	const getKey = `${getSupportedChainIdFromWorkspace(workspace)}-${CACHE_KEY}-${workspace?.id}`

	const incrementFormInputStep = (data: any) => {
		console.log(data)
		if(currentStep < totalSteps - 1) {
			incrementCurrentStep(data)
		} else {
			submitForm(data)
		}
	}

	const decrementFormInputStep = () => {
		if(currentStep > 0) {
			decrementCurrentStep()
		}
	}

	const [formData, setFormData] = React.useState({})

	React.useEffect(() => {
		console.log('Form DATA: ', formData)
	}, [formData])

	const constructCache = (data: any) => {
		if(getKey.includes('undefined') || typeof window === 'undefined') {
			return
		}

		const newFormData = { ...formData, ...data }
		console.log(newFormData)
		localStorage.setItem(getKey, JSON.stringify(newFormData))
		setFormData(newFormData)
	}

	const formInputs = [
		<Title
			onSubmit={incrementFormInputStep}
			constructCache={constructCache}
			cacheKey={getKey}
			key={0}
		/>,
		<Details
			onSubmit={incrementFormInputStep}
			constructCache={constructCache}
			cacheKey={getKey}
			key={1}
		/>,
		<ApplicantDetails
			onSubmit={incrementFormInputStep}
			constructCache={constructCache}
			cacheKey={getKey}
			key={2}
		/>,
		<GrantRewardsInput
			hasClicked={hasClicked}
			constructCache={constructCache}
			cacheKey={getKey}
			onSubmit={incrementFormInputStep}
			key={3}
		/>,
	]

	const getProgressValueFromStep = (step: number) => ((step + 1) / (totalSteps + 1)) * 100

	return (
		<Container
			maxW="100%"
			flex="1">
			<Flex
				flexDirection="column"
				h="100%"
				mx="116px"
				pb="52px"
				pt="38px"
				alignItems="flex-start"
				w="100%"
				maxW="496px"
			>
				{
					currentStep > 0 && (
						<Button
							variant="ghost"
							mb={10}
							p={0}
							_hover={
								{
									textDecoration: 'underline',
								}
							}
							_active={{}}
							leftIcon={
								<Image
									src="/ui_icons/back.svg"
									w="24px"
									h="24px" />
							}
							onClick={decrementFormInputStep}
						>
            Back
						</Button>
					)
				}
				<Text
					color="#69657B"
					fontSize="12px"
					fontWeight="400">
          Grant Details
				</Text>
				<Progress
					width="100%"
					value={getProgressValueFromStep(currentStep)}
					borderRadius={5}
					height={1}
					mt={2}
					colorScheme="brandGreen"
				/>
				{formInputs[currentStep]}
			</Flex>
		</Container>
	)
}

export default Form
