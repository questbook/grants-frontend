import {
  Box, VStack, Button, Text,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { ApiClientsContext } from 'pages/_app';
import React, { useContext } from 'react';
import FloatingSidebar from '../../ui/sidebar/floatingSidebar2';
import Tooltip from '../../ui/tooltip';

interface Props {
  grantRequiredFields: any[];
  grantID: string;
}

function Sidebar({ grantRequiredFields, grantID }: Props) {
  const router = useRouter();
  const { chainId } = useContext(ApiClientsContext)!;
  return (
    <Box my="71px">
      <FloatingSidebar>
        <Text variant="heading" fontSize="18px" lineHeight="26px">
          Requisite for Application
        </Text>
        <VStack alignItems="stretch" mt={5} p={0} spacing={4}>
          {grantRequiredFields?.map(({ detail, tooltip }) => (
            <Text
              fontWeight="400"
              fontSize="16px"
              lineHeight="20px"
              key={`grant-required-field-${detail}`}
            >
              {detail}
              {tooltip?.length ? (
                <Tooltip icon="/ui_icons/tooltip_grey.svg" label={tooltip} />
              ) : null}
            </Text>
          ))}
        </VStack>
        <Button
          onClick={() => router.push({
            pathname: '/explore_grants/apply',
            query: {
              account: true,
              grantID,
              chainId,
            },
          })}
          mt={10}
          variant="primary"
        >
          Apply for Grant
        </Button>
        <Text
          mt={2}
          color="#717A7C"
          textAlign="center"
          fontWeight="400"
          fontSize="12px"
          lineHeight="16px"
        >
          Before applying, please ensure you read the grant details, and understand every details
          around it.
        </Text>
      </FloatingSidebar>
    </Box>
  );
}

export default Sidebar;
