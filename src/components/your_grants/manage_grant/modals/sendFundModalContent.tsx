import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  ModalBody, Flex, Image, Text, Button, Heading,
  Divider, Checkbox, Box, Menu, MenuButton, MenuList,
  MenuItem, useToast, Center, CircularProgress, ToastId,
} from '@chakra-ui/react';
import { BigNumber } from 'ethers';
import React, { useEffect } from 'react';
import { useContract, useSigner } from 'wagmi';
import InfoToast from '../../../ui/infoToast';
import { formatAmount, parseAmount } from '../../../../utils/formattingUtils';
import Dropdown from '../../../ui/forms/dropdown';
import SingleLineInput from '../../../ui/forms/singleLineInput';
import ERC20ABI from '../../../../contracts/abi/ERC20.json';
import GrantABI from '../../../../contracts/abi/GrantAbi.json';

interface Props {
  onClose: () => void;
  rewardAsset: {
    address: string;
    committed: BigNumber;
    label: string;
    icon: string;
  };
  contractFunding: string;
  milestones: any[];
  applicationId: string;
  grantId: string;
}

function ModalContent({
  onClose, rewardAsset, contractFunding, milestones, applicationId, grantId,
}: Props) {
  const [checkedItems, setCheckedItems] = React.useState([true, false]);
  const [chosen, setChosen] = React.useState(-1);
  const [selectedMilestone, setSelectedMilestone] = React.useState(-1);
  const [funding, setFunding] = React.useState('');
  const [error, setError] = React.useState(false);

  const [walletBalance, setWalletBalance] = React.useState(0);
  // const toast = useToast();
  const [signerStates] = useSigner();
  const rewardAssetContract = useContract({
    addressOrName: rewardAsset.address ?? '0x0000000000000000000000000000000000000000',
    contractInterface: ERC20ABI,
    signerOrProvider: signerStates.data,
  });

  const grantContract = useContract({
    addressOrName: grantId.length > 0 ? grantId : '0x0000000000000000000000000000000000000000',
    contractInterface: GrantABI,
    signerOrProvider: signerStates.data,
  });

  const toast = useToast();
  const toastRef = React.useRef<ToastId>();
  const [hasClicked, setHasClicked] = React.useState(false);
  const closeToast = () => {
    if (toastRef.current) {
      toast.close(toastRef.current);
    }
  };

  const showToast = ({ link } : { link: string }) => {
    toastRef.current = toast({
      position: 'top',
      render: () => (
        <InfoToast
          link={link}
          close={closeToast}
        />
      ),
    });
  };

  const sendFundsFromContract = async () => {
    if (!milestones[selectedMilestone].id.split('.')[1]) return;
    if (!rewardAsset.address) return;
    if (!parseAmount(funding)) return;
    if (!applicationId) return;

    try {
      setHasClicked(true);
      const transaction = await grantContract.disburseReward(
        applicationId,
        milestones[selectedMilestone].id.split('.')[1],
        rewardAsset.address,
        parseAmount(funding),
      );
      // const transactionData =
      await transaction.wait();
      onClose();
      setHasClicked(false);
      showToast({ link: `https://etherscan.io/tx/${transaction.transactionHash}` });
    } catch (e) {
      setHasClicked(false);
      console.log(e);
      toast({
        title: 'Application update not indexed',
        status: 'error',
      });
    }

    // console.log(transactionData);
    // console.log(transactionData.blockNumber);
  };

  const sendFundsFromWallet = async () => {
    console.log(grantContract);

    console.log(
      applicationId,
      milestones[selectedMilestone].id.split('.')[1],
      rewardAsset.address,
      parseAmount(funding),
    );

    if (!milestones[selectedMilestone].id.split('.')[1]) return;
    if (!rewardAsset.address) return;
    if (!parseAmount(funding)) return;
    if (!applicationId) return;

    setHasClicked(true);
    const txn = await rewardAssetContract.approve(grantContract.address, parseAmount(funding));
    await txn.wait();

    const transaction = await grantContract.disburseRewardP2P(
      applicationId,
      milestones[selectedMilestone].id.split('.')[1],
      rewardAsset.address,
      parseAmount(funding),
    );
    const transactionData = await transaction.wait();
    setHasClicked(false);
    showToast({ link: `https://etherscan.io/tx/${transaction.transactionHash}` });

    console.log(transactionData);
    console.log(transactionData.blockNumber);

    onClose();
  };

  useEffect(() => {
    (async function () {
      try {
        console.log('rewardContract', rewardAssetContract);
        if (!rewardAssetContract.provider) return;
        // const assetDecimal = await rewardAssetContract.decimals();
        // setRewardAssetDecimals(assetDecimal);
        const tempAddress = await signerStates.data?.getAddress();
        const tempWalletBalance = await rewardAssetContract.balanceOf(
          // signerStates.data._address,
          tempAddress,
        );
        console.log('tempAddress', tempAddress);
        console.log(tempWalletBalance);
        setWalletBalance(tempWalletBalance);
      } catch (e) {
        console.error(e);
      }
    }());
  }, [signerStates, rewardAssetContract]);

  return (
    <ModalBody>
      {chosen === -1
      && (
      <Flex direction="column" justify="start" align="start">
        <Heading variant="applicationHeading" mt={4}>Use funds from the grant smart contract</Heading>
        <Flex direction="row" justify="space-between" align="center" w="100%" mt={9}>
          <Flex direction="row" justify="start" align="center">
            <Image src={rewardAsset.icon} />
            <Flex direction="column" ml={2}>
              <Text variant="applicationText" fontWeight="700">Funds Available</Text>
              <Text fontSize="14px" lineHeight="20px" fontWeight="700" color="brand.500">
                {`${formatAmount(contractFunding.toString())} ${rewardAsset?.label}`}
              </Text>
            </Flex>
          </Flex>
          <Checkbox
            m={0}
            p={0}
            colorScheme="brand"
            isChecked={checkedItems[0]}
            onChange={() => setCheckedItems([true, false])}
          />
        </Flex>

        <Divider mt={6} />
        <Heading variant="applicationHeading" mt={6}>Use funds from the wallet linked to your account</Heading>
        <Flex direction="row" justify="space-between" align="center" w="100%" mt={9}>
          <Flex direction="row" justify="start" align="center">
            <Image src={rewardAsset.icon} />
            <Flex direction="column" ml={2}>
              <Text variant="applicationText" fontWeight="700">Funds Available</Text>
              <Text fontSize="14px" lineHeight="20px" fontWeight="700" color="brand.500">
                {`${formatAmount(walletBalance.toString())} ${rewardAsset?.label}`}
              </Text>
            </Flex>
          </Flex>
          <Checkbox
            m={0}
            p={0}
            isChecked={checkedItems[1]}
            onChange={() => setCheckedItems([false, true])}
          />
        </Flex>
        <Divider mt={6} />
        <Button variant="primary" w="100%" my={8} onClick={() => (checkedItems[0] ? setChosen(0) : setChosen(1))}>Continue</Button>
      </Flex>
      )}

      {chosen === 0 && (
        <Flex direction="column" justify="start" align="start">
          <Heading variant="applicationHeading" mt={4}>Sending funds from grant smart contract</Heading>
          <Button mt={1} variant="link" _focus={{}} onClick={() => { setChosen(-1); setSelectedMilestone(-1); setFunding(''); }}>
            <Heading variant="applicationHeading" color="brand.500">Change</Heading>
          </Button>

          <Flex direction="row" justify="start" align="center" mt={6}>
            <Image src={rewardAsset.icon} />
            <Flex direction="column" ml={2}>
              <Text variant="applicationText" fontWeight="700">Funds Available</Text>
              <Text fontSize="14px" lineHeight="20px" fontWeight="700" color="brand.500">
                {`${formatAmount(contractFunding.toString())} ${rewardAsset?.label}`}
              </Text>
            </Flex>
          </Flex>

          <Box mt={8} />
          <Heading variant="applicationHeading" color="#122224">Milestone</Heading>
          <Menu
            matchWidth
          >
            <MenuButton
              w="100%"
              as={Button}
              color="#122224"
              background="#E8E9E9"
              _disabled={{ color: '#A0A7A7', background: '#F3F4F4' }}
              rightIcon={<ChevronDownIcon />}
              textAlign="left"
            >
              <Text
                variant="applicationText"
                color={selectedMilestone === -1 ? '#717A7C' : '#122224'}
              >
                {selectedMilestone === -1 ? 'Select a milestone' : `Milestone ${selectedMilestone + 1}: ${milestones[selectedMilestone].title}`}
              </Text>
            </MenuButton>
            <MenuList>
              {milestones.map((milestone, index) => (
                <MenuItem
                  onClick={() => setSelectedMilestone(index)}
                >
                  Milestone
                  {' '}
                  {index + 1}
                  {': '}
                  {milestone.title}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>

          <Flex direction="row" w="100%" alignItems="flex-end" justify="space-between" mt={8}>
            <Flex w="70%" direction="column">
              <SingleLineInput
                label="Amount to be disbursed"
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
                    icon: rewardAsset?.icon,
                    label: rewardAsset?.label,
                  },
                ]}
              />
            </Flex>
          </Flex>

          { hasClicked ? (
            <Center>
              <CircularProgress isIndeterminate color="brand.500" size="48px" my={10} />
            </Center>
          ) : <Button variant="primary" w="100%" my={10} onClick={sendFundsFromContract}>Send Funds</Button>}

        </Flex>
      )}

      {chosen === 1 && (
      <Flex direction="column" justify="start" align="start">
        <Heading variant="applicationHeading" mt={4}>Sending funds from wallet linked to your account</Heading>
        <Button mt={1} variant="link" _focus={{}} onClick={() => { setChosen(-1); setSelectedMilestone(-1); setFunding(''); }}>
          <Heading variant="applicationHeading" color="brand.500">Change</Heading>
        </Button>

        <Flex direction="row" justify="start" align="center" mt={6}>
          <Image src={rewardAsset.icon} />
          <Flex direction="column" ml={2}>
            <Text variant="applicationText" fontWeight="700">Funds Available</Text>
            <Text fontSize="14px" lineHeight="20px" fontWeight="700" color="brand.500">
              {`${formatAmount(walletBalance.toString())} ${rewardAsset?.label}`}
            </Text>
          </Flex>
        </Flex>

        <Box mt={8} />
        <Heading variant="applicationHeading" color="#122224">Milestone</Heading>
        <Menu matchWidth>
          <MenuButton w="100%" as={Button} rightIcon={<ChevronDownIcon />} textAlign="left">
            <Text
              variant="applicationText"
              color={selectedMilestone === -1 ? '#717A7C' : '#122224'}
            >
              {selectedMilestone === -1 ? 'Select a milestone' : `Milestone ${selectedMilestone + 1}: ${milestones[selectedMilestone].title}`}
            </Text>
          </MenuButton>
          <MenuList>
            {milestones.map((milestone, index) => (
              <MenuItem
                onClick={() => setSelectedMilestone(index)}
              >
                Milestone
                {' '}
                {index + 1}
                {': '}
                {milestone.title}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>

        <Flex direction="row" w="100%" alignItems="flex-end" justify="space-between" mt={8}>
          <Flex w="70%" direction="column">
            <SingleLineInput
              label="Amount to be disbursed"
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
                  icon: rewardAsset?.icon,
                  label: rewardAsset?.label,
                },
              ]}
            />
          </Flex>
        </Flex>

        {hasClicked ? (
          <Center>
            <CircularProgress isIndeterminate color="brand.500" size="48px" my={10} />
          </Center>
        ) : <Button variant="primary" w="100%" my={10} onClick={sendFundsFromWallet}>Send Funds</Button>}

      </Flex>
      )}
    </ModalBody>
  );
}

export default ModalContent;
