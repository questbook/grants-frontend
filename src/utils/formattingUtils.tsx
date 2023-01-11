import { BigNumber, ethers } from 'ethers'
import moment from 'moment'
import applicantDetailsList from 'src/constants/applicantDetailsList'
import { ALL_SUPPORTED_CHAIN_IDS, CHAIN_INFO, SupportedChainId, USD_ASSET } from 'src/constants/chains'
import { MONTH_MAP } from 'src/libraries/utils/constants'
import { ChainInfo, CustomField, FundTransfer } from 'src/types'
import { InitialApplicationType } from 'src/v2/components/Dashboard/ReviewerDashboard/ApplicationsTable'

export function timeToString(
	timestamp: number,
	type?: 'day_first' | 'month_first',
	showYear?: boolean,
) {
	const date = new Date(timestamp)
	const months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	]
	return type === 'day_first'
		? `${date.getUTCDate().toString()} ${months[date.getMonth()].substring(
			0,
			3,
		)}, ${date.getFullYear()}`
		: `${months[date.getMonth()]} ${date.getUTCDate().toString()} ${showYear ? date.getFullYear() : ''
		}`
}

export function parseAmount(number: string, contractAddress?: string, decimal?: number) {
	if(decimal) {
		return ethers.utils.parseUnits(number, decimal).toString()
	}

	let allCurrencies: ChainInfo['supportedCurrencies'][string][] = []
	ALL_SUPPORTED_CHAIN_IDS.forEach((id) => {
		const { supportedCurrencies } = CHAIN_INFO[id]
		const supportedCurrenciesArray = Object.keys(supportedCurrencies).map(
			(i) => supportedCurrencies[i],
		)
		allCurrencies = [...allCurrencies, ...supportedCurrenciesArray]
	})

	decimal = allCurrencies.find((currency) => currency.address === contractAddress)
		?.decimals || decimal

	return ethers.utils.parseUnits(number, decimal).toString()
}

export function extractDateFromDateTime(date: string) {
	if(!date) {
		return ''
	}

	const splittedDate = date.split('T')[0]
	const [year, month, day] = splittedDate.split('-')
	return `${day} ${MONTH_MAP[month]}, ${year}`
}

export function nFormatter(value: string, digits = 3) {
	const num = Math.abs(Number(value))
	if(num < 10000) {
		return value
	}

	const lookup = [
		{ value: 1, symbol: '' },
		{ value: 1e3, symbol: 'k' },
		{ value: 1e6, symbol: 'M' },
		{ value: 1e9, symbol: 'G' },
		{ value: 1e12, symbol: 'T' },
		{ value: 1e15, symbol: 'P' },
		{ value: 1e18, symbol: 'E' },
	]
	// noinspection RegExpSimplifiable
	const rx = /\.0+$|(\.[0-9]*[1-9])0+$/
	const item = lookup
		.slice()
		.reverse()
		.find((i) => num >= i.value)
	return item
		? (num / item.value).toFixed(digits).replace(rx, '$1') + item.symbol
		: '0'
}

// export const trimAddress = (address: string, digitQuantity: number) => `${address.slice(0, digitQuantity)}...${address.slice(-4)}`

function truncateTo(number: string, digits = 3) {
	const decimalIndex = number.indexOf('.')
	if(decimalIndex === -1) {
		return number
	}

	let ret = number.substring(0, decimalIndex + 1)
	const lastSymbol = number.charCodeAt(number.length - 1)
	const containsSymbol = !(lastSymbol >= 48 && lastSymbol <= 57)
	const isEntirelyZeroAfterDecimal = true
	for(
		let i = decimalIndex + 1;
		i
		< Math.min(
			decimalIndex + digits + 1,
			containsSymbol ? number.length - 1 : number.length,
		);
		i += 1
	) {
		ret += number.charAt(i)
	}

	return (isEntirelyZeroAfterDecimal ? ret.substring(0, decimalIndex) : ret)
		+ (containsSymbol ? number.charAt(number.length - 1) : '')
}

export const extractDate = (date: string) => date.substring(0, 10)

export function formatAmount(number: string, decimals: number | undefined = 18, isEditable = false, isBig = false, returnTruncated = true) {
	// no need to do any calcs
	if(decimals === 0) {
		return number
	}

	const value = ethers.utils.formatUnits(number, decimals).toString()

	if(!returnTruncated) {
		return value
	}

	if(isEditable) {
		return truncateTo(value, decimals)
	}

	if(!isBig) {
		const formattedValue = nFormatter(value)
		return truncateTo(formattedValue)
	} else {
		return truncateTo(value)
	}
}

