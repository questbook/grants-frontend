import React from 'react'
import { Flex } from '@chakra-ui/react'
import Empty from 'src/components/ui/empty'

function ExpiredGrantEmptyState() {
	return (
		<Flex
			direction='row'
			w='100%'>
			<Flex
				direction='column'
				justify='center'
				h='100%'
				align='center'
				mt={10}
				mx='auto'
			>
				<Empty
					src='/illustrations/empty_states/no_live_grant.svg'
					imgHeight='174px'
					imgWidth='146px'
					title='No expired grants.'
					subtitle='Grants whose deadline has passed will appear here.'
				/>
			</Flex>
		</Flex>
	)
}

export default ExpiredGrantEmptyState
