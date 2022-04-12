import {
  getSupportedChainIdFromWorkspace,
  getSupportedValidatorNetworkFromChainId,
} from 'src/utils/validationUtils';
import {
  APPLICATION_REGISTRY_ADDRESS,
  WORKSPACE_REGISTRY_ADDRESS,
} from 'src/constants/addresses';
import { uploadToIPFS } from 'src/utils/ipfsUtils';
import { parseAmount } from 'src/utils/formattingUtils';
import ErrorToast from 'src/components/ui/toasts/errorToast';
import { ToastId } from '@chakra-ui/react';
import React from 'react';

export function checkData(
  data: any,
  setError: React.Dispatch<React.SetStateAction<string | undefined>>,
  setIncorrectNetwork: React.Dispatch<React.SetStateAction<boolean>>,
): void {
  if (data) {
    setError(undefined);
    setIncorrectNetwork(false);
  }
}

export function checkNetwork(
  incorrectNetwork: boolean,
  setIncorrectNetwork:React.Dispatch<React.SetStateAction<boolean>>,
): void {
  if (incorrectNetwork) {
    setIncorrectNetwork(false);
  }
}

export function validate(
  formData: any,
  chainId: any,
  transactionData: any,
  accountData: any,
  workspace: any,
  currentChainId: any,
  switchNetwork: any,
  setIncorrectNetwork: any,
  setLoading: any,
  validatorApi: any,
  grantContract: any,
) {
  if (!formData) return;
  if (transactionData) return;
  if (!accountData || !accountData.address) {
    throw new Error('not connected to wallet');
  }
  if (!workspace) {
    throw new Error('not connected to workspace');
  }
  if (!currentChainId) {
    if (switchNetwork && chainId) { switchNetwork(chainId); }
    setIncorrectNetwork(true);
    setLoading(false);
    return;
  }
  if (chainId !== currentChainId) {
    if (switchNetwork && chainId) { switchNetwork(chainId); }
    setIncorrectNetwork(true);
    setLoading(false);
    return;
  }
  if (!validatorApi) {
    throw new Error('validatorApi or workspaceId is not defined');
  }
  if (
    !grantContract
      || grantContract.address
        === '0x0000000000000000000000000000000000000000'
      || !grantContract.signer
      || !grantContract.provider
  // eslint-disable-next-line no-empty
  ) {
    // eslint-disable-next-line no-useless-return
    return;
  }
}

export async function createGrant(
  formData: any,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  validatorApi: any,
  accountData: any,
  chainId: any,
  workspace: any,
  grantContract: any,
  workspaceId: any,
  currentChainId: any,
  setTransactionData: React.Dispatch<any>,
  getErrorMessage: any,
  setError: React.Dispatch<React.SetStateAction<string | undefined>>,
  toastRef: React.MutableRefObject<ToastId | undefined>,
  toast: any,

) {
  setLoading(true);
  // console.log('calling validate');
  try {
    const detailsHash = (await uploadToIPFS(formData.details)).hash;
    const {
      data: { ipfsHash },
    } = await validatorApi.validateGrantCreate({
      title: formData.title,
      summary: formData.summary,
      details: detailsHash,
      deadline: formData.date,
      reward: {
        committed: parseAmount(formData.reward, formData.rewardCurrencyAddress),
        asset: formData.rewardCurrencyAddress,
      },
      creatorId: accountData!.address,
      workspaceId: getSupportedValidatorNetworkFromChainId(
        (chainId ?? getSupportedChainIdFromWorkspace(workspace))!,
      ),
      fields: formData.fields,
      grantManagers: formData.grantManagers.length
        ? formData.grantManagers
        : [accountData!.address],
    });
    if (!ipfsHash) {
      throw new Error('Error validating grant data');
    }

    const createGrantTransaction = await grantContract.createGrant(
      workspaceId ?? Number(workspace?.id).toString(),
      ipfsHash,
      WORKSPACE_REGISTRY_ADDRESS[currentChainId!],
      APPLICATION_REGISTRY_ADDRESS[currentChainId!],
    );
    const createGrantTransactionData = await createGrantTransaction.wait();

    setTransactionData(createGrantTransactionData);
    setLoading(false);
  } catch (e: any) {
    const message = getErrorMessage(e);
    setError(message);
    setLoading(false);
    // eslint-disable-next-line no-param-reassign
    toastRef.current = toast({
      position: 'top',
      render: () => ErrorToast({
        content: message,
        close: () => {
          if (toastRef.current) {
            toast.close(toastRef.current);
          }
        },
      }),
    });
  }
}

export async function updateGrant(
  formData: any,
  grantContract: any,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  validatorApi: any,
  setTransactionData: React.Dispatch<any>,
  getErrorMessage: any,
  setError: React.Dispatch<React.SetStateAction<string | undefined>>,
  toastRef: React.MutableRefObject<ToastId | undefined>,
  toast: any,
) {
  setLoading(true);
  // console.log('calling validate');
  try {
    const detailsHash = (await uploadToIPFS(formData.details)).hash;
    const {
      data: { ipfsHash },
    } = await validatorApi.validateGrantUpdate({
      title: formData.title,
      summary: formData.summary,
      details: detailsHash,
      deadline: formData.date,
      reward: {
        committed: parseAmount(formData.reward, formData.rewardCurrencyAddress),
        asset: formData.rewardCurrencyAddress,
      },
      fields: formData.fields,
    });
    if (!ipfsHash) {
      throw new Error('Error validating grant data');
    }

    const createGrantTransaction = await grantContract.updateGrant(
      ipfsHash,
    );
    const createGrantTransactionData = await createGrantTransaction.wait();

    setTransactionData(createGrantTransactionData);
    setLoading(false);
  } catch (e: any) {
    const message = getErrorMessage(e);
    setError(message);
    setLoading(false);
    // eslint-disable-next-line no-param-reassign
    toastRef.current = toast({
      position: 'top',
      render: () => ErrorToast({
        content: message,
        close: () => {
          if (toastRef.current) {
            toast.close(toastRef.current);
          }
        },
      }),
    });
  }
}
