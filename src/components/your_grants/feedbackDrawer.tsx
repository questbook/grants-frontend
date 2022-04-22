import {
  Box, Divider, Drawer, DrawerContent, DrawerOverlay, Flex, Text, Button,
} from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { SupportedChainId } from 'src/constants/chains';
// import useSetFeedbacks from 'src/hooks/useSetFeedbacks';
import StarRatings from 'react-star-ratings';
import useSubmitReview from 'src/hooks/useSubmitReview';
import MultiLineInput from '../ui/forms/multiLineInput';
import Loader from '../ui/loader';
import Badge from '../ui/badge';

function FeedbackDrawer({
  feedbackDrawerOpen,
  setFeedbackDrawerOpen,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  feedbacks,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setFeedbacks,
  feedbackEditAllowed,
  rubrics,
  grantAddress,
  chainId,
  workspaceId,
  applicationId,
  isPrivate,
}: {
  feedbackDrawerOpen: boolean;
  setFeedbackDrawerOpen: (feedbackDrawerOpen: boolean) => void;
  feedbacks: any[];
  setFeedbacks: (feedbacks: any[]) => void;
  feedbackEditAllowed: boolean;
  grantAddress: string;
  chainId: SupportedChainId | undefined;
  workspaceId: string;
  rubrics: any[];
  applicationId: string;
  isPrivate: boolean;
}) {
  const [editedFeedbackData, setEditedFeedbackData] = React.useState<any>();
  const [feedbackData, setFeedbackData] = React.useState<any[]>();
  const [isApproved, setIsApproved] = React.useState<boolean>(false);
  useEffect(() => {
    const newFeedbackData = [] as any[];
    if (rubrics?.length > 0) {
      rubrics.forEach((rubric) => {
        newFeedbackData.push({
          rating: 0,
          comment: '',
          rubric,
        });
      });
    }
    setFeedbackData(newFeedbackData);
  }, [rubrics]);
  const handleOnSubmit = () => {
    console.log(feedbackData);

    let error = false;
    feedbackData?.forEach((feedback) => {
      if (feedback.rating === 0 && feedback.comment === '') {
        error = true;
      }
    });
    if (error) return;
    setEditedFeedbackData({ isApproved, items: feedbackData });
  };

  const [
    data,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transactionLink,
    loading,
  ] = useSubmitReview(
    editedFeedbackData,
    isPrivate,
    chainId,
    workspaceId,
    grantAddress,
    applicationId,
  );

  useEffect(() => {
    if (data) {
      setFeedbackDrawerOpen(false);
    }
  }, [data, setFeedbackDrawerOpen]);

  return (
    <Drawer
      isOpen={feedbackDrawerOpen}
      placement="right"
      onClose={() => setFeedbackDrawerOpen(false)}
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
              isActive={isApproved}
              label="YES"
              onClick={() => setIsApproved(true)}
            />

            <Box ml={4} />

            <Badge
              isActive={!isApproved}
              label="NO"
              onClick={() => setIsApproved(false)}
            />
          </Flex>
          {feedbackData?.map((feedback, index) => (
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
                  changeRating={(r) => {
                    console.log(r);
                    const newFeedbackData = [...feedbackData];
                    newFeedbackData[index].rating = r;
                    setFeedbackData(newFeedbackData);
                  }}
                  rating={feedback.rating}
                  name="rating"
                  starHoverColor="#88BDEE"
                  starDimension="18px"
                />

                <MultiLineInput
                  value={feedback.comment}
                  onChange={(e) => {
                    const newFeedbackData = [...feedbackData];
                    newFeedbackData[index].comment = e.target.value;
                    setFeedbackData(newFeedbackData);
                  }}
                  placeholder="Feedback"
                  isError={false}
                  errorText="Required"
                  disabled={!feedbackEditAllowed}
                />
              </Flex>
              <Divider mt={4} />
            </>
          ))}

          <Box mt={12}>
            <Button mt="auto" variant="primary" onClick={handleOnSubmit}>
              {!loading ? 'Save' : (
                <Loader />
              )}
            </Button>
          </Box>
        </Flex>
      </DrawerContent>
    </Drawer>
  );
}

export default FeedbackDrawer;
