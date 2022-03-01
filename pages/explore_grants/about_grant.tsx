import {
  Box, Container, Image, Flex, Divider,
} from '@chakra-ui/react';
import React, {
  ReactElement, useContext, useEffect, useState,
} from 'react';
import BN from 'bn.js';
import { useRouter } from 'next/router';
import { useGetGrantDetailsQuery } from 'src/generated/graphql';
import { ApiClientsContext } from 'pages/_app';
import { SupportedChainId } from 'src/constants/chains';
import { getAssetInfo } from 'src/utils/tokenUtils';
import GrantDetails from '../../src/components/explore_grants/about_grant/grantDetails';
import GrantRewards from '../../src/components/explore_grants/about_grant/grantRewards';
import Sidebar from '../../src/components/explore_grants/about_grant/sidebar';
import Breadcrumbs from '../../src/components/ui/breadcrumbs';
import Heading from '../../src/components/ui/heading';
import NavbarLayout from '../../src/layout/navbarLayout';
import {
  formatAmount,
  getFormattedDate,
} from '../../src/utils/formattingUtils';
import { getUrlForIPFSHash } from '../../src/utils/ipfsUtils';

function AboutGrant() {
  const { subgraphClients } = useContext(ApiClientsContext)!;

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
  const [chainId, setChainId] = useState<SupportedChainId>();

  useEffect(() => {
    // console.log(router.query);
    if (router.query) {
      // console.log('setting chain id');
      const { chainId: cId, grantId: gId } = router.query;
      setChainId(cId as unknown as SupportedChainId);
      setGrantID(gId);
    }
  }, [router.query]);

  const [queryParams, setQueryParams] = useState<any>({
    client: subgraphClients[chainId ?? SupportedChainId.RINKEBY].client,
  });

  useEffect(() => {
    if (!grantID) return;
    if (!chainId) return;

    // console.log(chainId);
    setQueryParams({
      client: subgraphClients[chainId].client,
      variables: {
        grantID,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId, grantID]);

  const { data, error, loading } = useGetGrantDetailsQuery(queryParams);

  useEffect(() => {
    // console.log('data', data);
    if (data && data.grants && data.grants.length > 0) {
      setGrantData(data.grants[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, error, loading]);

  useEffect(() => {
    const funding = new BN(grantData?.funding);
    setIsGrantVerified(funding.gt(new BN('0')));
    setDeadline(getFormattedDate(grantData?.deadline));
    setTitle(grantData?.title);
    setDaoName(grantData?.workspace?.title);
    setDaoLogo(getUrlForIPFSHash(grantData?.workspace?.logoIpfsHash));
    setRewardAmount(
      grantData?.reward?.committed
        ? formatAmount(grantData?.reward?.committed)
        : '',
    );
    const supportedCurrencyObj = getAssetInfo(
      grantData?.reward?.asset?.toLowerCase(),
      chainId,
    );

    if (supportedCurrencyObj) {
      setRewardCurrency(supportedCurrencyObj?.label);
      setRewardCurrencyCoin(supportedCurrencyObj?.icon);
    }

    if (
      grantData?.fields.length
      && grantData?.fields?.some((fd: any) => fd.title === 'Milestones')
    ) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grantData]);

  const grantStatus = 'Open';

  return (
    <Container maxW="100%" display="flex" px="70px">
      <Container
        flex={1}
        display="flex"
        flexDirection="column"
        maxW="834px"
        alignItems="stretch"
        pb={8}
        px={10}
      >
        <Breadcrumbs path={['Explore Grants', 'About Grant']} />
        <Heading mt="18px" dontRenderDivider title={title} />
        <Flex fontWeight="400" alignItems="center">
          <Image mr={3} mt="-3px" boxSize={3} src="/ui_icons/calendar.svg" />
          {`Ends on ${deadline}`}
          <Image mx={2} src="/ui_icons/green_dot.svg" />
          <Box
            as="span"
            display="inline-block"
            color="#122224"
            fontWeight="bold"
          >
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

      <Sidebar
        chainId={chainId}
        grantID={grantData?.id}
        grantRequiredFields={grantRequiredFields}
      />
    </Container>
  );
}

AboutGrant.getLayout = function getLayout(page: ReactElement) {
  return <NavbarLayout>{page}</NavbarLayout>;
};

export default AboutGrant;
