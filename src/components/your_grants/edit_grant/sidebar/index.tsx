import {
  Box, Flex, Button, Text,
} from '@chakra-ui/react';
import React from 'react';

function Sidebar({
  sidebarDetails,
  scrollTo,
  currentStep,
}: {
  sidebarDetails: any[];
  scrollTo: (ref: React.Ref<HTMLElement>, index: number) => void;
  currentStep: number;
}) {
  return (
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
        {sidebarDetails.map(([title, description, ref], index) => (
          <Flex direction="row" align="start">
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
                onClick={() => scrollTo(ref, index)}
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
  );
}

export default Sidebar;
