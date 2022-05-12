
import SolanaProgramIdl from 'src/contracts/abi/SolanaProgramIdl.json'
import { Idl, Program, AnchorProvider } from '@project-serum/anchor';
import { useWallet } from "@solana/wallet-adapter-react";

import { useSigner } from 'multichain';

import { SOLANA_PROGRAM_ADDRESS } from 'src/constants/addresses'
import  SolanaProgramLib from 'src/contracts/questbook-solana'

const useSolanaProgram = () => {
    const [signerStates] = useSigner(); 
    const wallet = useWallet();

    if (!wallet.wallet || !signerStates.data) return null;
    if (!(signerStates.data.provider instanceof AnchorProvider)) return null
    const solanaProgram = new Program(SolanaProgramIdl as Idl, SOLANA_PROGRAM_ADDRESS, signerStates.data.provider);
    const solanaProgramLib = new SolanaProgramLib(solanaProgram, signerStates.data.provider)
    return solanaProgramLib;
}

export default useSolanaProgram;
