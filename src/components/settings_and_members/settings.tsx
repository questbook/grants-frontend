import {
  Flex, Text, Box, useToast, ToastId,
} from '@chakra-ui/react';
import React, { useEffect, useContext } from 'react';
import { useContract, useSigner } from 'wagmi';
import config from '../../constants/config';
import WorkspaceRegistryABI from '../../contracts/abi/WorkspaceRegistryAbi.json';
import EditForm from './edit_form';
import { getUrlForIPFSHash, uploadToIPFS } from '../../utils/ipfsUtils';
import { ApiClientsContext } from '../../../pages/_app';
import InfoToast from '../ui/infoToast';

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

  const [hasClicked, setHasClicked] = React.useState(false);
  useEffect(() => {
    console.log(hasClicked);
  }, [hasClicked]);
  const toastRef = React.useRef<ToastId>();
  const toast = useToast();

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
    try {
      const { validatorApi } = apiClients;
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

      setHasClicked(true);
      const {
        data: { ipfsHash },
      } = await validatorApi.validateWorkspaceUpdate(coverImageHash ? {
        title: data.name,
        about: data.about,
        logoIpfsHash: imageHash,
        coverImageIpfsHash: coverImageHash,
        socials,
      } : {
        title: data.name,
        about: data.about,
        logoIpfsHash: imageHash,
        socials,
      });

      const workspaceID = Number(workspaceData.id);

      // toast({
      //   title: 'Updating workspace',
      //   status: 'info',
      //   duration: 100000,
      // });

      const txn = await contract.updateWorkspaceMetadata(workspaceID, ipfsHash);
      console.log(txn);
      const transactionData = await txn.wait();
      console.log(transactionData.blockNumber);
      setHasClicked(false);
      window.location.reload();

      showToast({ link: `https://etherscan.io/tx/${transactionData.transactionHash}` });
    } catch (error) {
      setHasClicked(false);
      console.log(error);
      toast({
        title: 'Application update not indexed',
        status: 'error',
      });
    }
    // await subgraphClient.waitForBlock(transactionData.blockNumber);
  };

  useEffect(() => {
    if (!workspaceData) return;
    if (Object.keys(workspaceData).length === 0) return;
    const twitterSocial = workspaceData.socials.filter((socials: any) => socials.name === 'twitter');
    const twitterHandle = twitterSocial.length > 0 ? twitterSocial[0].value : null;
    const discordSocial = workspaceData.socials.filter((socials: any) => socials.name === 'discord');
    const discordHandle = discordSocial.length > 0 ? discordSocial[0].value : null;
    const telegramSocial = workspaceData.socials.filter((socials: any) => socials.name === 'telegram');
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
      <EditForm hasClicked={hasClicked} onSubmit={handleFormSubmit} formData={formData} />
      <Box my={10} />
    </Flex>
  );
}

export default Settings;
