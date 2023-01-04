import { ReactNode } from 'react'
import { BsArrowRight } from 'react-icons/bs'
import { Button, Spacer, Text } from '@chakra-ui/react'

const ConnectWalletButton = ({
	onClick,
	icon,
	name,
	maxW
}: {
	onClick: () => void
	icon: ReactNode
	name: string
	isPopular?: boolean
	maxW?: string
}) => {
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
			rightIcon={
				<BsArrowRight
					color='#0A84FF'
					strokeWidth='2px' />
			}
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