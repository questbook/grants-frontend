import { ApiClientsContext } from 'pages/_app';
import { useContext } from 'react';
import { CHAIN_INFO } from 'src/constants/chainInfo';
import { ALL_SUPPORTED_CHAIN_IDS, SupportedChainId } from 'src/constants/chains';
import { useGetApplicationMilestonesQuery } from 'src/generated/graphql';
import { getSupportedChainIdFromWorkspace } from './validationUtils';

const useApplicationMilestones = (grantId: string, chainId?: SupportedChainId) => {
  const { subgraphClients, workspace } = useContext(ApiClientsContext)!;
  const fullData = useGetApplicationMilestonesQuery({
    client:
      subgraphClients[
        (chainId ?? getSupportedChainIdFromWorkspace(workspace)) ?? SupportedChainId.RINKEBY
      ].client,
    variables: {
      grantId,
    },
  });

  const grantApp = fullData?.data?.grantApplications[0];

  const fundingAsk = grantApp?.fields?.find((item) => item.id.endsWith('.fundingAsk.field'))?.values[0]?.value;
  const rewardAsset = grantApp?.grant?.reward?.asset ?? '';
  const milestones = grantApp?.milestones || [];

  let decimals = 18;

  if (rewardAsset) {
    let allCurrencies: any[] = [];
    ALL_SUPPORTED_CHAIN_IDS.forEach((id) => {
      const { supportedCurrencies } = CHAIN_INFO[id];
      const supportedCurrenciesArray = Object
        .keys(supportedCurrencies)
        .map((i) => supportedCurrencies[i]);
      allCurrencies = [...allCurrencies, ...supportedCurrenciesArray];
    });

    decimals = allCurrencies
      .find((currency) => currency.address === rewardAsset)?.decimals || 18;
  }

  return {
    ...fullData,
    data: {
      rewardAsset, milestones, fundingAsk, decimals,
    },
  };
};

export default useApplicationMilestones;
