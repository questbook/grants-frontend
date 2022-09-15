import { Flex, Text } from '@chakra-ui/react'
import logger from 'src/utils/logger'

type Props<T> = {
    data: T[]
    filter: keyof T
}

function FilterTable<T>({ data, filter }: Props<T>) {
	logger.info({ data }, 'Data')
	return (
		<Flex >
			{
				data?.map((d: T, index: number) => {
					logger.info({ d, index }, 'FilterTable')
					return (
						<Text key={index}>
							{d[filter]}
						</Text>
					)
				})
			}

		</Flex>
	)
}

export default FilterTable