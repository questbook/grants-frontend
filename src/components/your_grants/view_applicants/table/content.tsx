import {
  Flex,
  Box,
  Text,
  Image,
  Button,
  Tooltip,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  SimpleGrid,
} from '@chakra-ui/react';
import React, { ReactElement } from 'react';
import CopyIcon from 'src/components/ui/copy_icon';
import {
  GrantApproved, Rejected, PendingReview, ResubmissionRequested, GrantComplete,
} from '../states';
import { TableFilters } from './TableFilters';


const table_headers_flex = [0.231, 0.20, 0.15, 0.16, 0.16, 0.28, 0.116];
const table_headers_flex_reviewer = [0.231, 0.15, 0.184, 0.116, 0.22, 0.116];

function Content({
  filter,
  onViewApplicationFormClick,
  // onAcceptApplicationClick,
  // onRejectApplicationClick,
  onManageApplicationClick,
  data,
  applicantionReviewer,
  isReviewer,
  fundReceived,
}: {
  filter: number;
  onViewApplicationFormClick?: (data?: any) => void;
  // onAcceptApplicationClick?: () => void;
  // onRejectApplicationClick?: () => void;
  onManageApplicationClick?: (data?: any) => void;
  data: any[];
  applicantionReviewer:Array<[]>;
  isReviewer : boolean;
  fundReceived: string;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const open = () => setIsOpen(!isOpen);

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
      { isReviewer ? (
        data
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

              <Flex direction="row" flex={table_headers_flex_reviewer[0]} align="center">
                <Tooltip label={item?.applicant_address}>
                  <Text
                    ml="19px"
                    mr="-19px"
                    variant="tableBody"
                  >
                    {'     '}
                    {`${item.applicant_address.substring(0, 4)}...${item.applicant_address.substring(item.applicant_address.length - 4)}`}
                  </Text>
                </Tooltip>
                <Box mr={8} />
                <CopyIcon text={item?.applicant_address} />
              </Flex>

              <Text
                flex={table_headers_flex_reviewer[1]}
                color="#717A7C"
                variant="tableBody"
              >
                {item.sent_on}
              </Text>
              <Text
                textAlign="left"
                flex={table_headers_flex_reviewer[2]}
                variant="tableBody"
                fontWeight="400"
              >
                {item.project_name}
              </Text>
              <Flex
                flex={table_headers_flex_reviewer[3]}
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
              <Flex justifyContent="center" flex={table_headers_flex_reviewer[4]}>
                {getStatus(item.status)}
              </Flex>
              <Flex
                display="flex"
                flexDirection="column"
                alignItems="center"
                flex={table_headers_flex_reviewer[5]}
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
          ))
      ) : (data
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

            <Flex direction="row" flex={table_headers_flex[0]} align="center">
              <Tooltip label={item?.applicant_address}>
                <Text
                  ml="19px"
                  mr="-19px"
                  variant="tableBody"
                >
                  {'     '}
                  {`${item.applicant_address.substring(0, 4)}...${item.applicant_address.substring(item.applicant_address.length - 4)}`}
                </Text>
              </Tooltip>
              <Box mr={8} />
              <CopyIcon text={item?.applicant_address} />
            </Flex>

            <Text
              flex={table_headers_flex[1]}
              color="#717A7C"
              variant="tableBody"
            >
              {item.project_name}

            </Text>

            <Flex
<<<<<<< HEAD
              flex={tableHeadersflex[3]}
=======
              flex={table_headers_flex[2]}
>>>>>>> 9cea838 (issue fixed)
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
                {fundReceived}
                {' '}
                {' '}
                /
                {item.funding_asked.amount}
                {' '}
                {item.funding_asked.symbol}
              </Text>
            </Flex>

            <Popover
              isOpen={isOpen}
              closeOnBlur
              isLazy
              placement="right"
            >
              <Text
                justifyContent="center"
                color="#717A7C"
                variant="tableBody"
                flex={table_headers_flex[3]}
                textAlign="center"
              >

                <PopoverTrigger>
                  <Text onMouseEnter={open}>{applicantionReviewer.length}</Text>
                </PopoverTrigger>

              </Text>
              <PopoverContent height="150px" width="inherit" right="60px" top="60px">
                <PopoverHeader>Reviewer</PopoverHeader>
                <PopoverBody overflowX="hidden" overflowY="auto">
                  { applicantionReviewer.map((reviewer) => (
                    <SimpleGrid columns={1} spacing={3}>
                      <Text>{reviewer.email}</Text>
                    </SimpleGrid>
                  ))}
                </PopoverBody>
              </PopoverContent>
            </Popover>
            <Flex justifyContent="center" flex={table_headers_flex[4]}>
              {getStatus(item.status)}
            </Flex>
<<<<<<< HEAD

            <Text
              textAlign="left"
              flex={tableHeadersflex[2]}
              variant="tableBody"
              fontWeight="400"
            >
=======
            <Flex justifyContent="center" flex={table_headers_flex[5]}>
>>>>>>> 9cea838 (issue fixed)
              {item.sent_on}
            </Text>

            <Flex
              display="flex"
              flexDirection="column"
              alignItems="center"
<<<<<<< HEAD
              flex={tableHeadersflex[5]}
=======
              flex={table_headers_flex[6]}
>>>>>>> 9cea838 (issue fixed)
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
        )))}
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
