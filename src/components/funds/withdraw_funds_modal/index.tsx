import {
  ModalBody,
  Flex,
  Image,
  Text,
  Button,
  Link,
  useToast,
  ToastId,
  Center,
  CircularProgress,
} from '@chakra-ui/react';
import React from 'react';
import { useContract, useSigner } from 'wagmi';
import {
  parseAmount,
  truncateStringFromMiddle,
} from 'src/utils/formattingUtils';
import { BigNumber } from 'ethers';
import InfoToast from 'src/components/ui/infoToast';
import { isValidAddress } from 'src/utils/validationUtils';
import Dropdown from '../../ui/forms/dropdown';
import SingleLineInput from '../../ui/forms/singleLineInput';
import Modal from '../../ui/modal';
import GrantABI from '../../../contracts/abi/GrantAbi.json';
import strings from '../../../constants/strings.json';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  grantAddress: string;
  grantFunding: string;
  rewardAsset: {
    address: string;
    committed: BigNumber;
    label: string;
    icon: string;
  };
}

function WithdrawFunds({
  isOpen, onClose, grantAddress, grantFunding, rewardAsset,
}: Props) {
  const [type, setType] = React.useState(-1);
  const [funding, setFunding] = React.useState('');
  const [address, setAddress] = React.useState('');
  const toast = useToast();
  const [signerStates] = useSigner();
  const grantContract = useContract({
    addressOrName: grantAddress ?? '0x0000000000000000000000000000000000000000',
    contractInterface: GrantABI,
    signerOrProvider: signerStates.data,
  });

  const { errors } = strings.funds.withdraw_funds_modal;

  enum WithdrawAmountErrorTypes {
    NoError = -1,
    InvalidValue = 0,
    InsufficientFunds = 1,
  }
  const [withdrawAmountError,
    setWithdrawAmountError] = React.useState(WithdrawAmountErrorTypes.NoError);
  const getWithdrawAmountErrorText = () => {
    switch (withdrawAmountError) {
      case WithdrawAmountErrorTypes.NoError:
        return '';
      default:
        return errors.withdraw_amount[withdrawAmountError].message;
    }
  };

  enum RecipientAddressErrorTypes {
    NoError = -1,
    InvalidAddress = 0,
  }
  const [recipientAddressError,
    setRecipientAddressError] = React.useState(RecipientAddressErrorTypes.NoError);

  const [transactionHash, setTransactionHash] = React.useState('');
  const [hasClicked, setHasClicked] = React.useState(false);
  const toastRef = React.useRef<ToastId>();

  const closeToast = () => {
    if (toastRef.current) {
      toast.close(toastRef.current);
    }
  };
  const showToast = ({ link }: { link: string }) => {
    toastRef.current = toast({
      position: 'top',
      render: () => <InfoToast link={link} close={closeToast} />,
    });
  };

  const withdraw = async () => {
    let hasError: boolean = false;

    if (funding === '' || BigNumber.from(funding).lte(0)) {
      setWithdrawAmountError(WithdrawAmountErrorTypes.InvalidValue);
      hasError = true;
    }

    if (!isValidAddress(address)) {
      setRecipientAddressError(RecipientAddressErrorTypes.InvalidAddress);
      hasError = true;
    }

    if (hasError) return;

    if (BigNumber.from(funding).gt(BigNumber.from(grantFunding))) {
      setWithdrawAmountError(WithdrawAmountErrorTypes.InsufficientFunds);
      return;
    }

    setType(0);
    const finalAmount = parseAmount(funding.toString());
    try {
      setHasClicked(true);
      const transferTxn = await grantContract.withdrawFunds(
        rewardAsset.address,
        finalAmount,
        address,
      );
      const transactionData = await transferTxn.wait();

      setHasClicked(false);
      setTransactionHash(transactionData.transactionHash);
      setType(1);
      showToast({
        link: `https://etherscan.io/tx/${transferTxn.transactionHash}`,
      });
    } catch {
      setHasClicked(false);
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
            <Flex
              direction="row"
              w="100%"
              align="start"
              justify="space-between"
            >
              <Flex w="70%" direction="column">
                <SingleLineInput
                  label="Withdrawal Amount"
                  placeholder="100"
                  value={funding}
                  onChange={(e) => {
                    if (
                      withdrawAmountError !== WithdrawAmountErrorTypes.NoError
                    ) { setWithdrawAmountError(WithdrawAmountErrorTypes.NoError); }

                    setFunding(e.target.value);
                  }}
                  isError={
                    withdrawAmountError !== WithdrawAmountErrorTypes.NoError
                  }
                  errorText={getWithdrawAmountErrorText()}
                  type="number"
                />
              </Flex>
              <Flex direction="column" w="25%" mt="20px">
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
                label="Recipient Address"
                placeholder="Enter address here"
                isError={recipientAddressError !== RecipientAddressErrorTypes.NoError}
                errorText=""
                value={address}
                onChange={(e) => {
                  if (recipientAddressError !== RecipientAddressErrorTypes.NoError) {
                    setRecipientAddressError(RecipientAddressErrorTypes.NoError);
                  }
                  setAddress(e.target.value);
                }}
              />
            </Flex>

            {recipientAddressError !== RecipientAddressErrorTypes.NoError ? (
              <Flex mt={1} direction="row" align="start">
                <Image mt={1} src="/ui_icons/error_red.svg" />
                <Text ml={1} variant="footer" color="#EE7979">
                  The withdrawal address format is wrong. Please check the
                  withdrawal address length and content.
                </Text>
              </Flex>
            ) : (
              <Text mt={1} variant="footer">
                Enter recipient address on
                {' '}
                {rewardAsset.label === 'WMATIC' ? 'Polygon' : 'Ethereum'}
                {' '}
                network
              </Text>
            )}
            {hasClicked ? (
              <Center>
                <CircularProgress
                  isIndeterminate
                  color="brand.500"
                  size="48px"
                  mt={10}
                  mb={9}
                />
              </Center>
            ) : (
              <Button
                variant="primary"
                mt={recipientAddressError !== RecipientAddressErrorTypes.NoError ? 5 : 10}
                mb={9}
                onClick={withdraw}
              >
                Withdraw
              </Button>
            )}
          </Flex>
        )}
        {type === 1 && (
          <Flex direction="column" align="center">
            <Image
              w="120.25px"
              h="123.15px"
              src="/illustrations/dao_created.svg"
            />
            <Text
              mt={10}
              variant="tableHeader"
              color="#122224"
              textAlign="center"
            >
              Your withdrawal is in progress.
            </Text>

            <Flex direction="column" w="full" mt={4} mb={5}>
              {[
                { key: 'Amount', value: `${funding} ${rewardAsset.label}` },
                {
                  key: 'Withdrawal Address',
                  value: truncateStringFromMiddle(address),
                },
              ].map((detail) => (
                <Flex direction="row" justify="space-between">
                  <Text>{detail.key}</Text>
                  <Text variant="tableHeader" color="#122224">
                    {detail.value}
                  </Text>
                </Flex>
              ))}
            </Flex>

            <Link
              mx={1}
              href={`https://etherscan.io/tx/${transactionHash}`}
              isExternal
              variant="footer"
              fontWeight="700"
              color="brand.500"
            >
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
