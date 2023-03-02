import React from 'react'
import { Center, CircularProgress } from '@chakra-ui/react'

interface Props {
  size?: string | number
  mt?: string | number
}

function Loader({ size, mt }: Props) {
	return (
		<Center>
			<CircularProgress
				isIndeterminate
				color='accent.azure'
				size={size}
				mt={mt} />
		</Center>
	)
}

Loader.defaultProps = {
	size: '32px',
	mt: 0,
}

export default Loader
