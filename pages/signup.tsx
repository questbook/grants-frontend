import { Container, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { ReactElement, useContext } from 'react';
import { useAccount, useContract, useSigner } from 'wagmi';
import { SupportedNetwork } from '@questbook/service-validator-client';
import Form from '../src/components/signup/create_dao/form';
import Loading from '../src/components/signup/create_dao/loading';
import CreateGrant from '../src/components/signup/create_grant';
import DaoCreated from '../src/components/signup/daoCreated';
import WorkspaceRegistryABI from '../src/contracts/abi/WorkspaceRegistryAbi.json';
import Tooltip from '../src/components/ui/tooltip';
import NavbarLayout from '../src/layout/navbarLayout';
import { ApiClientsContext } from './_app';
import config from '../src/constants/config';
import { uploadToIPFS } from '../src/utils/ipfsUtils';

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
  } | null>(null);

  const apiClients = useContext(ApiClientsContext);
  const [signerStates] = useSigner();
  const contract = useContract({
    addressOrName: config.WorkspaceRegistryAddress,
    contractInterface: WorkspaceRegistryABI,
    signerOrProvider: signerStates.data,
  });
  const handleFormSubmit = async (data: {
    name: string;
    description: string;
    image: File;
    network: string;
  }) => {
    if (!accountData || !accountData.address) {
      return;
    }
    if (!apiClients) return;

    setLoading(true);
    const { subgraphClient, validatorApi } = apiClients;

    const imageHash = await uploadToIPFS(data.image);
    console.log(imageHash);

    const { data: { ipfsHash } } = await validatorApi.validateWorkspaceCreate({
      title: data.name,
      about: data.description,
      logoIpfsHash: imageHash.hash,
      creatorId: accountData.address,
      socials: [],
      supportedNetworks: [data.network as SupportedNetwork],
    });

    // console.log(url);
    console.log(ipfsHash);

    const transaction = await contract.createWorkspace(ipfsHash);
    // console.log(ret);
    const transactionData = await transaction.wait();

    console.log(transactionData);
    console.log(transactionData.blockNumber);

    await subgraphClient.waitForBlock(transactionData.blockNumber);

    setDaoData({ ...data, image: imageHash.hash });
    setLoading(false);
    setDaoCreated(true);
  };

  if (creatingGrant) {
    return <CreateGrant onSubmit={() => router.push('/your_grants')} />;
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

/*

{
    "reward": "1",
    "rewardCurrency": "MATIC",
    "date": "2022-02-10",
    "applicant_name": true,
    "applicant_email": false,
    "about_team": true,
    "funding_breakdown": false,
    "project_name": true,
    "project_link": true,
    "project_details": false,
    "project_goals": false,
    "extra_field": "extra info",
    "is_multiple_miletones": true,
    "details": "details",
    "title": "title",
    "summary": "summary"
}

title: 'title',
    summary: 'summary',
    details: 'details',
    applicant_name: true,
    applicant_email: false,
    about_team: false,
    funding_breakdown: false,
    project_name: false,
    project_link: false,
    project_details: true,
    project_goals: false,
    extra_field: 'ko',
    is_multiple_miletones: false,
    reward: '10',
    rewardCurrency: 'USDC',
    date: '2022-02-05',
*/
