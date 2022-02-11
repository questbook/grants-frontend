import { gql } from '@apollo/client';
import { Container } from '@chakra-ui/react';
import BN from 'bn.js';
import { useRouter } from 'next/router';
import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import Form from '../../src/components/explore_grants/apply_grant/form';
import Sidebar from '../../src/components/explore_grants/apply_grant/sidebar';
import supportedCurrencies from '../../src/constants/supportedCurrencies';
import { getGrantDetails, getAllGrants } from '../../src/graphql/daoQueries';
import SubgraphClient from '../../src/graphql/subgraph';
import NavbarLayout from '../../src/layout/navbarLayout';
import { getFormattedDate } from '../../src/utils/formattingUtils';
import { getUrlForIPFSHash } from '../../src/utils/ipfsUtils';

function ApplyGrant() {
  const router = useRouter();
  const [grantData, setGrantData] = useState<any>(null);
  const [grantID, setGrantID] = useState<any>('');
  const [title, setTitle] = useState('');
  const [deadline, setDeadline] = useState('');
  const [isGrantVerified, setIsGrantVerified] = useState(false);
  const [daoName, setDaoName] = useState('');
  const [daoLogo, setDaoLogo] = useState('');
  const [rewardAmount, setRewardAmount] = useState('');
  const [rewardCurrency, setRewardCurrency] = useState('');
  const [rewardCurrencyCoin, setRewardCurrencyCoin] = useState('');
  const [payoutDescription, setPayoutDescription] = useState('');
  const [grantDetails, setGrantDetails] = useState('');
  const [grantSummary, setGrantSummary] = useState('');
  const [grantRequiredFields, setGrantRequiredFields] = useState([]);
  console.log(deadline, isGrantVerified, daoName, payoutDescription, grantRequiredFields);

  const getGrantData = useCallback(async () => {
    const subgraphClient = new SubgraphClient();
    if (!subgraphClient.client) return null;
    try {
      const { data } = (await subgraphClient.client.query({
        query: gql(getGrantDetails),
        variables: {
          grantID, // : '0xcf624e32a53fec9ea5908f22d43a78a943931063',
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
    const funding: number = parseInt(grantData?.funding, 10);
    setIsGrantVerified(funding > 0);
    setDeadline(getFormattedDate(grantData?.deadline));
    setTitle(grantData?.title);
    setDaoName(grantData?.workspace?.title);
    setDaoLogo(getUrlForIPFSHash(grantData?.workspace?.logoIpfsHash));
    const rAmt = new BN(grantData?.reward?.committed).div(new BN(10).pow(new BN(18)));
    setRewardAmount(rAmt.toString());
    const supportedCurrencyObj = supportedCurrencies.find(
      (curr) => curr?.id.toLowerCase() === grantData?.reward?.asset?.toLowerCase(),
    );
    if (supportedCurrencyObj) {
      setRewardCurrency(supportedCurrencyObj?.label);
      setRewardCurrencyCoin(supportedCurrencyObj?.icon);
    }

    if (grantData?.fields.length && grantData?.fields?.some((fd: any) => fd.title === 'Milestones')) {
      setPayoutDescription('Muliple Payouts');
    } else {
      setPayoutDescription('Single Payout - Instant Payout once the grant recepient is selected.');
    }
    setGrantDetails(grantData?.details);
    setGrantSummary(grantData?.summary);
    setGrantRequiredFields(
      grantData?.fields?.map((field: any) => ({
        detail: field.title,
      })),
    );
  }, [grantData]);

  return (
    <Container maxW="100%" display="flex" px="0px">
      <Container flex={3} display="flex" flexDirection="column" maxW="834px" alignItems="stretch" pb={8} px={10}>
        <Form
          onSubmit={(data) => {
            console.log(data);
            router.push({
              pathname: '/your_applications',
              query: {
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
