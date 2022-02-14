import { gql } from '@apollo/client';
import { Container } from '@chakra-ui/react';
import BN from 'bn.js';
import { useRouter } from 'next/router';
import React, { ReactElement, useCallback, useContext, useEffect, useState } from 'react';
import Form from '../../src/components/explore_grants/apply_grant/form';
import Sidebar from '../../src/components/explore_grants/apply_grant/sidebar';
import supportedCurrencies from '../../src/constants/supportedCurrencies';
import { getGrantDetails } from '../../src/graphql/daoQueries';
import SubgraphClient from '../../src/graphql/subgraph';
import NavbarLayout from '../../src/layout/navbarLayout';
import { getFormattedDate } from '../../src/utils/formattingUtils';
import { getUrlForIPFSHash } from '../../src/utils/ipfsUtils';
import { ApiClientsContext } from '../_app';

function ApplyGrant() {
  const router = useRouter();
  const [grantData, setGrantData] = useState<any>(null);
  const [grantID, setGrantID] = useState<any>('');
  const [title, setTitle] = useState('');
  const [daoLogo, setDaoLogo] = useState('');
  const [rewardAmount, setRewardAmount] = useState('');
  const [rewardCurrency, setRewardCurrency] = useState('');
  const [rewardCurrencyCoin, setRewardCurrencyCoin] = useState('');
  const [grantDetails, setGrantDetails] = useState('');
  const [grantSummary, setGrantSummary] = useState('');
  const [workspaceId, setWorkspaceId] = useState('');
  const [grantRequiredFields, setGrantRequiredFields] = useState<any[]>([]);
  // console.log(deadline, isGrantVerified, daoName, payoutDescription, grantRequiredFields);

  const getGrantData = useCallback(async () => {
    const subgraphClient = new SubgraphClient();
    if (!subgraphClient.client) return null;
    try {
      const { data } = (await subgraphClient.client.query({
        query: gql(getGrantDetails),
        variables: {
          grantID,
        },
      })) as any;
      console.log(data);
      if (data && data.grants.length) {
        setGrantData(data.grants[0]);
      }
      return true;
    } catch (e) {
      console.log(e);
      return null;
    }
  }, [grantID]);

  useEffect(() => {
    setGrantID(router?.query?.grantID ?? '');
  }, [router]);

  useEffect(() => {
    if (!grantID) return;
    getGrantData();
  }, [grantID, getGrantData]);

  useEffect(() => {
    if (!grantData) return;
    setTitle(grantData?.title);
    setWorkspaceId(grantData?.workspace?.id);
    setDaoLogo(getUrlForIPFSHash(grantData?.workspace?.logoIpfsHash));
    const rAmt = new BN(grantData?.reward?.committed).div(new BN(10).pow(new BN(18)));
    setRewardAmount(rAmt.toString());
    const supportedCurrencyObj = supportedCurrencies.find(
      (curr) => curr?.id.toLowerCase() === grantData?.reward?.asset?.toLowerCase(),
    );
    console.log('curr', supportedCurrencyObj);
    if (supportedCurrencyObj) {
      setRewardCurrency(supportedCurrencyObj?.label);
      setRewardCurrencyCoin(supportedCurrencyObj?.icon);
    }
    console.log(grantData);

    setGrantDetails(grantData?.details);
    setGrantSummary(grantData?.summary);
    setGrantRequiredFields(grantData?.fields);
  }, [grantData]);

  return (
    <Container maxW="100%" display="flex" px="0px">
      <Container flex={3} display="flex" flexDirection="column" maxW="834px" alignItems="stretch" pb={8} px={10}>
        <Form
          onSubmit={({ data }) => {
            console.log('applyRes', data);
            router.push({
              pathname: '/your_applications',
              query: {
                applicantID: data[0].applicantId,
                account: true,
              },
            });
          }}
          title={title}
          grantId={grantID}
          daoLogo={daoLogo}
          rewardAmount={rewardAmount}
          rewardCurrency={rewardCurrency}
          rewardCurrencyCoin={rewardCurrencyCoin}
          workspaceId={workspaceId}
          grantRequiredFields={grantRequiredFields.map((field:any) => field.id.split('.')[1])}
        />
      </Container>

      <Sidebar grantSummary={grantSummary} grantDetails={grantDetails} />
    </Container>
  );
}

ApplyGrant.getLayout = function getLayout(page: ReactElement) {
  return <NavbarLayout>{page}</NavbarLayout>;
};

export default ApplyGrant;
