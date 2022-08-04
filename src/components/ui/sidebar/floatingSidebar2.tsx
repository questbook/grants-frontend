import React from 'react'
import { Flex, useTheme } from '@chakra-ui/react'

function FloatingSidebar({
	children,
	top,
}: {
  children: React.ReactNode;
  top?: number | string;
}) {
	const theme = useTheme()
	return (
		<Flex
			// h="calc(100vh - 64px)"
			bg={theme.colors.backgrounds.floatingSidebar}
			border="1px solid #E8E9E9"
			borderRadius={12}
			maxW={340}
			direction="column"
			alignItems="stretch"
			px={10}
			py={5}
			pos="sticky"
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
