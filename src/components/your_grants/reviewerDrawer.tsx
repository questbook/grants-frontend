import {
  Box, Divider, Drawer, DrawerContent, DrawerOverlay, Flex, Text, Image, Button, Switch, Link,
} from '@chakra-ui/react';
import { ApiClientsContext } from 'pages/_app';
import React, { useContext, useEffect } from 'react';
import { SupportedChainId } from 'src/constants/chains';
import useAssignReviewers from 'src/hooks/useAssignReviewers';
import Badge from '../ui/badge';
// import useSetReviews from 'src/hooks/useSetReviews';
import Dropdown from '../ui/forms/dropdown';
import MultiLineInput from '../ui/forms/multiLineInput';
import SingleLineInput from '../ui/forms/singleLineInput';
import Loader from '../ui/loader';

function ReviewDrawer({
  reviewDrawerOpen,
  setReviewDrawerOpen,
  initialReviewers,
  grantAddress,
  chainId,
  workspaceId,
  applicationId,
}: {
  reviewDrawerOpen: boolean;
  setReviewDrawerOpen: (reviewDrawerOpen: boolean) => void;
  grantAddress: string;
  chainId: SupportedChainId | undefined;
  workspaceId: string;
  initialReviewers: any[];
  applicationId: string;
}) {
  const { workspace } = useContext(ApiClientsContext)!;
  const [isReviewer, setIsReviewer] = React.useState<any[]>([]);
  const [editedReviewData, setEditedReviewData] = React.useState<any>();

  useEffect(() => {
    if (!workspace) return;
    if (!initialReviewers) return;
    const newIsReviewer = [] as any[];
    workspace.members.forEach((member: any) => {
      newIsReviewer.push(
        initialReviewers.find((r: any) => r.address === member.address) !== undefined,
      );
    });
    setIsReviewer(newIsReviewer);
  }, [initialReviewers, workspace]);

  const handleOnSubmit = () => {
    setEditedReviewData({
      reviewers: workspace?.members.map((reviewer) => reviewer.id.split('.')[1]),
      active: isReviewer,
    });
  };

  const [
    data,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transactionLink,
    loading,
  ] = useAssignReviewers(editedReviewData, chainId, workspaceId, grantAddress, applicationId);
  // ] = useSetReviews(editedReviewData, chainId, workspaceId, grantAddress);

  useEffect(() => {
    if (data) {
      setReviewDrawerOpen(false);
    }
  }, [data, setReviewDrawerOpen]);

  return (
    <Drawer
      isOpen={reviewDrawerOpen}
      placement="right"
      onClose={() => setReviewDrawerOpen(false)}
      size="lg"
    >
      <DrawerOverlay />
      <DrawerContent>

        <Flex direction="column" overflow="scroll" p={8}>
          {workspace?.members.map((member, index) => (
            <Button
              isActive={isReviewer[index]}
              onClick={() => {
                const newIsReviewer = [...isReviewer];
                newIsReviewer[index] = !isReviewer[index];
                setIsReviewer(newIsReviewer);
              }}
            >
              <Box>
                <Text mt={2} fontWeight="700" color="#122224" fontSize="14px">{member.id}</Text>
                <Text color="#717A7C" fontSize="12px">{member?.email}</Text>
              </Box>
              <Box />
            </Button>
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

export default ReviewDrawer;
