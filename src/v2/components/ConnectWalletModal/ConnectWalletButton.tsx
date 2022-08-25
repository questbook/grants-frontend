import { useState } from 'react'
import { Box, Button, Spacer, Text } from '@chakra-ui/react'
import { ArrowRightFilled } from 'src/v2/assets/custom chakra icons/Arrows/ArrowRightFilled'

const ConnectWalletButton = ({
	onClick,
	icon,
	name,
	isPopular,
	maxW
}: {
  onClick: () => void,
  icon: React.ReactNode,
  name: string,
  isPopular?: boolean,
	maxW?: string,
}) => {
	const [isHovering, setIsHovering] = useState(false)
	return (
		<Button
			w={'full'}
			px={6}
			py={4}
			h={'auto'}
			maxW={maxW ?? '27rem'}
			colorScheme={'brandGrey'}
			onClick={onClick}
			onMouseEnter={() => setIsHovering(true)}
			onMouseLeave={() => setIsHovering(false)}
		>

			{icon}
			<Text
				ml={'10px'}
				fontWeight={'500'}
				color={'black'}
			>
				{name}
			</Text>

			{
				isPopular && (
					<Box
						ml={3.5}
						bg={'greenTextBackground'}
						px={1}
						borderRadius={'sm'}
					>
						<Text
							fontWeight={'bold'}
							fontSize={'xs'}
							color={'greenTextDark'}
						>
							POPULAR
						</Text>
					</Box>
				)
			}

			<Spacer />
			<Text
				fontWeight={'500'}
				color={'blue.500'}
				opacity={isHovering ? 1 : 0}
				transition={'all 0.3s'}
			>
				Connect
			</Text>
			<ArrowRightFilled
				ml={2}
				boxSize={'13.33px'}
				color={'blue.500'}
				opacity={isHovering ? 1 : 0}
				transition={'all 0.3s'}
			/>
		</Button>
	)
}

export default ConnectWalletButton