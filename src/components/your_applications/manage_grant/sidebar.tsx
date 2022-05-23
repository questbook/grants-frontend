import {
  Box, Link, Text, Flex, Image, Divider,
} from '@chakra-ui/react';
import React from 'react';
import { SupportedChainId } from 'src/constants/chains';
import FloatingSidebar from '../../ui/sidebar/floatingSidebar';

function Sidebar({
  applicationData,
  assetInfo,
  chainId,
}: {
  applicationData: any;
  assetInfo: any;
  chainId: SupportedChainId | undefined;
}) {
  return (
    <Box my="115px">
      <FloatingSidebar>
        <Text variant="applicationText" color="#414E50">
          Application Details
        </Text>
        <Flex direction="row" justify="start" w="full" mt={7} align="flex-start">
          <Image h="45px" w="45px" src={assetInfo?.icon} />
          <Box ml="18px" />
          <Flex direction="column" align="start" w="100%">
            <Text
              fontSize="18px"
              lineHeight="24px"
              letterSpacing={0.5}
              fontWeight="700"
              color="#6200EE"
            >
              {`${applicationData.applicantAddress.substring(0, 6)}...`}
            </Text>
            <Text variant="applicationText" color="#717A7C">
              Sent on
              {' '}
              <Box
                display="inline-block"
                fontSize="16px"
                lineHeight="32px"
                letterSpacing={0.5}
                fontWeight="700"
                color="#122224"
              >
                {applicationData.applicationDate}
              </Box>
            </Text>
          </Flex>
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
            href={`/explore_grants/about_grant/?grantId=${applicationData.grant?.id}&chainId=${chainId}`}
            isExternal
          >
            View Grant
            {' '}
            <Image display="inline-block" h={3} w={3} src="/ui_icons/link.svg" />
          </Link>
          <Link
            variant="link"
            fontSize="14px"
            lineHeight="24px"
            fontWeight="500"
            fontStyle="normal"
            color="#414E50"
            href={`/your_applications/grant_application/?applicationId=${applicationData.id}&chainId=${chainId}`}
            isExternal
            ml="auto"
          >
            View Application
            {' '}
            <Image display="inline-block" h={3} w={3} src="/ui_icons/link.svg" />
          </Link>
        </Flex>
      </FloatingSidebar>
    </Box>
  );
}

export default Sidebar;
