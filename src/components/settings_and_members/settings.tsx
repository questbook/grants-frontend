import {
  Flex, Text, Box, useToast, ToastId,
} from '@chakra-ui/react';
import React, { useEffect, useContext } from 'react';
import { useContract, useSigner } from 'wagmi';
import { Workspace } from 'src/types';
import useIsCorrectNetworkSelected from 'src/hooks/useIsCorrectNetwork';
import { CHAIN_INFO } from 'src/constants/chainInfo';
import { useToastContext } from 'src/context/toastContext';
import config from '../../constants/config';
import WorkspaceRegistryABI from '../../contracts/abi/WorkspaceRegistryAbi.json';
import EditForm from './edit_form';
import { getUrlForIPFSHash, uploadToIPFS } from '../../utils/ipfsUtils';
import { ApiClientsContext } from '../../../pages/_app';
import InfoToast from '../ui/infoToast';

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

  const [signerStates] = useSigner();
  const { showErrorToast } = useToastContext();

  const contract = useContract({
    addressOrName: config.WorkspaceRegistryAddress,
    contractInterface: WorkspaceRegistryABI,
    signerOrProvider: signerStates.data,
  });

  const apiClients = useContext(ApiClientsContext);

  const [hasClicked, setHasClicked] = React.useState(false);
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
  const isCorrectNetworkSelected = useIsCorrectNetworkSelected(apiClients?.chainId);

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

      if (!isCorrectNetworkSelected && apiClients && apiClients.chainId) {
        throw Error(`You are on the wrong network. Please switch to ${CHAIN_INFO[apiClients.chainId].name}`);
      }

      let imageHash = workspaceData.logoIpfsHash;
      let coverImageHash = workspaceData.coverImageIpfsHash;
      const socials = [];

      if (data.image) {
        imageHash = (await uploadToIPFS(data.image)).hash;
      }
      if (data.coverImage) {
        coverImageHash = (await uploadToIPFS(data.coverImage)).hash;
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

      const workspaceID = Number(workspaceData?.id);

      const txn = await contract.updateWorkspaceMetadata(workspaceID, ipfsHash);
      const transactionData = await txn.wait();
      setHasClicked(false);
      window.location.reload();

      showToast({ link: `https://etherscan.io/tx/${transactionData.transactionHash}` });
    } catch (error: any) {
      setHasClicked(false);
      // console.log(error);
      showErrorToast(error.message as string);
    }
    // await subgraphClient.waitForBlock(transactionData.blockNumber);
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
