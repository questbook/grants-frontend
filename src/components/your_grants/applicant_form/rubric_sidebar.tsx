import {
  Flex, Text, Link, Image, Box,
} from '@chakra-ui/react';
import React, { useEffect } from 'react';
import StarRatings from 'react-star-ratings';
import Loader from 'src/components/ui/loader';
import useEncryption from 'src/hooks/utils/useEncryption';
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
    setDetailedReviews(publicData);

    const results = [] as any;
    rubric.items.forEach((item: any) => {
      results[item.id] = {
        title: item.title,
        maximumPoints: item.maximumPoints,
        rating: 0,
      };
    });

    let forCount = 0;
    publicData.forEach((review: any) => {
      if (review.isApproved) {
        forCount += 1;
      }
      review.items.forEach((item: any) => {
        results[item.rubric.id].rating += item.rating;
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
      };
    });

    let forCount = 0;
    privateDecryptedData.forEach((review: any) => {
      if (review.isApproved) {
        forCount += 1;
      }
      review.items.forEach((item: any) => {
        results[item.rubric.id].rating += item.rating;
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

  if (rubric.isPrivate && !isDecrypted) {
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
                rating={r.rating}
                starRatedColor="#88BDEE"
                starDimension="16px"
                starSpacing="2px"
                numberOfStars={r.maximumPoints}
              />
            </Flex>
          ))}
      </Flex>

      {aggregatedResults && Object.values(aggregatedResults).length > 0 ? (
        <Link mt={5} href="/" fontSize="14px" lineHeight="24px" fontWeight="500">
          See detailed feedback
        </Link>
      ) : null}
    </Flex>
  );
}

export default RubricSidebar;
