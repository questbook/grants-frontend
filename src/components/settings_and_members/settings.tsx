import { Flex, Text, Image, Button, Box } from '@chakra-ui/react';
import React, { useEffect, useContext } from 'react';
import { useContract, useSigner } from 'wagmi';
import config from '../../constants/config';
import WorkspaceRegistryABI from '../../contracts/abi/WorkspaceRegistryAbi.json';
import EditForm from './edit_form';
import { getUrlForIPFSHash, uploadToIPFS } from '../../utils/ipfsUtils';
import { ApiClientsContext } from '../../../pages/_app';

interface Props {
  workspaceData: any;
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
  } | null>(null);

  const [signerStates] = useSigner();

  const contract = useContract({
    addressOrName: config.WorkspaceRegistryAddress,
    contractInterface: WorkspaceRegistryABI,
    signerOrProvider: signerStates.data,
  });

  const apiClients = useContext(ApiClientsContext);

  const handleFormSubmit = async (data: {
    name: string;
    about: string;
    image?: File;
    coverImage?: File;
    twitterHandle?: string;
    discordHandle?: string;
    telegramChannel?: string;
  }) => {
    if (!apiClients) return;
    const { subgraphClient, validatorApi } = apiClients;
    let imageHash = workspaceData.logoIpfsHash;
    let coverImageHash = workspaceData.coverImageIpfsHash;
    const socials = [];

    console.log('check', data.image);
    if (data.image) {
      imageHash = await uploadToIPFS(data.image);
      imageHash = imageHash.hash;
    }
    if (data.coverImage) {
      coverImageHash = await uploadToIPFS(data.coverImage);
      coverImageHash = coverImageHash.hash;
    }

    if (data.twitterHandle) {
      socials.push({ name: 'twitter', value: data.twitterHandle });
    }
    if (data.discordHandle) {
      socials.push({ name: 'discord', value: data.discordHandle });
    }
    if (data.telegramChannel) {
      socials.push({ name: 'telegram', value: data.telegramChannel });
    }

    const {
      data: { ipfsHash },
    } = await validatorApi.validateWorkspaceUpdate({
      title: data.name,
      about: data.about,
      logoIpfsHash: imageHash,
      coverImageIpfsHash: coverImageHash,
      socials,
    });

    const workspaceID = Number(workspaceData.id);
    const ret = await contract.updateWorkspaceMetadata(workspaceID, ipfsHash);
    console.log(ret);
  };

  useEffect(() => {
    if (!workspaceData) return;
    if (Object.keys(workspaceData).length === 0) return;
    const twitterSocial = workspaceData.socials.filter((socials) => socials.name === 'twitter');
    const twitterHandle = twitterSocial.length > 0 ? twitterSocial[0].value : null;
    const discordSocial = workspaceData.socials.filter((socials) => socials.name === 'discord');
    const discordHandle = discordSocial.length > 0 ? discordSocial[0].value : null;
    const telegramSocial = workspaceData.socials.filter((socials) => socials.name === 'telegram');
    const telegramChannel = telegramSocial.length > 0 ? telegramSocial[0].value : null;
    console.log('loaded', workspaceData);
    console.log(getUrlForIPFSHash(workspaceData?.logoIpfsHash));
    setFormData({
      name: workspaceData.title,
      about: workspaceData.about,
      image: getUrlForIPFSHash(workspaceData?.logoIpfsHash),
      supportedNetwork: workspaceData.supportedNetworks[0],
      coverImage: getUrlForIPFSHash(workspaceData?.coverImageIpfsHash),
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
      <EditForm onSubmit={handleFormSubmit} formData={formData} />
      <Box my={10} />
    </Flex>
  );
}

export default Settings;
