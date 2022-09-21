import React from 'react'
import { Flex } from '@chakra-ui/react'
import Empty from 'src/components/ui/empty'

function DoaDashTableEmptyState() {
	return (
		<Flex
			direction='row'
			w='100%'>
			<Flex
				direction='column'
				justify='center'
				h='300px'
				align='center'
				mt={3}
				mx='auto'
			>
				<Empty
					src='/illustrations/empty_states/no_daodash_table.svg'
					imgHeight='174px'
					imgWidth='146px'
					title='You have no pending actions'
					subtitle=''
				/>

			</Flex>
		</Flex>
	)
}

export default DoaDashTableEmptyState
