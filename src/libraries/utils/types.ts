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
