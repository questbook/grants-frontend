import { BigNumber } from 'ethers';
import { formatAmount } from './formattingUtils';

function verify(funding: string, decimals?: number): [boolean, string] {
  return [BigNumber.from(funding).gt(0), formatAmount(funding, decimals ?? 18)];
}

export default verify;
