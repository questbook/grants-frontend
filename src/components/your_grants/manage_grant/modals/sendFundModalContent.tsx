import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  ModalBody, Flex, Image, Text, Button, Heading,
  Divider, Checkbox, Box, Menu, MenuButton, MenuList, MenuItem,
} from '@chakra-ui/react';
import React from 'react';
import Dropdown from '../../../ui/forms/dropdown';
import SingleLineInput from '../../../ui/forms/singleLineInput';

interface Props {
  onClose: () => void;
}

function ModalContent({
  onClose,
}: Props) {
  const [checkedItems, setCheckedItems] = React.useState([false, false]);
  const [chosen, setChosen] = React.useState(-1);
  const [selectedMilestone, setSelectedMilestone] = React.useState(-1);
  const [funding, setFunding] = React.useState('');
  const [error, setError] = React.useState(false);

  const milestones = [1, 2, 3, 4, 5];
  const walletBalance = 2;
  const contractBalance = 40;

  return (
    <ModalBody>
      {chosen === -1
      && (
      <Flex direction="column" justify="start" align="start">
        <Heading variant="applicationHeading" mt={4}>Use funds from the grant smart contract</Heading>
        <Flex direction="row" justify="space-between" align="center" w="100%" mt={9}>
          <Flex direction="row" justify="start" align="center">
            <Image src="/images/dummy/Ethereum Icon.svg" />
            <Flex direction="column" ml={2}>
              <Text variant="applicationText" fontWeight="700">Funds Available</Text>
              <Text fontSize="14px" lineHeight="20px" fontWeight="700" color="brand.500">
                {contractBalance}
                {' '}
                ETH
              </Text>
            </Flex>
          </Flex>
          <Checkbox
            m={0}
            p={0}
            isChecked={checkedItems[0]}
            onChange={() => setCheckedItems([true, false])}
          />
        </Flex>

        <Divider mt={6} />
        <Heading variant="applicationHeading" mt={6}>Use funds from the wallet linked to your account</Heading>
        <Flex direction="row" justify="space-between" align="center" w="100%" mt={9}>
          <Flex direction="row" justify="start" align="center">
            <Image src="/images/dummy/Ethereum Icon.svg" />
            <Flex direction="column" ml={2}>
              <Text variant="applicationText" fontWeight="700">Funds Available</Text>
              <Text fontSize="14px" lineHeight="20px" fontWeight="700" color="brand.500">
                {walletBalance}
                {' '}
                ETH
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
            <Image src="/images/dummy/Ethereum Icon.svg" />
            <Flex direction="column" ml={2}>
              <Text variant="applicationText" fontWeight="700">Funds Available</Text>
              <Text fontSize="14px" lineHeight="20px" fontWeight="700" color="brand.500">
                {contractBalance}
                {' '}
                ETH
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
                {selectedMilestone === -1 ? 'Select a milestone' : `Milestone ${milestones[selectedMilestone]}`}
              </Text>
            </MenuButton>
            <MenuList>
              {milestones.map((milestone, index) => (
                <MenuItem
                  onClick={() => setSelectedMilestone(index)}
                >
                  Milestone
                  {' '}
                  {milestone}
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
                    icon: '/images/dummy/Ethereum Icon.svg',
                    label: 'ETH',
                  },
                ]}
              />
            </Flex>
          </Flex>

          <Button variant="primary" w="100%" my={10} onClick={onClose}>Send Funds</Button>

        </Flex>
      )}

      {chosen === 1 && (
      <Flex direction="column" justify="start" align="start">
        <Heading variant="applicationHeading" mt={4}>Sending funds from wallet linked to your account</Heading>
        <Button mt={1} variant="link" _focus={{}} onClick={() => { setChosen(-1); setSelectedMilestone(-1); setFunding(''); }}>
          <Heading variant="applicationHeading" color="brand.500">Change</Heading>
        </Button>

        <Flex direction="row" justify="start" align="center" mt={6}>
          <Image src="/images/dummy/Ethereum Icon.svg" />
          <Flex direction="column" ml={2}>
            <Text variant="applicationText" fontWeight="700">Funds Available</Text>
            <Text fontSize="14px" lineHeight="20px" fontWeight="700" color="brand.500">
              {walletBalance}
              {' '}
              ETH
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
              {selectedMilestone === -1 ? 'Select a milestone' : `Milestone ${milestones[selectedMilestone]}`}
            </Text>
          </MenuButton>
          <MenuList>
            {milestones.map((milestone, index) => (
              <MenuItem
                onClick={() => setSelectedMilestone(index)}
              >
                Milestone
                {' '}
                {milestone}
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
                  icon: '/images/dummy/Ethereum Icon.svg',
                  label: 'ETH',
                },
              ]}
            />
          </Flex>
        </Flex>

        <Button variant="primary" w="100%" my={10} onClick={onClose}>Send Funds</Button>

      </Flex>
      )}
    </ModalBody>
  );
}

export default ModalContent;
