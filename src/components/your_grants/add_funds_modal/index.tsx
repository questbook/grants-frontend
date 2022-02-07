import {
  ModalBody,
  Flex,
  Image,
  Text,
  Button,
  Link,
  Heading,
} from '@chakra-ui/react';
import React from 'react';
import SingleLineInput from '../../ui/forms/singleLineInput';
import Modal from '../../ui/modal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

function AddFunds({ isOpen, onClose }: Props) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => onClose()}
      title="Add Funds"
      rightIcon={(
        <Button
          _focus={{}}
          variant="link"
          color="#AA82F0"
          leftIcon={<Image src="/sidebar/discord_icon.svg" />}
        >
          Support 24*7
        </Button>
      )}
      closeOnOverlayClick
    >
      <ModalBody>
        <Flex direction="column" justify="start" align="center">
          <Image h="85px" w="85px" src="/ui_icons/verified_2.svg" />
          <Text
            mt={7}
            textAlign="center"
            fontSize="28px"
            lineHeight="40px"
            fontWeight="700"
          >
            Verified grants = 10x applicants
          </Text>
          <Text variant="applicationText" textAlign="center" mt={2}>
            Add funds to get a verified badge.
          </Text>
          <Text variant="applicationText" textAlign="center" mt={6}>
            Deposit and withdraw funds anytime.
          </Text>
          <Flex w="100%" mt={6}>
            <SingleLineInput
              label="Smart Contract Address"
              labelRightElement={(
                <Link
                  variant="link"
                  fontSize="12px"
                  lineHeight="16px"
                  fontWeight="700"
                  fontStyle="normal"
                  color="brand.500"
                  href="view grant"
                >
                  View Contract
                  {' '}
                  <Image
                    display="inline-block"
                    h={3}
                    w={3}
                    src="/ui_icons/link.svg"
                  />
                </Link>
              )}
              height="80px"
              inputRightElement={(
                <Button variant="primary" w="89px" h="48px" mr={20}>
                  Copy
                </Button>
              )}
              placeholder="0xb794f5fss35x9268"
              // subtext="Send only ETH token to this address."
              value={undefined}
              onChange={() => {}}
              isError={false}
              subtextAlign="center"
              tooltip="Smart Contract Address is the address of the smart contract that will receive the funds."
              disabled
            />
          </Flex>
          <Heading variant="applicationHeading" mt={4}>
            Send only ETH token to this address.
          </Heading>
          <Button variant="primary" my={8} onClick={() => onClose()}>
            OK
          </Button>
        </Flex>
      </ModalBody>
    </Modal>
  );
}

export default AddFunds;
