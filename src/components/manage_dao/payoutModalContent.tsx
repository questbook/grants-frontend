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
  useClipboard,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { trimAddress } from '../../utils/formattingUtils';
import useChainId from 'src/hooks/utils/useChainId';

import Dropdown from '../ui/forms/dropdown';
import { CHAIN_INFO } from 'src/constants/chainInfo';
import { SupportedChainId } from 'src/constants/chains';

// import InfoToast from '../ui/infoToast';
// import Loader from 'src/components/ui/loader';

interface Props {
  payMode: number;
  address: string | any;
  reviews: number;
  onClose: () => void;
}

function PayoutModalContent({ payMode, address, reviews, onClose }: Props) {
  const currentChain = useChainId() ?? SupportedChainId.RINKEBY;

  const [reviewsToPay, setReviewsToPay] = useState<number>();
  const [amountToPay, setAmountToPay] = useState<number>();
  const [totalAmount, setTotalAmount] = useState<number>(0);

  const supportedCurrencies = Object.keys(
    CHAIN_INFO[currentChain].supportedCurrencies
  )
    .map((address) => CHAIN_INFO[currentChain].supportedCurrencies[address])
    .map((currency) => ({ ...currency, id: currency.address }));

  const [reviewCurrency, setReviewCurrency] = useState(
    supportedCurrencies[0].label
  );
  const [rewardCurrencyAddress, setRewardCurrencyAddress] = useState(
    supportedCurrencies[0].address
  );

  // const toast = useToast();

  const { hasCopied, onCopy } = useClipboard(address);

  const fillReviews = () => {
    setReviewsToPay(reviews);
  };

  useEffect(() => {
    if (amountToPay != undefined && reviewsToPay != undefined) {
      setTotalAmount(((amountToPay as any) * reviewsToPay) as any);
    }
  }, [amountToPay]);

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
              {trimAddress(address, 8)}{' '}
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
                onChange={(e) => setReviewsToPay(parseInt(e.target.value))}
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
                  onClick={() => fillReviews()}
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
                onChange={(value) => setAmountToPay(parseInt(value))}
                value={amountToPay}
                precision={2}
                min={0.01}
                step={0.1}
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
                  console.log(data);
                  setReviewCurrency(data.label);
                  setRewardCurrencyAddress(data.id);
                }}
              />
            </Flex>
          </Flex>
          <Flex>
            {totalAmount != 0 ? (
              <InputGroup>
                <Input isReadOnly value="Total Amount" pr="4.5rem" h={12} />
                <InputRightElement zIndex="0" p={5} mt="0.25rem" width="fit-content">
                  <Text
                    bg="none"
                    fontSize="0.875rem"
                    color="black"
                    size="sm"
                  >
                    {totalAmount} {reviewCurrency}
                  </Text>
                </InputRightElement>
              </InputGroup>
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

          <Button variant="primary" my={8} onClick={() => onClose()}>
            Make Payment
          </Button>
        </Flex>
      )}

      {/*payMode === 1 && (
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
                icon={<Image mr={8} src={!hasCopied ? "/ui_icons/copy/normal.svg" : "/ui_icons/copy/active.svg"} />}
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
      )*/}
    </ModalBody>
  );
}

export default PayoutModalContent;
