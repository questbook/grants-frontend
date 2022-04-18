import {
  Flex, Text, Box, Button, Image, Link, Switch,
} from '@chakra-ui/react';
import React, { useContext, useEffect, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { CHAIN_INFO } from 'src/constants/chainInfo';
import Loader from 'src/components/ui/loader';

import { SupportedChainId } from 'src/constants/chains';
import useChainId from 'src/hooks/utils/useChainId';
import { useNetwork } from 'wagmi';
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils';
import { ApiClientsContext } from 'pages/_app';
import useEncryption from 'src/hooks/utils/useEncryption';
import { WorkspaceUpdateRequest } from '@questbook/service-validator-client';
import useUpdateWorkspacePublicKeys from 'src/hooks/useUpdateWorkspacePublicKeys';
import { ChevronRightIcon } from '@chakra-ui/icons';
import Tooltip from 'src/components/ui/tooltip';
import Datepicker from '../../../ui/forms/datepicker';
import Dropdown from '../../../ui/forms/dropdown';
import SingleLineInput from '../../../ui/forms/singleLineInput';

interface Props {
  onSubmit: (data: any) => void;
  hasClicked: boolean;
}

function GrantRewardsInput({ onSubmit, hasClicked }: Props) {
  const { getPublicEncryptionKey } = useEncryption();
  const apiClients = useContext(ApiClientsContext)!;
  const { workspace } = apiClients;
  const [reward, setReward] = React.useState('');
  const [rewardError, setRewardError] = React.useState(false);
  const [,switchNetwork] = useNetwork();

  const currentChain = useChainId() ?? SupportedChainId.RINKEBY;

  const supportedCurrencies = Object.keys(
    CHAIN_INFO[currentChain].supportedCurrencies,
  ).map((address) => CHAIN_INFO[currentChain].supportedCurrencies[address])
    .map((currency) => ({ ...currency, id: currency.address }));
  const [rewardCurrency, setRewardCurrency] = React.useState(
    supportedCurrencies[0].label,
  );
  const [rewardCurrencyAddress, setRewardCurrencyAddress] = React.useState(
    supportedCurrencies[0].address,
  );

  useEffect(() => {
    if (workspace && switchNetwork) {
      const chainId = getSupportedChainIdFromWorkspace(workspace);
      switchNetwork(chainId!);
    }
  }, [switchNetwork, workspace]);

  useEffect(() => {
    console.log(currentChain);
    if (currentChain) {
      const currencies = Object.keys(
        CHAIN_INFO[currentChain].supportedCurrencies,
      ).map((address) => CHAIN_INFO[currentChain].supportedCurrencies[address])
        .map((currency) => ({ ...currency, id: currency.address }));
      setRewardCurrency(currencies[0].label);
      setRewardCurrencyAddress(currencies[0].address);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChain]);

  useEffect(() => {
    console.log(rewardCurrencyAddress);
  }, [rewardCurrencyAddress]);

  const [date, setDate] = React.useState('');
  const [dateError, setDateError] = React.useState(false);

  const [keySubmitted, setKeySubmitted] = useState(false);
  const [shouldEncrypt, setShouldEncrypt] = useState(false);
  const [publicKey, setPublicKey] = React.useState<WorkspaceUpdateRequest>({ publicKey: '' });
  const [transactionData, loading] = useUpdateWorkspacePublicKeys(publicKey);

  const [shouldEncryptReviews, setShouldEncryptReviews] = useState(false);

  useEffect(() => {
    if (transactionData) {
      setKeySubmitted(true);
    }
  }, [transactionData]);

  const buttonRef = React.useRef<HTMLButtonElement>(null);

  const handleOnSubmit = async () => {
    let error = false;
    if (reward.length <= 0) {
      setRewardError(true);
      error = true;
    }
    if (date.length <= 0) {
      setDateError(true);
      error = true;
    }

    console.log(reward);
    console.log(rewardCurrencyAddress);

    if (!error) {
      if (!keySubmitted) {
        setPublicKey({ publicKey: (await getPublicEncryptionKey()) || '' });
      }
      let pii = false;
      if (shouldEncrypt && keySubmitted) {
        pii = true;
      }
      onSubmit({
        reward, rewardCurrencyAddress, date, pii, shouldEncryptReviews,
      });
    }
  };
  return (
    <>
      <Flex py={12} direction="column">
        <Text variant="heading" fontSize="36px" lineHeight="48px">
          What&apos;s the reward and deadline for the grant?
        </Text>

        <Flex direction="row" mt={12}>
          <Box minW="160px" flex={1}>
            <SingleLineInput
              label="Grant Reward"
              placeholder="100"
              value={reward}
              onChange={(e) => {
                if (rewardError) {
                  setRewardError(false);
                }
                setReward(e.target.value);
              }}
              isError={rewardError}
              errorText="Required"
              type="number"
            />
          </Box>
          <Box mt={5} ml={4} minW="132px" flex={0}>
            <Dropdown
              listItemsMinWidth="132px"
              listItems={supportedCurrencies}
              value={rewardCurrency}
              onChange={(data: any) => {
                console.log(data);
                setRewardCurrency(data.label);
                setRewardCurrencyAddress(data.id);
              }}
            />
          </Box>
        </Flex>

        <Box mt={12} />

        <Datepicker
          onChange={(e) => {
            if (dateError) {
              setDateError(false);
            }
            setDate(e.target.value);
          }}
          value={date}
          isError={dateError}
          errorText="Required"
          label="Grant Deadline"
        />

        <Flex direction="column" mt={12}>
          <Text
            fontSize="18px"
            fontWeight="700"
            lineHeight="26px"
            letterSpacing={0}
          >
            Grant privacy
          </Text>
        </Flex>

        <Flex mt={8} gap="2">
          <Flex direction="column" flex={1}>
            <Text color="#122224" fontWeight="bold" fontSize="16px" lineHeight="20px">
              Hide applicant personal data (email, and about team)
            </Text>
            <Flex>
              <Text color="#717A7C" fontSize="14px" lineHeight="20px">
                You will be using your public key to access this data.
                <Tooltip
                  icon="/ui_icons/tooltip_questionmark.svg"
                  label="Public key linked to your wallet will allow you to see the hidden data."
                  placement="bottom-start"
                />
              </Text>
            </Flex>
          </Flex>
          <Flex justifyContent="center" gap={2} alignItems="center">
            <Switch
              id="encrypt"
              onChange={
              (e) => {
                setShouldEncrypt(e.target.checked);
              }
             }
            />
            <Text
              fontSize="12px"
              fontWeight="bold"
              lineHeight="16px"
            >
              {`${shouldEncrypt ? 'YES' : 'NO'}`}

            </Text>
          </Flex>
        </Flex>
        {/* {(shouldEncrypt && !keySubmitted) && (
        <Flex mt={8} gap="2" direction="column">
          <Flex
            gap="2"
            cursor="pointer"
            onClick={async () => setPublicKey({ publicKey: (await getPublicEncryptionKey()) || '' })}
          >
            <Text
              color="brand.500"
              fontWeight="bold"
              fontSize="16px"
              lineHeight="24px"
            >
              Allow access to your public key and encrypt the applicant form to proceed
            </Text>
            <ChevronRightIcon color="brand.500" fontSize="2xl" />
            {loading
              && <Loader />}
          </Flex>
          <Flex alignItems="center" gap={2}>
            <Image mt={1} src="/ui_icons/info.svg" />
            <Text color="#122224" fontWeight="medium" fontSize="14px" lineHeight="20px">
              By doing the above you’ll have to approve this transaction in your wallet.
            </Text>
          </Flex>
          <Link href="https://www.notion.so/questbook/Why-is-public-key-required-e3fa53f34a5240d185d3d34744bb33f4" isExternal>
            <Text color="#122224" fontWeight="normal" fontSize="14px" lineHeight="20px" decoration="underline">

              Why is this required?
            </Text>
          </Link>
        </Flex>
        )} */}

        <Flex mt={8} gap="2" justifyContent="space-between">
          <Flex direction="column" flex={1}>
            <Text
              color="#122224"
              fontWeight="bold"
              fontSize="16px"
              lineHeight="20px"
            >
              Keep applicant reviews private
            </Text>
            <Flex>
              <Text color="#717A7C" fontSize="14px" lineHeight="20px">
                Private review is only visible to reviewers, DAO members.
              </Text>
            </Flex>
          </Flex>
          <Flex ml="auto" justifyContent="center" gap={2} alignItems="center">
            <Switch
              id="encrypt"
              onChange={(e) => {
                setShouldEncryptReviews(e.target.checked);
              }}
            />
            <Text fontSize="12px" fontWeight="bold" lineHeight="16px">
              {`${shouldEncryptReviews ? 'YES' : 'NO'}`}
            </Text>
          </Flex>
        </Flex>

        <Text variant="footer" mt={8} mb={7} maxW="400">
          <Image
            display="inline-block"
            h="10px"
            w="10px"
            src="/ui_icons/info_brand.svg"
          />
          {' '}
          By pressing Publish Grant you&apos;ll have to approve this transaction
          in your wallet.
          {' '}
          <Link
            href="https://www.notion.so/questbook/FAQs-206fbcbf55fc482593ef6914f8e04a46"
            isExternal
          >
            Learn more
          </Link>
          {' '}
          <Image
            display="inline-block"
            h="10px"
            w="10px"
            src="/ui_icons/link.svg"
          />
        </Text>
      </Flex>

      <Button
        ref={buttonRef}
        mt="auto"
        variant="primary"
        onClick={hasClicked ? () => {} : handleOnSubmit}
        py={hasClicked ? 2 : 0}
        w={hasClicked ? buttonRef.current?.offsetWidth : 'auto'}
      >
        {hasClicked ? <Loader /> : 'Continue'}
      </Button>
    </>
  );
}

export default GrantRewardsInput;
