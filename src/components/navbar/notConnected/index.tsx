import React from 'react'
import { Container, Image } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import GetStarted from 'src/components/navbar/notConnected/getStarted'

interface Props {
  renderGetStarted?: boolean
	onGetStartedClick: () => void
}
const defaultProps = { renderGetStarted: false }

function Navbar({ renderGetStarted, onGetStartedClick }: Props) {
	const router = useRouter()
	return (
		<Container
			zIndex={1}
			variant='header-container'
			maxW='100vw'
			px={8}
			py={6}>
			<Image
				onClick={
					() => router.push({
						pathname: '/',
					})
				}
				h={9}
				w={8}
				mr='auto'
				src='/questbook_logo.svg'
				alt='Questbook'
				cursor='pointer'
			/>
			{renderGetStarted ? <GetStarted onGetStartedClick={onGetStartedClick} /> : null}
			{/* <ConnectWallet /> */}
		</Container>
	)
}

Navbar.defaultProps = defaultProps
export default Navbar
