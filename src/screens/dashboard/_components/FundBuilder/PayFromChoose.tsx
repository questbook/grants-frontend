import { useState } from 'react'
import { Button, Flex, Image, Text } from '@chakra-ui/react'
import { PlaceholderProps, Select, SelectComponentsConfig } from 'chakra-react-select'
import { useSafeContext } from 'src/contexts/safeContext'
import Dropdown from 'src/screens/dashboard/_components/FundBuilder/Dropdown'
// import { formatAddress } from 'src/utils/formattingUtils'

function PayFromChoose({ selectedMode, setSelectedMode }) {


	const buildComponent = () => {
		return (
			<Flex
				p={4}
				w='100%'
				borderBottom='1px solid #E7E4DD'
				alignItems='center'>
				<Text
					w='20%'
					color='gray.6'>
					Pay From
				</Text>
				<Flex alignItems='center'>

					<Dropdown
						options={
							[Safe, Wallet].map((item, index) => {
								return {
									index,
									...item
								}
							})
						}
						makeOption={makeOption}
						singleValue={singleValue}
						selected={selectedMode}
						setSelected={
							(value) => {
								console.log('selected', value)
								setSelectedMode(value!)
							}
						} />


				</Flex>
			</Flex>
		)
	}

	const makeOption = ({ innerProps, data }: any) => (
		<Button
			{...innerProps}
			variant='link'
			w='100%'
			leftIcon={
				<Image
					boxSize='16px'
					src={data.icon} />
			}>
			<Text
				ml={2}
				variant='v2_body'
			>
				{data.value}
			</Text>
		</Button>
	)

	const singleValue = ({ innerProps, data }: any) => (
		<Flex
			{...innerProps}
			display='inline-flex'
			alignItems='center'
			p={0}
			m={0}
		>
			<Image
				src={data.icon}
				boxSize='16px' />
			<Text
				ml={2}
				variant='v2_body'
			>
				{data.value}
			</Text>
		</Flex>
	)

	const { safeObj } = useSafeContext()

	const Safe = {
		icon: safeObj.safeLogo,
		value: safeObj?.safeAddress ?? ''
	}

	const Wallet = {
		icon: '/wallet_icons/ton.svg',
		value: 'TON Wallet'
	}

	return buildComponent()
}

export default PayFromChoose