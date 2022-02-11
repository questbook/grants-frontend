import { Container, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { ReactElement, useContext } from 'react';
import { useAccount, useContract, useSigner } from 'wagmi';
import { SupportedNetwork } from '@questbook/service-validator-client';
import { gql } from '@apollo/client';
import Form from '../src/components/signup/create_dao/form';
import Loading from '../src/components/signup/create_dao/loading';
import CreateGrant from '../src/components/signup/create_grant';
import DaoCreated from '../src/components/signup/daoCreated';
import WorkspaceRegistryABI from '../src/contracts/abi/WorkspaceRegistryAbi.json';
import GrantFactoryABI from '../src/contracts/abi/GrantFactoryAbi.json';
import Tooltip from '../src/components/ui/tooltip';
import NavbarLayout from '../src/layout/navbarLayout';
import { ApiClientsContext } from './_app';
import config from '../src/constants/config';
import { uploadToIPFS } from '../src/utils/ipfsUtils';
import { getWorkspacesQuery } from '../src/graphql/workspaceQueries';
import { parseAmount } from '../src/utils/formattingUtils';

function SignupDao() {
  const [{ data: accountData }] = useAccount();
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [daoCreated, setDaoCreated] = React.useState(false);
  const [creatingGrant, setCreatingGrant] = React.useState(false);

  const [daoData, setDaoData] = React.useState<{
    name: string;
    description: string;
    image: string;
    network: string;
    id: string;
  } | null>(null);

  const apiClients = useContext(ApiClientsContext);
  const [signerStates] = useSigner();
  const workspaceFactoryContract = useContract({
    addressOrName: config.WorkspaceRegistryAddress,
    contractInterface: WorkspaceRegistryABI,
    signerOrProvider: signerStates.data,
  });

  const grantContract = useContract({
    addressOrName: config.GrantFactoryAddress,
    contractInterface: GrantFactoryABI,
    signerOrProvider: signerStates.data,
  });
  const handleFormSubmit = async (data: {
    name: string;
    description: string;
    image: File;
    network: string;
  }) => {
    try {
      if (!accountData || !accountData.address) {
        return;
      }
      if (!apiClients) return;

      setLoading(true);
      const { subgraphClient, validatorApi } = apiClients;

      const imageHash = await uploadToIPFS(data.image);
      console.log(imageHash);

      const {
        data: { ipfsHash },
      } = await validatorApi.validateWorkspaceCreate({
        title: data.name,
        about: data.description,
        logoIpfsHash: imageHash.hash,
        creatorId: accountData.address,
        socials: [],
        supportedNetworks: [data.network as SupportedNetwork],
      });

      // console.log(url);
      console.log(ipfsHash);

      const transaction = await workspaceFactoryContract.createWorkspace(ipfsHash);
      // console.log(ret);
      const transactionData = await transaction.wait();

      console.log(transactionData);
      console.log(transactionData.blockNumber);

      await subgraphClient.waitForBlock(transactionData.blockNumber);

      const { data: createdWorkspaceData } = (await subgraphClient.client.query(
        {
          query: gql(getWorkspacesQuery),
          variables: {
            ownerId: accountData.address,
          },
        },
      )) as any;
      // console.log(data);
      if (createdWorkspaceData.workspaces.length > 0) {
        const newId = createdWorkspaceData.workspaces[
          createdWorkspaceData.workspaces.length - 1
        ].id;
        // if (newId.length % 2 === 1) {
        //   newId = `0x0${newId.slice(2)}`;
        // }
        setDaoData({
          ...data,
          image: imageHash.hash,
          id: Number(newId).toString(),
        });
        setLoading(false);
        setDaoCreated(true);
      } else {
        throw new Error('Workspace not indexed');
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const handleGrantSubmit = async (data: any) => {
    if (!accountData || !accountData.address || !daoData) {
      return;
    }
    if (!apiClients) return;

    setCreatingGrant(true);
    const { subgraphClient, validatorApi } = apiClients;

    console.log(data);

    const {
      data: { ipfsHash },
    } = await validatorApi.validateGrantCreate({
      title: data.title,
      summary: data.summary,
      details: data.details,
      deadline: data.date,
      reward: {
        committed: parseAmount(data.reward),
        asset: data.rewardCurrencyAddress,
      },
      creatorId: accountData.address,
      workspaceId: daoData!.id,
      fields: data.fields,
    });

    console.log(ipfsHash);

    const transaction = await grantContract.createGrant(
      daoData!.id,
      ipfsHash,
      config.WorkspaceRegistryAddress,
      config.ApplicationRegistryAddress,
    );
    const transactionData = await transaction.wait();

    console.log(transactionData);
    console.log(transactionData.blockNumber);

    await subgraphClient.waitForBlock(transactionData.blockNumber);

    router.push('/your_grants');
  };

  if (creatingGrant) {
    return <CreateGrant onSubmit={handleGrantSubmit} />;
  }

  if (daoCreated && daoData) {
    return (
      <DaoCreated
        daoName={daoData.name}
        network={daoData.network}
        onCreateGrantClick={() => setCreatingGrant(true)}
        onVisitGrantsClick={() => router.push('/your_grants')}
      />
    );
  }

  if (loading) {
    return <Loading />;
  }
  return (
    <Container
      maxW="100%"
      display="flex"
      px="70px"
      flexDirection="column"
      alignItems="center"
    >
      <Text mt="46px" variant="heading">
        What should we call your Grants DAO?
      </Text>
      <Text mt={7} maxW="676px" textAlign="center">
        A Grants DAO
        <Tooltip
          icon="/ui_icons/tooltip_questionmark_brand.svg"
          label="Crypto wallet is an application or hardware device that allows users to store and retrieve digital assets."
        />
        allows you and your team to manage grants, funds and applicants - all in
        a single neatly arranged space.
      </Text>
      <Form onSubmit={handleFormSubmit} />
    </Container>
  );
}

SignupDao.getLayout = function getLayout(page: ReactElement) {
  return <NavbarLayout renderTabs={false}>{page}</NavbarLayout>;
};

export default SignupDao;
