import {
  Flex,
  Text,
  Button,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  Box,
  Divider,
} from '@chakra-ui/react';
import { ApiClientsContext } from 'pages/_app';
import React, { useContext, useEffect, useState } from 'react';
import StarRatings from 'react-star-ratings';
import Badge from 'src/components/ui/badge';
import MultiLineInput from 'src/components/ui/forms/multiLineInput';
import Loader from 'src/components/ui/loader';
import useEncryption from 'src/hooks/utils/useEncryption';
import { getFromIPFS } from 'src/utils/ipfsUtils';
import {
  getSupportedChainIdFromWorkspace,
} from 'src/utils/validationUtils';
import { useAccount } from 'wagmi';
import FeedbackDrawer from '../feedbackDrawer';

function ReviewerSidebar({
  applicationData,
  isAdmin,
}: {
  showHiddenData: () => void;
  isAdmin: boolean;
  onAcceptApplicationClick: () => void;
  onRejectApplicationClick: () => void;
  onResubmitApplicationClick: () => void;
  applicationData: any;
}) {
  const { workspace } = useContext(ApiClientsContext)!;
  const chainId = getSupportedChainIdFromWorkspace(workspace);
  const [{ data: accountData }] = useAccount();

  const [feedbackDrawerOpen, setFeedbackDrawerOpen] = React.useState(false);
  const [feedbacks, setFeedbacks] = React.useState<any[]>([]);

  const [yourReview, setYourReview] = useState<any>();

  const [decrpytLoading, setDecrpytLoading] = useState(false);
  const [reviewerDrawerOpen, setReviewerDrawerOpen] = useState(false);
  const [reviewSelected, setReviewSelected] = React.useState<any>();

  const { decryptMessage } = useEncryption();

  useEffect(() => {
    if (!applicationData) return;
    if (!accountData) return;
    const review = applicationData?.reviews.find((r: any) => (
      r.reviewer.id.split('.')[1].toLowerCase() === accountData?.address.toLowerCase()
    ));
    setYourReview(review);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applicationData, accountData]);

  const handleSeeFeedbackClick = async () => {
    setDecrpytLoading(true);
    const reviewData = yourReview.data.find((d: any) => (
      d.id.split('.')[1].toLowerCase() === accountData?.address.toLowerCase()
    ));
    const ipfsData = await getFromIPFS(reviewData.data);
    let data = {};
    if (applicationData?.grant.rubric.isPrivate) {
      data = JSON.parse(await decryptMessage(ipfsData) ?? '{}');
    } else {
      data = JSON.parse(ipfsData ?? '{}');
    }
    console.log(data);
    setDecrpytLoading(false);
    setReviewSelected(data);
    setReviewerDrawerOpen(true);
  };

  if (yourReview && isAdmin) {
    return null;
  }

  if (yourReview) {
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
            <Text fontWeight="700">Your Review</Text>
            <Text mt={2} color="#717A7C" fontSize="12px">
              You have already submitted a review for this application.
              {' '}
            </Text>

            {decrpytLoading ? (
              <Button onClick={() => {}} mt={6} variant="primary"><Loader /></Button>
            ) : (
              <Button onClick={() => handleSeeFeedbackClick()} mt={6} variant="primary">View Feedback</Button>
            )}

          </Flex>
        </Flex>
        <Drawer
          isOpen={reviewerDrawerOpen}
          placement="right"
          onClose={() => {
            setReviewerDrawerOpen(false);
            setReviewSelected(null);
          }}
          size="lg"
        >
          <DrawerOverlay />
          <DrawerContent>

            <Flex direction="column" overflow="scroll" p={8}>
              <Text
                mt="18px"
                color="#122224"
                fontWeight="bold"
                fontSize="16px"
                lineHeight="20px"
              >
                Overall Recommendation
              </Text>
              <Flex py={8}>
                <Badge
                  isActive={reviewSelected?.isApproved}
                  label="YES"
                  onClick={() => {}}
                />

                <Box ml={4} />

                <Badge
                  isActive={!reviewSelected?.isApproved}
                  label="NO"
                  onClick={() => {}}
                />
              </Flex>
              {reviewSelected?.items?.map((feedback: any) => (
                <>
                  <Flex
                    mt={4}
                    gap="2"
                    direction="column"
                  >
                    <Text
                      mt="18px"
                      color="#122224"
                      fontWeight="bold"
                      fontSize="16px"
                      lineHeight="20px"
                    >
                      {feedback.rubric.title}
                    </Text>
                    <Text
                      color="#69657B"
                      fontWeight="bold"
                      fontSize="12px"
                      lineHeight="20px"
                    >
                      {feedback.rubric.details}
                    </Text>

                    <StarRatings
                      numberOfStars={feedback.rubric.maximumPoints}
                      starRatedColor="#88BDEE"
                      rating={feedback.rating}
                      name="rating"
                      starHoverColor="#88BDEE"
                      starDimension="18px"
                    />

                    <MultiLineInput
                      value={feedback.comment}
                      onChange={() => {}}
                      placeholder="Feedback"
                      isError={false}
                      errorText="Required"
                      disabled
                    />
                  </Flex>
                  <Divider mt={4} />
                </>
              ))}
            </Flex>
          </DrawerContent>
        </Drawer>
      </>
    );
  }

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
        isPrivate={applicationData?.grant.rubric.isPrivate}
      />
    </>
  );
}

export default ReviewerSidebar;
