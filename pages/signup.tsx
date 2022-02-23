import {
  Container, Text,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, {
  ReactElement,
} from 'react';
import { SupportedChainId } from 'src/constants/chains';
import { useDaoContext } from 'src/context/daoContext';
import { useGrantContext } from 'src/context/grantContext';
import Form from '../src/components/signup/create_dao/form';
import Loading from '../src/components/signup/create_dao/loading';
import CreateGrant from '../src/components/signup/create_grant';
import DaoCreated from '../src/components/signup/daoCreated';
import NavbarLayout from '../src/layout/navbarLayout';

function SignupDao() {
  const router = useRouter();
  // const [creatingGrant, setCreatingGrant] = React.useState(false);

  const {
    createWorkspace, daoData, loading, daoCreated,
  } = useDaoContext();
  const {
    createGrant, creatingGrant, hasClicked, setCreatingGrant,
  } = useGrantContext();

  const handleFormSubmit = async (data: {
    name: string;
    description: string;
    image: File;
    network: SupportedChainId;
  }) => {
    await createWorkspace(data);
  };

  const handleGrantSubmit = async (data: any) => {
    await createGrant(data);
  };

  if (creatingGrant) {
    return <CreateGrant hasClicked={hasClicked} onSubmit={handleGrantSubmit} />;
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
        A Grants DAO is a neatly arranged space where you can manage grants,
        review grant applications and fund grants.
      </Text>
      <Form hasClicked={hasClicked} onSubmit={handleFormSubmit} />
    </Container>
  );
}

SignupDao.getLayout = function getLayout(page: ReactElement) {
  return <NavbarLayout renderTabs={false}>{page}</NavbarLayout>;
};

export default SignupDao;
