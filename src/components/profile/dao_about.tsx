/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import {
  Image, Text, Button, Flex, Box, Divider, Link,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';

interface DaoAboutProps {
  daoAbout?: string;
  daoPartners?: string;
}

function DaoAbout({
  daoAbout,
  daoPartners
}: DaoAboutProps) {
  const router = useRouter();

  return (
    <Flex py={6} px="1.5rem" w="100%" h="full">
      <Text>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pretium, malesuada magna nisi, amet pharetra volutpat, sit leo aliquet. Feugiat habitant orci nibh curabitur condimentum proin egestas tincidunt. Placerat odio bibendum diam nisi, sodales lacinia pellentesque. Faucibus turpis nunc egestas massa feugiat nunc, massa non. Proin iaculis massa vitae cras mattis volutpat enim ut.
      </Text>
    </Flex>
  );
}

export default DaoAbout;