export function getFormattedDate(timestamp: number) {
	const date = new Date(timestamp)
	return moment(date).format('DD MMM YY')
}

export function getFormattedDateFromUnixTimestamp(timestamp: number) {
	return moment.unix(timestamp).format('DD MMM')
}

export function getFormattedDateFromUnixTimestampWithYear(
	timestamp: number | undefined,
) {
	return timestamp ? moment.unix(timestamp).format('MMM DD, YYYY') : undefined
}

export function getFormattedFullDateFromUnixTimestamp(timestamp: number) {
	return moment.unix(timestamp).format('LL')
}

export function truncateStringFromMiddle(str: string) {
	if(!str) {
		return ''
	}

	if(str.length > 10) {
		return `${str.substring(0, 4)}...${str.substring(
			str.length - 4,
			str.length,
		)}`
	}

	return str
}

// extract milstone index from ID and generate title like "Milestone (index+1)"
export function getMilestoneMetadata(milestone: FundTransfer['milestone']) {
	if(milestone) {
		const [applicationId, idx] = milestone.id.split('.')
		return {
			applicationId,
			milestoneIndex: +idx,
		}
	}

	return undefined
}

// extract milstone index from ID and generate title like "Milestone (index+1)"
export function getMilestoneTitle(milestone: FundTransfer['milestone']) {
	const item = getMilestoneMetadata(milestone)
	if(typeof item !== 'undefined') {
		return `Milestone ${item.milestoneIndex + 1}`
	}

	return 'Unknown Milestone'
}

export const getTextWithEllipses = (txt: string, maxLength = 7) => (txt?.length > maxLength ? `${txt.slice(0, maxLength)}...` : txt)

export const getChainIdFromResponse = (networkString: string): string => networkString?.split('_')[1]

// eslint-disable-next-line max-len
export const getFieldLabelFromFieldTitle = (title: string) => applicantDetailsList.find((detail) => detail.id === title)?.title

export const getExplorerUrlForAddress = (chainId: SupportedChainId | undefined, address: string) => {
	return CHAIN_INFO[chainId!]?.explorer.address.replace('{{address}}', address) || ''
}

export const getExplorerUrlForTxHash = (chainId: SupportedChainId | undefined, tx: string | undefined) => {
	return tx ? CHAIN_INFO[chainId!]?.explorer.transactionHash.replace('{{tx}}', tx) : ''
}

export const formatAddress = (address: string) => `${address.substring(0, 4)}....${address.substring(address.length - 4)}`

export const getFieldString = (applicationData: any, name: string) => applicationData?.fields?.find((field: any) => field?.id?.includes(`.${name}`))?.values[0]?.value
export const getFieldStrings = (applicationData: any, name: string) => applicationData?.fields?.find((field: any) => field?.id?.includes(`.${name}`))?.values?.map((v: any) => v.value)

export const getCustomFields = (applicationData: any): CustomField[] => applicationData?.fields
	?.filter((field: any) => (field.id.split('.')[1].startsWith('customField')))
	?.map((field: any) => {
		const i = field.id.indexOf('-')
		return ({
			title: field.id.substring(i + 1).split('\\s').join(' '),
			value: field.values[0].value,
			isError: false,
		})
	})

export const getRewardAmount = (decimals: number | undefined, application: {
	fields: InitialApplicationType['fields']
	milestones: InitialApplicationType['milestones']
}) => {
	if(typeof decimals === 'undefined') {
		decimals = 18
	}

	const fundingAskField = getFieldString(application, 'fundingAsk')
	if(fundingAskField) {
		return formatAmount(fundingAskField, decimals)
	} else {
		let sum = BigNumber.from(0)
		application?.milestones?.forEach(
			(milestone) => sum = sum.add(milestone.amount))
		return formatAmount(sum.toString(), decimals)
	}
}

export const getRewardAmountMilestones = (decimals: number, application: any) => {
	let sum = BigNumber.from(0)

	application?.milestones?.forEach(
		(milestone: any) => sum = sum.add(milestone.amount))
	return parseInt(ethers.utils.formatUnits(sum.toString(), decimals)).toLocaleString()?.split('.')[0]
}

export function titleCase(str: string) {
	return str.toLowerCase().replace(/\b\w/g, s => s.toUpperCase())
}
