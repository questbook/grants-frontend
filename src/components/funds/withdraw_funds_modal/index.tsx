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
  useToast,
} from '@chakra-ui/react';
import React from 'react';
import Dropdown from '../../ui/forms/dropdown';
import SingleLineInput from '../../ui/forms/singleLineInput';
import Modal from '../../ui/modal';
import {
  useContract, useSigner,
} from 'wagmi';
import GrantABI from '../../../contracts/abi/GrantAbi.json';
import { parseAmount, truncateStringFromMiddle } from 'src/utils/formattingUtils';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  grantAddress: string;
  rewardAsset: {
    address: string;
    committed: BigNumber;
    label: string;
    icon: string;
  };
}

function WithdrawFunds({ isOpen, onClose, grantAddress, rewardAsset }: Props) {
  const [type, setType] = React.useState(-1);
  const [funding, setFunding] = React.useState('');
  const [error, setError] = React.useState(false);
  const [address, setAddress] = React.useState('');
  const [addressError, setAddressError] = React.useState(false);
  const toast = useToast();
  const [signerStates] = useSigner();
  const grantContract = useContract({
    addressOrName: grantAddress ?? '0x0000000000000000000000000000000000000000',
    contractInterface: GrantABI,
    signerOrProvider: signerStates.data,
  });

  const [transactionHash, setTransactionHash] = React.useState('');
  const details = [{ key: 'Amount', value: '2 ETH' }, { key: 'Withdrawal Address', value: '0x918102991810xc10292' }];



  const dummyTransaction = async () => {
    setType(0);
    const finalAmount = parseAmount(funding.toString());
    try {
      const transferTxn = await grantContract.withdrawFunds(
        rewardAsset.address,
        finalAmount,
        address,
      );
      setTransactionHash(transferTxn.hash);
      setType(1);
    } catch {
      toast({
        title: 'Withdrawal failed!',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }


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
                      icon: rewardAsset.icon,
                      label: rewardAsset.label,
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
            {[{ key: 'Amount', value: `${funding} ${rewardAsset.label}` }, { key: 'Withdrawal Address', value: truncateStringFromMiddle(address) }].map((detail) => (
              <Flex direction="row" justify="space-between">
                <Text>{detail.key}</Text>
                <Text variant="tableHeader" color="#122224">{detail.value}</Text>
              </Flex>
            ))}
          </Flex>

          <Link mx={1} href={`https://etherscan.io/tx/${transactionHash}`} target="_blank" variant="footer" fontWeight="700" color="brand.500">
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
