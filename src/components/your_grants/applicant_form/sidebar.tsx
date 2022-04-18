import {
  Heading,
  Flex,
  Text,
  Image,
  Box,
  Button,
  Tooltip,
} from '@chakra-ui/react';
import { ApiClientsContext } from 'pages/_app';
import React, { useContext } from 'react';
import CopyIcon from 'src/components/ui/copy_icon';
import { CHAIN_INFO } from 'src/constants/chainInfo';
import {
  getSupportedChainIdFromSupportedNetwork,
  getSupportedChainIdFromWorkspace,
} from 'src/utils/validationUtils';
import {
  formatAmount,
  getFormattedFullDateFromUnixTimestamp,
  truncateStringFromMiddle,
} from '../../../utils/formattingUtils';
import { getAssetInfo } from '../../../utils/tokenUtils';
import FloatingSidebar from '../../ui/sidebar/floatingSidebar';
import MailTo from '../mail_to/mailTo';

function Sidebar({
  showHiddenData,
  onAcceptApplicationClick,
  onRejectApplicationClick,
  onResubmitApplicationClick,
  applicationData,
}: {
  showHiddenData: () => void;
  onAcceptApplicationClick: () => void;
  onRejectApplicationClick: () => void;
  onResubmitApplicationClick: () => void;
  applicationData: any;
}) {
  const { workspace } = useContext(ApiClientsContext)!;
  const chainId = getSupportedChainIdFromWorkspace(workspace);

  const applicantEmail = applicationData?.fields?.find(
    (fld: any) => fld?.id?.split('.')[1] === 'applicantEmail',
  ) ? applicationData?.fields?.find(
      (fld: any) => fld?.id?.split('.')[1] === 'applicantEmail',
    )?.values[0]?.value : undefined;

  return (
    <>
      <Flex
        bg="white"
        border="2px solid #D0D3D3"
        borderRadius={4}
        w={340}
        direction="column"
        alignItems="stretch"
        px="28px"
        py="22px"
      >
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
          <Image
            h="45px"
            w="45px"
            src={
            getAssetInfo(applicationData?.grant?.reward?.asset, chainId)?.icon
          }
          />
          <Box mx={3} />
          <Tooltip label={applicationData?.applicantId}>
            <Heading variant="applicationHeading" color="brand.500">
              {truncateStringFromMiddle(applicationData?.applicantId)}
            </Heading>
          </Tooltip>
          <Box mr={4} />
          <CopyIcon text={applicationData?.applicantId} />
        </Flex>
        <Box my={4} />
        <Flex direction="row" justify="space-between" w="full" align="center">
          <Text variant="applicationText" lineHeight="32px">
            Name
          </Text>
          <Heading variant="applicationHeading" lineHeight="32px">
            {
            applicationData?.fields?.find(
              (fld: any) => fld?.id?.split('.')[1] === 'applicantName',
            )?.values[0]?.value
          }
          </Heading>
        </Flex>
        <Flex direction="row" justify="space-between" w="full" align="center">
          <Text variant="applicationText" lineHeight="32px">
            Email
          </Text>
          <Heading variant="applicationHeading" lineHeight="32px">
            {applicationData?.fields?.find(
              (fld: any) => fld?.id?.split('.')[1] === 'applicantEmail',
            ) ? (
              <>
                {
                applicationData?.fields?.find(
                  (fld: any) => fld?.id?.split('.')[1] === 'applicantEmail',
                )?.values[0]?.value
              }
                <MailTo applicantEmail={applicantEmail} />
              </>
              ) : (
                <Heading
                  variant="applicationHeading"
                  lineHeight="32px"
                  onClick={showHiddenData}
                  cursor="pointer"
                >
                  Hidden
                  {' '}
                  <Text color="#6200EE" display="inline">
                    View
                  </Text>
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
        <Flex direction="column" w="full" align="start" mt={4}>
          <Box
          // variant="dashed"
            border="1px dashed #A0A7A7"
            h={0}
            w="100%"
            m={0}
          />
          <Text fontSize="10px" mt={6} lineHeight="12px">
            FUNDING REQUESTED
          </Text>
          <Text
            fontSize="20px"
            lineHeight="40px"
            fontWeight="500"
            fontStyle="normal"
            color="#122224"
          >
            {applicationData
            && formatAmount(
              applicationData?.fields?.find(
                (fld: any) => fld?.id?.split('.')[1] === 'fundingAsk',
              )?.values[0]?.value ?? '0',
              CHAIN_INFO[
                getSupportedChainIdFromSupportedNetwork(
                  applicationData.grant.workspace.supportedNetworks[0],
                )
              ]?.supportedCurrencies[
                applicationData.grant.reward.asset.toLowerCase()
              ]?.decimals ?? 18,
            )}
            {' '}
            {getAssetInfo(applicationData?.grant?.reward?.asset, chainId)?.label}
          </Text>
          <Box
          // variant="dashed"
            border="1px dashed #A0A7A7"
            h={0}
            w="100%"
            mt="17px"
            mb={0}
          />
        </Flex>
        <Button
          onClick={() => onAcceptApplicationClick()}
          variant="primary"
          mt={7}
          display={applicationData?.state === 'submitted' ? '' : 'none'}
        >
          Approve Application
        </Button>
        <Button
          onClick={() => onAcceptApplicationClick()}
          variant="primary"
          mt={7}
          disabled={applicationData?.state === 'resubmit'}
          display={applicationData?.state === 'resubmit' ? '' : 'none'}
        >
          Accept Application
        </Button>
        <Text
          mt={7}
          fontSize="sm"
          lineHeight="4"
          align="center"
          color="#717A7C"
          display={applicationData?.state === 'resubmit' ? '' : 'none'}
        >
          This application has been asked for resubmission. The applicant has been
          notified to resubmit.
        </Text>
        <Button
          onClick={() => onResubmitApplicationClick()}
          variant="resubmit"
          mt={4}
          display={applicationData?.state === 'submitted' ? '' : 'none'}
        >
          Ask to Resubmit
        </Button>
        <Button
          onClick={() => onRejectApplicationClick()}
          variant="reject"
          mt={4}
          display={applicationData?.state === 'submitted' ? '' : 'none'}
        >
          Reject Application
        </Button>
      </Flex>
      <Flex
        bg="white"
        border="2px solid #D0D3D3"
        borderRadius={4}
        w={340}
        direction="column"
        alignItems="stretch"
        px="28px"
        py="22px"
        mt={8}
      >
        <Flex direction="column">
          <Text fontWeight="700">Application Reviewers</Text>
          <Text mt={2}>Assign reviewers for application</Text>
          <Button mt={4}>
            <Text fontWeight="700">Assign Reviewers</Text>
          </Button>
        </Flex>
      </Flex>
      <Flex
        bg="white"
        border="2px solid #D0D3D3"
        borderRadius={4}
        w={340}
        direction="column"
        alignItems="stretch"
        px="28px"
        py="22px"
        mt={8}
        mb={8}
      >
        <Flex direction="column">
          <Text mb="14px" fontWeight="700">Evaluation Rubric</Text>
          {[{ title: 'Evaluation Rubric', description: 'Description' },
            { title: 'Evaluation Rubric', description: 'Description' }].map((rubric: any) => (
              <>
                <Text mt={2} fontWeight="700" color="#122224" fontSize="14px">{rubric.title}</Text>
                <Text color="#717A7C" fontSize="12px">{rubric.description}</Text>
              </>
          ))}
        </Flex>
      </Flex>
    </>
  );
}

export default Sidebar;
