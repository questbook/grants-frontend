import {
  ModalBody,
  Flex,
  Text,
  Link,
  Button,
  IconButton,
  Image,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  InputGroup,
  InputRightElement,
  Heading,
  ToastId,
  useClipboard,
  useToast,
} from '@chakra-ui/react';

// UTILS AND HOOKS
import React, { useState, useEffect, useRef } from 'react';
import { BigNumber, utils } from 'ethers';
import useChainId from 'src/hooks/utils/useChainId';
import { useContract, useSigner } from 'wagmi';
import { CHAIN_INFO } from 'src/constants/chainInfo';
import { SupportedChainId } from 'src/constants/chains';
import Loader from 'src/components/ui/loader';
import usePayReviewers from '../../hooks/usePayReviewers';

// CONSTANTS AND ABIS
import { trimAddress, formatAmount } from '../../utils/formattingUtils';
import ERC20ABI from '../../contracts/abi/ERC20.json';

// UI AND COMPONENT TOOLS
import Dropdown from '../ui/forms/dropdown';
import InfoToast from '../ui/infoToast';

interface Props {
  payMode: number;
  reviewerAddress: string | any;
  reviews: number;
  onClose: () => void;
}

function PayoutModalContent({
  payMode,
  reviewerAddress,
  reviews,
  onClose,
}: Props) {
  // WAGMI && ETH HOOKS
  const currentChain = useChainId() ?? SupportedChainId.RINKEBY;
  const [signerStates] = useSigner();

  //CHAKRA HOOKS
  const { hasCopied, onCopy } = useClipboard(reviewerAddress);
  const toast = useToast();
  const toastRef = useRef<ToastId>();

  const supportedCurrencies = Object.keys(
    CHAIN_INFO[currentChain].supportedCurrencies
  )
    .map((address) => CHAIN_INFO[currentChain].supportedCurrencies[address])
    .map((currency) => ({ ...currency, id: currency.address }));

  // STATES TO FILL WITH FORM INPUTS
  const [reviewsToPay, setReviewsToPay] = useState<number>();
  const [amountToPay, setAmountToPay] = useState<number>();
  const [totalAmount, setTotalAmount] = useState<any>(0);
  const [finalAmount, setFinalAmount] = useState<BigNumber>();
  const [reviewCurrency, setReviewCurrency] = useState(
    supportedCurrencies[0].label
  );
  const [reviewCurrencyAddress, setReviewCurrencyAddress] = useState(
    supportedCurrencies[0].address
  );

  // STATES TO FILL WITH ETH HOOKS
  const [walletBalance, setWalletBalance] = React.useState(0);
  const [loader, setLoader] = useState(false);
  // const [rewardAssetDecimals, setRewardAssetDecimals] = React.useState(0);

  const [payReviewerData, txnLink, loading] = usePayReviewers(
    totalAmount,
    reviewerAddress,
    reviewCurrencyAddress
  );

  useEffect(() => {
    if (amountToPay !== undefined && reviewsToPay !== undefined) {
      const amount = ((amountToPay as any) * reviewsToPay) as any;

      setTotalAmount(amount.toString());
    }
  }, [amountToPay, reviewsToPay]);

  useEffect(() => {
    if (currentChain) {
      const currencies = Object.keys(
        CHAIN_INFO[currentChain].supportedCurrencies
      )
        .map((address) => CHAIN_INFO[currentChain].supportedCurrencies[address])
        .map((currency) => ({ ...currency, id: currency.address }));
      setReviewCurrency(currencies[0].label);
      setReviewCurrencyAddress(currencies[0].address);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChain]);

  const rewardAssetContract = useContract({
    addressOrName:
      reviewCurrencyAddress ?? '0x0000000000000000000000000000000000000000',
    contractInterface: ERC20ABI,
    signerOrProvider: signerStates.data,
  });

  useEffect(() => {
    (async function () {
      try {
        const tempAddress = await signerStates.data?.getAddress();
        const tempWalletBalance = await rewardAssetContract.balanceOf(
          tempAddress
        );
        setWalletBalance(tempWalletBalance);
        console.log(tempWalletBalance);
      } catch {}
    });
  }, [totalAmount]);

  useEffect(() => {
    // console.log(depositTransactionData);
    if (payReviewerData) {
      onClose();
      setFinalAmount(undefined);
      setTotalAmount('');
      toastRef.current = toast({
        position: 'top',
        render: () => (
          <InfoToast
            link={txnLink}
            close={() => {
              if (toastRef.current) {
                toast.close(toastRef.current);
              }
            }}
          />
        ),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast, payReviewerData]);

  return (
    <ModalBody>
      {payMode === 0 && (
        <Flex direction="column" gap="1rem">
          <Flex
            w="100%"
            mt={7}
            direction="row"
            justify="space-between"
            align="center"
          >
            <Heading fontSize="0.875rem" textAlign="left">
              Address:
            </Heading>
            <Text fontSize="0.875rem">
              {trimAddress(reviewerAddress, 8)}{' '}
              <IconButton
                alignItems="center"
                justifyItems="center"
                _focus={{ boxShadow: 'none' }}
                aria-label="Back"
                variant="ghost"
                _hover={{}}
                _active={{}}
                icon={
                  <Image
                    src={
                      !hasCopied
                        ? '/ui_icons/copy/normal.svg'
                        : '/ui_icons/copy/active.svg'
                    }
                  />
                }
                onClick={() => onCopy()}
              />
            </Text>
          </Flex>
          <Flex direction="column" gap="0.5rem">
            <Heading fontSize="0.875rem" textAlign="left">
              Reviews:
            </Heading>
            <InputGroup size="md">
              <Input
                pr="4.5rem"
                placeholder="Enter number of reviews"
                min={1}
                max={reviews}
                isInvalid={
                  (reviewsToPay as any) > reviews || (reviewsToPay as any) < 1
                }
                onChange={(e) => setReviewsToPay(parseInt(e.target.value, 10))}
                value={reviewsToPay}
                h={12}
                type="number"
              />
              <InputRightElement width="fit-content" p={5} mt="0.25rem">
                <Button
                  bg="none"
                  color="#8850EA"
                  fontWeight="bold"
                  h="1.75rem"
                  size="sm"
                  onClick={() => setReviewsToPay(reviews)}
                >
                  ALL
                </Button>
              </InputRightElement>
            </InputGroup>
            <Text fontSize="0.75rem">
              {(reviewsToPay as any) > reviews
                ? `You can not pay more than ${reviews} reviews`
                : (reviewsToPay as any) < 1 &&
                  'You need to pay at least 1 review'}
            </Text>
          </Flex>
          <Flex direction="row">
            <Flex w="70%" direction="column" gap="0.5rem">
              <Heading fontSize="0.875rem" textAlign="left">
                Amount per Review:
              </Heading>
              <NumberInput
                mr="0.5rem"
                placeholder="Enter Amount"
                onChange={(value) => {
                  setAmountToPay(parseInt(value));
                }}
                value={amountToPay}
                min={0}
                step={0.01}
              >
                <NumberInputField h={12} minW="full" />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </Flex>
            <Flex direction="column" w="fit-content" mt="20px">
              <Dropdown
                listItemsMinWidth="132px"
                listItems={supportedCurrencies}
                value={reviewCurrency}
                onChange={(data: any) => {
                  setReviewCurrency(data.label);
                  setReviewCurrencyAddress(data.id);
                }}
              />
            </Flex>
          </Flex>
          <Flex>
            {totalAmount !== 0 ? (
              <Flex direction="column" w="100%">
                <InputGroup>
                  <Input
                    color="#717A7C"
                    border="none"
                    bg="rgba(241, 247, 255, 0.83)"
                    isReadOnly
                    value="Total Amount"
                    pr="4.5rem"
                    h={12}
                  />
                  <InputRightElement
                    zIndex="0"
                    p={5}
                    mt="0.25rem"
                    width="fit-content"
                  >
                    <Text bg="none" fontSize="0.875rem" color="black" size="sm">
                      {totalAmount} {reviewCurrency}
                    </Text>
                  </InputRightElement>
                </InputGroup>

                <Text mt="0.75rem" color="#AAAAAA">
                  Wallet Balance{' '}
                  <Text
                    color="#AAAAAA"
                    display="inline-block"
                    fontWeight="bold"
                  >
                    {`${formatAmount(walletBalance.toString())}`}{' '}
                    {reviewCurrency}
                  </Text>
                </Text>
              </Flex>
            ) : null}
          </Flex>

          <Text fontSize="0.75rem" alignContent="center">
            <Image
              display="inline-block"
              h="10px"
              w="10px"
              alt="wallet_info"
              src="/ui_icons/info_brand.svg"
            />{' '}
            By pressing Make Payment you will have to approve the transaction in
            your wallet.{' '}
            <Link
              href="https://www.notion.so/questbook/FAQs-206fbcbf55fc482593ef6914f8e04a46"
              isExternal
            >
              Learn more
            </Link>{' '}
            <Image
              display="inline-block"
              h="10px"
              w="10px"
              src="/ui_icons/link.svg"
            />
          </Text>

          <Button
            variant="primary"
            my={8}
            onClick={() => {
              console.log(
                reviewCurrencyAddress,
                totalAmount,
                reviewCurrency,
                reviewerAddress
              );
              setLoader(!loader);
              setFinalAmount(utils.parseUnits(totalAmount));
            }}
          >
            {loader ? <Loader /> : 'Make Payment'}
          </Button>
          <Button variant="reject" my={8} onClick={() => {}} py="0">
            Cancel
          </Button>
        </Flex>
      )}

      {/* payMode === 1 && (
        <Flex direction="column" gap="0.5rem">
          <Flex w="100%" mt={7} direction="row" justify="space-between" align="center">
            <Heading fontSize="0.875rem" textAlign="left">
              Address:
            </Heading>
            <Text fontSize="0.875rem">
              {trimAddress(address)} <IconButton
                aria-label="Back"
                variant="ghost"
                _hover={{}}
                _active={{}}
                icon={<Image mr={8} src={!hasCopied ? "/ui_icons/copy/normal.svg"
                : "/ui_icons/copy/active.svg"} />}
                onClick={() => onCopy()}
              />
            </Text>
          </Flex>
          <Flex direction="column" gap="0.25rem">
          <Heading fontSize="0.875rem" textAlign="left">
            Reviews:
          </Heading>
          <InputGroup size='md'>
            <Input
              pr='4.5rem'
              placeholder='Enter number of reviews'
              min={1}
              max={reviews}
              onChange={(e) => onChange(e)}
              value={reviewsToPay}
            />
            <InputRightElement width='4.5rem'>
              <Button bg="none" color="brand" h='1.75rem' size='sm' onClick={() => fillReviews}>
                ALL
              </Button>
            </InputRightElement>
          </InputGroup>
          </Flex>
          <Flex direction="column" gap="0.25rem">
          <Heading fontSize="0.875rem" textAlign="left">
            Amount per Review
          </Heading>
          <Input
            pr='4.5rem'
            placeholder='Enter Amount'
            onChange={(e) => onChange(e)}
            value={amountToPay}
          />
          </Flex>

          <Text fontSize="0.75rem">
            By pressing Make Payment you will have to approve the transaction in
            your wallet
          </Text>
          <Button variant="primary" my={8} onClick={() => onClose()}>
            Make Payment
          </Button>
        </Flex>
      ) */}
    </ModalBody>
  );
}

export default PayoutModalContent;
