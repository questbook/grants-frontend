import { useEffect, useState } from 'react'
import { Box, Flex, Heading, Input, Text, Button } from '@chakra-ui/react'
import { ForwardArrow } from 'src/v2/assets/custom chakra icons/Arrows/ForwardArrow'
import ContinueButton from '../UI/Misc/ContinueButton'

const CreateDaoSafeAddressInput = ({
	onSubmit,
}: {
  onSubmit: (name: string | null) => void
}) => {
	const [safeAddress, setSetSafeAddress] = useState('')
	const [safeAddressInputIsFocused, setSafeAddressInputIsFocused] = useState(true)
	return (
		<>
			<Heading variant={'small'}>
				What's the address of your safe?
			</Heading>
			<Text variant='small' color='brandText'>
				All payouts will happen only when the multi-sig is confirmed.
			</Text>

			<Flex
				mt={6}
				alignItems={'flex-start'}>
				<Flex
					direction={'column'}
					mt={2}>
					<ForwardArrow
						color={'blue.500'}
						w={'16px'}
						h={'15.56px'} />
				</Flex>
				<Flex
					flex={1}
					direction={'column'}
					ml={4}>
					<Input
						variant={'brandFlushed'}
						placeholder={'Your Safe Address'}
						_placeholder={
							{
								color: 'blue.100',
								fontWeight: '500'
							}
						}
						fontWeight={'500'}
						value={safeAddress}
						onChange={(e) => setSetSafeAddress(e.target.value)}
						errorBorderColor={'red'}
						isInvalid={!safeAddressInputIsFocused && !safeAddress}
						onFocus={() => setSafeAddressInputIsFocused(true)}
						onBlur={() => setSafeAddressInputIsFocused(false)}
					/>
				</Flex>
			</Flex>

			<Flex
				mt={2}
				justifyContent={'flex-end'}>
					<Button 
						onClick={() => onSubmit(null)}
						style={{ marginRight: 10}}
					>
						Skip for now
					</Button>
				<ContinueButton
					disabled={!safeAddress}
					onClick={() => onSubmit(safeAddress)}
				/>
			</Flex>
		</>
	)
}

export default CreateDaoSafeAddressInput