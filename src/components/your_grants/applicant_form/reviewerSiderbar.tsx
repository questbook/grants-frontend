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
import FeedbackDrawer from '../feedbackDrawer';
import MailTo from '../mail_to/mailTo';

function ReviewerSidebar({
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

  const [feedbackDrawerOpen, setFeedbackDrawerOpen] = React.useState(false);
  const [feedbacks, setFeedbacks] = React.useState<any[]>([]);

  return (
    <>
      <Flex
        bg="white"
        border="2px solid #D0D3D3"
        borderRadius={8}
        w={340}
        direction="column"
        alignItems="stretch"
        px="28px"
        py="22px"
        mb={8}
      >
        <Flex direction="column">
          <Text fontWeight="700">Assigned to review (you)</Text>
          <Text mt={2} color="#717A7C" fontSize="12px">
            Review the application and provide
            your feedback.
            {' '}
          </Text>

          <Button onClick={() => setFeedbackDrawerOpen(true)} mt={6} variant="primary">Review Application</Button>
        </Flex>
      </Flex>

      <FeedbackDrawer
        feedbackDrawerOpen={feedbackDrawerOpen}
        setFeedbackDrawerOpen={setFeedbackDrawerOpen}
        grantAddress={applicationData?.grant.id}
        chainId={chainId}
        workspaceId={applicationData?.grant.workspace.id}
        feedbacks={feedbacks}
        setFeedbacks={setFeedbacks}
        rubrics={applicationData?.grant.rubric.items}
        feedbackEditAllowed
        applicationId={applicationData?.id}
      />
    </>
  );
}

export default ReviewerSidebar;
