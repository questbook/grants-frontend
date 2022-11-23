import React from 'react'
import { Image, Tooltip } from '@chakra-ui/react'
import copy from 'copy-to-clipboard'

interface Props {
  text: string
}

function CopyIcon({ text }: Props) {
	const imageSource = '/v2/icons/copy.svg'

	const defaultTooltip = 'Copy'
	const copiedTooltip = 'Copied'

	const [tooltipLabel, setTooltipLabel] = React.useState(defaultTooltip)

	return (
		<Tooltip label={tooltipLabel}>
			<Image
				m={0}
				boxSize='18px'
				cursor='pointer'
				src={imageSource}
				onClick={
					() => {
						copy(text)
						setTooltipLabel(copiedTooltip)
					}
				}
			/>
		</Tooltip>

	)
}

export default CopyIcon
