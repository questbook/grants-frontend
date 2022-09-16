import { Box, Button, Flex, Image, Text } from '@chakra-ui/react'
import { OptionBase } from 'chakra-react-select'
import TokenDropdownSelect from 'src/v2/payouts/SendFundsModal/TokenDropdownSelect'


export interface MilestoneSelectOption extends OptionBase {
	id: string
  label: string
  title: string
}

const Option = ({ innerProps, data }: any) => (
	<Box
		{...innerProps}
		alignItems='center'
		p={0}
		m={0}
	>
		<Button
			w='100%'
			variant='ghost'
			py='10px'
			px={4}
			alignItems='flex-start'
			borderRadius={0}
			display='flex'
			flexDirection='column'
			textAlign='left'
			h='auto'
		>
			<Flex>
				<Flex align='center'>
					<Image
						src={data.icon}
						fallbackSrc='/images/dummy/Ethereum Icon.svg'
						boxSize='24px' />
				</Flex>
				<Flex
					direction='column'
					ml='1em'>
					<Text
						fontSize='14px'
						lineHeight='20px'
						fontWeight='500'
					>
						{data.title}
					</Text>

					<Text
						fontSize='12px'
						lineHeight='16px'
						fontWeight='400'
						color='#7D7DA0'
						mt='2px'
					>
						{data.label}
					</Text>
				</Flex>
			</Flex>
		</Button>
	</Box>
)

const TokenSelect = ({
	safeTokenList,
	value,
	onChange,
	placeholder,
}: {
	safeTokenList: any[]
  value: MilestoneSelectOption | undefined
  onChange: (value: MilestoneSelectOption | undefined) => void
  placeholder: string
}) => {
	let selected = undefined
	if(safeTokenList?.length > 0) {
		const foundToken = safeTokenList?.find((token) => token.tokenName === value.name)
		selected = {
			icon: foundToken?.tokenIcon,
			title: foundToken?.tokenName,
		}
	}

	return (
		<TokenDropdownSelect
			options={
				safeTokenList?.length > 0 ? safeTokenList?.map((token,) => ({
					id: token.tokenName,
					title: token.tokenName,
					label: token.tokenValueAmount,
					icon: token.tokenIcon,
					info: token.info,
				})) : undefined
			}
			makeOption={Option}
			placeholder={placeholder}
			selected={ selected}
			setSelected={onChange} />
	)
}

export default TokenSelect