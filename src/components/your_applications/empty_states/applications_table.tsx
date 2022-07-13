import React from 'react'
import { Flex } from '@chakra-ui/react'
import Empty from 'src/components/ui/empty'


function AppplicationTableEmptyState() {

	return (
		<Flex
			direction="row"
			w="100%">
			<Flex
				direction="column"
				justify="center"
				h="100%"
				align="center"
				mt={10}
				mx="auto"
			>
				<Empty
					src="/illustrations/empty_states/first_grant.svg"
					imgHeight="174px"
					imgWidth="146px"
					title="No Applicants yet"
					subtitle="In the meantime, you can set up the evaluation rubric that reviewers can use to evaluate the applicant."
				/>
			</Flex>
		</Flex>
	)
}

export default AppplicationTableEmptyState
