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
  GrantApproved, Rejected, PendingReview, ResubmissionRequested, GrantComplete, AssignedToReview,
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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
  applicantionReviewer:Array<[]>;
  isReviewer : boolean;
  fundReceived: string;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const open = () => setIsOpen(!isOpen);

=======
}) {
  const tableHeadersflex = [0.231, 0.15, 0.184, 0.116, 0.22, 0.116];
>>>>>>> 1f10abc (Revert "Applicant table update")
=======
  applicantionReviewer:[];
  isReviewer : boolean;
  fundReceived: string;
}) {
=======
  applicantionReviewer:[];
  isReviewer : boolean;
  fundReceived: string;
}) {
>>>>>>> master
  const [isOpen, setIsOpen] = React.useState(false);
  const open = () => setIsOpen(!isOpen);
  const tableHeadersFlex = [0.231, 0.20, 0.15, 0.16, 0.16, 0.28, 0.116];
  const tableHeadersFlexReviewer = [0.231, 0.15, 0.184, 0.116, 0.22, 0.116];
<<<<<<< HEAD
>>>>>>> 2991765 (Revert "Revert "Applicant table update"")
=======
>>>>>>> master
  const getStatus = (status: number): ReactElement => {
    if (status === TableFilters.submitted) return <PendingReview />;
    if (status === TableFilters.resubmit) return <ResubmissionRequested />;
    if (status === TableFilters.approved) return <GrantApproved />;
    if (status === TableFilters.rejected) return <Rejected />;
    if (status === TableFilters.assigned) return <AssignedToReview />;

    return <GrantComplete />;
  };
<<<<<<< HEAD
<<<<<<< HEAD

<<<<<<< HEAD

=======
>>>>>>> 1f10abc (Revert "Applicant table update")
=======
>>>>>>> 2991765 (Revert "Revert "Applicant table update"")
=======
>>>>>>> master
  return (
    <Flex
      mt="10px"
      direction="column"
      w="100%"
      border="1px solid #D0D3D3"
      borderRadius={4}
      align="stretch"
    >
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 2991765 (Revert "Revert "Applicant table update"")
=======
>>>>>>> master
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

<<<<<<< HEAD
<<<<<<< HEAD
              <Flex direction="row" flex={table_headers_flex_reviewer[0]} align="center">
=======
              <Flex direction="row" flex={tableHeadersFlexReviewer[0]} align="center">
>>>>>>> 2991765 (Revert "Revert "Applicant table update"")
=======
              <Flex direction="row" flex={tableHeadersFlexReviewer[0]} align="center">
>>>>>>> master
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
<<<<<<< HEAD
<<<<<<< HEAD
                flex={table_headers_flex_reviewer[1]}
=======
                flex={tableHeadersFlexReviewer[1]}
>>>>>>> 2991765 (Revert "Revert "Applicant table update"")
=======
                flex={tableHeadersFlexReviewer[1]}
>>>>>>> master
                color="#717A7C"
                variant="tableBody"
              >
                {item.sent_on}
              </Text>
              <Text
                textAlign="left"
<<<<<<< HEAD
<<<<<<< HEAD
                flex={table_headers_flex_reviewer[2]}
=======
                flex={tableHeadersFlexReviewer[2]}
>>>>>>> 2991765 (Revert "Revert "Applicant table update"")
=======
                flex={tableHeadersFlexReviewer[2]}
>>>>>>> master
                variant="tableBody"
                fontWeight="400"
              >
                {item.project_name}
              </Text>
              <Flex
<<<<<<< HEAD
<<<<<<< HEAD
                flex={table_headers_flex_reviewer[3]}
=======
                flex={tableHeadersFlexReviewer[3]}
>>>>>>> 2991765 (Revert "Revert "Applicant table update"")
=======
                flex={tableHeadersFlexReviewer[3]}
>>>>>>> master
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
<<<<<<< HEAD
<<<<<<< HEAD
              <Flex justifyContent="center" flex={table_headers_flex_reviewer[4]}>
=======
              <Flex justifyContent="center" flex={tableHeadersFlexReviewer[4]}>
>>>>>>> 2991765 (Revert "Revert "Applicant table update"")
=======
              <Flex justifyContent="center" flex={tableHeadersFlexReviewer[4]}>
>>>>>>> master
                {getStatus(item.status)}
              </Flex>
              <Flex
                display="flex"
                flexDirection="column"
                alignItems="center"
<<<<<<< HEAD
<<<<<<< HEAD
                flex={table_headers_flex_reviewer[5]}
=======
                flex={tableHeadersFlexReviewer[5]}
>>>>>>> 2991765 (Revert "Revert "Applicant table update"")
=======
                flex={tableHeadersFlexReviewer[5]}
>>>>>>> master
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
<<<<<<< HEAD
<<<<<<< HEAD
=======
      {data
>>>>>>> 1f10abc (Revert "Applicant table update")
=======
>>>>>>> 2991765 (Revert "Revert "Applicant table update"")
=======
>>>>>>> master
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

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
            <Flex direction="row" flex={table_headers_flex[0]} align="center">
=======
            <Flex direction="row" flex={tableHeadersflex[0]} align="center">
>>>>>>> 1f10abc (Revert "Applicant table update")
=======
            <Flex direction="row" flex={tableHeadersFlex[0]} align="center">
>>>>>>> 2991765 (Revert "Revert "Applicant table update"")
=======
            <Flex direction="row" flex={tableHeadersFlex[0]} align="center">
>>>>>>> master
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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
              flex={table_headers_flex[1]}
=======
              flex={tableHeadersflex[1]}
>>>>>>> 1f10abc (Revert "Applicant table update")
=======
              flex={tableHeadersFlex[1]}
>>>>>>> 2991765 (Revert "Revert "Applicant table update"")
=======
              flex={tableHeadersFlex[1]}
>>>>>>> master
              color="#717A7C"
              variant="tableBody"
            >
              {item.project_name}

            </Text>

            <Flex
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
              flex={table_headers_flex[2]}
=======
              flex={tableHeadersflex[3]}
>>>>>>> 1f10abc (Revert "Applicant table update")
=======
              flex={tableHeadersFlex[2]}
>>>>>>> 2991765 (Revert "Revert "Applicant table update"")
=======
              flex={tableHeadersFlex[2]}
>>>>>>> master
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
                letterSpacing={0.2}
              >
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
                {fundReceived}
                {' '}
                {' '}
                /
=======
>>>>>>> 1f10abc (Revert "Applicant table update")
=======
=======
>>>>>>> master
                {fundReceived}
                {' '}
                /
                {' '}
<<<<<<< HEAD
>>>>>>> 2991765 (Revert "Revert "Applicant table update"")
=======
>>>>>>> master
                {item.funding_asked.amount}
                {' '}
                {item.funding_asked.symbol}
              </Text>
            </Flex>
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 2991765 (Revert "Revert "Applicant table update"")
=======
>>>>>>> master

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
<<<<<<< HEAD
<<<<<<< HEAD
                flex={table_headers_flex[3]}
=======
                flex={tableHeadersFlex[3]}
>>>>>>> 2991765 (Revert "Revert "Applicant table update"")
=======
                flex={tableHeadersFlex[3]}
>>>>>>> master
                textAlign="center"
              >

                <PopoverTrigger>
                  <Text onMouseEnter={open}>{applicantionReviewer.length}</Text>
                </PopoverTrigger>

              </Text>
              <PopoverContent height="150px" width="inherit" right="60px" top="60px">
                <PopoverHeader>Reviewer</PopoverHeader>
                <PopoverBody overflowX="hidden" overflowY="auto">
<<<<<<< HEAD
<<<<<<< HEAD
                  { applicantionReviewer.map((reviewer) => (
=======
                  { applicantionReviewer.map((reviewer:{ email: string }) => (
>>>>>>> 2991765 (Revert "Revert "Applicant table update"")
=======
                  { applicantionReviewer.map((reviewer:{ email: string }) => (
>>>>>>> master
                    <SimpleGrid columns={1} spacing={3}>
                      <Text>{reviewer.email}</Text>
                    </SimpleGrid>
                  ))}
                </PopoverBody>
              </PopoverContent>
            </Popover>
<<<<<<< HEAD
<<<<<<< HEAD
            <Flex justifyContent="center" flex={table_headers_flex[4]}>
              {getStatus(item.status)}
            </Flex>
            <Flex justifyContent="center" flex={table_headers_flex[5]}>
              {item.sent_on}
            </Text>

=======
            <Flex justifyContent="center" flex={tableHeadersflex[4]}>
              {getStatus(item.status)}
            </Flex>
>>>>>>> 1f10abc (Revert "Applicant table update")
=======
            <Flex justifyContent="center" flex={tableHeadersFlex[4]}>
              {getStatus(item.status)}
            </Flex>
            <Flex justifyContent="center" flex={tableHeadersFlex[5]}>
              {item.sent_on}
            </Flex>
>>>>>>> 2991765 (Revert "Revert "Applicant table update"")
=======
            <Flex justifyContent="center" flex={tableHeadersFlex[4]}>
              {getStatus(item.status)}
            </Flex>
            <Flex justifyContent="center" flex={tableHeadersFlex[5]}>
              {item.sent_on}
            </Flex>
>>>>>>> master
            <Flex
              display="flex"
              flexDirection="column"
              alignItems="center"
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
              flex={table_headers_flex[6]}
=======
              flex={tableHeadersflex[5]}
>>>>>>> 1f10abc (Revert "Applicant table update")
=======
              flex={tableHeadersFlex[6]}
>>>>>>> 2991765 (Revert "Revert "Applicant table update"")
=======
              flex={tableHeadersFlex[6]}
>>>>>>> master
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
