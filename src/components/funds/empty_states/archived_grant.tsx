import React from 'react'
import { Flex, Text } from '@chakra-ui/react'
import Empty from 'src/components/ui/empty'

function ArchivedGrantEmptyState() {
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
					src="/illustrations/empty_states/no_live_grant.svg"
					imgHeight="174px"
					imgWidth="146px"
					title="No Grants archived."
					subtitle="When you archive a grant it will no longer be visible to anyone."
				/>
				<Text
					mt="11px"
					fontWeight="400"
					textAlign="center">
          To archive a grant, click on the icon next to the button live grant
          and select “Archive grant”.
				</Text>
			</Flex>
		</Flex>
	)
}

export default ArchivedGrantEmptyState
