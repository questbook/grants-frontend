import {
  Flex, Box, Button, Text, Image, Link, CircularProgress, Center,
} from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useNetwork } from 'wagmi';
import ImageUpload from '../../ui/forms/imageUpload';
import MultiLineInput from '../../ui/forms/multiLineInput';
import SingleLineInput from '../../ui/forms/singleLineInput';
import Tooltip from '../../ui/tooltip';
import supportedNetworks from '../../../constants/supportedNetworks.json';

function Form({
  hasClicked,
  onSubmit: onFormSubmit,
}: {
  onSubmit: (data: { name: string; description: string; image: File, network: string }) => void;
  hasClicked: boolean;
}) {
  const [{ data: networkData }] = useNetwork();
  const [networkSupported, setNetworkSupported] = React.useState(false);

  useEffect(() => {
    if (!networkData.chain || !networkData.chain.id) {
      return;
    }
    const supportedChainIds = Object.keys(supportedNetworks);
    const isSupported = supportedChainIds.includes(networkData.chain.id.toString());
    setNetworkSupported(isSupported);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!networkData.chain || !networkData.chain.id) {
      return;
    }
    const supportedChainIds = Object.keys(supportedNetworks);
    const isSupported = supportedChainIds.includes(networkData.chain.id.toString());
    setNetworkSupported(isSupported);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [networkData]);

  const [daoName, setDaoName] = React.useState('');
  const [daoNameError, setDaoNameError] = React.useState(false);

  const [daoDescription, setDaoDescription] = React.useState('');
  const [daoDescriptionError, setDaoDescriptionError] = React.useState(false);

  const [image, setImage] = React.useState<string | null>(null);
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [imageError, setImageError] = React.useState(false);
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // console.log(event.target.files);
    if (event.target.files && event.target.files[0]) {
      const img = event.target.files[0];
      setImageFile(img);
      setImage(URL.createObjectURL(img));
      setImageError(false);
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
    if (!networkSupported) {
      error = true;
    }
    if (image === null || imageFile === null) {
      setImageError(true);
      error = true;
    }

    if (error) return;

    onFormSubmit({
      name: daoName,
      description: daoDescription,
      image: imageFile!,
      network: networkData.chain!.id.toString(),
    });
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
            isError={imageError}
          />
        </Flex>
        <Flex w="100%" mt={1}>
          <MultiLineInput
            label="About your Grants DAO"
            placeholder="A summary about your Grants DAO containing your mission statement and grant focus areas"
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
            value={networkSupported ? (
              supportedNetworks[
                networkData.chain?.id.toString() as keyof typeof supportedNetworks
              ].name
            ) : 'Network not supported'}
            onChange={() => {}}
            isError={false}
            disabled
            inputRightElement={(
              <Tooltip
                icon="/ui_icons/error.svg"
                label={networkSupported ? (
                  `Your wallet is connected to the ${supportedNetworks[
                    networkData.chain?.id.toString() as keyof typeof supportedNetworks
                  ].name} Network. Your GrantsDAO will be created on the same network.
    To create a GrantsDAO on another network, connect a different wallet.`
                ) : 'Select a supported network'}
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
        By pressing continue you&apos;ll have to approve this transaction in your wallet.
        {' '}
        <Link mx={1} href="https://www.notion.so/questbook/FAQs-206fbcbf55fc482593ef6914f8e04a46" target="_blank">
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

      {hasClicked ? (
        <Center>
          <CircularProgress isIndeterminate color="brand.500" size="48px" mt={4} />
        </Center>
      ) : (
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
      )}
    </>
  );
}

export default Form;
