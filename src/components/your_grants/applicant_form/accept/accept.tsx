import {
  Container,
  Flex,
  Divider,
  Button,
  Text,
  Image,
} from '@chakra-ui/react';
import React from 'react';

function Accept({
  milestones,
  onSubmit,
}: {
  milestones: any[];
  onSubmit: () => void;
}) {
  return (
    <Container
      flex={1}
      display="flex"
      flexDirection="column"
      maxW="834px"
      alignItems="stretch"
      pb={8}
      px={10}
    >
      <Text fontSize="18px" lineHeight="26px" fontWeight="700">
        Accept Grant Application
      </Text>
      <Flex direction="row" align="center" mt={2}>
        <Image src="/ui_icons/funding_asked.svg" />
        <Flex ml={4} direction="column" align="start">
          <Text fontSize="16px" lineHeight="24px" fontWeight="700">
            Total Funding Asked
          </Text>
          <Text
            fontSize="14px"
            lineHeight="20px"
            fontWeight="700"
            color="brand.500"
          >
            60 ETH
          </Text>
        </Flex>
      </Flex>
      <Divider mt="22px" mb="16px" />
      <Text fontSize="18px" fontWeight="700" lineHeight="26px" color="#6200EE">
        Funding split by milestones
      </Text>
      <Flex direction="column" justify="start" align="start">
        {milestones.map((milestone) => (
          <Flex direction="column" mt={6}>
            <Text variant="applicationText" fontWeight="700">
              Milestone
              {' '}
              {milestone.number}
            </Text>
            <Text variant="applicationText" color="#717A7C">
              {milestone.description}
            </Text>
            <Flex direction="row" justify="start" align="center" mt={2}>
              <Image src={milestone.icon} />
              <Flex direction="column" ml={2}>
                <Text variant="applicationText" fontWeight="700">
                  Funding Ask
                </Text>
                <Text
                  fontSize="14px"
                  lineHeight="20px"
                  fontWeight="700"
                  color="brand.500"
                >
                  {milestone.amount}
                  {' '}
                  {milestone.symbol}
                </Text>
              </Flex>
            </Flex>
          </Flex>
        ))}
      </Flex>
      <Divider mt={7} />
      <Button onClick={() => onSubmit()} w="100%" mt={10} variant="primary">
        Accept Application
      </Button>
    </Container>
  );
}

export default Accept;
