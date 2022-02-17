import {
  Box, Container, Image, Flex, Divider,
} from '@chakra-ui/react';
import React, {
  ReactElement, useCallback, useEffect, useState,
} from 'react';
import { gql } from '@apollo/client';
import BN from 'bn.js';
import { useRouter } from 'next/router';
import GrantDetails from '../../src/components/explore_grants/about_grant/grantDetails';
import GrantRewards from '../../src/components/explore_grants/about_grant/grantRewards';
import Sidebar from '../../src/components/explore_grants/about_grant/sidebar';
import Breadcrumbs from '../../src/components/ui/breadcrumbs';
import Heading from '../../src/components/ui/heading';
import NavbarLayout from '../../src/layout/navbarLayout';
import { getGrantDetails } from '../../src/graphql/daoQueries';
import { getFormattedDate } from '../../src/utils/formattingUtils';
import { getUrlForIPFSHash } from '../../src/utils/ipfsUtils';
import supportedCurrencies from '../../src/constants/supportedCurrencies';
import SubgraphClient from '../../src/graphql/subgraph';

function AboutGrant() {
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
  const router = useRouter();
  useEffect(() => {
    setGrantID(router?.query?.grantID ?? '');
  }, [router]);

  useEffect(() => {
    if (!grantID) return;
    getGrantData();
  }, [grantID, getGrantData]);

  useEffect(() => {
    const funding = new BN(grantData?.funding);
    setIsGrantVerified(funding.gt((new BN('0'))));
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
      setPayoutDescription('Multiple');
    } else {
      setPayoutDescription('Single');
    }
    setGrantDetails(grantData?.details);
    setGrantSummary(grantData?.summary);
    setGrantRequiredFields(
      grantData?.fields?.map((field: any) => ({
        detail: field.title,
      })),
    );
  }, [grantData]);

  const grantStatus = 'Open';

  return (
    <Container maxW="100%" display="flex" px="70px">
      <Container flex={1} display="flex" flexDirection="column" maxW="834px" alignItems="stretch" pb={8} px={10}>
        <Breadcrumbs path={['Explore Grants', 'About Grant']} />
        <Heading mt="18px" dontRenderDivider title={title} />
        <Flex fontWeight="400" alignItems="center">
          <Image mr={3} mt="-3px" boxSize={3} src="/ui_icons/calendar.svg" />
          {`Ends on ${deadline}`}
          <Image mx={2} src="/ui_icons/green_dot.svg" />
          <Box as="span" display="inline-block" color="#122224" fontWeight="bold">
            {grantStatus}
          </Box>
        </Flex>

        <Divider mt={3} />

        <GrantRewards
          daoName={daoName}
          daoLogo={daoLogo}
          isGrantVerified={isGrantVerified}
          rewardAmount={rewardAmount}
          rewardCurrency={rewardCurrency}
          rewardCurrencyCoin={rewardCurrencyCoin}
          payoutDescription={payoutDescription}
        />

        <Divider mt={7} />

        <GrantDetails grantSummary={grantSummary} grantDetails={grantDetails} />
      </Container>

      <Sidebar grantID={grantData?.id} grantRequiredFields={grantRequiredFields} />
    </Container>
  );
}

AboutGrant.getLayout = function getLayout(page: ReactElement) {
  return <NavbarLayout>{page}</NavbarLayout>;
};

export default AboutGrant;
