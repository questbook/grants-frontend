
import {
  Box, Button, Text, Image, useTheme,
} from '@chakra-ui/react';
import React, { useMemo } from 'react';

import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { clusterApiUrl } from "@solana/web3.js";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import {
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  SolletExtensionWalletAdapter,
  SolletWalletAdapter,
  TorusWalletAdapter,
} from "@solana/wallet-adapter-wallets";

const name2Wallet = {
  'Phantom': PhantomWalletAdapter,
  // TODO: add the other wallets.
}

function SolanaWalletSelectButton({
  name,
  icon,
}: {
  name: 'Phantom';
  icon: string;
}) {
  const theme = useTheme();
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(() => [new name2Wallet[name]()], [network]);


  return (
    <Box
      background={theme.colors.backgrounds.card}
      border="1px solid #E8E9E9"
      borderRadius={12}
      px="18px"
      py={4}
      alignItems="center"
      display="flex"
      w="full"
    >
      <Image h="40px" w="40px" src={icon} alt="Connect using" />
      <Text fontWeight="700" ml={5} mr="auto">
        {name}
      </Text>

      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets}>
          <WalletModalProvider>
            <WalletMultiButton />
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>

    </Box>
  );
}

export default SolanaWalletSelectButton;

