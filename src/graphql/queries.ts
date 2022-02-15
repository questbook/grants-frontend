import { gql, useQuery } from '@apollo/client';
import { ApiClientsContext } from 'pages/_app';
import { useContext } from 'react';
import { getApplicationMilestones } from './daoQueries';

export type ApplicationMilestone = {
  id: string
  amount: string
  amountPaid: string
  state: 'submitted' | 'requested' | 'approved'
  title: string
  updatedAtS: number | null
};

export const useApplicationMilestones = (grantId: string) => {
  const { subgraphClient } = useContext(ApiClientsContext)!;
  const { data, loading, error } = useQuery(gql(getApplicationMilestones), {
    client: subgraphClient.client,
    variables: {
      grantId,
    },
  });

  const rewardAsset = data?.grantApplications[0]?.grant?.reward?.asset;
  const milestones = data?.grantApplications[0]?.milestones || [];
  return {
    data: { rewardAsset, milestones: milestones as ApplicationMilestone[] },
    loading,
    error,
  };
};
