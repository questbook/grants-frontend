import {
  ModalBody, Flex, Text, Button, Box, Image, useToast,
} from '@chakra-ui/react';
import { ApiClientsContext } from 'pages/_app';
import React, { useContext, useState } from 'react';
import config from 'src/constants/config';
import { ApplicationMilestone } from 'src/graphql/queries';
import { getMilestoneMetadata } from 'src/utils/formattingUtils';
import ApplicationRegistryAbi from 'src/contracts/abi/ApplicationRegistryAbi.json';
import { useContract, useSigner } from 'wagmi';
import MultiLineInput from '../../../ui/forms/multiLineInput';

interface Props {
  milestone: ApplicationMilestone | undefined
  onClose: () => void;
}

function ModalContent({ milestone, onClose }: Props) {
  const { subgraphClient, validatorApi } = useContext(ApiClientsContext)!;
  const [signerStates] = useSigner();
  const applicationRegContract = useContract({
    addressOrName: config.ApplicationRegistryAddress,
    contractInterface: ApplicationRegistryAbi,
    signerOrProvider: signerStates.data,
  });
  const toast = useToast();

  const [details, setDetails] = useState('');
  const [detailsError, setDetailsError] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const markAsDone = async () => {
    if (!details) {
      setDetailsError(true);
      return;
    }

    setIsLoading(true);

    try {
      const { data } = await validatorApi.validateApplicationMilestoneUpdate({ text: details });
      console.log(`uploaded milestone update data to IPFS: ${data.ipfsHash}`);

      const { milestoneIndex, applicationId } = getMilestoneMetadata(milestone)!;
      // contract interaction
      const transaction = await applicationRegContract.requestMilestoneApproval(
        applicationId,
        Number(milestoneIndex),
        data.ipfsHash,
      );

      const transactionData = await transaction.wait();

      console.log('executed transaction', transactionData);

      await subgraphClient.waitForBlock(transactionData.blockNumber);

      console.log('executed application milestone');

      onClose();
    } catch (error: any) {
      console.error('error in milestone update ', error);
      toast({
        title: error.name,
        description: error.message,
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ModalBody maxW="521px">
      <Flex direction="column" justify="start" align="center">
        <Text textAlign="center" variant="applicationText">
          Add a brief summary of what was achieved in the milestone, timelines
          and links to show your proof of work.
        </Text>
        <Text mt={8} textAlign="center" variant="applicationText">
          The grant reviewer can see your summary.
        </Text>
        <Flex mt={6} w="100%">
          <MultiLineInput
            label="Milestone Details"
            placeholder="A tool, script or tutorial to set up monitoring for miner GPU, CPU, & memory."
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
        <Button w="100%" variant="primary" mt={8} onClick={markAsDone} disabled={isLoading}>
          {
            isLoading
              ? 'Updating...'
              : 'Mark as Done'
          }
        </Button>
        <Box mb={4} />
      </Flex>
    </ModalBody>
  );
}

export default ModalContent;
