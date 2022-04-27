import React, { useContext, useEffect } from 'react';
// import { ToastId, useToast } from '@chakra-ui/react';
import { ApiClientsContext } from 'pages/_app';
// import { useAccount, useNetwork } from 'wagmi';
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils';
import { BigNumber } from 'ethers';
// import getErrorMessage from 'src/utils/errorUtils';
import { CHAIN_INFO } from 'src/constants/chainInfo';
// import ErrorToast from '../components/ui/toasts/errorToast';
import useChainId from './utils/useChainId';
import useApplicationRegistryContract from './contracts/useApplicationRegistryContract';


export default function usePayReviewers(
  totalAmount?: BigNumber,
  // reviewerAddress?: string,
  // reviewCurrencyAddress?: string,
) {
  const [error, setError] = React.useState<string>();
  const [loading] = React.useState(false);
  const [incorrectNetwork, setIncorrectNetwork] = React.useState(false);
  const [transactionData, setTransactionData] = React.useState<any>();
  // const [{ data: accountData }] = useAccount();
  // const [{ data: networkData }, switchNetwork] = useNetwork();

  const apiClients = useContext(ApiClientsContext)!;
  const { workspace } = apiClients;
  const chainId = getSupportedChainIdFromWorkspace(workspace);
  const applicationReviewerContract = useApplicationRegistryContract(chainId);
  // const toastRef = React.useRef<ToastId>();
  // const toast = useToast();
  const currentChainId = useChainId();

  useEffect(() => {
    if (totalAmount) {
      setError(undefined);
      setIncorrectNetwork(false);
      error
    } else if (transactionData) {
      setTransactionData(undefined);
      setIncorrectNetwork(false);
    }
  }, [totalAmount, transactionData]);

  useEffect(() => {
    if (incorrectNetwork) {
      setIncorrectNetwork(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applicationReviewerContract]);

  return [
    transactionData,
    currentChainId
      ? `${CHAIN_INFO[currentChainId]
        .explorer.transactionHash}${transactionData?.transactionHash}`
      : '',
    loading,
  ];
}
