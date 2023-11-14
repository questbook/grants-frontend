/* eslint-disable indent */
import { useContext, useEffect, useState } from 'react'
import { Flex, Image, Text } from '@chakra-ui/react'
import { TokenDetailsInterface } from '@questbook/supported-safes/lib/types/Safe'
import { GroupBase, OptionProps, SingleValueProps } from 'chakra-react-select'
import { useSafeContext } from 'src/contexts/safeContext'
import logger from 'src/libraries/logger'
import DropdownSelect from 'src/libraries/ui/LinkYourMultisigModal/DropdownSelect'
import { FundBuilderContext } from 'src/screens/dashboard/Context'

type DropdownItem = TokenDetailsInterface & { index: number }
function PayWithChoose({ selectedMode }: { selectedMode: { logo: string | undefined, value: string | undefined } | undefined }) {
	const buildComponent = () => {
		return (
			<Flex
				p={4}
				w='100%'
				borderBottom='1px solid #E7E4DD'>
				<Text
					w='20%'
					color='gray.600'>
					Pay With
				</Text>
				<Text>
					{
						!safeObj && selectedMode?.value === 'TON Wallet' ? 'TON'
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
					selectedMode?.value === 'TON Wallet' ? (
						<>
							<Text>
								TON
							</Text>
						</>
					) : (
						<>
							<DropdownSelect
								options={
									(tokenList ?? []).map((token: TokenDetailsInterface, index: number) => {
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
							{
								selectedTokenInfo?.tokenName !== 'TON' && (
								<Text
									color='#53514F'
									fontSize='14px'
									mt='8px'>
									Available:
									{' '}
									{(selectedTokenInfo?.tokenValueAmount!).toFixed(2)}
									{' '}
									{selectedTokenInfo?.tokenName}
									{' '}
									≈
									{' '}
									{(selectedTokenInfo?.usdValueAmount!).toFixed(2)}
									{' '}
									USD
								</Text>
      )
}
						</>
					)
				}
			</>
		)
	}

	function makeOption<T extends object>({ innerProps, data }: OptionProps<T, false, GroupBase<T>>) {
		if(!('tokenName' in data) || !('tokenIcon' in data) || (typeof data.tokenName !== 'string') || (typeof data.tokenIcon !== 'string')) {
			return <Flex />
		}

		return (
			<Flex
				{...innerProps}
				w='100%'
			>
				<Image
					boxSize='16px'
					src={data.tokenIcon}
					fallbackSrc={(data.tokenName.includes('DAI') ? '/chain_assets/dai.svg' : (data.tokenName.includes('TON') ? '/chain_assets/toncoin.svg' : '/chain_assets/eth.svg'))}
				/>
				<Text
					ml={2}
					variant='body'
				>
					{data.tokenName}
				</Text>
			</Flex>
		)
	}

	function singleValue<T extends object>({ innerProps, data }: SingleValueProps<T, false, GroupBase<T>>) {
		if(!('tokenName' in data) || !('tokenIcon' in data) || (typeof data.tokenName !== 'string') || (typeof data.tokenIcon !== 'string')) {
			return <Flex />
		}

		return (
			<Flex
				{...innerProps}
				display='inline-flex'
				alignItems='center'
				p={0}
				m={0}
			>
				<Image
					src={data.tokenIcon}
					fallbackSrc={(data.tokenName.includes('DAI') ? '/chain_assets/dai.svg' : (data.tokenName.includes('TON') ? '/chain_assets/toncoin.svg' : '/chain_assets/eth.svg'))}
					boxSize='16px' />
				<Text
					ml={2}
					variant='body'
				>
					{data.tokenName}
				</Text>
			</Flex>
		)
	}

	const { safeObj } = useSafeContext()!
	const { tokenList, setTokenList, selectedTokenInfo, setSelectedTokenInfo } = useContext(FundBuilderContext)!
	const [selectedTokenIndex, setSelectedTokenIndex] = useState<number>(selectedTokenInfo ? tokenList?.map((v) => v.tokenName).indexOf(selectedTokenInfo.tokenName)! : 0)

	useEffect(() => {
		if(!safeObj) {
			return
		}

		safeObj?.getTokenAndbalance().then((list: { value?: TokenDetailsInterface[] | undefined, error?: string }) => {
			if(list?.value) {
				setTokenList(list?.value)
				if(list?.value?.length && !selectedTokenInfo) {
					setSelectedTokenInfo(list?.value[0])
					setSelectedTokenIndex(0)
				}
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