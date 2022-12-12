import React from 'react'
import { Image, ImageProps, Tooltip } from '@chakra-ui/react'
import copy from 'copy-to-clipboard'

type Props = {
	text: string
} & ImageProps

function CopyIcon({ text, ...props }: Props) {
	const imageSource = '/v2/icons/copy/black.svg'

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
				{...props}
			/>
		</Tooltip>

	)
}

export default CopyIcon
