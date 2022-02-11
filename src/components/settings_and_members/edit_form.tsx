import {
  Box, Button, Flex, Image,
} from '@chakra-ui/react';
import React from 'react';
import CoverUpload from '../ui/forms/coverUpload';
import ImageUpload from '../ui/forms/imageUpload';
import MultiLineInput from '../ui/forms/multiLineInput';
import SingleLineInput from '../ui/forms/singleLineInput';

function EditForm({
  onSubmit: onFormSubmit,
}: {
  onSubmit: (data: {
    name: string;
    about: string;
    image?: string;
    coverImage?: string;
    twitterHandle?: string;
    discordHandle?: string;
    telegramChannel?: string;
  }) => void;
}) {
  const [daoName, setDaoName] = React.useState('');
  const [daoNameError, setDaoNameError] = React.useState(false);

  const [daoAbout, setDaoAbout] = React.useState('');
  const [daoAboutError, setDaoAboutError] = React.useState(false);

  const [image, setImage] = React.useState<string | null>(null);

  const [twitterHandle, setTwitterHandle] = React.useState('');
  const [twitterHandleError, setTwitterHandleError] = React.useState(false);

  const [discordHandle, setDiscordHandle] = React.useState('');
  const [discordHandleError, setDiscordHandleError] = React.useState(false);

  const [telegramChannel, setTelegramChannel] = React.useState('');
  const [telegramChannelError, setTelegramChannelError] = React.useState(false);

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
    if (!daoAbout || daoAbout.length === 0) {
      setDaoAboutError(true);
      error = true;
    }

    if (!error) {
      onFormSubmit({
        name: daoName,
        about: daoAbout,
        // image: image === null ? undefined : image,
      });
    }
  };

  return (
    <>
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
        />
        <Box ml={9} />
        <ImageUpload
          image={image}
          isError={false}
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
          value={daoAbout}
          onChange={(e) => {
            if (daoAboutError) setDaoAboutError(false);
            setDaoAbout(e.target.value);
          }}
          isError={daoAboutError}
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
          value={twitterHandle}
          onChange={(e) => {
            if (twitterHandleError) setTwitterHandleError(false);
            setTwitterHandle(e.target.value);
          }}
          isError={twitterHandleError}
        />
      </Flex>
      <Flex w="100%" mt={8} alignItems="flex-start">
        <SingleLineInput
          label="Discord Server Link"
          placeholder="@ethereum"
          subtext=""
          value={discordHandle}
          onChange={(e) => {
            if (discordHandleError) setDiscordHandleError(false);
            setDiscordHandle(e.target.value);
          }}
          isError={discordHandleError}
        />
      </Flex>
      <Flex w="100%" mt={8} alignItems="flex-start">
        <SingleLineInput
          label="Telegram Channel"
          placeholder="www.telegram.com"
          subtext=""
          value={telegramChannel}
          onChange={(e) => {
            if (telegramChannelError) setTelegramChannelError(false);
            setTelegramChannel(e.target.value);
          }}
          isError={telegramChannelError}
        />
      </Flex>
      <Flex direction="row" justify="start" mt={10}>
        <Button variant="primary" onClick={handleSubmit}>
          Save changes
        </Button>
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
    </>
  );
}

export default EditForm;
