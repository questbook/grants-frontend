import { useState } from 'react'
import { Box, Flex, Image, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import SupportedChainId from 'src/generated/SupportedChainId'

type DaoCardProps = {
	logo: string
	name: string
	daoId: string
	chainId: SupportedChainId | undefined
	noOfApplicants: number
	totalAmount: number
}

function DaoCard({ logo, name, daoId, chainId, noOfApplicants, totalAmount }: DaoCardProps) {
	const router = useRouter()
	const [isActive, setIsActive] = useState(false)
	return (
		<Box
			w='100%'
			h='172px'
			background='white'
			p='24px'
			position='relative'
			boxShadow='0px 10px 18px rgba(31, 31, 51, 0.05), 0px 0px 1px rgba(31, 31, 51, 0.31);'
			borderRadius='4px'
			cursor='pointer'
			onMouseOver={
				() => {
					setIsActive(true)
				}
			}
			onMouseLeave={
				() => {
					setIsActive(false)
				}
			}
			onClick={
				() => {
					router.push({
						pathname: '/profile/',
						query: {
							daoId,
							chainId,
						},
					})
				}
			}>
			<Flex>
				<Image
					src={logo}
					my='8px'
					w='56px'
					h='56px'
					objectFit='cover'
					borderRadius='4px' />
				<Text
					ml='auto'
					fontWeight='700'
					fontSize='12px'>
					{noOfApplicants}
				</Text>
				<Text
					ml='3px'
					color='#555570'
					fontSize='12px'>
					Applicants
				</Text>
			</Flex>
			<Text
				fontSize='20px'
				fontWeight='500'
				mb='5px'
				noOfLines={1}>
				{name}
			</Text>
			<Flex>
				<Text
					fontSize='14px'
					fontWeight='600'>
					$
					{totalAmount ? totalAmount : 0}
				</Text>
				<Text
					ml='5px'
					fontSize='14px'
					color='#555570'>
					grants
				</Text>
			</Flex>
			{
				isActive && (
					<Box
						position='absolute'
						bottom={0}
						right={0}
						p='24px'
						display='flex'
						alignItems='center'
						as='button'
						onClick={() => {}}>

						<Text
							fontSize='14px'
							fontWeight='500'
							color='#1F1F33'
							mr='8px'>
							Apply for grants
						</Text>
						<Image src='/ui_icons/black_right_arrow.svg' />
					</Box>
				)
			}
		</Box>
	)
}

export default DaoCard