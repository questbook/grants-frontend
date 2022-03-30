import {
  Flex,
  Text,
  Box,
  Link,
  Image,
} from '@chakra-ui/react';
import React from 'react';
import { Workspace } from 'src/types';
import { getSupportedChainIdFromSupportedNetwork } from 'src/utils/validationUtils';
import EditForm from './edit_form';

interface Props {
  workspaceData: Workspace;
}

function Settings({ workspaceData }: Props) {
  return (
    <Flex direction="column" align="start" w="85%">
      <Flex direction="row" w="full" justify="space-between">
        <Text
          fontStyle="normal"
          fontWeight="bold"
          fontSize="18px"
          lineHeight="26px"
        >
          Workspace Settings
        </Text>
        <Link
          href={`/profile?daoId=${
            workspaceData?.id
          }&chainId=${getSupportedChainIdFromSupportedNetwork(
            workspaceData?.supportedNetworks[0],
          )}`}
          color="brand.500"
          fontWeight="700"
          letterSpacing={0.5}
        >
          <Flex direction="row" align="center">
            <Image src="/ui_icons/see.svg" display="inline-block" mr={2} />
            See Profile Preview
          </Flex>
        </Link>
      </Flex>

      <EditForm workspaceData={workspaceData} />

      <Box my={10} />
    </Flex>
  );
}

export default Settings;
