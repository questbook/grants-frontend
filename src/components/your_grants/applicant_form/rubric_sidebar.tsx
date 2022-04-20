import {
  Flex, Text, Link, Image, Box,
} from '@chakra-ui/react';
import React from 'react';

interface RubricSidebarProps {
  total: number;
  forCount: number;
  againstCount: number;
}

function RubricSidebar({ total, forCount, againstCount }: RubricSidebarProps) {
  const forPercentage = Math.ceil((forCount / total) * 100);
  const againstPercentage = 100 - forPercentage;

  const motion = [
    {
      label: 'Against',
      percentage: againstPercentage,
      icon: '/ui_icons/like_down.svg',
      color: '#EE7979',
    },
    {
      label: 'For',
      percentage: forPercentage,
      icon: '/ui_icons/like_up.svg',
      color: '#39C696',
    },
  ];

  return (
    <Flex
      bg="white"
      border="2px solid #D0D3D3"
      borderRadius={8}
      w={340}
      direction="column"
      alignItems="stretch"
      px="28px"
      py="22px"
    >
      <Flex direction="row" justify="space-between">
        <Text variant="tableHeader" color="#122224">
          Application Review
        </Text>
        <Link href="/" fontSize="12px" lineHeight="24px" fontWeight="500">
          Edit
        </Link>
      </Flex>
      <Text mt={3} variant="applicationText">
        {total - (forCount + againstCount)}
        {' '}
        waiting
      </Text>

      <Box mt={2} />

      <Flex direction="column" mt={8}>

        {motion.map((motionItem, index) => (
          <Flex
            w="100%"
            justify="space-between"
            position="relative"
            align="center"
            mt={index === 0 ? 0 : '44px'}
          >
            <Flex
              w={`${motionItem.percentage}%`}
              bg={motionItem.color}
              borderRadius="4px"
              h="32px"
              position="absolute"
              left={0}
            />

            <Flex direction="row" align="center" pos="absolute">
              <Image w="12px" h="12px" src={motionItem.icon} mx={3} />
              <Text
                fontSize="14px"
                lineHeight="24px"
                fontWeight="500"
                color="#FFFFFF"
              >
                {motionItem.label}
              </Text>
            </Flex>
            <Text
              position="absolute"
              right={0}
              fontSize="18px"
              lineHeight="24px"
              fontWeight="700"
              color="#414E50"
            >
              {motionItem.percentage}
              %
            </Text>
          </Flex>
        ))}
      </Flex>

      <Text mt={14} variant="tableHeader" color="#122224">
        Evaluation Rubric
      </Text>

      <Flex direction="column" mt={4}>
        {Array.from(
          { length: Math.ceil(1 + Math.random() * (10 - 1)) },
          (_, i) => (
            <Flex direction="row" mt={i === 0 ? 0 : 5}>
              <Text
                fontSize="16px"
                lineHeight="16px"
                fontWeight="400"
                color="#122224"
              >
                Vision
              </Text>
              <Box mx="auto" />
              {Array.from(
                { length: Math.ceil(1 + Math.random() * (5 - 1)) },
                (__, ii) => (
                  <Image
                    ml={ii === 0 ? 0 : 2}
                    src="/ui_icons/rubric_star.svg"
                    h="13px"
                    w="13px"
                  />
                ),
              )}
            </Flex>
          ),
        )}
      </Flex>

      <Link mt={5} href="/" fontSize="14px" lineHeight="24px" fontWeight="500">
        See detailed feedback
      </Link>
    </Flex>
  );
}

export default RubricSidebar;
