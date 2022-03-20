import {
  Flex,
  Box,
  Text,
  Image,
  Button,
  Tooltip,
} from '@chakra-ui/react';
import React, { ReactElement } from 'react';
import {
  GrantApproved, Rejected, PendingReview, ResubmissionRequested, GrantComplete,
} from '../states';
import { TableFilters } from './TableFilters';

function Content({
  filter,
  onViewApplicationFormClick,
  // onAcceptApplicationClick,
  // onRejectApplicationClick,
  onManageApplicationClick,
  data,
}: {
  filter: number;
  onViewApplicationFormClick?: (data?: any) => void;
  // onAcceptApplicationClick?: () => void;
  // onRejectApplicationClick?: () => void;
  onManageApplicationClick?: (data?: any) => void;
  data: any[];
}) {
  const tableHeadersflex = [0.231, 0.15, 0.184, 0.116, 0.22, 0.116];
  const getStatus = (status: number): ReactElement => {
    if (status === TableFilters.submitted) return <PendingReview />;
    if (status === TableFilters.resubmit) return <ResubmissionRequested />;
    if (status === TableFilters.approved) return <GrantApproved />;
    if (status === TableFilters.rejected) return <Rejected />;
    return <GrantComplete />;
  };

  return (
    <Flex
      mt="10px"
      direction="column"
      w="100%"
      border="1px solid #D0D3D3"
      borderRadius={4}
      align="stretch"
    >
      {data
        .filter((item) => (filter === -1 ? true : filter === item.status))
        .map((item, index) => (
          <Flex
            direction="row"
            w="100%"
            justify="stretch"
            align="center"
            bg={index % 2 === 0 ? '#F7F9F9' : 'white'}
            px={0}
            py={4}
          >

            <Tooltip label={item?.applicant_address}>
              <Text
                ml="19px"
                mr="-19px"
                flex={tableHeadersflex[0]}
                variant="tableBody"
              >
                {'     '}
                {`${item.applicant_address.substring(0, 13)}...`}
              </Text>
            </Tooltip>
            <Text
              flex={tableHeadersflex[1]}
              color="#717A7C"
              variant="tableBody"
            >
              {item.sent_on}
            </Text>
            <Text
              textAlign="left"
              flex={tableHeadersflex[2]}
              variant="tableBody"
              fontWeight="400"
            >
              {item.applicant_name}
            </Text>
            <Flex
              flex={tableHeadersflex[3]}
              direction="row"
              justifyContent="center"
              alignItems="center"
            >
              <Image h={5} w={5} src={item.funding_asked.icon} />
              <Box mr={3} />
              <Text
                whiteSpace="nowrap"
                color="brand.500"
                fontSize="14px"
                lineHeight="16px"
                fontWeight="700"
                letterSpacing={0.5}
              >
                {item.funding_asked.amount}
                {' '}
                {item.funding_asked.symbol}
              </Text>
            </Flex>
            <Flex justifyContent="center" flex={tableHeadersflex[4]}>
              {getStatus(item.status)}
            </Flex>
            <Flex
              display="flex"
              flexDirection="column"
              alignItems="center"
              flex={tableHeadersflex[5]}
            >
              <Button
                variant="outline"
                color="brand.500"
                fontWeight="500"
                fontSize="14px"
                lineHeight="14px"
                textAlign="center"
                borderRadius={8}
                borderColor="brand.500"
                _focus={{}}
                p={0}
                minW={0}
                w="88px"
                h="32px"
                onClick={() => {
                  //               if (status === 0) return <PendingReview />;
                  // if (status === 1) return <ResubmissionRequested />;
                  // if (status === 2) return <GrantApproved />;
                  // if (status === 3) return <Rejected />;
                  // return <GrantComplete />;
                  // console.log(item.status);
                  if ((item.status === 2 || item.status === 4) && onManageApplicationClick) {
                    onManageApplicationClick({
                      applicationId: item.applicationId,
                    });
                    return;
                  }
                  if (onViewApplicationFormClick) {
                    if (item.status === 3) {
                      onViewApplicationFormClick({
                        rejectionComment: 'rejectionComment',
                        applicationId: item.applicationId,
                      });
                    } else if (item.status === 1) {
                      onViewApplicationFormClick({
                        resubmissionComment: 'resubmissionComment',
                        applicationId: item.applicationId,
                      });
                    } else if (item.status === 0) {
                      onViewApplicationFormClick({ applicationId: item.applicationId });
                    }
                  }
                }}
              >
                View
              </Button>
              {/* <Actions
                status={item.status}
                onViewApplicationFormClick={() => {
                  if (item.status === 0 && onManageApplicationClick) {
                    onManageApplicationClick({
                      applicationId: item.applicationId,
                    });
                    return;
                  }
                  if (onViewApplicationFormClick) {
                    if (item.status === 1) {
                      onViewApplicationFormClick({
                        rejectionComment: 'rejectionComment',
                        applicationId: item.applicationId,
                      });
                    } else if (item.status === 2) {
                      onViewApplicationFormClick({
                        resubmissionComment: 'resubmissionComment',
                        applicationId: item.applicationId,
                      });
                    } else {
                      onViewApplicationFormClick({ applicationId: item.applicationId });
                    }
                  }
                }}
                onAcceptApplicationClick={onAcceptApplicationClick}
                onRejectApplicationClick={onRejectApplicationClick}
              /> */}
            </Flex>
          </Flex>
        ))}
    </Flex>
  );
}

Content.defaultProps = {
  onViewApplicationFormClick: () => {},
  // onAcceptApplicationClick: () => {},
  // onRejectApplicationClick: () => {},
  onManageApplicationClick: () => {},
};
export default Content;
