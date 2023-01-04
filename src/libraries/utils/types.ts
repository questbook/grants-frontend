import { OptionBase } from 'chakra-react-select'
import { NetworkType } from 'src/constants/Networks'

export type PIIForCommentType = {
    sender?: string
    message?: string
    timestamp?: number
    role?: string
    tags?: string[]
    pii?: {[key: string]: string}
}

export interface NoteDetails {
	bgColor: string
	color: string
	text: string
	link?: string
	linkText?: string
	linkTextColor?: string
}
export interface SafeSelectOption extends OptionBase {
	safeAddress: string
	networkType: NetworkType
	networkId: string
	networkName: string // Polygon
	networkIcon: string
	safeType: string // Gnosis
	safeIcon: string
	amount: number // 1000
	currency?: string // USD
	isNote?: boolean
	noteDetails?: NoteDetails
	owners: any
}

import { PublicKey } from '@solana/web3.js'

export type PhantomEvent = 'disconnect' | 'connect' | 'accountChanged';

export interface ConnectOpts {
    onlyIfTrusted: boolean
}

export interface PhantomProvider {
    connect: (opts?: Partial<ConnectOpts>) => Promise<{ publicKey: PublicKey }>
    disconnect: () => Promise<void>
    on: (event: PhantomEvent, callback: (args: any) => void) => void
    isPhantom: boolean
	publicKey: PublicKey
	isConnected: boolean
}

export type WindowWithSolana = Window & {
    solana?: PhantomProvider
}