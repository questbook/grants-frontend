import {
  Box, Button, Container, Flex, Text,
} from '@chakra-ui/react';
import React, {
  ReactElement, useRef, useState,
} from 'react';
import { useGrantContext } from 'src/context/grantContext';
import Breadcrumbs from '../../src/components/ui/breadcrumbs';
import Form from '../../src/components/your_grants/create_grant/form';
import NavbarLayout from '../../src/layout/navbarLayout';

function CreateGrant() {
  const grantInfoRef = useRef(null);
  const detailsRef = useRef(null);
  const applicationDetailsRef = useRef(null);
  const grantRewardsRef = useRef(null);

  const [currentStep, setCurrentStep] = useState(0);

  const scroll = (ref: any, step: number) => {
    if (!ref.current) return;
    ref.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
    setCurrentStep(step);
  };

  const sideBarDetails = [
    ['Grant Intro', 'Grant title, and summary', grantInfoRef],
    [
      'Grant Details',
      'Requirements, expected deliverables, and milestones',
      detailsRef,
    ],
    [
      'Applicant Details',
      'About team, project, and funding breakdown.',
      applicationDetailsRef,
    ],
    [
      'Reward and Deadline',
      'Grant reward & submission deadline',
      grantRewardsRef,
    ],
  ];

  const {
    createGrant, hasClicked,
  } = useGrantContext();

  const handleGrantSubmit = async (data: any) => {
    await createGrant(data);
  };

  return (
    <Container maxW="100%" display="flex" px="70px">
      <Container
        flex={1}
        display="flex"
        flexDirection="column"
        maxW="682px"
        alignItems="stretch"
        pb={8}
        px={10}
      >
        <Breadcrumbs path={['My Grants', 'Create grant']} />
        <Form
          onSubmit={handleGrantSubmit}
          refs={sideBarDetails.map((detail) => detail[2])}
          hasClicked={hasClicked}
        />
      </Container>

      <Box>
        <Flex
            // h="calc(100vh - 80px)"
            // bg={theme.colors.backgrounds.floatingSidebar}
          position="sticky"
          top={10}
          borderLeft="2px solid #E8E9E9"
          maxW={340}
          direction="column"
          alignItems="stretch"
          boxSizing="border-box"
        >
          {sideBarDetails.map(([title, description, ref], index) => (
            <Flex key={`sidebar-${title}`} direction="row" align="start">
              <Box
                bg={currentStep < index ? '#E8E9E9' : 'brand.500'}
                h="20px"
                w="20px"
                minW="20px"
                color={currentStep < index ? 'black' : 'white'}
                textAlign="center"
                display="flex"
                alignItems="center"
                justifyContent="center"
                lineHeight="0"
                fontSize="12px"
                fontWeight="700"
                ml="-1px"
              >
                {index + 1}
              </Box>
              <Flex direction="column" align="start" ml={7}>
                <Button
                  variant="link"
                  color={currentStep < index ? 'black' : 'brand.500'}
                  textAlign="left"
                  onClick={() => scroll(ref, index)}
                >
                  <Text
                    fontSize="18px"
                    fontWeight="700"
                    lineHeight="26px"
                    letterSpacing={0}
                    textAlign="left"
                  >
                    {title}
                  </Text>
                </Button>
                <Text
                  mt="6px"
                  color={currentStep < index ? '#717A7C' : '#122224'}
                  fontSize="14px"
                  fontWeight="400"
                  lineHeight="20px"
                >
                  {description}
                </Text>
                <Box mb={7} />
              </Flex>
            </Flex>
          ))}
        </Flex>
      </Box>
    </Container>
  );
}

CreateGrant.getLayout = function getLayout(page: ReactElement) {
  return <NavbarLayout>{page}</NavbarLayout>;
};

export default CreateGrant;
