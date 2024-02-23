import { BigNumber, ethers } from 'ethers'
import { ALL_SUPPORTED_CHAIN_IDS, CHAIN_INFO, SupportedChainId } from 'src/constants/chains'
import { ApplicationMilestone, GrantApplication } from 'src/generated/graphql'
import { MONTH_MAP } from 'src/libraries/utils/constants'
import { ChainInfo, CustomField } from 'src/types'

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

export function nFormatter(value: string, digits = 3, isTonGrants?: boolean) {
	let num = Math.abs(Number(value))
	if(num < 10000) {
		return value
	}

	if(isTonGrants) {
		num = num - 18000
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

export const getExplorerUrlForTxHash = (chainId: SupportedChainId | undefined, tx: string | undefined) => {
	return tx ? CHAIN_INFO[chainId!]?.explorer.transactionHash.replace('{{tx}}', tx) : ''
}

export const formatAddress = (address: string) => `${address.substring(0, 4)}....${address.substring(address.length - 4)}`

export const getFieldString = (applicationData: {fields: (Pick<GrantApplication['fields'][number], 'id'> & {values: Pick<GrantApplication['fields'][number]['values'][number], 'id' | 'value'>[]})[]} | undefined | null, name: string): string | undefined => {
	if(name.includes('customField')) {
		const newName = name.slice(12)
		return applicationData?.fields?.find((field) => field?.id?.includes(`${newName}`))?.values[0]?.value
	}

	return applicationData?.fields?.find((field) => field?.id?.includes(`.${name}`))?.values[0]?.value
}

export const getFieldStrings = (applicationData: {fields: (Pick<GrantApplication['fields'][number], 'id'> & {values: Pick<GrantApplication['fields'][number]['values'][number], 'id' | 'value'>[]})[]} | undefined | null, name: string) => applicationData?.fields?.find((field) => field?.id?.includes(`.${name}`))?.values?.map((v) => v.value)

export const getCustomFields = (applicationData: Pick<GrantApplication, 'fields'>): CustomField[] => applicationData?.fields
	?.filter((field) => (field.id.split('.')[1].startsWith('customField')))
	?.map((field) => {
		const i = field.id.indexOf('-')
		return ({
			title: field.id.substring(i + 1).split('\\s').join(' '),
			value: field.values[0].value,
			isError: false,
		})
	})

export const getRewardAmount = (decimals: number | undefined, application: {
	fields: GrantApplication['fields']
	milestones: GrantApplication['milestones']
}) => {
	if(typeof decimals === 'undefined') {
		decimals = 18
	}

	const fundingAskField = getFieldString(application, 'fundingAsk')
	if(fundingAskField) {
		return formatAmount(fundingAskField, decimals)
	} else {
		return getRewardAmountMilestones(decimals, application)
	}
}

export const getRewardAmountMilestones = (decimals: number, application: {milestones: Pick<ApplicationMilestone, 'amount'>[]}) => {
	let sum = BigNumber.from(0)

	application?.milestones?.forEach(
		(milestone) => sum = sum.add(milestone.amount))
	return parseInt(ethers.utils.formatUnits(sum.toString(), decimals)).toLocaleString('en-US')?.split('.')[0]
}

export function titleCase(str: string) {
	return str.toLowerCase().replace(/\b\w/g, s => s.toUpperCase())
}

export const formatFundsAmount = (amount: number): string => {
	if(amount >= 1e6) {
		return `$${(amount / 1e6).toFixed(1)}M`
	} else if(amount >= 1e3) {
		return `$${(amount / 1e3).toFixed(0)}K`
	} else {
		return `$${amount}`
	}
}

export const formatNumber = (amount: number): string => {
	if(amount >= 1e6) {
		return `${(amount / 1e6).toFixed(1)}M`
	} else if(amount >= 1e3) {
		return `${(amount / 1e3).toFixed(0)}K`
	} else {
		return `${amount}`
	}
}