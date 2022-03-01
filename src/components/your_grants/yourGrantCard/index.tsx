import React from 'react';
import {
  Image, Text, Button, Flex, Box, Divider,
} from '@chakra-ui/react';
import Badge from './badge';
import ShareMenu from '../../ui/grantShareMenu';

interface YourGrantCardProps {
  grantID: string;
  daoIcon: string;
  grantTitle: string;
  grantDesc: string;
  numOfApplicants: number;
  endTimestamp: number;
  grantAmount: string;
  grantCurrency: string;
  grantCurrencyIcon: string;
  state: 'processing' | 'done';
  onEditClick?: () => void;
  onViewApplicantsClick?: () => void;
  onAddFundsClick?: () => void;
}

function YourGrantCard({
  grantID,
  daoIcon,
  grantTitle,
  grantDesc,
  numOfApplicants,
  endTimestamp,
  grantAmount,
  grantCurrency,
  grantCurrencyIcon,
  state,
  onEditClick,
  onViewApplicantsClick,
  onAddFundsClick,
}: YourGrantCardProps) {
  return (
    <>
      <Flex py={6} w="100%">
        <Image objectFit="cover" h="54px" w="54px" src={daoIcon} />
        <Flex flex={1} direction="column" ml={6}>
          <Text lineHeight="24px" fontSize="18px" fontWeight="700">
            {grantTitle}
          </Text>
          <Text lineHeight="24px" color="#122224" fontWeight="400">
            {grantDesc}
          </Text>
          <Box mt={6} />

          <Badge
            numOfApplicants={numOfApplicants}
            endTimestamp={endTimestamp}
          />

          <Flex
            direction={{ base: 'column', md: 'row' }}
            mt={8}
            alignItems="center"
          >
            <Flex direction="row" align="center" w="full">
              <Image src={grantCurrencyIcon} />
              <Text ml={2} fontWeight="700" color="#3F06A0">
                {grantAmount}
                {' '}
                {grantCurrency}
              </Text>

              <Box mr="auto" />

              {/* eslint-disable-next-line no-nested-ternary */}
              {state === 'processing' ? (
                <Text
                  color="#717A7C"
                  fontSize="14px"
                  lineHeight="20px"
                  fontWeight="400"
                  display="flex"
                  alignItems="center"
                  mr={2}
                >
                  <Image
                    src="/ui_icons/hourglass.svg"
                    display="inline-block"
                    mr="4px"
                  />
                  Processing...
                  <Button
                    variant="link"
                    colorScheme="brand"
                    fontSize="14px"
                    lineHeight="20px"
                    fontWeight="700"
                    display="inline-block"
                    ml="6px"
                  >
                    Learn More
                    {'  '}
                    <Image
                      ml={1}
                      src="/ui_icons/link.svg"
                      display="inline-block"
                    />
                  </Button>
                </Text>
              ) : (
                <ShareMenu grantID={grantID} />
              )}
              <Button
                mr={2}
                ml={5}
                isDisabled={state === 'processing'}
                variant={state === 'processing' ? 'primaryCta' : 'outline'}
                color="brand.500"
                borderColor="brand.500"
                h="32px"
                onClick={onAddFundsClick ?? (() => {})}
              >
                Add funds
              </Button>
              <Button
                ml={2}
                isDisabled={state === 'processing'}
                variant="primaryCta"
                onClick={() => {
                  if (numOfApplicants <= 0 && onEditClick) {
                    onEditClick();
                  } else if (onViewApplicantsClick) {
                    onViewApplicantsClick();
                  }
                }}
              >
                {numOfApplicants > 0 ? 'View Applicants' : 'Edit Grant'}
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
      <Divider w="auto" />
    </>
  );
}

YourGrantCard.defaultProps = {
  onEditClick: () => {},
  onViewApplicantsClick: () => {},
  onAddFundsClick: () => {},
};
export default YourGrantCard;
