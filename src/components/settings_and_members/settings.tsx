import {
  Flex, Text, Image, Button, Box,
} from '@chakra-ui/react';
import React from 'react';
import EditForm from './edit_form';

function Settings() {
  // const [, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState<{
    name: string;
    about: string;
    image?: string;
    coverImage?: string;
    twitterHandle?: string;
    discordHandle?: string;
    telegramChannel?: string;
  } | null>(null);

  const handleFormSubmit = async (data: {
    name: string;
    about: string,
    image?: string,
    coverImage?: string,
    twitterHandle?: string,
    discordHandle?: string,
    telegramChannel?: string, }) => {
    setFormData(data);
    // setLoading(true);

    console.log(formData);

    // setLoading(false);
  };

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
      <EditForm onSubmit={handleFormSubmit} />

      <Box my={10} />
    </Flex>
  );
}

export default Settings;
