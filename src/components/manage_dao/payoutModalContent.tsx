import {
  ModalBody,
  Flex,
  Text,
  Button,
  Image,
  Heading,
  Input,
  useClipboard,
  useToast,
} from '@chakra-ui/react';
import React from 'react';
import Loader from 'src/components/ui/loader';
import SingleLineInput from '../ui/forms/singleLineInput';
import InfoToast from '../ui/infoToast';

interface Props {
  payMode: number;
  address: string;
  reviews: number;
  onClose: () => void;
}

function PayoutModalContent({ payMode, address, reviews, onClose }: Props) {
  const toast = useToast();

  const { hasCopied, onCopy } = useClipboard(address);

  const startToast = async () => {
    toast({
      title: 'Copied!',
      status: 'success',
      duration: 9000,
      isClosable: true,
    });
  };

  return (
    <ModalBody>
      {payMode === 0 && (
        <Flex direction="column">
          <Flex w="100%" mt={7}>
            <SingleLineInput
              label="Address"
              height="80px"
              inputRightElement={
                <Button
                  variant="primary"
                  w="89px"
                  h="48px"
                  mr={20}
                  onClick={() => {
                    startToast();
                    onCopy();
                  }}
                >
                  Copy
                </Button>
              }
              value={`${address.substring(0, 12)}....${address.substring(
                address.length - 13,
                address.length
              )}`}
              disabled
              onChange={() => {}}
              isError={false}
              subtextAlign="center"
              tooltip="This is the address of the reviewer that will receive the funds."
            />
          </Flex>
          <Heading
            variant="applicationHeading"
            textAlign="center"
            color="#717A7C"
            mt={4}
          >
            Reviews
          </Heading>
          <Input></Input>
          <Heading
            variant="applicationHeading"
            textAlign="center"
            color="#717A7C"
            mt={4}
          >
            Amount per Review
          </Heading>
          <Input></Input>

          <Text fontSize="0.75rem">
            By pressing Make Payment you will have to approve the transaction in
            your wallet
          </Text>
          <Button variant="primary" my={8} onClick={() => onClose()}>
            Make Payment
          </Button>
        </Flex>
      )}

      {/*payMode === 1 && (
      <Flex direction="column">
        <Heading variant="page">Deposit funds from your wallet</Heading>
        <Flex direction="row" mt={5}>
          <Image src="/ui_icons/grant_reward.svg" />
          <Flex flex={1} direction="column" ml={3}>
            <Text fontWeight="500">Grant Reward</Text>
            <Text variant="footer" color="brand.500" fontWeight="700">
              {rewardAsset
                && rewardAsset.committed
                && formatAmount(rewardAsset.committed.toString(), rewardAssetDecimals)}
              {' '}
              {rewardAsset?.label}
            </Text>
          </Flex>
        </Flex>
        <Flex
          direction="row"
          w="100%"
          alignItems="start"
          justify="space-between"
          mt={5}
        >
          <Flex w="70%" direction="column">
            <SingleLineInput
              label="Deposit Amount"
              placeholder="100"
              value={funding}
              onChange={(e) => {
                if (error) {
                  setError(false);
                }
                setFunding(e.target.value);
              }}
              isError={error}
              errorText="Required"
              type="number"
            />
          </Flex>
          <Flex direction="column" w="25%" mt="20px">
            <Dropdown
              listItemsMinWidth="132px"
              listItems={[
                {
                  icon: rewardAsset?.icon,
                  label: rewardAsset?.label,
                },
              ]}
            />
          </Flex>
        </Flex>
        <Text mt={1} variant="tableHeader" color="#122224">
          Wallet Balance
          {' '}
          <Text variant="tableHeader" display="inline-block">
            {`${formatAmount(walletBalance.toString(), rewardAssetDecimals)} ${
              rewardAsset?.label
            }`}
          </Text>
        </Text>

        <Button
          variant="primary"
          my={8}
          py={loading ? 2 : 0}
          onClick={loading ? () => {} : () => {
            if (funding === '') { setError(true); return; }
            setFinalAmount(ethers.utils.parseUnits(funding, rewardAssetDecimals));
          }}
        >
          {loading ? <Loader /> : 'Deposit'}
        </Button>
      </Flex>
    )*/}
    </ModalBody>
  );
}

export default PayoutModalContent;
