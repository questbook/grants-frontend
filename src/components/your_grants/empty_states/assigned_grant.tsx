import React from 'react'
import { Flex } from '@chakra-ui/react'
import Empty from 'src/components/ui/empty'

function AssignedGrantEmptyState() {
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
					title='It’s quite silent here!'
					subtitle='You have no grants assigned to you!'
				/>
			</Flex>
		</Flex>
	)
}

export default AssignedGrantEmptyState
