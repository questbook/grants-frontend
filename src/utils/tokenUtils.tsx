import supportedCurrencies from '../constants/supportedCurrencies';

export function getAssetInfo(asset: string): { label: string; icon: string } {
  return supportedCurrencies.find(
    (curr) => curr?.id.toLowerCase() === asset?.toLowerCase(),
  ) ?? { label: '', icon: '' };
}

export function dummy() {}
