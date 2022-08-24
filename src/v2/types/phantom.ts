import { PublicKey } from '@solana/web3.js'

export type PhantomEvent = 'disconnect' | 'connect' | 'accountChanged';

export interface ConnectOpts {
    onlyIfTrusted: boolean;
}

export interface PhantomProvider {
    connect: (opts?: Partial<ConnectOpts>) => Promise<{ publicKey: PublicKey }>;
    disconnect: ()=>Promise<void>;
    on: (event: PhantomEvent, callback: (args:any)=>void) => void;
    isPhantom: boolean;
	publicKey: PublicKey;
	isConnected: boolean;
}

export type WindowWithSolana = Window & {
    solana?: PhantomProvider;
}