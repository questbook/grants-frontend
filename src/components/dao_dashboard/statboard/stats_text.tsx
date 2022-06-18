import React from 'react'
import { Flex, Text } from '@chakra-ui/react'


function StatsText({ app_count, title }:{app_count:string, title: string}) {


	return (

		<>
			<Flex>
				<Text>

					{app_count}
				</Text>
				<Text>

					{app_count}
				</Text>

			</Flex>


		</>


	)

}

export default StatsText
