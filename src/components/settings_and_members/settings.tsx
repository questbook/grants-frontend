import {
  Flex, Text, Box,
} from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { Workspace } from 'src/types';
import { useDaoContext } from 'src/context/daoContext';
import EditForm from './edit_form';
import { getUrlForIPFSHash } from '../../utils/ipfsUtils';

interface Props {
  workspaceData: Workspace;
}

function Settings({
  workspaceData,
}: Props) {
  // const [, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState<{
    name: string;
    about: string;
    supportedNetwork: string;
    image?: string;
    coverImage?: string;
    twitterHandle?: string;
    discordHandle?: string;
    telegramChannel?: string;
  } | null>();

  const { editWorkspace, hasClicked } = useDaoContext();
  const handleFormSubmit = async (data: {
    name: string;
    about: string;
    image?: File;
    coverImage?: File;
    twitterHandle?: string;
    discordHandle?: string;
    telegramChannel?: string;
  }) => {
    await editWorkspace(data, workspaceData);
  };

  useEffect(() => {
    if (!workspaceData) return;
    if (Object.keys(workspaceData).length === 0) return;
    const twitterSocial = workspaceData.socials.filter((socials: any) => socials.name === 'twitter');
    const twitterHandle = twitterSocial.length > 0 ? twitterSocial[0].value : undefined;
    const discordSocial = workspaceData.socials.filter((socials: any) => socials.name === 'discord');
    const discordHandle = discordSocial.length > 0 ? discordSocial[0].value : undefined;
    const telegramSocial = workspaceData.socials.filter((socials: any) => socials.name === 'telegram');
    const telegramChannel = telegramSocial.length > 0 ? telegramSocial[0].value : undefined;
    // console.log('loaded', workspaceData);
    // console.log(getUrlForIPFSHash(workspaceData?.logoIpfsHash));
    setFormData({
      name: workspaceData.title,
      about: workspaceData.about,
      image: getUrlForIPFSHash(workspaceData?.logoIpfsHash),
      supportedNetwork: workspaceData.supportedNetworks[0],
      coverImage: getUrlForIPFSHash(workspaceData.coverImageIpfsHash || ''),
      twitterHandle,
      discordHandle,
      telegramChannel,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceData]);

  return (
    <Flex direction="column" align="start" w="85%">
      <Flex direction="row" w="full" justify="space-between">
        <Text
          fontStyle="normal"
          fontWeight="bold"
          fontSize="18px"
          lineHeight="26px"
        >
          Workspace Settings
        </Text>
      </Flex>
      <EditForm hasClicked={hasClicked} onSubmit={handleFormSubmit} formData={formData} />
      <Box my={10} />
    </Flex>
  );
}

export default Settings;
