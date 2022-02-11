import { Container } from '@chakra-ui/react';
import React, { useRef, useState } from 'react';
import Form from './form';
import TipsContainer from './tips';

function CreateGrant({
  onSubmit,
}: {
  onSubmit: (data: any) => void;
}) {
  const totalSteps = 4;

  const [formData, setFormData] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const currentPageRef = useRef(null);

  const changeCurrentStep = (data: any, step: number) => {
    setFormData({ ...data, ...formData });

    const { current } = currentPageRef;
    if (!current) return;
    ((current as HTMLElement)?.parentNode as HTMLElement).scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
    // console.log(currentPageRef.current?.parentNode);
    setCurrentStep(step);
  };

  const submitForm = (data: any) => {
    setFormData({ ...data, ...formData });
    // eslint-disable-next-line no-console
    // console.log({ ...data, ...formData });
    // setTimeout(() => {
    //   onSubmit();
    // }, 10000);

    onSubmit({ ...data, ...formData });
  };

  return (
    <Container
      ref={currentPageRef}
      display="flex"
      w="100%"
      maxW="100%"
      minH="calc(100vh - 80px)"
      px={0}
      py={0}
    >
      <Form
        currentStep={currentStep}
        totalSteps={totalSteps}
        incrementCurrentStep={(data) => changeCurrentStep(data, currentStep + 1)}
        submitForm={(data) => submitForm(data)}
      />
      <TipsContainer currentTip={currentStep} />
    </Container>
  );
}

export default CreateGrant;
