import React from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Flex, FlexProps, Image, Link, Text } from '@chakra-ui/react'
import { GroupBase, OptionProps, SingleValueProps } from 'chakra-react-select'
import DropdownSelect from 'src/libraries/ui/LinkYourMultisigModal/DropdownSelect'
import { SafeSelectOption } from 'src/types'

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

const Option = ({ innerProps, data }: OptionProps<SafeSelectOption, boolean, GroupBase<SafeSelectOption>>) => (
	<Box
		{...innerProps}
		alignItems='center'
		p={0}
		m={0}
	>
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
							variant='metadata'
							color='black.300'
							ml={1}>
							{data.safeType}
						</Text>
					</Flex>
				</Flex>
			</Flex>
			<Box mx='auto' />
			<Text
				variant='requestProposalBody'
				color='black.200'>
				{data.amount}
				{' '}
				USD
			</Text>
		</Flex>
	</Box>
)

const SingleValue = ({ innerProps, data }: SingleValueProps<SafeSelectOption, boolean, GroupBase<SafeSelectOption>>) => (
	<Box
		{...innerProps}
		w='98%'
		alignItems='center'
	>
		<Flex>
			<Image
				src={data.networkIcon}
				boxSize='20px' />
			<Text
				ml={4}
				variant='requestProposalBody'>
				{data.networkName}
			</Text>
			<Text
				ml='auto'
				variant='requestProposalBody'
				color='black.200'>
				{data.amount}
				{' '}
				USD
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
							variant='metadata'
							color='black.300'>
							{optionalText}
						</Text>
					)
				}
			</Flex>
			{
				helperText && (
					<Text
						variant='metadata'
						color='black.300'>
						{helperText}
						{' '}
						{
							helperLinkText && (
								<Link
									display='inline-block'
									fontWeight='500'
									color='black.300'
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