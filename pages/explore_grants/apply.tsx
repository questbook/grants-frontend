import { Flex } from '@chakra-ui/react';
import BN from 'bn.js';
import { useRouter } from 'next/router';
import { ApiClientsContext } from 'pages/_app';
import React, {
  ReactElement, useCallback, useContext, useEffect, useState,
} from 'react';
import { useGetGrantDetailsLazyQuery } from 'src/generated/graphql';
import Form from '../../src/components/explore_grants/apply_grant/form';
import Sidebar from '../../src/components/explore_grants/apply_grant/sidebar';
import supportedCurrencies from '../../src/constants/supportedCurrencies';
import NavbarLayout from '../../src/layout/navbarLayout';
import { getUrlForIPFSHash } from '../../src/utils/ipfsUtils';

function ApplyGrant() {
  const { subgraphClient } = useContext(ApiClientsContext)!;

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

  const [getGrantDetails] = useGetGrantDetailsLazyQuery({
    client: subgraphClient?.client,
  });

  const getGrantData = useCallback(async () => {
    try {
      const { data } = await getGrantDetails({
        variables: { grantID },
      });

      if (data && data.grants.length) {
        setGrantData(data.grants[0]);
      }
      return true;
    } catch (e) {
      // console.log(e);
      return null;
    }
  }, [grantID, getGrantDetails]);

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
    // console.log('curr', supportedCurrencyObj);
    if (supportedCurrencyObj) {
      setRewardCurrency(supportedCurrencyObj?.label);
      setRewardCurrencyCoin(supportedCurrencyObj?.icon);
    }
    // console.log(grantData);

    setGrantDetails(grantData?.details);
    setGrantSummary(grantData?.summary);
    setGrantRequiredFields(grantData?.fields);
  }, [grantData]);

  return (
    <Flex direction="row" w="100%" justify="space-evenly">
      <Flex direction="column" w="50%" h="100%">
        <Form
          title={title}
          grantId={grantID}
          daoLogo={daoLogo}
          rewardAmount={rewardAmount}
          rewardCurrency={rewardCurrency}
          rewardCurrencyCoin={rewardCurrencyCoin}
          workspaceId={workspaceId}
          grantRequiredFields={grantRequiredFields.map((field:any) => field.id.split('.')[1])}
        />
      </Flex>

      <Flex direction="column" w="50%">
        <Sidebar grantSummary={grantSummary} grantDetails={grantDetails} />
      </Flex>

    </Flex>
  );
}

ApplyGrant.getLayout = function getLayout(page: ReactElement) {
  return <NavbarLayout>{page}</NavbarLayout>;
};

export default ApplyGrant;
