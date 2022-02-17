import {
  ModalBody, Flex, Text, Button, Box, Image, useToast,
} from '@chakra-ui/react';
import config from 'src/constants/config';
import { ApiClientsContext } from 'pages/_app';
import React, { useContext, useState } from 'react';
import { ApplicationMilestone } from 'src/graphql/queries';
import ApplicationRegistryAbi from 'src/contracts/abi/ApplicationRegistryAbi.json';
import { getFormattedDateFromUnixTimestampWithYear, getMilestoneMetadata } from 'src/utils/formattingUtils';
import { useContract, useSigner } from 'wagmi';
import MultiLineInput from '../../../ui/forms/multiLineInput';

interface Props {
  milestone: ApplicationMilestone | undefined
  done: () => void
}

function ModalContent({ milestone, done }: Props) {
  const { subgraphClient, validatorApi, workspaceId } = useContext(ApiClientsContext)!;
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
    setIsLoading(true);

    try {
      const { data } = await validatorApi.validateApplicationMilestoneUpdate({ text: details });
      console.log(`uploaded milestone update data to IPFS: ${data.ipfsHash}`);

      const { milestoneIndex, applicationId } = getMilestoneMetadata(milestone)!;
      // contract interaction
      const transaction = await applicationRegContract.approveMilestone(
        applicationId,
        Number(milestoneIndex),
        Number(workspaceId),
        data.ipfsHash,
      );

      const transactionData = await transaction.wait();

      console.log('executed transaction', transactionData);

      await subgraphClient.waitForBlock(transactionData.blockNumber);

      console.log('executed application milestone');

      done();
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
      <Flex direction="column" justify="start" align="stretch">
        <Text textAlign="center" variant="applicationText">
          Add a brief summary of what was achieved in the milestone,
          and add a proof of work.
        </Text>
        <Text mt={8} textAlign="center" variant="applicationText">
          The grantee can see your summary.
        </Text>
        {
          milestone?.state === 'requested' && (
            <>
              <Text
                mt={5}
                variant="applicationText"
                textAlign="center"
                fontWeight="700"
              >
                Grantee marked it as done on
                {' '}
                {getFormattedDateFromUnixTimestampWithYear(milestone!.updatedAtS || 0)}
              </Text>
              <Text
                mt={8}
                variant="applicationText"
                fontWeight="700"
              >
                Milestone Summary by Grantee
              </Text>
              <Text variant="applicationText" mt={4}>{milestone.text || 'N/A'}</Text>
            </>
          )
        }

        <Flex mt={6} w="100%">
          <MultiLineInput
            label="Feedback and Comments"
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
