import {
  Box, Heading, Flex, Divider, Image, Text, Link,
} from '@chakra-ui/react';
import { ApiClientsContext } from 'pages/_app';
import React, { useContext } from 'react';
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils';
import { getFormattedFullDateFromUnixTimestamp, truncateStringFromMiddle } from '../../../../utils/formattingUtils';
import { getAssetInfo } from '../../../../utils/tokenUtils';
import FloatingSidebar from '../../../ui/sidebar/floatingSidebar';

function Sidebar(
  {
    applicationData,
    showHiddenData,
  }: {
    applicationData: any;
    showHiddenData: () => void;
  },
) {
  const { workspace } = useContext(ApiClientsContext)!;
  const chainId = getSupportedChainIdFromWorkspace(workspace);
  return (
    <Box mt="8px">
      <FloatingSidebar>
        <Heading
          fontSize="16px"
          fontWeight="400"
          color="#414E50"
          lineHeight="26px"
          fontStyle="normal"
        >
          Application Details
        </Heading>
        <Flex direction="row" justify="start" w="full" mt={6} align="center">
          <Image h="45px" w="45px" src={getAssetInfo(applicationData?.grant?.reward?.asset, chainId)?.icon} />
          <Box mx={3} />
          <Heading variant="applicationHeading" color="brand.500">
            {truncateStringFromMiddle(applicationData?.applicantId)}
          </Heading>
        </Flex>
        <Box my={4} />
        <Flex direction="row" justify="space-between" w="full" align="center">
          <Text variant="applicationText" lineHeight="32px">
            Name
          </Text>
          <Heading variant="applicationHeading" lineHeight="32px">
            {applicationData?.fields?.find((fld:any) => fld?.id?.split('.')[1] === 'applicantName').values[0]?.value}
          </Heading>
        </Flex>
        <Flex direction="row" justify="space-between" w="full" align="center">
          <Text variant="applicationText" lineHeight="32px">
            Email
          </Text>
          <Heading variant="applicationHeading" lineHeight="32px">
            {(applicationData?.fields?.find((fld:any) => fld?.id?.split('.')[1] === 'applicantEmail')) ? (
              applicationData?.fields?.find((fld:any) => fld?.id?.split('.')[1] === 'applicantEmail')?.values[0]?.value) : (
                <Heading variant="applicationHeading" lineHeight="32px" onClick={showHiddenData} cursor="pointer">
                  Hidden
                  {' '}
                  <Text color="#6200EE" display="inline">View</Text>
                </Heading>
            )}
          </Heading>
        </Flex>
        <Flex direction="row" justify="space-between" w="full" align="center">
          <Text variant="applicationText" lineHeight="32px">
            Sent On
          </Text>
          <Heading variant="applicationHeading" lineHeight="32px">
            {getFormattedFullDateFromUnixTimestamp(applicationData?.createdAtS)}
          </Heading>
        </Flex>
        <Divider mt="37px" />
        <Flex mt="22px" mb="3px" direction="row" w="full" alignItems="center">
          <Link
            variant="link"
            fontSize="14px"
            lineHeight="24px"
            fontWeight="500"
            fontStyle="normal"
            color="#414E50"
            href={`/explore_grants/about_grant?grantID=${applicationData?.grant?.id}`}
          >
            View Grant
            {' '}
            <Image
              display="inline-block"
              h={3}
              w={3}
              src="/ui_icons/link.svg"
            />
          </Link>
          <Link
            variant="link"
            fontSize="14px"
            lineHeight="24px"
            fontWeight="500"
            fontStyle="normal"
            color="#414E50"
            href={`/your_applications/grant_application?applicationID=${applicationData?.id}`}
            ml="auto"
          >
            View Application
            {' '}
            <Image
              display="inline-block"
              h={3}
              w={3}
              src="/ui_icons/link.svg"
            />
          </Link>
        </Flex>
      </FloatingSidebar>
    </Box>
  );
}

export default Sidebar;
