import React from 'react'
import { Tooltip } from '@chakra-ui/react'
import copy from 'copy-to-clipboard'
import { Copy } from 'src/generated/icons'

type Props = {
	text: string
}

function CopyIcon({ text }: Props) {
	const defaultTooltip = 'Copy'
	const copiedTooltip = 'Copied'

	const [tooltipLabel, setTooltipLabel] = React.useState(defaultTooltip)

	return (
		<Tooltip label={tooltipLabel}>
			<Copy
				boxSize='12px'
				alignSelf='center'
				cursor='pointer'
				onClick={
					() => {
						copy(text)
						setTooltipLabel(copiedTooltip)
					}
				} />
		</Tooltip>

	)
}

export default CopyIcon
