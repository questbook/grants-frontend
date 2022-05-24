import React from 'react';
import {
  Container,
  Flex,
  Text,
  Progress,
  Image,
  Button,
} from '@chakra-ui/react';
import ApplicantDetails from './3_applicantDetails';
import Details from './2_details';
import GrantRewardsInput from './4_rewards';
import Title from './1_title';

interface Props {
  currentStep: number;
  incrementCurrentStep: (data: any) => void;
  decrementCurrentStep: () => void;
  totalSteps: number;
  submitForm: (data: any) => void;
  hasClicked: boolean;
}

function Form({
  currentStep, incrementCurrentStep, decrementCurrentStep, totalSteps, submitForm, hasClicked,
}: Props) {
  const incrementFormInputStep = (data: any) => {
    console.log(data);
    if (currentStep < totalSteps - 1) {
      incrementCurrentStep(data);
    } else {
      submitForm(data);
    }
  };

  const decrementFormInputStep = () => {
    if (currentStep > 0) {
      decrementCurrentStep();
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
        {currentStep > 0 && (
        <Button
          variant="ghost"
          mb={10}
          p={0}
          _hover={{
            textDecoration: 'underline',
          }}
          _active={{}}
          leftIcon={<Image src="/ui_icons/back.svg" w="24px" h="24px" />}
          onClick={decrementFormInputStep}
        >
          Back
        </Button>
        )}
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
