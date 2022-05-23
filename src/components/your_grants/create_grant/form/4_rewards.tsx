import {
  Flex,
  Box,
  Link,
  Text,
  Image,
  Switch,
} from '@chakra-ui/react';
import React, { useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
// import Modal from 'src/components/ui/modal';
import CustomTokenModal from 'src/components/ui/submitCustomTokenModal';
import Loader from 'src/components/ui/loader';
import useEncryption from 'src/hooks/utils/useEncryption';
import { Token } from '@questbook/service-validator-client';
import Datepicker from '../../../ui/forms/datepicker';
import Dropdown from '../../../ui/forms/dropdown';
import SingleLineInput from '../../../ui/forms/singleLineInput';

function GrantRewardsInput({
  reward,
  setReward,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  rewardToken,
  setRewardToken,
  rewardError,
  setRewardError,
  rewardCurrency,
  setRewardCurrency,
  setRewardCurrencyAddress,
  date,
  setDate,
  dateError,
  setDateError,
  supportedCurrencies,
  shouldEncrypt,
  setShouldEncrypt,
  loading,
  setPublicKey,
  hasOwnerPublicKey,
  keySubmitted,
  shouldEncryptReviews,
  setShouldEncryptReviews,
}: {
  reward: string;
  setReward: (rewards: string) => void;
  rewardToken: Token
  setRewardToken: (rewardToken: Token) => void;
  rewardError: boolean;
  setRewardError: (rewardError: boolean) => void;
  rewardCurrency: string;
  setRewardCurrency: (rewardCurrency: string) => void;
  setRewardCurrencyAddress: (rewardCurrencyAddress: string) => void;
  date: string;
  setDate: (date: string) => void;
  dateError: boolean;
  setDateError: (dateError: boolean) => void;
  supportedCurrencies: any[];
  shouldEncrypt: boolean;
  setShouldEncrypt: (shouldEncrypt: boolean) => void;
  loading: boolean;
  setPublicKey: (publicKey: any) => void;
  hasOwnerPublicKey: boolean;
  keySubmitted: boolean;
  shouldEncryptReviews: boolean;
  setShouldEncryptReviews: (shouldEncryptReviews: boolean) => void;
}) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [supportedCurrenciesList, setSupportedCurrenciesList] = React.useState<any[]>([]);

  useEffect(() => {
    if (supportedCurrencies && supportedCurrencies.length > 0) {
      setSupportedCurrenciesList(supportedCurrencies);
    }
  }, [supportedCurrencies]);

  const [isJustAddedToken, setIsJustAddedToken] = React.useState<boolean>(false);
  const addERC = true;
  const { getPublicEncryptionKey } = useEncryption();
  return (
    <Flex direction="column">

      <Flex direction="row" mt={12}>
        <Box minW="160px" flex={1}>
          <SingleLineInput
            label="Grant Reward"
            placeholder="e.g. 100"
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
        <CustomTokenModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          setRewardCurrency={setRewardCurrency}
          setRewardCurrencyAddress={setRewardCurrencyAddress}
          setRewardToken={setRewardToken}
          supportedCurrenciesList={supportedCurrenciesList}
          setSupportedCurrenciesList={setSupportedCurrenciesList}
          setIsJustAddedToken={setIsJustAddedToken}
        />
        <Box mt={5} ml={4} minW="132px" flex={0}>
          <Dropdown
            listItemsMinWidth="132px"
            listItems={supportedCurrenciesList}
            value={rewardCurrency}
            // eslint-disable-next-line react/no-unstable-nested-components
            onChange={(data: any) => {
              if (data === 'addERCToken') {
                setIsModalOpen(true);
              }
              setRewardCurrency(data.label);
              setRewardCurrencyAddress(data.id);
              if (data !== 'addERCToken' && !isJustAddedToken && data.icon.lastIndexOf('ui_icons') === -1) {
                setRewardToken({
                  iconHash: data.icon.substring(data.icon.lastIndexOf('=') + 1),
                  address: data.address,
                  label: data.label,
                  decimal: data.decimals.toString(),
                });
              }
            }}
            addERC={addERC}
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

      <Flex mt={8} gap="2" justifyContent="space-between">
        <Flex direction="column">
          <Text
            color="#122224"
            fontWeight="bold"
            fontSize="16px"
            lineHeight="20px"
          >
            Hide applicant personal data (email, and about team)
          </Text>
          <Flex>
            <Text color="#717A7C" fontSize="14px" lineHeight="20px">
              {shouldEncrypt
                ? 'The applicant data will be visible only to DAO members.'
                : 'The applicant data will be visible to everyone with the link.'}
              {/* <Tooltip
                icon="/ui_icons/tooltip_questionmark.svg"
                label="Public key linked to your wallet will allow you to see the hidden data."
                placement="bottom-start"
              /> */}
            </Text>
          </Flex>
        </Flex>
        <Flex justifyContent="center" gap={2} alignItems="center">
          <Switch
            id="encrypt"
            onChange={(e) => {
              setShouldEncrypt(e.target.checked);
            }}
          />
          <Text fontSize="12px" fontWeight="bold" lineHeight="16px">
            {`${shouldEncrypt ? 'YES' : 'NO'}`}
          </Text>
        </Flex>
      </Flex>
      {shouldEncrypt && !hasOwnerPublicKey && !keySubmitted && (
        <Flex mt={8} gap="2" direction="column">
          <Flex
            gap="2"
            cursor="pointer"
            onClick={async () => setPublicKey({
              publicKey: (await getPublicEncryptionKey()) || '',
            })}
          >
            <Text
              color="brand.500"
              fontWeight="bold"
              fontSize="16px"
              lineHeight="24px"
            >
              Allow access to your public key and encrypt the applicant form to
              proceed
            </Text>
            <Image src="/ui_icons/brand/chevron_right.svg" />
            {loading && <Loader />}
          </Flex>
          <Flex alignItems="center" gap={2}>
            <Image mt={1} src="/ui_icons/info.svg" />
            <Text
              color="#122224"
              fontWeight="medium"
              fontSize="14px"
              lineHeight="20px"
            >
              By doing the above you’ll have to approve this transaction in your
              wallet.
            </Text>
          </Flex>
          <Link
            href="https://www.notion.so/questbook/Why-is-public-key-required-e3fa53f34a5240d185d3d34744bb33f4"
            isExternal
          >
            <Text
              color="#122224"
              fontWeight="normal"
              fontSize="14px"
              lineHeight="20px"
              decoration="underline"
            >
              Why is this required?
            </Text>
          </Link>
        </Flex>
      )}

      <Flex mt={8} gap="2" justifyContent="space-between">
        <Flex direction="column">
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
        <Flex justifyContent="center" gap={2} alignItems="center">
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

    </Flex>
  );
}

export default GrantRewardsInput;
