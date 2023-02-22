import React from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Flex, FlexProps, Image, Link, Text } from '@chakra-ui/react'
import { GroupBase, OptionBase, OptionProps, SingleValueProps } from 'chakra-react-select'
import { NetworkType } from 'src/constants/Networks'
import DropdownSelect from 'src/libraries/ui/LinkYourMultisigModal/DropdownSelect'

interface Props {
	label: string
	optionalText?: string
	helperText?: string
	helperLinkText?: string
	helperLinkUrl?: string
	value: SafeSelectOption | undefined
	onChange: (e: SafeSelectOption | undefined) => void
	isError?: boolean
	safesOptions?: SafeSelectOption[]
	flexProps?: FlexProps
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
	owners: string[]
}

const Option = ({ innerProps, data }: OptionProps<SafeSelectOption, boolean, GroupBase<SafeSelectOption>>) => (
	<Box
		{...innerProps}
		alignItems='center'
		p={0}
		m={0}
	>
		{
			data?.isNote && (
				<Flex
					bg={data?.noteDetails?.bgColor}
					w='100%'
					direction='column'
					p={2}
					mx={4}
					mt={3}>
					<Text
						variant='v2_metadata'
						fontWeight='500'
						color={data?.noteDetails?.color}>
						Note:
					</Text>
					<Text
						mt={1}
						variant='v2_metadata'
						color={data?.noteDetails?.color}>
						{data?.noteDetails?.text}
						{' '}
						{
							data?.noteDetails?.link && (
								<Link
									href={data?.noteDetails?.link}
									color={data?.noteDetails?.linkTextColor}>
									{data?.noteDetails?.linkText}
								</Link>
							)
						}
					</Text>
				</Flex>
			)
		}
		{
			!data?.isNote && (
				<Flex
					cursor='pointer'
					mx={4}
					my={3}
					align='center'
					opacity={data?.isDisabled ? 0.7 : 1.0}>
					<Flex align='center'>
						<Image
							src={data.networkIcon}
							boxSize='28px' />
						<Flex
							ml={2}
							direction='column'>
							<Text variant='requestProposalBody'>
								{data.networkName}
							</Text>
							<Flex align='center'>
								<Image
									src={data.safeIcon}
									boxSize='12px' />
								<Text
									variant='v2_metadata'
									color='black.3'
									ml={1}>
									{data.safeType}
								</Text>
							</Flex>
						</Flex>
					</Flex>
					<Box mx='auto' />
					<Text
						variant='requestProposalBody'
						color='black.2'>
						{data.amount}
						{' '}
						{data.currency || 'USD'}
					</Text>
				</Flex>
			)
		}
	</Box>
)

const SingleValue = ({ innerProps, data }: SingleValueProps<SafeSelectOption, boolean, GroupBase<SafeSelectOption>>) => (
	<Box
		{...innerProps}
		alignItems='center'
		p={0}
		m={0}
	>
		<Flex>
			<Image
				src={data.networkIcon}
				boxSize='20px' />
			<Text
				ml={1}
				variant='requestProposalBody'>
				{data.networkName}
			</Text>
			<Text
				ml={1}
				variant='requestProposalBody'
				color='black.2'>
				{data.amount}
				{' '}
				{data.currency ?? 'USD'}
			</Text>
		</Flex>
	</Box>

)

function SafeSelect({ label, optionalText, helperText, helperLinkText, helperLinkUrl, value, onChange, safesOptions, flexProps }: Props) {
	const { t } = useTranslation()
	return (
		<Flex
			direction='column'
			{...flexProps}>
			<Flex>
				<Text
					variant='requestProposalBody'
					fontWeight='500'>
					{label}
				</Text>
				{
					optionalText && (
						<Text
							ml={1}
							variant='v2_metadata'
							color='black.3'>
							{optionalText}
						</Text>
					)
				}
			</Flex>
			{
				helperText && (
					<Text
						variant='v2_metadata'
						color='black.3'>
						{helperText}
						{' '}
						{
							helperLinkText && (
								<Link
									display='inline-block'
									fontWeight='500'
									color='black.3'
									isExternal
									href={helperLinkUrl}>
									{helperLinkText}
								</Link>
							)
						}
					</Text>
				)
			}
			<DropdownSelect
				options={safesOptions ?? []}
				makeOption={Option}
				singleValue={SingleValue}
				placeholder={t('/onboarding/create-domain.pick_network_placeholder')}
				selected={value}
				setSelected={onChange} />
		</Flex>
	)
}

export default SafeSelect