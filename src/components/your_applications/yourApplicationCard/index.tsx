import {
  Flex,
  Container,
  Box,
  Button,
  Divider,
  Image,
  Text,
  Link,
} from '@chakra-ui/react';
import React from 'react';
import CheckPoint from './checkPoint';

interface Props {
  grantTitle: string;
  daoName: string;
  daoIcon: string;
  isGrantVerified?: boolean;
  isDaoVerified?: boolean;
  status: 'approved' | 'submitted' | 'rejected' | 'resubmit';
  onViewGrantClick?: () => void;
  onViewApplicationClick?: () => void;
  onManageGrantClick?: () => void;
  sentDate?: string;
  reviewDate?: string;
  resultDate?: string;
}

const defaultProps = {
  isGrantVerified: false,
  isDaoVerified: false,
  onViewGrantClick: () => {},
  onViewApplicationClick: () => {},
  onManageGrantClick: () => {},
  sentDate: '',
  reviewDate: '',
  resultDate: '',
};

function YourApplicationCard({
  grantTitle,
  daoName,
  daoIcon,
  isGrantVerified,
  isDaoVerified,
  status,
  onViewGrantClick,
  onViewApplicationClick,
  onManageGrantClick,
  sentDate,
  reviewDate,
  resultDate,
}: Props) {
  return (
    <Flex direction="column">
      <Flex py={6} w="100%" alignItems="flex-start">
        <Image h="54px" w="54px" src={daoIcon} />
        <Flex flex={1} direction="column" ml={6}>
          <Flex direction="row" alignItems="center" flexWrap="wrap">
            <Text lineHeight="24px" fontSize="18px" fontWeight="700">
              {grantTitle}
              {isGrantVerified && (
                <Image
                  display="inline-block"
                  src="/ui_icons/verified.svg"
                  ml="2px"
                  mb="-2px"
                />
              )}
            </Text>
          </Flex>

          <Flex direction="row">
            <Text lineHeight="24px" color="#9045FC" fontWeight="700">
              {daoName}
              {isDaoVerified && (
                <Image
                  display="inline-block"
                  src="/ui_icons/verified.svg"
                  ml="2px"
                  mb="-2px"
                />
              )}
            </Text>
          </Flex>

          <Container
            py={6}
            px={0}
            borderRadius={6}
            display="flex"
            mt="14px"
            alignItems="center"
          >
            <Flex direction="column" alignItems="center" position="relative">
              <CheckPoint date={sentDate} state="sent" />
            </Flex>

            <Box h={1} bg="#A0A7A7" flex={1} />

            <Flex direction="column" alignItems="center" position="relative">
              <CheckPoint date={reviewDate} state="under_review" />
            </Flex>

            <Box
              h={1}
              bg={status === 'submitted' ? '#E8E9E9' : '#A0A7A7'}
              flex={1}
            />

            <Flex direction="column" alignItems="center" position="relative">
              <CheckPoint date={resultDate} state={status} />
            </Flex>
          </Container>
        </Flex>
      </Flex>

      <Flex direction="row" mt={2} alignItems="center">
        <Box mr="auto" />
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <Link onClick={() => (onViewGrantClick ? onViewGrantClick() : null)} fontWeight="700">
          View Grant
          <Image
            ml={2}
            display="inline-block"
            src="/ui_icons/link.svg"
            alt="pro tip"
            h="10px"
            w="10px"
          />
        </Link>
        {status === 'approved' ? (
          <Button
            onClick={() => (onManageGrantClick ? onManageGrantClick() : () => {})}
            ml="30px"
            variant="primaryCta"
          >
            Manage Grant
          </Button>
        ) : (
          <Button
            onClick={() => (onViewApplicationClick ? onViewApplicationClick() : null)}
            ml="30px"
            variant="primaryCta"
          >
            View Application
          </Button>
        )}
      </Flex>

      <Divider mt={6} mb={3} />
    </Flex>
  );
}

YourApplicationCard.defaultProps = defaultProps;
export default YourApplicationCard;
