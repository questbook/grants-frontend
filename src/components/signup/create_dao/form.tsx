import {
  Flex, Box, Button, Text, Image, Link,
} from '@chakra-ui/react';
import React from 'react';
import { useNetwork } from 'wagmi';
import ImageUpload from '../../ui/forms/imageUpload';
import MultiLineInput from '../../ui/forms/multiLineInput';
import SingleLineInput from '../../ui/forms/singleLineInput';
import Tooltip from '../../ui/tooltip';
import supportedNetworks from '../../../constants/supportedNetworks.json';

function Form({
  onSubmit: onFormSubmit,
}: {
  onSubmit: (data: { name: string; description: string; image?: string, network: string }) => void;
}) {
  const [{ data: networkData }] = useNetwork();

  const [daoName, setDaoName] = React.useState('');
  const [daoNameError, setDaoNameError] = React.useState(false);

  const [daoDescription, setDaoDescription] = React.useState('');
  const [daoDescriptionError, setDaoDescriptionError] = React.useState(false);

  const [image, setImage] = React.useState<string | null>(null);
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const img = event.target.files[0];
      setImage(URL.createObjectURL(img));
    }
  };

  const handleSubmit = () => {
    let error = false;
    if (!daoName || daoName.length === 0) {
      setDaoNameError(true);
      error = true;
    }
    if (!daoDescription || daoDescription.length === 0) {
      setDaoDescriptionError(true);
      error = true;
    }

    if (!error) {
      onFormSubmit({
        name: daoName,
        description: daoDescription,
        image: image === null ? undefined : image,
        network: supportedNetworks[
          networkData.chain?.id.toString() as keyof typeof supportedNetworks
        ].name,
      });
    }
  };

  return (
    <>
      <Flex mt={8} w="100%" maxW="502px" flexDirection="column">
        <Flex w="100%" mt={8} alignItems="flex-start">
          <SingleLineInput
            label="Grants DAO Name"
            placeholder="Nouns DAO"
            subtext="Letters, spaces, and numbers are allowed."
            value={daoName}
            onChange={(e) => {
              if (daoNameError) setDaoNameError(false);
              setDaoName(e.target.value);
            }}
            isError={daoNameError}
            errorText="Required"
          />
          <Box ml={9} />
          <ImageUpload
            image={image}
            onChange={handleImageChange}
            onClear={() => setImage(null)}
            label="Add a logo"
            subtext="Upload"
          />
        </Flex>
        <Flex w="100%" mt={1}>
          <MultiLineInput
            label="About your Grants DAO"
            placeholder="Sample"
            value={daoDescription}
            onChange={(e) => {
              if (daoDescriptionError) setDaoDescriptionError(false);
              setDaoDescription(e.target.value);
            }}
            isError={daoDescriptionError}
            errorText="Required"
            maxLength={500}
          />
        </Flex>
        <Flex w="100%" mt={1}>
          <SingleLineInput
            label="Network"
            placeholder="Network"
            value={supportedNetworks[
              networkData.chain?.id.toString() as keyof typeof supportedNetworks
            ].name}
            onChange={() => {}}
            isError={false}
            disabled
            inputRightElement={(
              <Tooltip
                icon="/ui_icons/error.svg"
                label={`Your wallet is connected to the ${supportedNetworks[
                  networkData.chain?.id.toString() as keyof typeof supportedNetworks
                ].name}. Your GrantsDAO will be created on the same network.
  To create a GrantsDAO on another network, connect a different wallet.`}
              />
            )}
          />
        </Flex>
      </Flex>

      <Text display="flex" alignItems="center" variant="footer" mt="51px">
        <Image
          mr={1}
          display="inline-block"
          h="14px"
          w="14px"
          src="/ui_icons/info_brand.svg"
        />
        {' '}
        By pressing continue you&apos;ll be charged a gas fee.
        {' '}
        <Link mx={1} href="wallet">
          Learn more
          <Image
            ml={1}
            display="inline-block"
            h="10px"
            w="10px"
            src="/ui_icons/link.svg"
          />
        </Link>
      </Text>

      <Button
        onClick={handleSubmit}
        w="100%"
        maxW="502px"
        variant="primary"
        mt={5}
        mb={16}
      >
        Create Grants DAO
      </Button>
    </>
  );
}

export default Form;
