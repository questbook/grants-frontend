import React from 'react'
import {
	Flex,
} from '@chakra-ui/react'

function FloatingSidebar({
	children,
	top,
}: {
  children: React.ReactNode
  top?: number | string
}) {
	return (
		<Flex
			bg='white'
			border='2px solid #D0D3D3'
			borderRadius={4}
			w={400}
			direction='column'
			alignItems='stretch'
			px='28px'
			py='22px'
			pos='sticky'
			top={top}
		>
			{children}
		</Flex>
	)
}

FloatingSidebar.defaultProps = {
	top: '40px',
}

export default FloatingSidebar
