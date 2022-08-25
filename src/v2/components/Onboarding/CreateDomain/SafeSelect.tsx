import React, { useEffect } from 'react'
import { Box, Flex, Image, Link, Text } from '@chakra-ui/react'
import { OptionBase, OptionProps } from 'chakra-react-select'
import { NetworkType } from 'src/constants/Networks'
import DropdownSelect from '../../DropdownSelect'

interface Props {
	label: string;
	optionalText?: string;
	helperText?: string;
	helperLinkText?: string;
	helperLinkUrl?: string;
	value: SafeSelectOption | undefined;
	onChange: (e: SafeSelectOption | undefined) => void;
	isError?: boolean;
	safesOptions?: SafeSelectOption[];
}

export interface SafeSelectOption extends OptionBase {
	networkType: NetworkType;
	networkId: string;
	networkName: string; // Polygon
	networkIcon: string;
	safeType: string; // Gnosis
	safeIcon: string;
	amount: number; // 1000
	currency?: string; // USD
	isNote?: boolean;
}

const Option = ({ innerProps, data }: OptionProps<SafeSelectOption, any, any>) => (
	<Box
		{...innerProps}
		alignItems={'center'}
		p={0}
		m={0}
	>
		{
			data?.isNote && (
				<Flex
					bg="blue.1"
					w="100%"
					direction="column"
					p={2}
					mx={4}
					mt={3}>
					<Text
						variant="v2_metadata"
						fontWeight="500"
						color="blue.2">
Note:
					</Text>
					<Text
						mt={1}
						variant="v2_metadata"
						color="blue.2">
You will be asked to verify that you own the safe. and have tokens atleast worth 1000 USD in your safe.
					</Text>
				</Flex>
			)
		}
		{
			!data?.isNote && (
				<Flex
					cursor="pointer"
					mx={4}
					my={3}
					align="center"
					opacity={data?.isDisabled ? 0.7 : 1.0}>
					<Flex align="center">
						<Image
							src={data.networkIcon}
							boxSize="28px" />
						<Flex
							ml={2}
							direction="column">
							<Text variant='v2_body'>
								{data.networkName}
							</Text>
							<Flex align="center">
								<Image
									src={data.safeIcon}
									boxSize="12px" />
								<Text
									variant="v2_metadata"
									color="black.3"
									ml={1}>
									{data.safeType}
								</Text>
							</Flex>
						</Flex>
					</Flex>
					<Box mx="auto" />
					<Text
						variant="v2_body"
						color="black.2">
						{data.amount}
						{' '}
						{data.currency || 'USD'}
					</Text>
				</Flex>
			)
		}
	</Box>
)

const SingleValue = ({ innerProps, data }: any) => (
	<Box
		{...innerProps}
		alignItems={'center'}
		p={0}
		m={0}
	>
		<Flex>
			<Image
				src={data.networkIcon}
				boxSize="20px" />
			<Text
				ml={1}
				variant="v2_body">
				{data.networkName}
			</Text>
			<Text
				ml={1}
				variant="v2_body"
				color="black.2">
				{data.amount}
				{' '}
				{data.currency ?? 'USD'}
			</Text>
		</Flex>
	</Box>

)

// const dummyData: SafeSelectOption[] = [
// 	{
// 		networkId: '',
// 		networkName: '',
// 		networkIcon: '',
// 		safeType: '',
// 		safeIcon: '',
// 		amount: 0,
// 		currency: '',
// 		isNote: true,
// 		isDisabled: true,
// 	},
// 	{
// 		networkId: '',
// 		networkName: 'Polygon',
// 		networkIcon: '/ui_icons/polygon.svg',
// 		safeType: 'Gnosis',
// 		safeIcon: '/ui_icons/gnosis.svg',
// 		amount: 1000,
// 		currency: 'USD',
// 	},
// 	{
// 		networkId: '',
// 		networkName: 'Optimism',
// 		networkIcon: '/ui_icons/optimism.svg',
// 		safeType: 'Gnosis',
// 		safeIcon: '/ui_icons/gnosis.svg',
// 		amount: 1000,
// 		currency: 'USD',
// 	},
// 	{
// 		networkId: '',
// 		networkName: 'Polygon',
// 		networkIcon: '/ui_icons/polygon.svg',
// 		safeType: 'Gnosis',
// 		safeIcon: '/ui_icons/gnosis.svg',
// 		amount: 100,
// 		currency: 'USD',
// 		isDisabled: true,
// 	},
// ]

function SafeSelect({ label, optionalText, helperText, helperLinkText, helperLinkUrl, value, onChange, safesOptions }: Props) {
	useEffect(() => {
		console.log('SELECTED DROPDOWN: ', value)
	}, [value])
	return (
		<Flex direction="column">
			<Flex>
				<Text
					variant="v2_body"
					fontWeight="500">
					{label}
				</Text>
				{
					optionalText && (
						<Text
							ml={1}
							variant="v2_metadata"
							color="black.3">
							{optionalText}
						</Text>
					)
				}
			</Flex>
			{
				helperText && (
					<Text
						variant="v2_metadata"
						color="black.3">
						{helperText}
						{' '}
						{
							helperLinkText && (
								<Link
									display="inline-block"
									fontWeight="500"
									color={'black.3'}
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
				placeholder='Select from the list'
				selected={value}
				setSelected={onChange} />
		</Flex>
	)
}

export default SafeSelect