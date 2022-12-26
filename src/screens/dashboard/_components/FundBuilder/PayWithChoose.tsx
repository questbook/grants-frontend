/* eslint-disable indent */
import { useContext, useEffect, useState } from 'react'
import { Button, Flex, Image, Text } from '@chakra-ui/react'
import { useSafeContext } from 'src/contexts/safeContext'
import logger from 'src/libraries/logger'
import Dropdown from 'src/screens/dashboard/_components/FundBuilder/Dropdown'
import { TokenInfo } from 'src/screens/dashboard/_utils/types'
import { FundBuilderContext } from 'src/screens/dashboard/Context'

type DropdownItem = TokenInfo & { index: number }
function PayWithChoose({ selectedMode }: { selectedMode: any}) {
	const buildComponent = () => {
		return (
			<Flex
				p={4}
				w='100%'
				borderBottom='1px solid #E7E4DD'>
				<Text
					w='20%'
					color='gray.6'>
					Pay With
				</Text>
				<Text>
					{
						!safeObj && selectedMode.value === 'TON Wallet' ? 'TON'
							: tokenList ? (tokenList.length ? dropdown() : 'No tokens in the safe') : 'Fetching...'
					}
				</Text>
			</Flex>
		)
	}

	const dropdown = () => {
		return (
			<>
				{
					selectedMode.value === 'TON Wallet' ? (
						<>
							<Text>
								TON
							</Text>
						</>
					) : (
						<>
							<Dropdown
									options={
										(tokenList ?? []).map((token: TokenInfo, index: number) => {
											const ret = {
												index,
												...token
											}
											return ret
										})
									}
									placeholder='Select Token'
									singleValue={singleValue}
									makeOption={makeOption}
									selected={{ ...tokenList?.[selectedTokenIndex]!, index: selectedTokenIndex }}
									setSelected={
										(value: DropdownItem | undefined) => {
											logger.info({ value }, 'Clicked')
											if(!value) {
												return
											}

											logger.info({ value }, 'Selected Token')
											setSelectedTokenIndex(value.index)
										}
									} />
							<Text
									color='#53514F'
									fontSize='14px'
									mt='8px'>
								Available:
								{' '}
								{parseFloat(selectedTokenInfo?.tokenValueAmount?.toString()!).toFixed(2)}
								{' '}
								{selectedTokenInfo?.tokenName}
								{' '}
								≈
								{' '}
								{parseFloat(selectedTokenInfo?.usdValueAmount?.toString()!).toFixed(2)}
								{' '}
								USD
							</Text>
						</>
					)
				}
			</>
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
					src={data.tokenIcon} />
			}>
			<Text
				ml={2}
				variant='v2_body'
			>
				{data.tokenName}
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
				src={data.tokenIcon}
				boxSize='16px' />
			<Text
				ml={2}
				variant='v2_body'
			>
				{data.tokenName}
			</Text>
		</Flex>
	)

	const { safeObj } = useSafeContext()
	const { tokenList, setTokenList, selectedTokenInfo, setSelectedTokenInfo } = useContext(FundBuilderContext)!
	const [selectedTokenIndex, setSelectedTokenIndex] = useState<number>(selectedTokenInfo ? tokenList?.map((v) => v.tokenName).indexOf(selectedTokenInfo.tokenName)! : 0)

	useEffect(() => {
		if(!safeObj) {
			return
		}

		safeObj?.getTokenAndbalance().then((list: TokenInfo[]) => {
			setTokenList(list)
			if(list.length && !selectedTokenInfo) {
				setSelectedTokenInfo(list[0])
				setSelectedTokenIndex(0)
			}
		})
	}, [safeObj])

	useEffect(() => {
		if(!tokenList) {
			return
		}

		if(selectedTokenIndex < tokenList.length) {
			const token = tokenList[selectedTokenIndex]
			setSelectedTokenInfo(token)
		}
	}, [selectedTokenIndex])

	return buildComponent()
}

export default PayWithChoose