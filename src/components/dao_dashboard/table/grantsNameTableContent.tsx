import React, { useState } from 'react'
import { Text, Tooltip } from '@chakra-ui/react'

const GrantsNameTableContent = ({ name }: { name: string }) => {
	const [isExpanded, setIsExpanded] = useState(false)

	if(name.length < 52) {
		return (
			<Tooltip label={name}>
				<Text>
					{name}
				</Text>
			</Tooltip>
		)
	}

	if(!isExpanded) {
		return (
			<Tooltip label={name}>
				<Text noOfLines={2}>
					{`${name.substring(0, 51)}`}
					<Text
						color="#8E48D3"
						as={'span'}
						onClick={() => setIsExpanded(true)}
						cursor={'pointer'}
					>
            ...more
					</Text>
				</Text>
			</Tooltip>
		)
	}

	return (
		<Text>
			{name}
			<Text
				color="#8E48D3"
				as={'span'}
				onClick={() => setIsExpanded(false)}
				cursor={'pointer'}
			>
        ...less
			</Text>
		</Text>
	)

}

export default GrantsNameTableContent
