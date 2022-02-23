import { BigNumber } from 'ethers';
import { ApiClientsContext } from 'pages/_app';
import { useContext } from 'react';
import { useGetApplicationMilestonesQuery } from 'src/generated/graphql';

export const useApplicationMilestones = (grantId: string) => {
  const { subgraphClient } = useContext(ApiClientsContext)!;
  const fullData = useGetApplicationMilestonesQuery({
	  client: subgraphClient.client,
	  variables: {
      grantId,
	  },
  });

  const grantApp = fullData?.data?.grantApplications[0];

  const fundingAsk = grantApp?.fields?.find((item: any) => item.id.endsWith('.fundingAsk.field'))?.value?.[0];
  const rewardAsset = grantApp?.grant?.reward?.asset;
  const milestones = grantApp?.milestones || [];

  return {
	  ...fullData,
	  data: { rewardAsset, milestones, fundingAsk },
  };
};
