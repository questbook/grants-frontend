import React from 'react'
import { Flex } from '@chakra-ui/react'
import Empty from 'src/components/ui/empty'

function AppplicationTableEmptyState() {
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
					src='/illustrations/empty_states/first_grant.svg'
					imgHeight='174px'
					imgWidth='146px'
					title='No grant applicants assigned to you.'
					subtitle='All the grant applicants assigned to you will be visible here.'
				/>

			</Flex>
		</Flex>
	)
}

export default AppplicationTableEmptyState
