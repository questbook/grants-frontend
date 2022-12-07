import { ReactNode, useState } from 'react'
import { Box, Button, Spacer, Text } from '@chakra-ui/react'
import { ArrowRightFilled } from 'src/v2/assets/custom chakra icons/Arrows/ArrowRightFilled'
import { BsArrowRight } from 'react-icons/bs'

const ConnectWalletButton = ({
	onClick,
	icon,
	name,
	isPopular,
	maxW
}: {
	onClick: () => void
	icon: ReactNode
	name: string
	isPopular?: boolean
	maxW?: string
}) => {
	const [isHovering, setIsHovering] = useState(false)
	return (
		<Button
			w='full'
			px={6}
			py={4}
			h='auto'
			maxW={maxW ?? '27rem'}
			backgroundColor='gray.2'
			onClick={onClick}
			borderRadius='sm'
			onMouseEnter={() => setIsHovering(true)}
			onMouseLeave={() => setIsHovering(false)}
			rightIcon={<BsArrowRight color='#0A84FF' strokeWidth='2px' />}
		>

			{icon}
			<Text
				ml='10px'
				fontWeight='500'
				color='black'
			>
				{name}
			</Text>

			<Spacer />

		</Button>
	)
}

export default ConnectWalletButton
