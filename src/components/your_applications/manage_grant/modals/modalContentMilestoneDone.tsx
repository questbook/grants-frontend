import {
  ModalBody, Flex, Text, Button, Box, Image, useToast, ToastId, Center, CircularProgress,
} from '@chakra-ui/react';
import React, { useContext, useState } from 'react';
import { useContract, useSigner } from 'wagmi';
import InfoToast from 'src/components/ui/infoToast';
import { ApiClientsContext } from '../../../../../pages/_app';
import config from '../../../../constants/config';
import { ApplicationMilestone } from '../../../../graphql/queries';
import { getMilestoneMetadata } from '../../../../utils/formattingUtils';
import ApplicationRegistryAbi from '../../../../contracts/abi/ApplicationRegistryAbi.json';
import MultiLineInput from '../../../ui/forms/multiLineInput';

interface Props {
  milestone: ApplicationMilestone | undefined
  onClose: () => void;
}

function ModalContent({ milestone, onClose }: Props) {
  const { validatorApi } = useContext(ApiClientsContext)!;
  const [signerStates] = useSigner();
  const applicationRegContract = useContract({
    addressOrName: config.ApplicationRegistryAddress,
    contractInterface: ApplicationRegistryAbi,
    signerOrProvider: signerStates.data,
  });

  const [details, setDetails] = useState('');
  const [detailsError, setDetailsError] = useState(false);

  const [hasClicked, setHasClicked] = React.useState(false);
  const toastRef = React.useRef<ToastId>();
  const toast = useToast();

  const closeToast = () => {
    if (toastRef.current) {
      toast.close(toastRef.current);
    }
  };

  const showToast = ({ link } : { link: string }) => {
    toastRef.current = toast({
      position: 'top',
      render: () => (
        <InfoToast
          link={link}
          close={closeToast}
        />
      ),
    });
  };

  const markAsDone = async () => {
    if (!details) {
      setDetailsError(true);
      return;
    }

    setHasClicked(true);

    try {
      const { data } = await validatorApi.validateApplicationMilestoneUpdate({ text: details });
      const { milestoneIndex, applicationId } = getMilestoneMetadata(milestone)!;
      // contract interaction
      const transaction = await applicationRegContract.requestMilestoneApproval(
        applicationId,
        Number(milestoneIndex),
        data.ipfsHash,
      );

      const transactionData = await transaction.wait();
      setHasClicked(false);
      onClose();

      showToast({ link: `https://etherscan.io/tx/${transactionData.transactionHash}` });
      // await subgraphClient.waitForBlock(transactionData.blockNumber);
    } catch (error: any) {
      // console.error('error in milestone update ', error);
      toast({
        title: error.name,
        description: error.message,
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    } finally {
      setHasClicked(false);
    }
  };

  return (
    <ModalBody maxW="521px">
      <Flex direction="column" justify="start" align="center">
        <Image src="/ui_icons/milestone_complete.svg" mt={6} />
        <Text textAlign="center" variant="applicationText" mt={6}>
          Add a brief summary of what was achieved in the milestone,
          timelines and links to show your proof of work.
        </Text>
        <Text mt={8} textAlign="center" variant="applicationText">
          The grantor can see your summary.
        </Text>
        <Flex mt={6} w="100%">
          <MultiLineInput
            label="Milestone Summary"
            placeholder="Write the milestone summary as detailed as possible."
            value={details}
            isError={detailsError}
            onChange={(e) => {
              if (detailsError) {
                setDetailsError(false);
              }
              setDetails(e.target.value);
            }}
            errorText="Required"
            maxLength={300}
          />
        </Flex>
        <Flex direction="row" w="100%" align="start" mt={2}>
          <Image mt={1} src="/ui_icons/info.svg" />
          <Box mr={2} />
          <Text variant="footer">
            By pressing Mark as done you’ll have to approve this transaction in
            your wallet.
            {' '}
            <Button
              variant="link"
              color="brand.500"
              rightIcon={
                <Image ml={1} src="/ui_icons/link.svg" display="inline-block" />
              }
            >
              <Text variant="footer" color="brand.500">
                Learn More
              </Text>
            </Button>
          </Text>
        </Flex>
        {hasClicked ? (
          <Center>
            <CircularProgress isIndeterminate color="brand.500" size="48px" mt={10} />
          </Center>
        ) : (
          <Button w="100%" variant="primary" mt={8} onClick={markAsDone}>
            Mark as Done
          </Button>
        )}
        <Box mb={4} />
      </Flex>
    </ModalBody>
  );
}

export default ModalContent;
