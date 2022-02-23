import {
  ModalBody, Flex, Text, Button, Box, Image, useToast, Center, CircularProgress, ToastId,
} from '@chakra-ui/react';
import config from 'src/constants/config';
import { ApiClientsContext } from 'pages/_app';
import React, { useContext, useState } from 'react';
import ApplicationRegistryAbi from 'src/contracts/abi/ApplicationRegistryAbi.json';
import { getFormattedDateFromUnixTimestampWithYear, getMilestoneMetadata } from 'src/utils/formattingUtils';
import { useContract, useSigner } from 'wagmi';
import InfoToast from 'src/components/ui/infoToast';
import { ApplicationMilestone } from 'src/types';
import MultiLineInput from '../../../ui/forms/multiLineInput';

interface Props {
  milestone: ApplicationMilestone | undefined
  done: () => void
}

function ModalContent({ milestone, done }: Props) {
  const { validatorApi, workspaceId } = useContext(ApiClientsContext)!;
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
    setHasClicked(true);

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

      // await subgraphClient.waitForBlock(transactionData.blockNumber);

      // console.log('executed application milestone');

      done();
      showToast({ link: `https://etherscan.io/tx/${transactionData.transactionHash}` });
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
      setHasClicked(false);
    }
  };

  return (
    <ModalBody maxW="521px">
      <Flex direction="column" justify="start" align="center">
        <Image src="/ui_icons/milestone_complete.svg" mt={6} />
        <Text textAlign="center" variant="applicationText" mt={6}>
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
            <CircularProgress isIndeterminate color="brand.500" size="48px" mt={4} />
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
