import { gql, useQuery } from '@apollo/client';
import { ApiClientsContext } from 'pages/_app';
import { useContext } from 'react';
import {
  getAllGrantsForADao, getApplicationMilestones, getFunding, getFundSentForApplication,
} from './daoQueries';

export type ApplicationMilestone = {
  id: string
  amount: string
  amountPaid: string
  state: 'submitted' | 'requested' | 'approved'
  title: string
  updatedAtS: number | null
};

export type FundTransferType = 'funds_deposited' | 'funds_withdrawn' | 'funds_disbursed';

export type FundTransfer = {
  id: string
  application?: { id: string }
  milestone?: { id: string, title: string }
  grant: { id: string }
  amount: string
  sender: string
  to: string
  createdAtS: number
  type: FundTransferType
};

export type Grant = {
  id: string
  title: string
  createdAtS: number
  reward: {
    asset: string
    committed: string
  }
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

export const useFundDisbursed = (applicationId: string | null) => {
  const { subgraphClient } = useContext(ApiClientsContext)!;
  const { data, loading, error } = useQuery(gql(getFundSentForApplication), {
    client: subgraphClient.client,
    variables: {
      applicationId,
    },
  });

  const transfers = data?.fundsTransfers || [];
  return {
    data: transfers as FundTransfer[],
    loading,
    error,
  };
};

export const useFundsTransfer = (grantId: string) => {
  const { subgraphClient } = useContext(ApiClientsContext)!;
  const { data, loading, error } = useQuery(gql(getFunding), {
    client: subgraphClient.client,
    variables: {
      grantId,
    },
  });

  const transfers = data?.fundsTransfers || [];
  return {
    data: transfers as FundTransfer[],
    loading,
    error,
  };
};

export const useAllGrantsForDAO = (workspaceId? : string) => {
  const { subgraphClient } = useContext(ApiClientsContext)!;
  const { data, loading, error } = useQuery(gql(getAllGrantsForADao), {
    client: subgraphClient.client,
    variables: {
      workspaceId,
    },
  });

  return {
    data: (data?.grants || []) as Grant[],
    loading,
    error,
  };
};
