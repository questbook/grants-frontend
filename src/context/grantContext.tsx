import router from 'next/router';
import { ApiClientsContext } from 'pages/_app';
import React, {
  Dispatch,
  ReactNode, SetStateAction, useCallback, useContext, useMemo,
} from 'react';
import { APPLICATION_REGISTRY_ADDRESS, WORKSPACE_REGISTRY_ADDRESS } from 'src/constants/addresses';
import { CHAIN_INFO } from 'src/constants/chainInfo';
import { SupportedChainId } from 'src/constants/chains';
import useGrantFactoryContract from 'src/hooks/useGrantFactoryContract';
import useIsCorrectNetworkSelected from 'src/hooks/useIsCorrectNetwork';
import { GrantFormData } from 'src/types/grant';
import { parseAmount } from 'src/utils/formattingUtils';
import { useAccount } from 'wagmi';
import { useToastContext } from './toastContext';

type Props = {
  children: ReactNode;
};
type GrantContextType = {
  createGrant: (data:GrantFormData) => void;
  setCreatingGrant: Dispatch<SetStateAction<boolean>>;
  creatingGrant: boolean;
  hasClicked: boolean;
  setHasClicked: Dispatch<SetStateAction<boolean>>;
};
const daoContextDefaultValues: GrantContextType = {
  createGrant: () => {},
  setCreatingGrant: () => {},
  creatingGrant: false,
  hasClicked: false,
  setHasClicked: () => {},
};

export const GrantContext = React.createContext<GrantContextType>(daoContextDefaultValues);

export function GrantProvider({ children }: Props) {
  const [creatingGrant, setCreatingGrant] = React.useState(false);
  const [hasClicked, setHasClicked] = React.useState(false);
  const [{ data: accountData }] = useAccount();
  const apiClients = useContext(ApiClientsContext);
  const { showErrorToast, showInfoToast } = useToastContext();
  const grantContract = useGrantFactoryContract(
    apiClients?.chainId || SupportedChainId.RINKEBY,
  );

  const isCorrectNetworkSelected : boolean = useIsCorrectNetworkSelected(apiClients?.chainId);
  const createGrant = useCallback(async (data: GrantFormData) => {
    try {
      if (!apiClients) return;
      if (!accountData || !accountData.address) {
        throw new Error('Not connected to wallet');
      }
      if (!apiClients || !apiClients.chainId
      || !apiClients.workspaceId) {
        throw new Error('Not connected to correct workspace');
      }
      if (!isCorrectNetworkSelected && apiClients && apiClients.chainId) {
        throw new Error(`You are on the wrong network. Please switch to ${CHAIN_INFO[apiClients.chainId].name}`);
      }
      setHasClicked(true);
      setCreatingGrant(true);
      const { validatorApi } = apiClients;
      const {
        data: { ipfsHash },
      } = await validatorApi.validateGrantCreate({
        title: data.title,
        summary: data.summary,
        details: data.details,
        deadline: data.date,
        reward: {
          committed: parseAmount(data.reward),
          asset: data.rewardCurrencyAddress,
        },
        creatorId: accountData.address,
        workspaceId: apiClients.workspaceId,
        fields: data.fields,
      });

      const transaction = await grantContract.createGrant(
        apiClients.workspaceId,
        ipfsHash,
        WORKSPACE_REGISTRY_ADDRESS[apiClients.chainId],
        APPLICATION_REGISTRY_ADDRESS[apiClients.chainId],
      );
      const txData = await transaction.wait();
      // console.log('txData', txData);

      setHasClicked(false);
      router.replace({ pathname: '/your_grants', query: { done: 'yes' } });

      showInfoToast(`https://etherscan.io/tx/${txData.transactionHash}`);
    } catch (error:any) {
      setHasClicked(false);
      showErrorToast(error.message);
      // console.log(error);
    }
  }, [accountData,
    apiClients, grantContract, isCorrectNetworkSelected, showErrorToast, showInfoToast]);
  const value = useMemo(() => ({
    createGrant, setCreatingGrant, creatingGrant, hasClicked, setHasClicked,
  }), [createGrant, creatingGrant, hasClicked, setHasClicked]);

  return (
    <GrantContext.Provider value={value}>
      {children}
    </GrantContext.Provider>
  );
}
export function useGrantContext() {
  return useContext(GrantContext);
}
