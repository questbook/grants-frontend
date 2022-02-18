import React from 'react';
import {
  Container,
  Flex,
  Text,
  Progress,
} from '@chakra-ui/react';
import ApplicantDetails from './3_applicantDetails';
import Details from './2_details';
import GrantRewardsInput from './4_rewards';
import Title from './1_title';

interface Props {
  currentStep: number;
  incrementCurrentStep: (data: any) => void;
  totalSteps: number;
  submitForm: (data: any) => void;
  hasClicked: boolean;
}

function Form({
  currentStep, incrementCurrentStep, totalSteps, submitForm, hasClicked,
}: Props) {
  const incrementFormInputStep = (data: any) => {
    if (currentStep < totalSteps - 1) {
      incrementCurrentStep(data);
    } else {
      submitForm(data);
    }
  };

  const formInputs = [
    <Title onSubmit={incrementFormInputStep} key={0} />,
    <Details onSubmit={incrementFormInputStep} key={1} />,
    <ApplicantDetails onSubmit={incrementFormInputStep} key={2} />,
    <GrantRewardsInput hasClicked={hasClicked} onSubmit={incrementFormInputStep} key={3} />,
  ];

  const getProgressValueFromStep = (step: number) => ((step + 1) / (totalSteps + 1)) * 100;

  return (
    <Container maxW="100%" flex="1">
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
        <Text color="#69657B" fontSize="12px" fontWeight="400">
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
  );
}

export default Form;
