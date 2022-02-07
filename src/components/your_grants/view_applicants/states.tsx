import React from 'react';
import { Text } from '@chakra-ui/react';

function GrantApproved() {
  return (
    <Text
      w="100%"
      maxW="115px"
      bg="#C8E9DE"
      color="#334640"
      borderRadius="24px"
      border="1px solid #69B399"
      px={3}
      py={1}
      textAlign="center"
      fontSize="12px"
      lineHeight="20px"
      fontWeight="400"
      whiteSpace="nowrap"
    >
      Grant Approved
    </Text>
  );
}

function Rejected() {
  return (
    <Text
      w="100%"
      maxW="115px"
      bg="#EBCCDD"
      color="#7B4646"
      borderRadius="24px"
      border="1px solid #EE7979"
      px={3}
      py={1}
      textAlign="center"
      fontSize="12px"
      lineHeight="20px"
      fontWeight="400"
    >
      Rejected
    </Text>
  );
}

function PendingReview() {
  return (
    <Text
      w="100%"
      maxW="115px"
      bg="#FFF0B8"
      color="#46251D"
      borderRadius="24px"
      border="1px solid #EFC094"
      px={3}
      py={1}
      textAlign="center"
      fontSize="12px"
      lineHeight="20px"
      fontWeight="400"
      whiteSpace="nowrap"
    >
      Pending Review
    </Text>
  );
}

function ResubmissionRequested() {
  return (
    <Text
      w="100%"
      maxW="115px"
      bg="#FFF0B8"
      color="#46251D"
      borderRadius="24px"
      border="1px solid #EFC094"
      px={3}
      py={1}
      textAlign="center"
      fontSize="12px"
      lineHeight="20px"
      fontWeight="400"
      whiteSpace="nowrap"
    >
      Changes Req
    </Text>
  );
}

export {
  GrantApproved, Rejected, PendingReview, ResubmissionRequested,
};
