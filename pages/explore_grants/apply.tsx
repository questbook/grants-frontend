import { Flex } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { ApiClientsContext } from 'pages/_app';
import React, {
  ReactElement, useContext, useEffect, useState,
} from 'react';
import { CHAIN_INFO } from 'src/constants/chainInfo';
import { SupportedChainId } from 'src/constants/chains';
import { useGetGrantDetailsQuery } from 'src/generated/graphql';
import { formatAmount } from 'src/utils/formattingUtils';
import { getAssetInfo } from 'src/utils/tokenUtils';
import { getSupportedChainIdFromSupportedNetwork } from 'src/utils/validationUtils';
import verify from 'src/utils/grantUtils';
import Form from '../../src/components/explore_grants/apply_grant/form';
import Sidebar from '../../src/components/explore_grants/apply_grant/sidebar';
import NavbarLayout from '../../src/layout/navbarLayout';
import { getUrlForIPFSHash } from '../../src/utils/ipfsUtils';

function ApplyGrant() {
  const { subgraphClients, workspace } = useContext(ApiClientsContext)!;

  const router = useRouter();
  const [grantData, setGrantData] = useState<any>(null);
  const [grantID, setGrantID] = useState<any>('');
  const [title, setTitle] = useState('');
  const [daoId, setDaoId] = useState('');
  const [daoLogo, setDaoLogo] = useState('');
  const [isGrantVerified, setIsGrantVerified] = useState(false);
  const [funding, setFunding] = useState('');
  const [rewardAmount, setRewardAmount] = useState('');
  const [rewardCurrency, setRewardCurrency] = useState('');
  const [rewardDecimal, setRewardDecimal] = useState<number | undefined>(undefined);
  const [rewardCurrencyCoin, setRewardCurrencyCoin] = useState('');
  const [rewardCurrencyAddress, setRewardCurrencyAddress] = useState();
  const [grantDetails, setGrantDetails] = useState('');
  const [grantSummary, setGrantSummary] = useState('');
  const [workspaceId, setWorkspaceId] = useState('');
  const [grantRequiredFields, setGrantRequiredFields] = useState<any[]>([]);
  const [chainId, setChainId] = useState<SupportedChainId>();
  const [acceptingApplications, setAcceptingApplications] = useState(true);
  const [shouldShowButton, setShouldShowButton] = useState(false);

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
        chainId ?? SupportedChainId.RINKEBY
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
    const localChainId = getSupportedChainIdFromSupportedNetwork(
      grantData.workspace.supportedNetworks[0],
    );
    let chainInfo;
    let tokenIcon;
    if (grantData.reward.token) {
      tokenIcon = getUrlForIPFSHash(grantData.reward.token?.iconHash);
      chainInfo = {
        address: grantData.reward.token.address,
        label: grantData.reward.token.label,
        decimals: grantData.reward.token.decimal,
        icon: tokenIcon,
      };
    } else {
      chainInfo = CHAIN_INFO[localChainId]?.supportedCurrencies[
        grantData.reward.asset.toLowerCase()
      ];
    }
    // const chainInfo = CHAIN_INFO[localChainId]
    //   ?.supportedCurrencies[grantData?.reward.asset.toLowerCase()];
    const [localIsGrantVerified, localFunding] = verify(grantData?.funding, chainInfo.decimals);

    setIsGrantVerified(localIsGrantVerified);
    setFunding(localFunding);
    setChainId(localChainId);
    setTitle(grantData?.title);
    setWorkspaceId(grantData?.workspace?.id);
    setDaoId(grantData?.workspace?.id);
    setDaoLogo(getUrlForIPFSHash(grantData?.workspace?.logoIpfsHash));
    setRewardAmount(
      grantData?.reward?.committed
        ? formatAmount(
          grantData?.reward?.committed,
          chainInfo?.decimals ?? 18,
        )
        : '',
    );

    let supportedCurrencyObj;
    if (grantData.reward.token) {
      setRewardCurrency(chainInfo.label);
      setRewardCurrencyCoin(chainInfo.icon);
      setRewardDecimal(parseInt(chainInfo.decimals, 10));
    } else {
      supportedCurrencyObj = getAssetInfo(
        grantData?.reward?.asset?.toLowerCase(),
        chainId,
      );
    }
    // supportedCurrencyObj = getAssetInfo(grantData?.reward?.asset?.toLowerCase(), chainId);
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
    setAcceptingApplications(grantData?.acceptingApplications);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grantData]);

  useEffect(() => {
    setShouldShowButton(daoId === workspace?.id);
  }, [daoId, workspace]);

  return (
    <Flex direction="row" w="100%" justify="space-evenly">
      <Flex direction="column" w="50%" h="100%">
        <Form
          chainId={chainId}
          title={title}
          grantId={grantID}
          daoLogo={daoLogo}
          isGrantVerified={isGrantVerified}
          funding={funding}
          rewardAmount={rewardAmount}
          rewardCurrency={rewardCurrency}
          rewardDecimal={rewardDecimal}
          rewardCurrencyCoin={rewardCurrencyCoin}
          rewardCurrencyAddress={rewardCurrencyAddress}
          workspaceId={workspaceId}
          grantRequiredFields={grantRequiredFields.map((field: any) => field.id.split('.')[1])}
          piiFields={grantRequiredFields.filter((field: any) => field.isPii).map((field: any) => field.id.split('.')[1])}
          members={grantData?.workspace?.members}
          acceptingApplications={acceptingApplications}
          shouldShowButton={shouldShowButton}
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
