import { encrypt } from '@metamask/eth-sig-util';
import { ethers } from 'ethers';
import { useCallback } from 'react';
import { useAccount } from 'wagmi';

export default function useEncryption() {
  const [{ data: accountData }] = useAccount();
  const getPublicEncryptionKey = async (): Promise<string | undefined> => {
    const { ethereum } = window;

    if (ethereum && accountData && accountData.address) {
      const pubEncryptionKey = await ethereum.request({
        // @ts-expect-error
        method: 'eth_getEncryptionPublicKey', params: [accountData.address],
      });

      return pubEncryptionKey;
    }

    return undefined;
  };

  const encryptMessage = (
    message: string,
    publicKey: string,
  ): string => {
    const encryptedData = encrypt({
      publicKey,
      data: message,
      version: 'x25519-xsalsa20-poly1305',
    });
    const hexValue = ethers.utils.hexlify(
      Buffer.from(JSON.stringify(encryptedData)),
    );
    return hexValue;
  };

  const decryptMessage = useCallback(async (cipherText: string): Promise<string | undefined> => {
    const { ethereum } = window;

    if (ethereum && accountData && accountData.address) {
      const decryptedData = await ethereum.request({
        // @ts-expect-error
        method: 'eth_decrypt', params: [cipherText, accountData?.address],
      });
      return decryptedData;
    }
    return undefined;
  }, [accountData]);

  return { getPublicEncryptionKey, encryptMessage, decryptMessage };
}
