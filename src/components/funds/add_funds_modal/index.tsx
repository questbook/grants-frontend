import {
  ModalBody,
  Flex,
  Image,
  Text,
  Button,
  Box,
  IconButton,
  Divider,
  Heading,
  Link,
} from '@chakra-ui/react';
import React from 'react';
import Lottie from 'lottie-react';
import Dropdown from '../../ui/forms/dropdown';
import SingleLineInput from '../../ui/forms/singleLineInput';
import Modal from '../../ui/modal';
import animationData from '../../../../public/animations/Add_Funds.json';
import Tooltip from '../../ui/tooltip';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

function AddFunds({ isOpen, onClose }: Props) {
  const [type, setType] = React.useState(-1);
  const [funding, setFunding] = React.useState('');
  const [error, setError] = React.useState(false);

  const nextScreenTexts = ['Deposit funds from another wallet', 'Deposit funds from connected wallet'];
  const stepsWhenAddingFromAnotherWallet = ['Open your wallet which has funds.', 'Send the funds to the address below.'];
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => onClose()}
      title="Add Funds"
      leftIcon={type !== -1 && (
        <IconButton
          aria-label="Back"
          variant="ghost"
          _hover={{}}
          _active={{}}
          icon={<Image mr={8} src="/ui_icons/black/chevron_left.svg" />}
          onClick={() => setType(-1)}
        />
      )}
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
      modalWidth={527}
    >
      <ModalBody>
        {type === -1 && (
        <Flex px={7} mb={7} mt={9} direction="column" justify="start" align="center">
          {/* <Image src="/illustrations/add_funds_body.svg" /> */}
          <Lottie animationData={animationData} />
          <Text
            mt={10}
            textAlign="center"
            fontSize="28px"
            lineHeight="40px"
            fontWeight="700"
          >
            Verified grants = 10x applicants
          </Text>
          <Text variant="applicationText" textAlign="center" mt="3px">
            Add funds to get a verified badge.
          </Text>
          <Text variant="applicationText" textAlign="center" mt={0}>
            Deposit and withdraw funds anytime.
          </Text>
          <Flex direction="column" mt={8} w="100%">
            <Divider />
            {nextScreenTexts.map((text, index) => (
              <>
                <Flex direction="row" justify="space-between" align="center" mx={4}>
                  <Text variant="tableBody" color="brand.500" my={4}>
                    {text}
                    {' '}
                  </Text>
                  <IconButton
                    aria-label="right_chevron"
                    variant="ghost"
                    _hover={{}}
                    _active={{}}
                    w="13px"
                    h="6px"
                    icon={<Image src="/ui_icons/brand/chevron_right.svg" />}
                    onClick={() => setType(index)}
                  />
                </Flex>
                <Divider />
              </>
            ))}
          </Flex>
        </Flex>
        )}
        {type === 0 && (
        <Flex direction="column" mt={6}>
          <Text fontSize="18px" lineHeight="26px" fontWeight="700" color="#122224">Deposit funds from another wallet</Text>
          <Flex direction="column" align="start">
            {stepsWhenAddingFromAnotherWallet.map((text, index) => (
              <Flex direction="row" justify="start" mt={8} align="center">
                <Flex
                  bg="brand.500"
                  w={10}
                  h={10}
                  borderRadius="50%"
                  justify="center"
                  align="center"
                  mr={4}
                >
                  <Text
                    variant="tableBody"
                    color="white"
                    textAlign="center"
                  >
                    {index + 1}
                  </Text>
                </Flex>
                <Text>{text}</Text>
              </Flex>
            ))}
          </Flex>
          <Flex w="100%" mt={7} direction="column">
            <Text variant="tableHeader" color="#122224">
              Smart Contract Address
            </Text>
            <Flex direction="row" justify="space-between" align="center" bg="#F3F4F4" px={3} py={3} mt={1} w="100%">
              <Text variant="footer">0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D</Text>
              <Button variant="primary" w="77px">Copy</Button>
            </Flex>
          </Flex>
          <Heading variant="applicationHeading" textAlign="center" color="#717A7C" mt={4}>
            Send only ETH token to this address.
          </Heading>
          <Button variant="primary" my={8} onClick={() => onClose()}>
            OK
          </Button>
        </Flex>
        )}
        {type === 1 && (
        <Flex direction="column" mt={6}>
          <Text fontSize="18px" lineHeight="26px" fontWeight="700" color="#122224">Deposit funds from your wallet</Text>
          <Flex direction="row" mt={7}>
            <Image src="/ui_icons/grant_reward.svg" />
            <Flex flex={1} direction="column" ml={3}>
              <Text fontWeight="500">Grant Reward</Text>
              <Text variant="footer" color="brand.500" fontWeight="700">
                60 ETH
              </Text>
            </Flex>
          </Flex>
          <Flex direction="row" w="100%" alignItems="flex-end" justify="space-between" mt={8}>
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
              />
            </Flex>
            <Flex direction="column" w="25%">
              <Dropdown
                listItemsMinWidth="132px"
                listItems={[
                  {
                    icon: '/images/dummy/Ethereum Icon.svg',
                    label: 'ETH',
                  },
                ]}
              />
            </Flex>
          </Flex>
          <Text mt={1} variant="tableHeader" color="#122224">
            Wallet Balance
            {' '}
            <Text variant="tableHeader" display="inline-block">2 ETH</Text>
          </Text>
          <Button variant="primary" my={8} onClick={() => onClose()}>
            Deposit
          </Button>
        </Flex>
        )}
      </ModalBody>
    </Modal>
  );
}

export default AddFunds;
