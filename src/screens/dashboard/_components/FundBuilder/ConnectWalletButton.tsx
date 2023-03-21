import { ReactNode, useState } from 'react'
import { BsArrowRight } from 'react-icons/bs'
import {
	Button,
	ButtonProps,
	CircularProgress,
	Fade,
	Spacer,
	Text,
} from '@chakra-ui/react'

type ConnectWalletButtonType = {
	id: string
  icon: ReactNode
  name: string
  verifying: string | undefined
} & ButtonProps;

const ConnectWalletButton = (props: ConnectWalletButtonType) => {
	const { id, icon, name, maxW, verifying } = props
	const [isHovering, setIsHovering] = useState(false)
	return (
		<Button
			w='full'
			px={6}
			py={4}
			h='auto'
			maxW={maxW ?? '29rem'}
			backgroundColor='gray.200'
			borderRadius='sm'
			onMouseEnter={() => setIsHovering(true)}
			onMouseLeave={() => setIsHovering(false)}
			rightIcon={
				(verifying === undefined || verifying !== id) ? (
					<Fade in={isHovering || verifying !== id}>
						<BsArrowRight
							color='#0A84FF'
							strokeWidth='2px' />
					</Fade>
				) : (
					<CircularProgress
						isIndeterminate />
				)
			}
			{...props}
		>
			{icon}
			<Text
				ml='10px'
				fontWeight='500'
				color='black'>
				{name}
			</Text>
			<Spacer />
		</Button>
	)
}

export default ConnectWalletButton