import { Flex } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { ApiClientsContext } from 'pages/_app';
import React, {
  ReactElement, useContext, useEffect, useState,
} from 'react';
import { CHAIN_INFO } from 'src/constants/chainInfo';
import { SupportedChainId, DefaultSupportedChainId } from 'src/constants/chains';
import { useGetGrantDetailsQuery } from 'src/generated/graphql';
import { formatAmount } from 'src/utils/formattingUtils';
import { getAssetInfo } from 'src/utils/tokenUtils';
import { getSupportedChainIdFromSupportedNetwork } from 'src/utils/validationUtils';
import Form from '../../src/components/explore_grants/apply_grant/form';
import Sidebar from '../../src/components/explore_grants/apply_grant/sidebar';
import NavbarLayout from '../../src/layout/navbarLayout';
import { getUrlForIPFSHash } from '../../src/utils/ipfsUtils';

function ApplyGrant() {
  const { subgraphClients } = useContext(ApiClientsContext)!;

  const router = useRouter();
  const [grantData, setGrantData] = useState<any>(null);
  const [grantID, setGrantID] = useState<any>('');
  const [title, setTitle] = useState('');
  const [daoLogo, setDaoLogo] = useState('');
  const [rewardAmount, setRewardAmount] = useState('');
  const [rewardCurrency, setRewardCurrency] = useState('');
  const [rewardCurrencyCoin, setRewardCurrencyCoin] = useState('');
  const [rewardCurrencyAddress, setRewardCurrencyAddress] = useState();
  const [grantDetails, setGrantDetails] = useState('');
  const [grantSummary, setGrantSummary] = useState('');
  const [workspaceId, setWorkspaceId] = useState('');
  const [grantRequiredFields, setGrantRequiredFields] = useState<any[]>([]);
  const [chainId, setChainId] = useState<SupportedChainId>();

  useEffect(() => {
    if (router && router.query) {
      const { chainId: cId, grantId: gId } = router.query;
      setChainId(cId as unknown as SupportedChainId);
      setGrantID(gId);
    }
  }, [router]);

  const [queryParams, setQueryParams] = useState<any>({
    client:
      subgraphClients[
        chainId ?? DefaultSupportedChainId
      ].client,
  });

  useEffect(() => {
    if (!grantID) return;
    if (!chainId) return;

    setQueryParams({
      client:
        subgraphClients[chainId].client,
      variables: {
        grantID,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId, grantID]);

  const { data, error, loading } = useGetGrantDetailsQuery(queryParams);

  useEffect(() => {
    if (data && data.grants && data.grants.length > 0) {
      setGrantData(data.grants[0]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, error, loading]);

  useEffect(() => {
    if (!grantData) return;
    setChainId(getSupportedChainIdFromSupportedNetwork(grantData.workspace.supportedNetworks[0]));
    setTitle(grantData?.title);
    setWorkspaceId(grantData?.workspace?.id);
    setDaoLogo(getUrlForIPFSHash(grantData?.workspace?.logoIpfsHash));
    setRewardAmount(
      grantData?.reward?.committed
        ? formatAmount(
          grantData?.reward?.committed,
          CHAIN_INFO[getSupportedChainIdFromSupportedNetwork(
            grantData.workspace.supportedNetworks[0],
          )]?.supportedCurrencies[grantData.reward.asset.toLowerCase()]
            ?.decimals ?? 18,
        )
        : '',
    );
    const supportedCurrencyObj = getAssetInfo(grantData?.reward?.asset?.toLowerCase(), chainId);
    // console.log('curr', supportedCurrencyObj);
    if (supportedCurrencyObj) {
      setRewardCurrency(supportedCurrencyObj?.label);
      setRewardCurrencyCoin(supportedCurrencyObj?.icon);
      setRewardCurrencyAddress(grantData?.reward?.asset?.toLowerCase());
    }
    // console.log(grantData);

    setGrantDetails(grantData?.details);
    setGrantSummary(grantData?.summary);
    setGrantRequiredFields(grantData?.fields);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grantData]);

  return (
    <Flex direction="row" w="100%" justify="space-evenly">
      <Flex direction="column" w="50%" h="100%">
        <Form
          chainId={chainId}
          title={title}
          grantId={grantID}
          daoLogo={daoLogo}
          rewardAmount={rewardAmount}
          rewardCurrency={rewardCurrency}
          rewardCurrencyCoin={rewardCurrencyCoin}
          rewardCurrencyAddress={rewardCurrencyAddress}
          workspaceId={workspaceId}
          grantRequiredFields={grantRequiredFields.map((field:any) => field.id.split('.')[1])}
          piiFields={grantRequiredFields.filter((field:any) => field.isPii).map((field:any) => field.id.split('.')[1])}
          members={grantData?.workspace?.members}
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
