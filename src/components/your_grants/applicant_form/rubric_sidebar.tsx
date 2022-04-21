import {
  Flex, Text, Link, Image, Box, Drawer, DrawerOverlay, DrawerContent, Button, Divider,
} from '@chakra-ui/react';
import React, { useEffect } from 'react';
import StarRatings from 'react-star-ratings';
import Badge from 'src/components/ui/badge';
import MultiLineInput from 'src/components/ui/forms/multiLineInput';
import Loader from 'src/components/ui/loader';
import useEncryption from 'src/hooks/utils/useEncryption';
import { truncateStringFromMiddle } from 'src/utils/formattingUtils';
import { getFromIPFS } from 'src/utils/ipfsUtils';
import { useAccount } from 'wagmi';

interface RubricSidebarProps {
  total: number;
  rubric: any;
  reviews: any[]
}

function RubricSidebar({
  total,
  rubric,
  reviews,
}: RubricSidebarProps) {
  const { decryptMessage } = useEncryption();
  const [loading, setLoading] = React.useState(false);
  const [detailedReviews, setDetailedReviews] = React.useState<any[]>([]);
  const [aggregatedResults, setAggregatedResults] = React.useState<any>();
  const [isDecrypted, setIsDecrypted] = React.useState(false);
  const [detailDrawerOpen, setDetailDrawerOpen] = React.useState(false);
  const [reviewerDrawerOpen, setReviewerDrawerOpen] = React.useState(false);
  const [reviewSelected, setReviewSelected] = React.useState<any>();

  const [forPercentage, setForPercentage] = React.useState<number>(0);
  const [againstPercentage, setAgainstPercentage] = React.useState<number>(0);

  const [{ data: accountData }] = useAccount();

  const decodeReviews = async () => {
    setLoading(true);
    const publicDataPromises = reviews?.map(async (review) => {
      const reviewData = getFromIPFS(review.publicReviewDataHash);
      return reviewData;
    });
    if (!publicDataPromises) return;
    const publicData = (await Promise.all(publicDataPromises)).map((data) => JSON.parse(data));
    console.log(publicData);
    setDetailedReviews(publicData);

    const results = [] as any;
    rubric.items.forEach((item: any) => {
      results[item.id] = {
        title: item.title,
        maximumPoints: item.maximumPoints,
        rating: 0,
        total: 0,
      };
    });

    let forCount = 0;
    publicData.forEach((review: any) => {
      if (review.isApproved) {
        forCount += 1;
      }
      review.items.forEach((item: any) => {
        results[item.rubric.id].rating += item.rating;
        results[item.rubric.id].total += 1;
      });
    });

    // eslint-disable-next-line @typescript-eslint/no-shadow
    const forPercentage = Math.ceil((forCount / publicData.length) * 100);
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const againstPercentage = 100 - forPercentage;

    if (publicData.length > 0) {
      setForPercentage(forPercentage);
      setAgainstPercentage(againstPercentage);
    }

    console.log(results);
    setAggregatedResults(results);
    setLoading(false);
  };

  const getEncrpytedData = async () => {
    console.log(reviews);
    const privateDataPromises = reviews?.map((review) => {
      const decryptableData = review.data.filter((data: any) => data.id.split('.')[1].toLowerCase() === accountData?.address.toLowerCase());
      return decryptableData.length > 0 ? decryptableData[0] : undefined;
    }).flat().filter((review) => review !== undefined).map(async (review) => {
      const reviewData = getFromIPFS(review.data);
      return reviewData;
    });
    if (!privateDataPromises) return;

    console.log(privateDataPromises);
    // const privateData = await Promise.all((await Promise.all(privateDataPromises))
    //   .map(async (data) => JSON.parse(await decryptMessage(data) ?? '{}')));

    const privateData = await Promise.all(privateDataPromises);
    console.log(privateData);
    const privateDecryptedData = await Promise.all(privateData.map(async (data) => JSON.parse(await decryptMessage(data) ?? '{}')));

    console.log(privateDecryptedData);
    setDetailedReviews(privateDecryptedData);
    const results = [] as any;
    rubric.items.forEach((item: any) => {
      results[item.id] = {
        title: item.title,
        maximumPoints: item.maximumPoints,
        rating: 0,
        total: 0,
      };
    });

    let forCount = 0;
    privateDecryptedData.forEach((review: any) => {
      if (review.isApproved) {
        forCount += 1;
      }
      review.items.forEach((item: any) => {
        results[item.rubric.id].rating += item.rating;
        results[item.rubric.id].total += 1;
      });
    });

    // eslint-disable-next-line @typescript-eslint/no-shadow
    const forPercentage = Math.ceil((forCount / privateDecryptedData.length) * 100);
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const againstPercentage = 100 - forPercentage;

    if (privateDecryptedData.length > 0) {
      setForPercentage(forPercentage);
      setAgainstPercentage(againstPercentage);
    }

    console.log(results);
    setAggregatedResults(results);
    setLoading(false);
    setIsDecrypted(true);
  };

  useEffect(() => {
    if (!rubric) return;
    if (!rubric.isPrivate) {
      decodeReviews();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reviews, rubric]);

  const motion = [
    {
      label: 'Against',
      percentage: againstPercentage,
      icon: '/ui_icons/like_down.svg',
      color: '#EE7979',
    },
    {
      label: 'For',
      percentage: forPercentage,
      icon: '/ui_icons/like_up.svg',
      color: '#39C696',
    },
  ];

  if (loading) {
    return (
      <Flex
        bg="white"
        border="2px solid #D0D3D3"
        borderRadius={8}
        w={340}
        direction="column"
        alignItems="stretch"
        px="28px"
        py="22px"
      >
        <Flex direction="row" justify="space-between">
          <Text variant="tableHeader" color="#122224">
            Application Review
          </Text>
        </Flex>

        <Loader />
      </Flex>
    );
  }

  if (rubric?.isPrivate && !isDecrypted) {
    return (
      <Flex
        bg="white"
        border="2px solid #D0D3D3"
        borderRadius={8}
        w={340}
        direction="column"
        alignItems="stretch"
        px="28px"
        py="22px"
      >
        <Flex direction="row" justify="space-between">
          <Text variant="tableHeader" color="#122224">
            Application Review
          </Text>
        </Flex>

        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <Link onClick={() => getEncrpytedData()} mt={5} fontSize="14px" lineHeight="24px" fontWeight="500">
          Decrypt reviews to see the results
        </Link>
      </Flex>
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
      >
        <Flex direction="row" justify="space-between">
          <Text variant="tableHeader" color="#122224">
            Application Review
          </Text>
        </Flex>
        <Text mt={3} variant="applicationText">
          {total - detailedReviews.length}
          {' '}
          waiting
        </Text>

        <Box mt={2} />

        {
        forPercentage === 0 && againstPercentage === 0 ? null : (
          <Flex direction="column" mt={8}>

            {motion.map((motionItem, index) => (
              <Flex
                w="100%"
                justify="space-between"
                position="relative"
                align="center"
                mt={index === 0 ? 0 : '44px'}
              >
                <Flex
                  w={`${motionItem.percentage}%`}
                  bg={motionItem.color}
                  borderRadius="4px"
                  h="32px"
                  position="absolute"
                  left={0}
                />

                <Flex direction="row" align="center" pos="absolute">
                  <Image w="12px" h="12px" src={motionItem.icon} mx={3} />
                  <Text
                    fontSize="14px"
                    lineHeight="24px"
                    fontWeight="500"
                    color="#FFFFFF"
                  >
                    {motionItem.label}
                  </Text>
                </Flex>
                <Text
                  position="absolute"
                  right={0}
                  fontSize="18px"
                  lineHeight="24px"
                  fontWeight="700"
                  color="#414E50"
                >
                  {motionItem.percentage}
                  %
                </Text>
              </Flex>
            ))}
          </Flex>
        )
      }

        {aggregatedResults && Object.values(aggregatedResults).length > 0 ? (
          <Text mt={14} variant="tableHeader" color="#122224">
            Evaluation Rubric
          </Text>
        ) : null}
        <Flex direction="column" mt={4}>
          {aggregatedResults && Object.values(aggregatedResults)
            .map((r: any, i: number) => (
              <Flex direction="row" mt={i === 0 ? 0 : 5} alignItems="center">
                <Text
                  fontSize="16px"
                  lineHeight="16px"
                  fontWeight="400"
                  color="#122224"
                >
                  {r.title}
                </Text>
                <Box mx="auto" />
                <StarRatings
                  rating={r.total === 0 ? 0 : r.rating / r.total}
                  starRatedColor="#88BDEE"
                  starDimension="16px"
                  starSpacing="2px"
                  numberOfStars={r.maximumPoints}
                />
              </Flex>
            ))}
        </Flex>

        {aggregatedResults && Object.values(aggregatedResults).length > 0 ? (
          // eslint-disable-next-line jsx-a11y/anchor-is-valid
          <Link mt={5} onClick={() => setDetailDrawerOpen(true)} fontSize="14px" lineHeight="24px" fontWeight="500">
            See detailed feedback
          </Link>
        ) : null}
      </Flex>

      <Drawer
        isOpen={detailDrawerOpen}
        placement="right"
        onClose={() => setDetailDrawerOpen(false)}
        size="md"
      >
        <DrawerOverlay />
        <DrawerContent>
          <Flex direction="column" p={8} h="100%" overflow="scroll">
            {reviews?.map((review: any, i: number) => (
              <Button
                onClick={() => {
                  setReviewerDrawerOpen(true);
                  console.log(detailedReviews[i]);
                  setReviewSelected(detailedReviews[i]);
                }}
                mb={4}
                p={8}
              >
                <Flex
                  w="100%"
                  h="64px"
                  align="center"
                  mt={2}
                  py={3}
                >
                  <Image src="/ui_icons/reviewer_account.svg" />
                  <Flex direction="column" ml={4}>
                    <Text
                      fontWeight="700"
                      color="#122224"
                      fontSize="14px"
                      lineHeight="20px"
                    >
                      {truncateStringFromMiddle(review.reviewer.id.split('.')[1])}
                    </Text>
                  </Flex>
                </Flex>
              </Button>
            ))}
          </Flex>
        </DrawerContent>
      </Drawer>

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

export default RubricSidebar;
