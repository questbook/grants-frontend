import { GrantFieldMap } from '@questbook/service-validator-client';

export interface GrantFormData {
  title: string;
  summary: string;
  details: string;
  date: string;
  reward: string;
  rewardCurrencyAddress: string;
  fields: GrantFieldMap;
}
