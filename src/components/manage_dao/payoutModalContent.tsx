import {
  ModalBody,
  Flex,
  Text,
  Button,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Heading,
  useClipboard,
  useToast,
} from '@chakra-ui/react';
import {useState} from 'react';
import {trimAddress} from '../utils';

// import InfoToast from '../ui/infoToast';
// import Loader from 'src/components/ui/loader';

interface Props {
  payMode: number;
  address: string;
  reviews: number;
  onClose: () => void;
}

function PayoutModalContent({ payMode, address, reviews, onClose }: Props) {

  const [reviewsToPay, setReviewsToPay] = useState<number>();
  const [amountToPay, setAmountToPay] = useState<number>()

  const toast = useToast();
  const { hasCopied, onCopy } = useClipboard(address);

  const onChange = (e: any) => {
    setReviewsToPay(e.target.value);
  }

  const fillReviews = () => {
    setReviewsToPay(reviews);
  }

  return (
    <ModalBody>
      {payMode === 0 && (
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
