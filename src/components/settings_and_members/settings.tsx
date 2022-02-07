import {
  Flex, Text, Image, Button, Box,
} from '@chakra-ui/react';
import React from 'react';
import CoverUpload from '../ui/forms/coverUpload';
import ImageUpload from '../ui/forms/imageUpload';
import MultiLineInput from '../ui/forms/multiLineInput';
import SingleLineInput from '../ui/forms/singleLineInput';

function Settings() {
  return (
    <Flex direction="column" align="start" w="85%">
      <Flex direction="row" w="full" justify="space-between">
        <Text fontStyle="normal" fontWeight="bold" fontSize="18px" lineHeight="26px">Workspace Settings</Text>
        <Button
          leftIcon={<Image src="/ui_icons/see.svg" my={-2} alt="Settings" />}
          fontStyle="normal"
          fontWeight="700"
          fontSize="14px"
          letterSpacing="0.5px"
          lineHeight="20px"
          colorScheme="brand"
          variant="link"
        >
          See profile preview
        </Button>
      </Flex>
      <Flex w="100%" mt={8} alignItems="flex-start">
        <SingleLineInput
          label="Grants DAO Name"
          placeholder="Nouns DAO"
          subtext="Letters, spaces, and numbers are allowed."
          value={undefined}
          onChange={() => {}}
          isError={false}
        />
        <Box ml={9} />
        <ImageUpload
          image={undefined}
          onChange={() => {}}
          onClear={() => {}}
          label="Add a logo"
          subtext="Upload"
        />
      </Flex>
      <Flex w="100%" mt={1}>
        <MultiLineInput
          label="About your Grants DAO"
          placeholder="Sample"
          value={undefined}
          onChange={() => {}}
          isError={false}
          maxLength={500}
          subtext={null}
        />
      </Flex>
      <Flex w="100%" mt={1}>
        <SingleLineInput
          label="Network"
          placeholder="Network"
          value="Ethereum"
          onChange={() => {}}
          isError={false}
          disabled
        />
      </Flex>
      <Flex w="100%" mt={10}>
        <CoverUpload label="Other Details" subtext="Upload a cover" />
      </Flex>
      <Flex w="100%" mt={8} alignItems="flex-start">
        <SingleLineInput
          label="Twitter Handle"
          placeholder="@ethereum"
          subtext=""
          value={undefined}
          onChange={() => {}}
          isError={false}
        />
      </Flex>
      <Flex w="100%" mt={8} alignItems="flex-start">
        <SingleLineInput
          label="Discord Server Link"
          placeholder="@ethereum"
          subtext=""
          value={undefined}
          onChange={() => {}}
          isError={false}
        />
      </Flex>
      <Flex w="100%" mt={8} alignItems="flex-start">
        <SingleLineInput
          label="Telegram Channel"
          placeholder="www.telegram.com"
          subtext=""
          value={undefined}
          onChange={() => {}}
          isError={false}
        />
      </Flex>
      <Flex direction="row" justify="start" mt={10}>
        <Button variant="primary">Save changes</Button>
        <Box mr={14} />
        <Button
          leftIcon={<Image src="/ui_icons/see.svg" my={-2} alt="Settings" />}
          fontStyle="normal"
          fontWeight="700"
          fontSize="14px"
          letterSpacing="0.5px"
          lineHeight="20px"
          colorScheme="brand"
          variant="link"
        >
          See profile preview
        </Button>
      </Flex>
      <Box my={10} />
    </Flex>
  );
}

export default Settings;
