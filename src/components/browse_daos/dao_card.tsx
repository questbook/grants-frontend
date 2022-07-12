import { useState } from 'react'
import { Box, Image, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'

function DaoCard({ logo, name, daoId, chainId }) {
	const router = useRouter()
	const [isActive, setIsActive] = useState(false)
	return (
		<Box
			w={'411px'}
			h={'172px'}
			background={'white'}
			p={'24px'}
			position={'relative'}
			boxShadow={'0px 10px 18px rgba(31, 31, 51, 0.05), 0px 0px 1px rgba(31, 31, 51, 0.31);'}
			borderRadius={'4px'}
			cursor={'pointer'}
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
			<Image
				src={logo}
				my={'8px'}
				w={'56px'}
				h={'56p'} />
			<Text
				fontSize={'20px'}
				fontWeight={'500'}>
				{name}
			</Text>
			{
				isActive && (
					<Box
						position={'absolute'}
						bottom={0}
						right={0}
						p={'24px'}
						display={'flex'}
						alignItems={'center'}
						as={'button'}
						onClick={() => {}}>
						<Text
							fontSize={'14px'}
							fontWeight={'500'}
							color={'#0065FF'}
							mr={'8px'}>
                    Apply for grants
						</Text>
						<Image src='/ui_icons/blue_right_arrow.svg' />
					</Box>
				)
			}
		</Box>
	)
}

export default DaoCard