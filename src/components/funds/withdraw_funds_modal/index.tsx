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
import Dropdown from '../../ui/forms/dropdown';
import SingleLineInput from '../../ui/forms/singleLineInput';
import Modal from '../../ui/modal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

function WithdrawFunds({ isOpen, onClose }: Props) {
  const [type, setType] = React.useState(-1);
  const [funding, setFunding] = React.useState('');
  const [error, setError] = React.useState(false);
  const [address, setAddress] = React.useState('');
  const [addressError, setAddressError] = React.useState(false);

  const [transactionHash, setTransactionHash] = React.useState('');
  const details = [{ key: 'Amount', value: '2 ETH' }, { key: 'Withdrawal Address', value: '0x918102991810xc10292' }];

  const dummyTransaction = async () => {
    setType(0);
    await new Promise((resolve) => { setTimeout(resolve, 5000); });
    setTransactionHash('hash');
    setType(1);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        if (type !== 0) {
          onClose();
          setType(-1);
        }
      }}
      title={type !== 1 ? 'Withdraw Funds' : ''}
      modalWidth={527}
    >
      <ModalBody mx={2}>
        {type !== 1 && (
          <Flex direction="column" mt={7}>
            <Flex direction="row" w="100%" alignItems="flex-end" justify="space-between">
              <Flex w="70%" direction="column">
                <SingleLineInput
                  label="Withdrawal Amount"
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
            <Flex mt={8}>
              <SingleLineInput
                label="Receipient Address"
                placeholder="Enter address here"
                isError={addressError}
                errorText=""
                value={address}
                onChange={(e) => {
                  setAddressError(false);
                  setAddress(e.target.value);
                }}
              />

            </Flex>

            {addressError ? (
              <Flex mt={1} direction="row" align="start">
                <Image mt={1} src="/ui_icons/error_red.svg" />
                <Text ml={1} variant="footer" color="#EE7979">
                  The withdrawal address format is wrong. Please check the
                  withdrawal address length and content.
                </Text>
              </Flex>
            ) : (
              <Text mt={1} variant="footer">
                Enter only ERC 20 address
              </Text>
            )}
            <Button variant="primary" mt={addressError ? 5 : 10} mb={9} onClick={dummyTransaction} disabled={addressError || type === 0}>
              Withdraw
            </Button>
          </Flex>
        )}
        {type === 1 && (
        <Flex direction="column" align="center">
          <Image w="120.25px" h="123.15px" src="/illustrations/dao_created.svg" />
          <Text mt={10} variant="tableHeader" color="#122224" textAlign="center">Your withdrawal is in progress.</Text>

          <Flex direction="column" w="full" mt={4} mb={5}>
            {details.map((detail) => (
              <Flex direction="row" justify="space-between">
                <Text>{detail.key}</Text>
                <Text variant="tableHeader" color="#122224">{detail.value}</Text>
              </Flex>
            ))}
          </Flex>

          <Link mx={1} href="wallet" variant="footer" fontWeight="700" color="brand.500">
            Learn more
            <Image
              ml={1}
              display="inline-block"
              h="10px"
              w="10px"
              src="/ui_icons/link.svg"
            />
          </Link>

          <Button
            my={8}
            variant="primary"
            w="full"
            onClick={() => {
              onClose();
              setType(-1);
            }}
          >
            OK
          </Button>
        </Flex>
        )}
      </ModalBody>
    </Modal>
  );
}

export default WithdrawFunds;
